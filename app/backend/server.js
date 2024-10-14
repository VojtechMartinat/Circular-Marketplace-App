const express = require('express');
const app = express();

const { Client } = require('pg')

const client = new Client({
    host: 'database-2.cv06umom2foy.eu-west-1.rds.amazonaws.com',
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
})
try {
    client.connect()
    console.log("Connected")
} catch (error){
    console.log("error")
}

app.get('/hello', (req, res) => {
    res.send('Circular MarketPlace App');
});

const port = 8080;
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
        return;
    }
    console.log(`Server is listening on port ${port}...`);
});