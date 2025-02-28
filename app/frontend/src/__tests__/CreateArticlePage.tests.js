import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateArticlePage from '../Components/CreateArticlePage';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

jest.mock('../Contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('CreateArticle Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            isLoggedIn: true,
            user: { userID: '1234' },
        });
    });

    test('renders all expected elements', async () => {
        render(
            <MemoryRouter>
                <CreateArticlePage />
            </MemoryRouter>
        );

        const title = await screen.findByRole('heading', { name: /Create New Article/i });
        expect(title).toBeInTheDocument();

        const title2 = await screen.findByText(/Article Title:/i);
        expect(title2).toBeInTheDocument();

        const description = await screen.findByText(/Description:/i);
        expect(description).toBeInTheDocument();

        const price = await screen.findByText(/Price:/i);
        expect(price).toBeInTheDocument();

        const Create = await screen.findByRole('button', { name: /Create Article/i });
        expect(Create).toBeInTheDocument();
    });
});
