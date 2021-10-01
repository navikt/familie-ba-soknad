interface MiljøProps {
    soknadApi: string;
    loginService: string;
    visInnsendingsknapp: boolean;
    mellomlagerUrl: string;
    modellVersjon: number;
    dokumentUrl: string;
}
const modellVersjon = 12;

export const basePath = process.env.BASE_PATH ?? '/';

/**
 * Vi må fortsatt hente scripts og ressurser fra /ordinaer med mindre vi ønsker å gjøre endringer på
 * express-appen, og vi kan forwarde requests til APIet via /ordinaer, det eneste som må endres for
 * å støtte utvidet søknad er basepath for react-routeren og login-redirect, derfor gjør vi dette her.
 */
export const routerBasePath = window.location.pathname.includes('utvidet')
    ? basePath.replace('ordinaer', 'utvidet')
    : basePath;

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            soknadApi: `https://familie-ba-soknad.dev.nav.no${basePath}api`,
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
            soknadApi: `https://www.nav.no${basePath}api`,
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsknapp: false,
            mellomlagerUrl: 'https://www.nav.no/familie/dokument/api/soknad/barnetrygd',
            modellVersjon: modellVersjon,
            dokumentUrl: `https://www.nav.no/familie/dokument/api/mapper/ANYTTHING`, //Vil uansett gå til bucket "familievedlegg" enn så lenge,
        };
    } else {
        return {
            soknadApi: `http://${window.location.hostname}:3000${basePath}api`,
            loginService: `http://${window.location.hostname}:8080/local/cookie?subject=12345678901`,
            visInnsendingsknapp: true,
            mellomlagerUrl: `http://${window.location.hostname}:8082/api/soknad/barnetrygd`,
            modellVersjon: modellVersjon,
            dokumentUrl: `http://${window.location.hostname}:8082/api/mapper/ANYTTHING`,
        };
    }
};

export default Miljø;
