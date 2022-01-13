// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const en = require('../frontend/assets/lang/en.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nb = require('../frontend/assets/lang/nb.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nn = require('../frontend/assets/lang/nn.json');

exec(
    `grep -r -oh -I --exclude '.json' --exclude '.test.ts' -E "([\\'|\\"]{1,1}([a-zA-ZæøåÆØÅ]+\\.{1,1})(([a-zA-ZæøåÆØÅ]+\\.{1,1})|([a-zA-ZæøåÆØÅ]+\\_{1,1})|([a-zA-ZæøåÆØÅ]+\\-{1,1}))*[a-zA-ZæøåÆØÅ]+[\\'|\\"]{1,1})" ./src/frontend`,
    (_, stdout) => {
        let ids = stdout.split('\n');

        let alleBenyttedeSpråkIder = [...new Set(ids)]
            .map(elem => {
                return elem.slice(1, elem.length - 1);
            })
            .filter(elem => {
                if (elem.length === 0) {
                    return false;
                }
                return !(
                    elem === 'DD.MM.YYYY' ||
                    elem === 'DD.MM.YY' ||
                    elem === 'www.nav' ||
                    elem === 'www.nav.no' ||
                    elem === 'favicon.ico' ||
                    elem === 'DD.MM.ÅÅÅÅ'
                );
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
        console.info("ubrukte språkId'er i nb.json: \n");
        const iderSomIkkeErIBrukNB = Object.keys(nb).filter(
            key => !alleBenyttedeSpråkIder.includes(key)
        );
        iderSomIkkeErIBrukNB.forEach(key => {
            console.info(`Ikke i bruk? -> ${key}`);
        });
        console.info('------------------------------------------------------------');
        console.info("ubrukte språkId'er i nn.json: \n");
        const iderSomIkkeErIBrukNN = Object.keys(nn).filter(
            key => !alleBenyttedeSpråkIder.includes(key)
        );
        iderSomIkkeErIBrukNN.forEach(key => {
            console.info(`Ikke i bruk? -> ${key}`);
        });
        console.info('------------------------------------------------------------');
        console.info("ubrukte språkId'er i en.json: \n");
        const iderSomIkkeErIBrukEN = Object.keys(en).filter(
            key => !alleBenyttedeSpråkIder.includes(key)
        );
        iderSomIkkeErIBrukEN.forEach(key => {
            console.info(`Ikke i bruk? -> ${key}`);
        });

        console.info('------------------------------------------------------------');

        console.info(`nb length: ${Object.keys(nb).length}`);
        console.info(`antall benyttede språknøkkler: ${alleBenyttedeSpråkIder.length}`);
        console.info(`Ider som ikke er i bruk fra nb.json: ${iderSomIkkeErIBrukNB.length}`);
        console.info(`Ider som ikke er i bruk fra nn.json: ${iderSomIkkeErIBrukNN.length}`);
        console.info(`Ider som ikke er i bruk fra en.json: ${iderSomIkkeErIBrukEN.length}`);
    }
);
