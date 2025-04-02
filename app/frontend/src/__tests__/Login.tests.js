import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Components/Login';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import 'whatwg-fetch';

jest.mock('../Contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('CreateArticle Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            isLoggedIn: false,
        });
    });

    test('renders all expected elements', async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const loginHeaders = await screen.findAllByText(/login/i);
        expect(loginHeaders[0]).toBeInTheDocument();


        const emailInput = await screen.findByPlaceholderText(/Email/i);
        expect(emailInput).toBeInTheDocument();


        const Loginbutton = await screen.findByRole('button', { name: /Login/i });
        expect(Loginbutton).toBeInTheDocument();
    });
});
