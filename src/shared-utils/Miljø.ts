import { modellVersjon } from './modellversjon';

interface MiljøProps {
    soknadApiProxyUrl: string;
    soknadApiUrl: string;
    dokumentProxyUrl: string;
    dokumentUrl: string;
    wonderwallUrl: string;
    oauthCallbackUri: string;
    modellVersjon: number;
    port: number;
}

export const basePath = process.env.BASE_PATH ?? '/';

/**
 * Vi må fortsatt hente scripts og ressurser fra /ordinaer med mindre vi ønsker å gjøre endringer på
 * express-appen, og vi kan forwarde requests til APIet via /ordinaer, det eneste som må endres for
 * å støtte utvidet søknad er basepath for react-routeren og login-redirect, derfor gjør vi dette her.
 */
export const routerBasePath = window.location.pathname.includes('utvidet')
    ? basePath.replace('ordinaer', 'utvidet')
    : basePath;

export const erProd = () => {
    if (typeof window === 'undefined') {
        return process.env.ENV === 'prod';
    }
    return window.location.hostname.indexOf('www') > -1;
};

export const erDev = () => {
    if (typeof window === 'undefined') {
        return process.env.ENV === 'dev';
    }
    return window.location.hostname.indexOf('dev') > -1;
};

export const erLokalt = () => !erProd() && !erDev();

const Miljø = (): MiljøProps => {
    if (erDev()) {
        return {
            soknadApiProxyUrl: `https://familie-ba-soknad.dev.nav.no${basePath}api`,
            soknadApiUrl: `http://familie-baks-soknad-api/api`,
            dokumentProxyUrl: `https://familie-ba-soknad.dev.nav.no${basePath}dokument`,
            dokumentUrl: 'http://familie-dokument/familie/dokument/api', //Vil uansett gå til bucket "familievedlegg" enn så lenge
            modellVersjon: modellVersjon,
            wonderwallUrl: 'https://familie-ba-soknad.dev.nav.no/oauth2/login?redirect=',
            oauthCallbackUri: 'https://familie-ba-soknad.dev.nav.no/oauth2/callback',
            port: 9000,
        };
    } else if (erProd()) {
        return {
            soknadApiProxyUrl: `https://www.nav.no${basePath}api`,
            soknadApiUrl: `http://familie-baks-soknad-api/api`,
            dokumentProxyUrl: `https://www.nav.no${basePath}dokument`,
            dokumentUrl: 'http://familie-dokument/familie/dokument/api', //Vil uansett gå til bucket "familievedlegg" enn så lenge,
            modellVersjon: modellVersjon,
            wonderwallUrl: '',
            oauthCallbackUri: '',
            port: 9000,
        };
    } else {
        return {
            soknadApiProxyUrl: `http://localhost:3000/api`,
            soknadApiUrl: 'http://localhost:8080/api',
            dokumentProxyUrl: `http://localhost:3000/dokument`,
            dokumentUrl: `http://localhost:8082/familie/dokument/api`,
            modellVersjon: modellVersjon,
            wonderwallUrl:
                'http://localhost:8080/local/cookie?issuerId=tokenx&audience=familie-app&cookiename=localhost-idtoken&subject=12345678901&redirect=',
            oauthCallbackUri: 'http://localhost:3000/',
            port: 55554,
        };
    }
};
export default Miljø;
