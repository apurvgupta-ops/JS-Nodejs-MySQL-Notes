"use client"

import { useRouter } from "next/navigation"

export default function Error({ error, reset }) {
    return (
        <div>
            <p>Something went wrong (This is main about error file running)</p>
            <button onClick={() => {
                reset()
            }}>Try Again</button>
        </div >
    )
}
