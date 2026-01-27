"use client"

export default function GlobalError({ error, reset }) {

    return (
        <html lang="en" className="dark">
            <head>
                <meta charSet="UTF-8" />
                <title>Document</title>
            </head>
            <body>

                <div>
                    <p>Something went wrong (This is main Global error file running)</p>
                    <button onClick={() => {
                        window.location.reload()
                    }}>Try Again</button>
                </div >
            </body>
        </html>
    )
}
