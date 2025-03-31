import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import Profile from "../Components/Profile";
import { getUser } from "../services/userService";  // Import getUser

jest.mock('../Contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock("../services/userService", () => ({
    getUser: jest.fn(),
}));

describe('Profile Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            isLoggedIn: true,
            user: { uid: '1234' },  // Mock current user with matching userID
        });

        getUser.mockResolvedValue({  // Mock resolved response for getUser
            user: { userID: '1234', name: "Test User" },
        });
    });

    test('renders all expected elements', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        // Wait for dbUser to be set in the component state
        await waitFor(() => expect(screen.getByText(/Favourited/i)).toBeInTheDocument());
        expect(screen.getByText(/Bought/i)).toBeInTheDocument();
        expect(screen.getByText(/Sold/i)).toBeInTheDocument();
        expect(screen.getByText(/Posted/i)).toBeInTheDocument();
    });
});
