const express = require('express');
const app = express();
const connection = require('./database/connect')
const articles = require('./routes/Articles')

connection.sync().then(r => console.log("Success")).catch((error) => {console.log(error)})

//middleware
app.use(express.json())

app.get('/hello', (req, res) => {
    res.send('Circular MarketPlace App');
});

app.use('/api/v1/articles', articles);

const port = 8080;
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
        return;
    }
    console.log(`Server is listening on port ${port}...`);
});

module.exports = app;

