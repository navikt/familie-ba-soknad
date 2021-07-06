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
    logEvent('skjema_startet', {
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
        team_id: 'familie',
    });
};

export const logForsettPåSkjemaMellomlagring = () => {
    logEvent('fortsett_skjema_mellomlagring', {
        skjemanavn: søknadstyper[ESøknadstype.ORDINÆR].navn,
        skjemaId: søknadstyper[ESøknadstype.ORDINÆR].id,
        team_id: 'familie',
    });
};
