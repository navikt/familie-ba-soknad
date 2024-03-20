import amplitude from 'amplitude-js';

import * as bokmålTekster from '../assets/lang/nb.json' assert { type: 'json' };
import { ESøknadstype } from '../typer/kontrakt/generelle';
import { hentSøknadstype, søknadstyper } from '../typer/søknad';

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init('default', '', {
    apiEndpoint: 'amplitude.nav.no/collect-auto',
    saveEvents: false,
    includeUtm: true,
    includeReferrer: true,
    platform: window.location.toString(),
});

export enum UserProperty {
    ANTALL_VALGTE_BARN = 'antallValgteBarn',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function logEvent(eventName: string, eventProperties: any) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const logSidevisningBarnetrygd = (side: string, søknadstype: ESøknadstype) => {
    logEvent('sidevisning', {
        side,
        team_id: 'familie',
        skjemanavn: søknadstyper[søknadstype].navn,
        skjemaId: søknadstyper[søknadstype].id,
    });
};

export const logSkjemaStartet = (søknadstype: ESøknadstype) => {
    logEvent('skjema startet', {
        skjemanavn: søknadstyper[søknadstype].navn,
        skjemaId: søknadstyper[søknadstype].id,
        team_id: 'familie',
    });
};

export const logFortsettPåSøknad = (søknadstype: ESøknadstype) => {
    logEvent('fortsett på søknad', {
        skjemanavn: søknadstyper[søknadstype].navn,
        skjemaId: søknadstyper[søknadstype].id,
        team_id: 'familie',
    });
};

export const logSkjemaStegFullført = (steg: number, søknadstype: ESøknadstype) => {
    logEvent('skjemasteg fullført', {
        skjemanavn: søknadstyper[søknadstype].navn,
        skjemaId: søknadstyper[søknadstype].id,
        team_id: 'familie',
        steg,
    });
};

export const logKlikkGåVidere = (steg: number, søknadstype: ESøknadstype) => {
    logEvent('klikk gå videre', {
        skjemanavn: søknadstyper[søknadstype].navn,
        skjemaId: søknadstyper[søknadstype].id,
        team_id: 'familie',
        steg,
    });
};

export const logSpørsmålBesvart = (spørsmålSpråktekstId: string, svar: string) => {
    /**
     * Vil ikke tulle med språkcontext, skal uansett ikke formatere spørsmålene (alle må være like uansett hva barnets navn er)
     * derfor bruker vi språktekstene fa bokmålfila direkte uten intl.formatMessage
     */
    const spørsmål = bokmålTekster[spørsmålSpråktekstId] ?? false;

    spørsmål &&
        logEvent('skjemaspørsmål besvart', {
            skjemanavn: søknadstyper[hentSøknadstype()].navn,
            skjemaId: søknadstyper[hentSøknadstype()].id,
            team_id: 'familie',
            spørsmål,
            svar,
        });
};

export const logError = (error: Error) => {
    logEvent('logg feil', {
        skjemanavn: søknadstyper[hentSøknadstype()].navn,
        skjemaId: søknadstyper[hentSøknadstype()].id,
        team_id: 'familie',
        errorType: error.name,
        errorMessage: error.message,
    });
};

export const setUserProperty = (key: UserProperty, value: string | number) => {
    const identify = new amplitudeInstance.Identify().set(key, value);
    amplitudeInstance.identify(identify);
};
