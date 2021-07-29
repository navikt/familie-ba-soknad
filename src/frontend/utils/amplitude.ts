import amplitude from 'amplitude-js';

import { ESøknadstype, søknadstyper } from '../typer/søknad';

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

export const logSidevisningOrdinærBarnetrygd = (side: string) => {
    logEvent('sidevisning', {
        side,
        team_id: 'familie',
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
    });
};

export const logSkjemaStartet = () => {
    logEvent('skjema startet', {
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
        team_id: 'familie',
    });
};

export const logForsettPåSøknad = () => {
    logEvent('fortsett på søknad', {
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
        team_id: 'familie',
    });
};

export const logSkjemaStegFullført = (steg: number) => {
    logEvent('skjemasteg fullført', {
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
        team_id: 'familie',
        steg,
    });
};

export const logKlikkGåVidere = (steg: number) => {
    logEvent('klikk gå videre', {
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
        team_id: 'familie',
        steg,
    });
};

export const setUserProperty = (key: UserProperty, value: string | number) => {
    const identify = new amplitudeInstance.Identify().set(key, value);
    amplitudeInstance.identify(identify);
};
