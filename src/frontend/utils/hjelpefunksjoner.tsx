import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';

export const hentTilfeldigElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
};

export const isAlpha3Code = (code: string): code is Alpha3Code => {
    return code in getAlpha3Codes();
};

export const trimWhiteSpace = (str: string) => {
    return str.split(/\s+/).join(' ').trim();
};
