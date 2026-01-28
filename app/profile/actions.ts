"use server"

import { signOut, auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToCloudinary } from "@/lib/uploadToCloudinary" // We'll actually use the buffer helper, let me fix imports in a sec
// Actually, we can just grab the buffer and convert to base64 to use the existing uploadToCloudinary if we want, 
// OR use a dedicated stream uploader. The previous step added uploadBufferToCloudinary.

// But wait, the standard approach with Server Actions and FormData is to get the file, arrayBuffer() it, 
// convert to Buffer, and stream it.

import cloudinary from "@/lib/cloudinary"; // Direct import might be easier if we just write the logic here or use the helper

export async function handleSignOut() {
    await signOut()
}

export async function updateProfileImage(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("Not authenticated");
    }

    const file = formData.get("image") as File;
    if (!file) {
        throw new Error("No image provided");
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error("Image too large (max 5MB)");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    // We can use a promise wrapper around upload_stream
    const imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'profile_images',
                resource_type: 'image',
                overwrite: true,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed'));
                }
            }
        );

        // Write buffer to stream
        const intoStream = require('stream').Readable.from(buffer);
        intoStream.pipe(uploadStream);
    });

    // Update user in DB
    await prisma.user.update({
        where: { email: session.user.email },
        data: { image: imageUrl },
    });

    return { success: true, imageUrl };
}
