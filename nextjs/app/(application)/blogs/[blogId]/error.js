"use client"

import { useRouter } from "next/navigation"
import { startTransition } from "react"

export default function Error({ error, reset }) {
    const router = useRouter()
    return (
        <div>
            <p>Something went wrong (This is main BlodId error file running)</p>
            <button onClick={() => {
                startTransition(() => {
                    router.refresh()
                    reset()
                })
            }}>Try Again</button>
        </div>
    )
}
