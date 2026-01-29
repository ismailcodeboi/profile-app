import { signIn } from "@/lib/auth"
import SubmitButton from "@/components/SubmitButton"

export default function SignIn() {
    return (
        <div className="w-full max-w-md space-y-8 rounded-lg p-6 shadow-md border-3 border-white border-solid">
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-sm">
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
    )
}
