import { modellVersjon } from './modellversjon';

interface MiljøProps {
    sanityDataset: string;
    soknadApiProxyUrl: string;
    soknadApiUrl: string;
    dokumentProxyUrl: string;
    dokumentUrl: string;
    wonderwallUrl: string;
    oauthCallbackUri: string;
    modellVersjon: number;
    port: number;
}

export const BASE_PATH = '/barnetrygd/soknad/';

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

const miljø = (): MiljøProps => {
    if (erDev()) {
        return {
            sanityDataset: 'ba-production',
            soknadApiProxyUrl: `https://familie-ba-soknad.ansatt.dev.nav.no${BASE_PATH}api`,
            soknadApiUrl: `http://familie-baks-soknad-api/api`,
            dokumentProxyUrl: `https://familie-ba-soknad.ansatt.dev.nav.no${BASE_PATH}dokument`,
            dokumentUrl: 'http://familie-dokument/familie/dokument/api', //Vil uansett gå til bucket "familievedlegg" enn så lenge
            modellVersjon: modellVersjon,
            wonderwallUrl: `https://familie-ba-soknad.ansatt.dev.nav.no${BASE_PATH}oauth2/login?redirect=`,
            oauthCallbackUri: `https://familie-ba-soknad.ansatt.dev.nav.no${BASE_PATH}oauth2/callback`,
            port: 9000,
        };
    } else if (erProd()) {
        return {
            sanityDataset: 'ba-production',
            soknadApiProxyUrl: `https://www.nav.no${BASE_PATH}api`,
            soknadApiUrl: `http://familie-baks-soknad-api/api`,
            dokumentProxyUrl: `https://www.nav.no${BASE_PATH}dokument`,
            dokumentUrl: 'http://familie-dokument/familie/dokument/api', //Vil uansett gå til bucket "familievedlegg" enn så lenge,
            modellVersjon: modellVersjon,
            wonderwallUrl: `https://www.nav.no${BASE_PATH}oauth2/login?redirect=`,
            oauthCallbackUri: `https://www.nav.no${BASE_PATH}oauth2/callback`,
            port: 9000,
        };
    } else {
        return {
            sanityDataset: 'ba-production',
            soknadApiProxyUrl: `http://localhost:3000${BASE_PATH}api`,
            soknadApiUrl: 'http://localhost:8080/api',
            dokumentProxyUrl: `http://localhost:3000${BASE_PATH}dokument`,
            dokumentUrl: `http://localhost:8082/familie/dokument/api`,
            modellVersjon: modellVersjon,
            wonderwallUrl: '',
            oauthCallbackUri: `http://localhost:3000${BASE_PATH}`,
            port: 55554,
        };
    }
};
export default miljø;
