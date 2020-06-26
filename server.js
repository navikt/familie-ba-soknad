const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const app = express();
const setupProxy = require('./src/setupProxy');
const getDecorator = require('./src/dekorator');
const mustacheExpress = require("mustache-express");
const { Console } = console;

app.set("views", `${__dirname}/build`);
app.set("view engine", "mustache");
app.engine("html", mustacheExpress());


setupProxy(app);

// app.use(express.static(path.join(__dirname, 'build')));

// Static files
app.use(express.static(path.join(__dirname, 'build'), { index: false }));

// Nais functions
app.get(`/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));


app.get('/deko', (req, res) =>
    getDecorator()
        .then(fragments => {
            console.log("sending file");
            //res.sendFile(path.join(__dirname + '/build/index.html'));
            console.log("sending file OK");
            res.render("index-dek.html", fragments);
            console.log("render OK");
        })
        .catch(e => {
            const error = `Failed to get decorator: ${e}`;
            console.log(error);
            res.status(500).send(error);
        })
);


app.get('/', function (_req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(9000);
