import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../Components/Register';
import 'whatwg-fetch';

import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

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
                <Register />
            </MemoryRouter>
        );


        const passInput = await screen.findByPlaceholderText(/Password/i);
        expect(passInput).toBeInTheDocument();

        const emailInput = await screen.findByPlaceholderText(/Email/i);
        expect(emailInput).toBeInTheDocument();


        const locInput = await screen.findByPlaceholderText(/Location/i);
        expect(locInput).toBeInTheDocument();

        const register = await screen.findByRole('button', { name: /Register/i });
        expect(register).toBeInTheDocument();
    });
});
