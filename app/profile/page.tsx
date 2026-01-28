import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProfileCard from "@/components/ProfileCard"
import { handleSignOut } from "./actions"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/api/auth/signin")
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    })

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-xl text-red-500">User not found</p>
                <Link href="/" className="mt-4 text-blue-500 hover:underline">
                    Back to Home
                </Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Your Profile
            </h1>

            <ProfileCard user={user} onSignOut={handleSignOut} />

            <Link
                href="/"
                className="mt-8 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                ← Back to Home
            </Link>
        </div>
    )
}
