// db connection
const ConnectToMongoose = require('./db');
ConnectToMongoose();

// node module
const express = require('express')
var cors = require('cors')



require("dotenv").config
const app = express()
const port = process.env.PORT;

app.use(cors())

// routes import and API
app.use(express.json());
app.use("/api/auth", require('./routes/auth'));

// app.get('/hello', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})