import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

import { uploadToCloudinary } from "@/lib/uploadToCloudinary"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.image) {
                try {
                    // Check if user already has a Cloudinary image URL (skip if yes)
                    if (user.image.includes("res.cloudinary.com")) {
                        return true
                    }

                    // Upload image to Cloudinary
                    const cloudinaryUrl = await uploadToCloudinary(user.image)

                    if (cloudinaryUrl) {
                        // Update user.image with Cloudinary URL
                        // If user.id exists (user in DB), update DB
                        if (user.id) {
                            await prisma.user.update({
                                where: { id: user.id },
                                data: { image: cloudinaryUrl },
                            })
                        }
                        // Update locally so session might pick it up?
                        user.image = cloudinaryUrl
                    }
                } catch (error) {
                    console.error("Error uploading image to Cloudinary:", error)
                    // Don't block sign-in if upload fails
                }
            }
            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
})
