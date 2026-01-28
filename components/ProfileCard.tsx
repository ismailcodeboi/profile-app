"use client"

import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
}

interface ProfileCardProps {
    user: User
    onSignOut?: () => Promise<void>
}

export default function ProfileCard({ user, onSignOut }: ProfileCardProps) {
    return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="relative px-6 pb-8">
                <div className="relative -mt-16 mb-6 flex justify-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-zinc-900">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name || "Profile"}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-4xl font-bold text-zinc-500 dark:bg-zinc-800">
                                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                        {user.name || "User"}
                    </h2>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={async () => {
                                if (onSignOut) {
                                    await onSignOut()
                                } else {
                                    await signOut({ callbackUrl: "/" })
                                }
                            }}
                            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                        >
                            Sign Out
                        </button>

                        <Link
                            href="/"
                            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 dark:focus:ring-offset-zinc-900"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
