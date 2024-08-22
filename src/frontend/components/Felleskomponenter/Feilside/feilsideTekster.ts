import { LocaleType } from '../../../typer/common';

import { IFeilsideTekster } from './feilsideTyper';

export const feilsideTekster: IFeilsideTekster[] = [
    {
        locale: LocaleType.nb,
        språktekst: 'Norsk bokmål / Norwegian',
        statuskode: 'Statuskode',
        tittel: 'Beklager, noe gikk galt',
        beskrivelse:
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.',
        duKanPrøveÅ: 'Du kan prøve å',
        venteNoenMinutter: {
            vanligTekst: 'vente noen minutter og ',
            lenkeTekst: 'laste siden på nytt',
        },
        gåTilbakeTilForrigeSide: 'gå tilbake til forrige side',
        hvisProblemetVedvarer: {
            vanligTekst: 'Hvis problemet vedvarer, kan du ',
            lenkeTekst: 'kontakte oss (åpnes i ny fane)',
        },
    },
    // TODO: Oversett tekster til nynorsk
    {
        locale: LocaleType.nn,
        språktekst: 'Norsk nynorsk / Norwegian',
        statuskode: 'Statuskode',
        tittel: 'Beklager, noe gikk galt',
        beskrivelse:
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.',
        duKanPrøveÅ: 'Du kan prøve å',
        venteNoenMinutter: {
            vanligTekst: 'vente noen minutter og ',
            lenkeTekst: 'laste siden på nytt',
        },
        gåTilbakeTilForrigeSide: 'gå tilbake til forrige side',
        hvisProblemetVedvarer: {
            vanligTekst: 'Hvis problemet vedvarer, kan du ',
            lenkeTekst: 'kontakte oss (åpnes i ny fane)',
        },
    },
    // TODO: Oversett tekster til engelsk
    {
        locale: LocaleType.en,
        språktekst: 'English / Engelsk',
        statuskode: 'Statuskode',
        tittel: 'Sorry, something went wrong',
        beskrivelse:
            'A technical error on our servers makes the page unavailable. This is not something you caused.',
        duKanPrøveÅ: 'You can try to',
        venteNoenMinutter: {
            vanligTekst: 'wait a few minutes and ',
            lenkeTekst: 'reload the page',
        },
        gåTilbakeTilForrigeSide: 'go back to the previous page',
        hvisProblemetVedvarer: {
            vanligTekst: 'If the problem persists, you can ',
            lenkeTekst: 'contact us (opens in a new tab)',
        },
    },
];
