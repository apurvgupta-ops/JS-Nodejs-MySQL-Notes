# Razorpay Subscriptions Integration Design Doc

## Goals

- Offer **2 TB / 5 TB / 10 TB** subscription plans (Monthly & Yearly).
- Frontend sends the **Razorpay Plan ID**; backend receives it and creates a razorpay subscription and return the subscription url.
- Use **webhooks** to finalize state; never trust redirects alone.
- Keep **plans** in a static JS config (no DB table for plans).

---

## Data Model

> Keep only what we must persist for correctness and performance.

### `users` (existing – add only the following fields)

```ts
users: {
  // NEW
  subscriptionId: ObjectId | null,
  // Update after successful payment
  maxStorageInBytes: number,
}
```

### `subscriptions`

```ts
subscriptions: {
  userId: ObjectId,                      // index
  planId: string,
  razorpaySubscriptionId: string,
  billingCycle: 'monthly' | 'yearly',
  status: 'pending' | 'active' | 'past_due' | 'paused' | 'canceled' | 'in_grace',

  currentPeriodStart?: Date,
  currentPeriodEnd?: Date,
  cancelAtPeriodEnd?: boolean
}
```

---

## Endpoints

### 1) Create Subscription (frontend passes Razorpay Plan ID)

```
POST /api/subscriptions
```

**Request**

```json
{
  "planId": "plan_Mon_5tb_xxx"
}
```

**Response**

```json
{
  "subscriptionId": "sub_672312351872",
}
```

**Responsibilities**

- Create **Razorpay Subscription** with `plan_id`.
- Insert `subscriptions` doc in the database with `status=pending`.

### 2) Get My Subscription (simple status panel)

```
GET /api/subscriptions/me
```

**Response** – last known subscription for the auth user (or `null`).

### 3) Razorpay Webhook (source of truth)

```
POST /api/billing/webhooks/razorpay
```

- Verify `X-Razorpay-Signature` using `RZP_WEBHOOK_SECRET`.
- Save raw event in the database for future processing.

> Keep this endpoint unauthenticated; use only signature verification.

---

## Static Plans (no DB table)

Create `src/config/plans.js` with plan metadata and Razorpay Plan IDs.

```js
export const PLANS = {
  "2TB": {
    code: "2TB",
    storageQuotaBytes: 2 * 1024 ** 4,
    razorpay: { monthlyPlanId: "...", yearlyPlanId: "..." },
  },
  "5TB": {
    code: "5TB",
    storageQuotaBytes: 5 * 1024 ** 4,
    razorpay: { monthlyPlanId: "...", yearlyPlanId: "..." },
  },
  "10TB": {
    code: "10TB",
    storageQuotaBytes: 10 * 1024 ** 4,
    razorpay: { monthlyPlanId: "...", yearlyPlanId: "..." },
  },
};
```

---

## Minimal Request Lifecycle

1. **FE**: User clicks a plan → sends `razorpayPlanId` to `POST /api/subscriptions`.
2. Creates **Subscription**, stores doc with `status=pending`, returns `url`.
3. **User** completes payment on Razorpay hosted page.
4. **BE**: Webhook `subscription.activated` → marks `active`, updates user quota.
5. **Recurring**: Webhook `subscription.charged` each cycle → roll period dates.
6. **Failure**: Webhook `subscription.pending` and `subscription.halted` → set `past_due` + start grace; optional freeze after grace.

---