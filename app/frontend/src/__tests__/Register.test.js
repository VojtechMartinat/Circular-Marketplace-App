import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For matchers like 'toBeInTheDocument'
import Register from '../Components/Register'; // Import the component you want to test
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

        const username = await screen.findByText(/Username:/i);
        expect(username).toBeInTheDocument();

        const password = await screen.findByText(/Password:/i);
        expect(password).toBeInTheDocument();


        const email = await screen.findByText(/Email:/i);
        expect(email).toBeInTheDocument();

        const location = await screen.findByText(/Location:/i);
        expect(location).toBeInTheDocument();

        const register = await screen.findByRole('button', { name: /Register/i });
        expect(register).toBeInTheDocument();
    });
});
