// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const en = require('../frontend/assets/lang/en.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nb = require('../frontend/assets/lang/nb.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nn = require('../frontend/assets/lang/nn.json');

const finnMuligensUbrukteIder = (alleBenyttedeSpråkIder, språkfil, språkfilNavn) => {
    console.info('------------------------------------------------------------');
    console.info(`ubrukte språkId'er i ${språkfilNavn}.json: 
`);
    const iderSomIkkeErIBruk = Object.keys(språkfil).filter(
        key => !alleBenyttedeSpråkIder.includes(key)
    );
    iderSomIkkeErIBruk.forEach(key => {
        console.info(`Ikke i bruk? -> ${key}`);
    });
    return iderSomIkkeErIBruk;
};

/**
 * Skriptet finner *nesten* alle tekst id'er som er i bruk i ./src/frontend
 *
 * Resultatet vil
 *
 * TODO:
 * inkludere id'er med formen 'aaa-bbb.asdf'
 * fikse slik at man ikke trenger å fjerne "type": "module" fra package.json for å kunne kjøre skriptet
 */
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

        const iderSomIkkeErIBrukNB = finnMuligensUbrukteIder(alleBenyttedeSpråkIder, nb, 'NB');
        const iderSomIkkeErIBrukNN = finnMuligensUbrukteIder(alleBenyttedeSpråkIder, nn, 'NN');
        const iderSomIkkeErIBrukEN = finnMuligensUbrukteIder(alleBenyttedeSpråkIder, en, 'EN');

        console.info('------------------------------------------------------------');
        console.info(`nb length: ${Object.keys(nb).length}`);
        console.info(`antall benyttede språknøkkler: ${alleBenyttedeSpråkIder.length}`);
        console.info(`Ider som ikke er i bruk fra nb.json: ${iderSomIkkeErIBrukNB.length}`);
        console.info(`Ider som ikke er i bruk fra nn.json: ${iderSomIkkeErIBrukNN.length}`);
        console.info(`Ider som ikke er i bruk fra en.json: ${iderSomIkkeErIBrukEN.length}`);
    }
);
