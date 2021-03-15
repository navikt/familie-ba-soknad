import { alpha3ToAlpha2, getName } from 'i18n-iso-countries';

import { ESivilstand } from '../../../typer/person';

export const landkodeTilSpråk = (landkode: string, locale: string) => {
    const landkodeIso = alpha3ToAlpha2(landkode);
    return getName(landkodeIso, locale);
};

// TODO: Fjern funksjon når backend fallbackstatus merget
export const hentSivilstatus = (statuskode?: ESivilstand) => {
    switch (statuskode) {
        case ESivilstand.UOPPGITT:
        case ESivilstand.UGIFT:
        case ESivilstand.GIFT:
        case ESivilstand.ENKE_ELLER_ENKEMANN:
        case ESivilstand.SKILT:
        case ESivilstand.SEPARERT:
        case ESivilstand.REGISTRERT_PARTNER:
        case ESivilstand.SEPARERT_PARTNER:
        case ESivilstand.SKILT_PARTNER:
        case ESivilstand.GJENLEVENDE_PARTNER:
            return `sivilstatus.kode.${statuskode}`;

        default:
            return 'sivilstatus.kode.ANNET';
    }
};
