require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/index');

const app = express();
// const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', apiRouter);

app.listen(process.env.PORT, () => {
    console.log(`E-Commerce App is listening on PORT ${process.env.PORT} `);
});
