import { ESøknadstype } from '../common/typer/kontrakt/generelle';

declare global {
    interface Window {
        umami: { track: (eventName: string, eventData?: string | object) => void };
    }
}

function sendTilUmami(eventNavn: string, obj: object) {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(eventNavn, obj);
    }
}

export function trackSøknadStartet(søknadstype: ESøknadstype): void {
    sendTilUmami('søknad_startet', {
        appNavn: 'familie-ba-soknad',
        søknadstype: søknadstype,
    });
}

export function trackSøknadSendt(søknadstype: ESøknadstype, ytelseType: 'EØS' | 'NASJONAL'): void {
    sendTilUmami('søknad_sendt', {
        appNavn: 'familie-ba-soknad',
        søknadstype: søknadstype,
        ytelseType: ytelseType,
    });
}

export function trackYtelseTypeFastsatt(ytelseType: 'EØS' | 'NASJONAL'): void {
    sendTilUmami('ytelse_type_fastsatt', {
        appNavn: 'familie-ba-soknad',
        ytelseType: ytelseType,
    });
}
