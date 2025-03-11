const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./database/connect');

const articles = require('./routes/Articles');
const users = require('./routes/User');
const orders = require('./routes/Order');
const paymentcards = require('./routes/PaymentCard');
const photos = require('./routes/Photo');
const tags = require('./routes/Tag');
const wishlists = require('./routes/Wishlist');
const tasklog = require('./routes/TaskLog');
const messages = require('./routes/Message');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Database connection
connection.sync()
    .then(() => console.log("Database connected successfully"))
    .catch(error => console.log("Database connection error:", error));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10000mb" }));
app.use(bodyParser.urlencoded({ limit: "10000mb", extended: true, parameterLimit: 50000 }));

// Routes
app.get('/hello', (req, res) => {
    res.send('Circular MarketPlace App - Running on AWS Lambda!');
});
app.use('/api/v1/articles', articles);
app.use('/api/v1/users', users);
app.use('/api/v1/orders', orders);
app.use('/api/v1/paymentcards', paymentcards);
app.use('/api/v1/photos', photos);
app.use('/api/v1/tags', tags);
app.use('/api/v1/wishlists', wishlists);
app.use('/api/v1/tasklog', tasklog);
app.use('/api/v1/messages', messages);

// Error handling middleware
app.use(errorHandler);

// AWS Lambda compatibility
module.exports.handler = serverless(app);

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running locally on http://localhost:${PORT}`);
    });
}