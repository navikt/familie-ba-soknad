import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../typer/skjema';

export const hentTilfeldigElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
};

export const isAlpha3Code = (code: string): code is Alpha3Code => {
    return code in getAlpha3Codes();
};

export const trimWhiteSpace = (str: string) => {
    return str.split(/\s+/).join(' ').trim();
};

export const visFeiloppsummering = (skjema: ISkjema<SkjemaFeltTyper, string>): boolean => {
    const feil = Object.values(skjema.felter).find(
        felt => felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL
    );
    return !!feil;
};
