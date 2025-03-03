import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../Components/Profile';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { getUserArticles, getUserOrders } from '../services/userService';

jest.mock('../services/userService', () => ({
    getUserArticles: jest.fn(),
    getUserOrders: jest.fn(),
}));

jest.mock('../Contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('ArticleDetails Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            isLoggedIn: true,
            user: { userID: 'pIHf8DLX0TNPfYsXbkEMhXxa19q1'}
        });

        getUserArticles.mockResolvedValue({
            articles: [
                {
                    articleID: 2,
                    articleTitle: 'Test Article',
                    description: 'This is a test article description.',
                    price: 100,
                    state: 'Available',
                },
            ],
        });


        // Mock getArticlePhotos
        getUserOrders.mockResolvedValue({
            orders:[
                {
                    userID: 1234,
                    paymentMethodID: 1,
                    dateOfPurchase: '2024-10-01',
                    collectionMethod: 'delivery',
                    orderStatus: 'confirmed',
                }
        ]
        });
    });

    test('renders all expected elements', async () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        // Wait for loading state to disappear
        await screen.findByText(/loading/i);

        // Wait for "Test Article" after loading is gone
        const title = await screen.findByText(/Test Article/i);
        expect(title).toBeInTheDocument();

        const articlesTitle = await screen.findByText(/Articles/i);
        expect(articlesTitle).toBeInTheDocument();

        const ordersTitle = await screen.findByText(/Orders/i);
        expect(ordersTitle).toBeInTheDocument();

        const state = await screen.findByText(/delivery/i);
        expect(state).toBeInTheDocument();
    });

});
