interface MiljøProps {
    soknadApi: string;
    loginService: string;
    visInnsendingsknapp: boolean;
    mellomlagerUrl: string;
    modellVersjon: number;
    dokumentUrl: string;
}
const modellVersjon = 1;

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            soknadApi:
                'https://familie-ba-soknad.dev.nav.no/familie/barnetrygd/soknad/ordinaer/api',
            loginService: 'https://loginservice.dev.nav.no/login?',
            visInnsendingsknapp: true,
            mellomlagerUrl:
                'https://familie-dokument.dev.nav.no/familie/dokument/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
            dokumentUrl:
                'https://familie-dokument.dev.nav.no/familie/dokument/api/mapper/ANYTTHING', //Vil uansett gå til bucket "familievedlegg" enn så lenge
        };
    } else if (window.location.hostname.indexOf('www.nav') > -1) {
        return {
            soknadApi: 'https://www.nav.no/familie/barnetrygd/soknad/ordinaer/api',
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsknapp: false,
            mellomlagerUrl: 'https://www.nav.no/familie/dokument/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
            dokumentUrl: `https://www.nav.no/familie/dokument/api/mapper/ANYTTHING`, //Vil uansett gå til bucket "familievedlegg" enn så lenge,
        };
    } else {
        return {
            soknadApi: 'http://localhost:3000/familie/barnetrygd/soknad/ordinaer/api',
            loginService: `http://localhost:8080/local/cookie?subject=12345678901`,
            visInnsendingsknapp: true,
            mellomlagerUrl: 'http://localhost:8082/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
            dokumentUrl: `http://localhost:8082/api/mapper/ANYTTHING`,
        };
    }
};

export default Miljø;
