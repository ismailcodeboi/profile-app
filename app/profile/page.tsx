import { auth } from "@/lib/auth"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-xl text-red-500">Access Denied</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="mb-4 text-3xl font-bold">User Profile</h1>
            <div className="rounded-lg border p-6 shadow-sm">
                <p className="mb-2"><strong>ID:</strong> {session.user.id}</p>
                <p className="mb-2"><strong>Name:</strong> {session.user.name}</p>
                <p className="mb-2"><strong>Email:</strong> {session.user.email}</p>
                {session.user.image && (
                    <img
                        src={session.user.image}
                        alt="Profile"
                        className="mt-4 h-20 w-20 rounded-full"
                    />
                )}
            </div>
        </div>
    )
}
