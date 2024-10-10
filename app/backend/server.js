const express = require('express')
const app = express()


app.get("/hello", (req,res) => {
    res.send("Circular MarketPlace App")
})

const port = 8080
app.listen(port,console.log(`server is listening on port ${port}...`))