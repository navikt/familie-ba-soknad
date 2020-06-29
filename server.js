const express = require('express');
const path = require('path');
const app = express();
const setupProxy = require('./src/setupProxy');
const getDecorator = require('./src/dekorator');
const mustacheExpress = require('mustache-express');

app.set('views', `${__dirname}/build`);
app.set('view engine', 'mustache');
app.engine('html', mustacheExpress());

setupProxy(app);

// Static files
app.use(express.static(path.join(__dirname, 'build'), { index: false }));

// Nais functions
app.get(`/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

app.get('/', (req, res) =>
    getDecorator()
        .then(fragments => {
            const error = `En feil oppstod. Klikk <a href="https://www.nav.no">her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
            res.status(500).send(error);
        })
        .catch(e => {
            res.render('index.html', fragments);
        })
);

app.listen(9000);
