const request = require('supertest');
const { sequelize, Wishlist } = require('./Setup'); // Import Sequelize and the Wishlist model from Setup.js
const app = require('../server'); // Import your Express app

// Sync the database before any tests run
beforeAll(async () => {
    await sequelize.sync();
});

// Close the database connection after all tests have run
afterAll(async () => {
    await sequelize.close();
});

// Clear data before each test to ensure isolation
beforeEach(async () => {
    await Wishlist.destroy({ where: {} });
});

describe('Wishlist Model Tests with Sequelize', () => {

    test('GET /api/v1/wishlists - Should return all wishlists as JSON', async () => {
        // Insert some wishlists into the database for testing
        await Wishlist.bulkCreate([
            { userID: '1', articleID: '101', totalPrice: 100.0 },
            { userID: '2', articleID: '102', totalPrice: 200.0 },
        ]);

        // Simulate GET request to fetch all wishlists
        const res = await request(app).get('/api/v1/wishlists');

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.wishlists.length).toBe(2); // Should return 2 wishlists
        expect(res.body.wishlists[0].userID).toBe('1');
        expect(res.body.wishlists[1].totalPrice).toBe(200.0);
    });

    test('POST /api/v1/wishlists - Should create a new wishlist', async () => {
        const newWishlist = { userID: '3', articleID: '103', totalPrice: 300.0 };

        // Simulate POST request to create a new wishlist
        const res = await request(app)
            .post('/api/v1/wishlists')
            .send(newWishlist); // Send new wishlist data

        // Check the response status and structure
        expect(res.statusCode).toBe(201); // Expect wishlist to be created successfully
        expect(res.body.userID).toBe('3'); // Ensure the correct wishlist was created
        expect(res.body.totalPrice).toBe(300.0);
    });

    test('GET /api/v1/wishlists/:id - Should return a specific wishlist by userID', async () => {
        // Insert a wishlist into the database for testing
        await Wishlist.create({ userID: '1', articleID: '101', totalPrice: 100.0 });

        // Simulate GET request to fetch the wishlist by userID
        const res = await request(app).get('/api/v1/wishlists/1');

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.userID).toBe('1');
        expect(res.body.totalPrice).toBe(100.0);
    });

    test('PUT /api/v1/wishlists/:id - Should update a wishlist', async () => {
        // Insert a wishlist to be updated
        const wishlist = await Wishlist.create({ userID: '2', articleID: '102', totalPrice: 200.0 });

        const updatedData = { totalPrice: 250.0 };

        // Simulate PUT request to update the wishlist
        const res = await request(app)
            .put(`/api/v1/wishlists/${wishlist.userID}`)
            .send(updatedData);

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.totalPrice).toBe(250.0); // Ensure totalPrice is updated
    });

    test('DELETE /api/v1/wishlists/:id - Should delete the wishlist if it exists', async () => {
        // Insert a wishlist for deletion
        const wishlist = await Wishlist.create({ userID: '2', articleID: '102', totalPrice: 200.0 });

        // Simulate DELETE request to delete the wishlist by userID
        const res = await request(app).delete(`/api/v1/wishlists/${wishlist.userID}`);

        // Check the response
        expect(res.statusCode).toBe(200); // Expect successful deletion
        expect(res.body.message).toBe('Wishlist deleted successfully');
    });

    test('GET /api/v1/wishlists/:id - Should return 404 if wishlist is not found', async () => {
        const res = await request(app).get('/api/v1/wishlists/999'); // Non-existent userID
        expect(res.statusCode).toBe(404); // Expect 404 not found
        expect(res.body.error).toBe('Wishlist not found');
    });

});
