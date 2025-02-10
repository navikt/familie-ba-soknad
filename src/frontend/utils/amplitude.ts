import { getAmplitudeInstance, getCurrentConsent } from '@navikt/nav-dekoratoren-moduler';

import { ESøknadstype } from '../typer/kontrakt/generelle';
import { søknadstyper } from '../typer/søknad';

const logger = getAmplitudeInstance('dekoratoren');

/* eslint-disable @typescript-eslint/no-explicit-any */
export function logEvent(eventName: string, eventProperties: any) {
    const consent = getCurrentConsent();

    if (logger && consent && consent.consent.analytics) {
        logger(eventName, eventProperties);
    }
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
