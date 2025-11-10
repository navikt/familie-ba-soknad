import { PortableTextBlock } from '@portabletext/types';
import { Alpha3Code } from 'i18n-iso-countries';

import { LocaleType } from './common.js';

export type LocaleRecordBlock = Record<LocaleType, PortableTextBlock[]> & {
    api_navn: string;
    [key: string]: unknown;
};

export type LocaleRecordString = Record<LocaleType, string> & {
    api_navn: string;
    [key: string]: unknown;
};

export type FlettefeltVerdier = {
    barnetsNavn?: string;
    gjelderUtland?: boolean;
    antall?: string;
    totalAntall?: string;
    land?: Alpha3Code | '';
    dato?: string;
    klokkeslett?: string;
};
