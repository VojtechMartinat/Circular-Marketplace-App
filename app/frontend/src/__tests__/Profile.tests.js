import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import Profile from "../Components/Profile";

jest.mock('../Contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('Profile Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            isLoggedIn: true,
            user: { userID: '1234' },
        });
    });

    test('renders all expected elements', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );



        const title2 = await screen.findByText(/Favourited Articles/i);
        expect(title2).toBeInTheDocument();

        const title3 = await screen.findByText(/Articles Bought/i);
        expect(title3).toBeInTheDocument();

        const title4 = await screen.findByText(/Articles Sold/i);
        expect(title4).toBeInTheDocument();

        const title5 = await screen.findByText(/Articles Posted/i);
        expect(title5).toBeInTheDocument();
    });
});
