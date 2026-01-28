import { signIn } from "@/lib/auth"
import SubmitButton from "@/components/SubmitButton"

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Access your profile and manage your settings
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/" })
                        }}
                    >
                        <SubmitButton text="Sign in with Google" loadingText="Signing in..." />
                    </form>
                </div>
            </div>
        </div>
    )
}
