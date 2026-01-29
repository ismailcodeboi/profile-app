import { auth, signIn, signOut } from "@/lib/auth"
import Link from "next/link"
import SignIn from "@/components/SignIn"
import SubmitButton from "@/components/SubmitButton"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Profile App</h1>
      </div>

      <div className="flex flex-col items-center gap-4">
        {session ? (
          <>
            <p className="text-xl">
              Signed in as {session.user?.name}
            </p>
            <div className="flex gap-4">
              <Link
                href="/profile"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Go to Profile
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <SignIn />
          </>
        )}
      </div>
    </main>
  )
}
