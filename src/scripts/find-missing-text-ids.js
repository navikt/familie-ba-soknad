// const exec = require('child_process');

const { exec } = require('child_process');

const en = require('../frontend/assets/lang/en.json');
const nb = require('../frontend/assets/lang/nb.json');
const nn = require('../frontend/assets/lang/nn.json');

exec(
    "grep -r -oh -I --exclude '.json' --exclude '.test.ts' -E \"('([a-zA-ZæøåÆØÅ]+\\.{1,1})(([a-zA-ZæøåÆØÅ]+\\.{1,1})|([a-zA-ZæøåÆØÅ]+\\_{1,1})|([a-zA-ZæøåÆØÅ]+\\-{1,1}))*[a-zA-ZæøåÆØÅ]+')\" ./src/frontend",
    (err, stdout) => {
        let ids = stdout.split('\n');
        let alleBenyttedeSpråkIder = [...new Set(ids)]
            .map(elem => {
                return elem.slice(1, elem.length - 1);
            })
            .filter(elem => {
                if (elem.length === 0) {
                    return false;
                }
                if (elem === 'DD.MM.YYYY' || elem === 'DD.MM.YY' || elem === 'www.nav') {
                    return false;
                }
                return true;
            });

        console.info('------------------------------------------------------------');
        console.info("språkid'er som mangler i nb.json: \n");
        alleBenyttedeSpråkIder.forEach(elem => {
            if (!(elem in nb)) {
                console.info(`ERROR -> ${elem}`);
            }
        });
        console.info('------------------------------------------------------------');
        console.info("språkid'er som mangler i nn.json: \n");
        alleBenyttedeSpråkIder.forEach(elem => {
            if (!(elem in nn)) {
                console.info(`ERROR -> ${elem}`);
            }
        });
        console.info('------------------------------------------------------------');
        console.info("språkid'er som mangler i en.json: \n");
        alleBenyttedeSpråkIder.forEach(elem => {
            if (!(elem in en)) {
                console.info(`ERROR -> ${elem}`);
            }
        });

        console.info('------------------------------------------------------------');

        // alleBenyttedeSpråkIder.forEach(id => {
        //     console.info(id);
        // });

        console.info('------------------------------------------------------------');
        Object.keys(nb).forEach(key => {
            if (key === 'oppsummering.deltittel.ombarnet') {
                console.info('ja, den er funnet');
                console.info(key);
            }
        });
        alleBenyttedeSpråkIder.forEach(key => {
            if (key === 'oppsummering.deltittel.ombarnet') {
                console.info('og den finnes også blant alle benyttede spårkfiler:');
                console.info(key);
            }
        });

        console.info('------------------------------------------------------------');
        console.info(
            'Så da skal det funke og finne hvilke tekster fra nb.json som ikke er blant alleBenyttedeSpråkIder:'
        );
        const iderSomIkkeErIBrukNB = Object.keys(nb).filter(key => {
            if (alleBenyttedeSpråkIder.includes(key)) {
                return false;
            }
            return true;
        });

        iderSomIkkeErIBrukNB.forEach(key => {
            console.info(`Ikke i bruk: ${key}`);
        });

        console.info('------------------------------------------------------------');

        console.info(`nb length: ${Object.keys(nb).length}`);
        console.info(`Count : ${alleBenyttedeSpråkIder.length}`);
        console.info(`Ider som ikke er i bruk : ${iderSomIkkeErIBrukNB.length}`);
    }
);
