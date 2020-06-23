const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

// Nais functions
app.get(`/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

app.get('/', function (_req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000);
