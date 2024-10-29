const request = require('supertest');
const { sequelize, Wishlist } = require('./Setup');
const app = require('../server');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Wishlist.destroy({ where: {} });
});

describe('Wishlist Model Tests with Sequelize', () => {

    test('GET /api/v1/wishlists - Should return all wishlists as JSON', async () => {
        await Wishlist.bulkCreate([
            { userID: '1', articleID: '101', totalPrice: 100.0 },
            { userID: '2', articleID: '102', totalPrice: 200.0 },
        ]);

        const res = await request(app).get('/api/v1/wishlists');
        expect(res.statusCode).toBe(200);
        expect(res.body.wishlists.length).toBe(2);
        expect(res.body.wishlists[0].userID).toBe('1');
        expect(res.body.wishlists[1].totalPrice).toBe(200.0);
    });

    test('POST /api/v1/wishlists - Should create a new wishlist', async () => {
        const newWishlist = { userID: '3', articleID: '103', totalPrice: 300.0 };

        const res = await request(app)
            .post('/api/v1/wishlists')
            .send(newWishlist);

        expect(res.statusCode).toBe(201);
        expect(res.body.wishlist.userID).toBe('3');
        expect(res.body.wishlist.totalPrice).toBe(300.0);
    });

    test('GET /api/v1/wishlists/:id - Should return a specific wishlist by userID', async () => {
        await Wishlist.create({ userID: '1', articleID: '101', totalPrice: 100.0 });

        const res = await request(app).get('/api/v1/wishlists/1');

        expect(res.statusCode).toBe(200);
        expect(res.body.wishlist.userID).toBe('1');
        expect(res.body.wishlist.totalPrice).toBe(100.0);
    });

    test('PUT /api/v1/wishlists/:id - Should update a wishlist', async () => {
        const wishlist = await Wishlist.create({ userID: '2', articleID: '102', totalPrice: 200.0 });

        const updatedData = { totalPrice: 250.0 };

        const res = await request(app)
            .put(`/api/v1/wishlists/${wishlist.userID}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.wishlist.totalPrice).toBe(250.0);
    });

    test('DELETE /api/v1/wishlists/:id - Should delete the wishlist if it exists', async () => {
        const wishlist = await Wishlist.create({ userID: '2', articleID: '102', totalPrice: 200.0 });

        const res = await request(app).delete(`/api/v1/wishlists/${wishlist.userID}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Wishlist deleted successfully');
    });

    test('GET /api/v1/wishlists/:id - Should return 404 if wishlist is not found', async () => {
        const res = await request(app).get('/api/v1/wishlists/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Wishlist not found');
    });

});
