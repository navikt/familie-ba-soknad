import { ReactElement } from 'react';

import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createIntl, createIntlCache } from 'react-intl';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { LocaleType } from '@navikt/familie-sprakvelger';

import * as engelsk from '../assets/lang/en.json';
import * as bokmål from '../assets/lang/nb.json';
import * as nynorsk from '../assets/lang/nn.json';
import { innebygdeFormatterere } from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { SkjemaFeltTyper } from '../typer/skjema';

export const randomIntFraIntervall = (min, max) => {
    // min and max inkludert
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    return skjema.visFeilmeldinger && !!feil;
};

const stripSpråkfil = (språkfilInnhold: Record<string, string>): Record<string, string> => {
    const språkEntries = Object.entries(språkfilInnhold);
    // Vi får med en default import her som vi må fjerne før vi kan mappe over entryene
    språkEntries.pop();
    return Object.fromEntries(språkEntries.map(([key, value]) => [key, value.trim()]));
};

const texts: Record<LocaleType, Record<string, string>> = {
    [LocaleType.nb]: stripSpråkfil(bokmål),
    [LocaleType.nn]: stripSpråkfil(nynorsk),
    [LocaleType.en]: stripSpråkfil(engelsk),
};

const cache = createIntlCache();

export const hentTekster = (
    tekstId: string,
    formatValues: object = {}
): Record<LocaleType, string> => {
    const map = {};

    for (const locale in LocaleType) {
        const { formatMessage } = createIntl({ locale, messages: texts[locale] }, cache);
        const message = formatMessage(
            { id: tekstId },
            { ...formatValues, ...innebygdeFormatterere }
        );

        map[locale] = reactElementToJSXString(message as ReactElement);
    }

    // Typescript er ikke smart nok til å se at alle locales er satt
    return map as Record<LocaleType, string>;
};

export const hentUformaterteTekster = (tekstId: string): Record<LocaleType, string> => {
    const map = {};

    for (const locale in LocaleType) {
        map[locale] = texts[locale][tekstId];
    }

    return map as Record<LocaleType, string>;
};
