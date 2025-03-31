import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArticleDetails from '../Components/ArticleDetails';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { getArticle, getArticlePhotos } from '../services/articleService';
import 'whatwg-fetch';

jest.mock('../services/articleService', () => ({
    getArticle: jest.fn(),
    getArticlePhotos: jest.fn(),
}));

jest.mock('../Contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('ArticleDetails Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            isLoggedIn: true,
            user: { userID: '1234' },
        });

        getArticle.mockResolvedValue({
            article: {
                articleTitle: 'Test Article',
                description: 'This is a test article description.',
                price: 100,
                state: 'Available',
            },
        });

        // Mock getArticlePhotos
        getArticlePhotos.mockResolvedValue({
            photos: [
                {
                    image: {
                        data: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
                    },
                },
            ],
        });
    });

    test('renders all expected elements', async () => {
        render(
            <MemoryRouter>
                <ArticleDetails />
            </MemoryRouter>
        );

        // Check if the article title is rendered
        const title = await screen.findByRole('heading', { name: /test article/i });
        expect(title).toBeInTheDocument();

        // Check if the article description is rendered
        const description = await screen.findByText(/this is a test article description\./i);
        expect(description).toBeInTheDocument();

        // Check if the price is rendered
        const price = await screen.findByRole('heading', { name: /£?\s*100/i });
        expect(price).toBeInTheDocument();


        // Check if the "Buy" button is rendered
        const buyButton = await screen.findByRole('button', { name: /buy now for £\s*100/i });
        expect(buyButton).toBeInTheDocument();
    });
});