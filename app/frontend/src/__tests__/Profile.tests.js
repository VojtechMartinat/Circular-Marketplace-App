import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For matchers like 'toBeInTheDocument'
import Profile from '../Components/Profile'; // Import the component you want to test
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
            user: { userID: '1234'}
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

        const title = await screen.findByText(/Test Article/i);
        expect(title).toBeInTheDocument();

        const title2 = await screen.findByText(/Articles/i);
        expect(title2).toBeInTheDocument();

        // Check if the article description is rendered
        const description = await screen.findByText(/Orders/i);
        expect(description).toBeInTheDocument();


        // Check if the state is rendered
        const state = await screen.findByText(/delivery/i);
        expect(state).toBeInTheDocument();


    });
});
