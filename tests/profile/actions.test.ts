import { updateProfileImage } from '@/app/profile/actions';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            update: jest.fn(),
        },
    },
}));

jest.mock('@/lib/auth', () => ({
    auth: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock('@/lib/cloudinary', () => ({
    uploader: {
        upload_stream: jest.fn(),
    },
}));

// Polyfill for File/Blob.arrayBuffer which might be missing in JSDOM
if (!Blob.prototype.arrayBuffer) {
    Blob.prototype.arrayBuffer = async function () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(this);
        });
    };
}


describe('updateProfileImage Server Action', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw "Not authenticated" if no session exists', async () => {
        (auth as jest.Mock).mockResolvedValue(null);
        const formData = new FormData();
        formData.append('image', new File([''], 'test.png'));

        await expect(updateProfileImage(formData)).rejects.toThrow('Not authenticated');
    });

    it('should throw "No image provided" if formData is empty', async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
        const formData = new FormData(); // Empty

        await expect(updateProfileImage(formData)).rejects.toThrow('No image provided');
    });

    it('should throw "Image too large" if file > 5MB', async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });

        // Create a large file using string repetition
        const largeContent = 'a'.repeat(5 * 1024 * 1024 + 1);
        const file = new File([largeContent], 'large.png', { type: 'image/png' });

        const formData = new FormData();
        formData.append('image', file);

        await expect(updateProfileImage(formData)).rejects.toThrow('Image too large (max 5MB)');
    });

    it('should upload image and update user in DB on success', async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
        const mockSecureUrl = 'https://res.cloudinary.com/demo/image.png';

        // Mock Cloudinary upload stream
        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
            callback(null, { secure_url: mockSecureUrl });
            return {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
                once: jest.fn(),
                emit: jest.fn(),
            };
        });

        // Mock DB update
        (prisma.user.update as jest.Mock).mockResolvedValue({
            id: '1',
            email: 'test@example.com',
            image: mockSecureUrl
        });

        // Create a valid file
        const file = new File(['test content'], 'test.png', { type: 'image/png' });
        // Mock arrayBuffer explicitly on the instance
        Object.defineProperty(file, 'arrayBuffer', {
            value: async () => Buffer.from('test content')
        });

        const formData = new FormData();
        formData.append('image', file);

        const result = await updateProfileImage(formData);

        expect(result).toEqual({ success: true, imageUrl: mockSecureUrl });
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
            data: { image: mockSecureUrl },
        });
    });
});
