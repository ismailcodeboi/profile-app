export default function ProfileLoading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="relative px-6 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-zinc-900 dark:bg-gray-700 animate-pulse"></div>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="mx-auto h-6 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        <div className="mx-auto h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

                        <div className="space-y-3 mt-6">
                            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
    )
}
