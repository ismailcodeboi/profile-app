import { uploadToCloudinary, uploadBufferToCloudinary } from '@/lib/uploadToCloudinary';
import cloudinary from '@/lib/cloudinary';

// Mock Cloudinary
jest.mock('@/lib/cloudinary', () => ({
    uploader: {
        upload: jest.fn(),
        upload_stream: jest.fn(),
    },
}));

describe('uploadToCloudinary', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null if no image URL is provided', async () => {
        const result = await uploadToCloudinary('');
        expect(result).toBeNull();
    });

    it('should upload image and return secure_url', async () => {
        const mockSecureUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/profile_images/my_image.jpg';
        (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
            secure_url: mockSecureUrl,
        });

        const result = await uploadToCloudinary('https://example.com/image.jpg');

        expect(cloudinary.uploader.upload).toHaveBeenCalledWith('https://example.com/image.jpg', expect.objectContaining({
            folder: 'profile_images',
            resource_type: 'image',
        }));
        expect(result).toBe(mockSecureUrl);
    });

    it('should throw error if upload fails', async () => {
        const mockError = new Error('Upload failed');
        (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(mockError);

        await expect(uploadToCloudinary('https://example.com/image.jpg')).rejects.toThrow('Upload failed');
    });
});

describe('uploadBufferToCloudinary', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload buffer and return secure_url', async () => {
        const mockResult = { secure_url: 'https://cloudinary.com/image.jpg' };

        // Mock upload_stream to execute the callback with success
        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
            callback(null, mockResult);
            return {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                once: jest.fn(),
                emit: jest.fn(),
            };
        });

        const buffer = Buffer.from('test image content');
        const result = await uploadBufferToCloudinary(buffer);

        expect(result).toBe(mockResult.secure_url);
        expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
            expect.objectContaining({ folder: 'profile_images' }),
            expect.any(Function)
        );
    });

    it('should reject if upload_stream returns error', async () => {
        const mockError = new Error('Stream upload error');

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
            callback(mockError, null);
            return { write: jest.fn(), end: jest.fn() };
        });

        const buffer = Buffer.from('test');
        await expect(uploadBufferToCloudinary(buffer)).rejects.toThrow('Stream upload error');
    });
});
