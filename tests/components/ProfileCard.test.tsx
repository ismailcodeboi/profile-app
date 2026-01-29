import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileCard from '@/components/ProfileCard';
import { updateProfileImage } from '@/app/profile/actions';

// Mock dependencies
jest.mock('@/app/profile/actions', () => ({
    updateProfileImage: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

jest.mock('next-auth/react', () => ({
    signOut: jest.fn(),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
    toast: {
        error: jest.fn(),
        promise: jest.fn((promise) => promise),
    }
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

describe('ProfileCard Component', () => {
    const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
    };

    it('renders user information correctly', () => {
        render(<ProfileCard user={mockUser} />);

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        // Fallback initial
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('renders profile image if provided', () => {
        const userWithImage = { ...mockUser, image: 'https://example.com/pic.jpg' };
        render(<ProfileCard user={userWithImage} />);

        const img = screen.getByAltText('Test User');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/pic.jpg');
    });

    it('calls onSignOut when Sign Out button is clicked', async () => {
        const mockSignOut = jest.fn();
        render(<ProfileCard user={mockUser} onSignOut={mockSignOut} />);

        const signOutBtn = screen.getByText('Sign Out');
        fireEvent.click(signOutBtn);

        expect(mockSignOut).toHaveBeenCalled();
    });

    it('handles image upload correctly', async () => {
        (updateProfileImage as jest.Mock).mockResolvedValue({ success: true, imageUrl: 'new-url.jpg' });
        render(<ProfileCard user={mockUser} />);

        // Find hidden input
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        // Create a file
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        // Changing the file input triggers the handler
        fireEvent.change(input, { target: { files: [file] } });

        // Wait for the server action to be called
        await waitFor(() => {
            expect(updateProfileImage).toHaveBeenCalled();
        });
    });
});
