interface MiljøProps {
    loginService: string;
    visInnsendingsknapp: boolean;
    mellomlagerUrl: string;
    modellVersjon: number;
}
const modellVersjon = 1;

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            loginService: 'https://loginservice.dev.nav.no/login?',
            visInnsendingsknapp: true,
            mellomlagerUrl:
                'https://familie-dokument.dev.nav.no/familie/dokument/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
        };
    } else if (window.location.hostname.indexOf('familie-ba-soknad.nav') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsknapp: false,
            mellomlagerUrl: 'https://www.nav.no/familie/dokument/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
        };
    } else {
        return {
            loginService: `http://localhost:8080/local/cookie?subject=12345678901`,
            visInnsendingsknapp: true,
            mellomlagerUrl: 'http://localhost:8082/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
        };
    }
};

export default Miljø;
