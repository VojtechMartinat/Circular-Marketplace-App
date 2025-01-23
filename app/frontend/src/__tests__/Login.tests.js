import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For matchers like 'toBeInTheDocument'
import Login from '../Components/Login'; // Import the component you want to test
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
                <Login />
            </MemoryRouter>
        );

        const title = await screen.findByText(/Username:/i);
        expect(title).toBeInTheDocument();

        const title2 = await screen.findByText(/Password:/i);
        expect(title2).toBeInTheDocument();

        const Loginbutton = await screen.findByRole('button', { name: /Login/i });
        expect(Loginbutton).toBeInTheDocument();
    });
});
