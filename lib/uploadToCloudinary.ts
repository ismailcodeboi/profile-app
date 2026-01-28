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
