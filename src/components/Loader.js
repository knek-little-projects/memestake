export default function ({
    loading,
    error,
    children,
}) {
    return (
        <>
            {
                loading
                &&
                <div>Loading...</div>
                ||
                (
                    error
                    &&
                    <div>Error: {"" + error}</div>
                    ||
                    <>
                        {children}
                    </>
                )
            }
        </>
    )
}