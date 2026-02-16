import Razorpay from "razorpay";
import Subscription from "../models/subscriptionModel.js";

// const rzpInstance = new Razorpay({
//   key_id: "rzp_live_RQtKefrYAszEWo",
//   key_secret: "ic0ZeEvyQtRw5VHCABvNEGpG",
// });

const rzpInstance = new Razorpay({
  key_id: "rzp_test_RSg3Fv2zJuKq4V",
  key_secret: "PnyUYMV6K7S9Wf83enwTo1ls",
});

export const createSubscription = async (req, res, next) => {
  try {
    const newSubscription = await rzpInstance.subscriptions.create({
      plan_id: req.body.planId,
      total_count: 120,
      notes: {
        userId: req.user._id,
      },
    });

    const subscription = new Subscription({
      razorpaySubscriptionId: newSubscription.id,
      userId: req.user._id,
    });

    await subscription.save();
    res.json({ subscriptionId: newSubscription.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
