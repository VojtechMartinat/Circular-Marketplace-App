const express = require('express');
const app = express();
const connection = require('./database/connect')
const articles = require('./routes/Articles')
const users = require('./routes/User')
const orders = require('./routes/Order')
const paymentcards = require('./routes/PaymentCard')
const photos = require('./routes/Photo')
const tags = require('./routes/Tag')
const wishlists = require('./routes/Wishlist')
const setupAssociations = require('./models/associations');

connection.sync().then(r => console.log("Success")).catch((error) => {console.log(error)})
setupAssociations();

//middleware
app.use(express.json())

app.get('/hello', (req, res) => {
    res.send('Circular MarketPlace App');
});

app.use('/api/v1/articles', articles);
app.use('/api/v1/users', users);
app.use('/api/v1/orders', orders);
app.use('/api/v1/paymentcards', paymentcards);
app.use('/api/v1/photos', photos);
app.use('/api/v1/tags', tags);
app.use('/api/v1/wishlists', wishlists);

const port = 8080;
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
        return;
    }
    console.log(`Server is listening on port ${port}...`);
});

module.exports = app;

