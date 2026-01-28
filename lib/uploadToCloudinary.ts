import cloudinary from './cloudinary';

/**
 * Uploads an image from a URL to Cloudinary.
 * @param imageUrl The URL of the image to upload.
 * @returns The secure URL of the uploaded image on Cloudinary.
 */
export const uploadToCloudinary = async (imageUrl: string) => {
    try {
        if (!imageUrl) return null;

        // Use the uploader to upload the image
        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: 'profile_images', // Organize images in a folder
            resource_type: 'image',
            overwrite: true, // If we want to overwrite based on public_id (not used here)
        });

        return uploadResponse.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        // Rethrow or return null depending on how we want to handle it upstream
        // The requirement says "Handle errors", "return Cloudinary URL"
        throw error;
    }
};

/**
 * Uploads a base64 encoded image or buffer to Cloudinary.
 * Used for server actions where we receive FormData.
 */
export const uploadBufferToCloudinary = async (buffer: Buffer | string) => {
    try {
        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'profile_images',
                    resource_type: 'image',
                    overwrite: true,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('No result from Cloudinary'));
                    resolve(result.secure_url);
                }
            );

            if (Buffer.isBuffer(buffer)) {
                // @ts-ignore
                const stream = require('stream'); // Dynamic require to avoid issues if used on client (though this file should be server-only effectively)
                const bufferStream = new stream.PassThrough();
                bufferStream.end(buffer);
                bufferStream.pipe(uploadStream);
            } else {
                // If it's a string (base64 or url), we can try to write it or upload directly? 
                // Actually upload_stream expects a stream. 
                // If it is a string data URI, we might be better off using uploader.upload directly.
                // But let's assume we handle Buffer here primarily.
                reject(new Error("Only Buffer is fully supported in this helper for now"));
            }
        });
    } catch (error) {
        console.error('Error uploading buffer to Cloudinary:', error);
        throw error;
    }
};
