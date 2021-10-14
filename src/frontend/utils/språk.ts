import { ReactElement } from 'react';

import { Alpha3Code, alpha3ToAlpha2, getName } from 'i18n-iso-countries';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createIntl, createIntlCache } from 'react-intl';

import { LocaleType } from '@navikt/familie-sprakvelger';

import * as engelsk from '../assets/lang/en.json';
import * as bokmål from '../assets/lang/nb.json';
import * as nynorsk from '../assets/lang/nn.json';
import { innebygdeFormatterere } from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { Dokumentasjonsbehov } from '../typer/dokumentasjon';
import { AlternativtSvarForInput, ESivilstand, IBarn } from '../typer/person';
import { Årsak } from '../typer/søknad';

export const toÅrsakSpråkId = (årsak: Årsak): string => {
    switch (årsak) {
        case Årsak.SEPARERT:
            return 'omdeg.velgårsak.separert';
        case Årsak.SKILT:
            return 'omdeg.velgårsak.skilt';
        case Årsak.BRUDD_SAMBOER:
            return 'omdeg.velgårsak.bruddsamboer';
        case Årsak.BODD_ALENE:
            return 'omdeg.velgårsak.boddalene';
        case Årsak.ENKE_ENKEMANN:
            return 'omdeg.velgårsak.enkeenkemann';
        case Årsak.FENGSEL_VARETEKT:
            return 'omdeg.velgårsak.fengselvaretekt';
        case Årsak.BRUDD_GIFT:
            return 'omdeg.velgårsak.bruddgift';
    }
};

export const landkodeTilSpråk = (landkode: Alpha3Code | '', locale: string): string => {
    return landkode ? getName(alpha3ToAlpha2(landkode), locale) : AlternativtSvarForInput.UKJENT;
};

export const dokumentasjonsbehovTilSpråkId = (dokumentasjonsbehov: Dokumentasjonsbehov): string => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return 'dokumentasjon.adopsjon.vedleggtittel';
        case Dokumentasjonsbehov.ANNEN_DOKUMENTASJON:
            return 'dokumentasjon.annendokumentasjon.vedleggtittel';
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return 'dokumentasjon.deltbosted.vedleggtittel';
        case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
            return 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel';
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return 'dokumentasjon.bekreftelseborsammen.vedleggtittel';
        case Dokumentasjonsbehov.EØS_SKJEMA:
            return 'dokumentasjon.tilleggsskjema.vedleggtittel';
        case Dokumentasjonsbehov.MEKLINGSATTEST:
            return 'dokumentasjon.meklingsattest.vedleggtittel';
        case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
            return 'dokumentasjon.bekreftelseborsammen.vedleggtittel';
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return 'dokumentasjon.oppholdstillatelse.vedleggtittel';
    }
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
            // Fjerner bokmål-tagen, skapte problemer og trenger ikke være med til pdf-gen
            { ...formatValues, ...innebygdeFormatterere, bokmål: msg => msg }
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

export const hentSivilstatusSpråkId = (statuskode?: ESivilstand) => {
    switch (statuskode) {
        case ESivilstand.UGIFT:
        case ESivilstand.GIFT:
        case ESivilstand.ENKE_ELLER_ENKEMANN:
        case ESivilstand.SKILT:
        case ESivilstand.SEPARERT:
        case ESivilstand.REGISTRERT_PARTNER:
        case ESivilstand.SEPARERT_PARTNER:
        case ESivilstand.SKILT_PARTNER:
        case ESivilstand.GJENLEVENDE_PARTNER:
            return `felles.sivilstatus.kode.${statuskode}`;

        default:
            return `felles.sivilstatus.kode.${ESivilstand.UOPPGITT}`;
    }
};

export const hentBostedSpråkId = (barn: IBarn) => {
    if (barn.adressebeskyttelse) {
        return 'hvilkebarn.barn.bosted.adressesperre';
    } else if (barn.borMedSøker) {
        return 'hvilkebarn.barn.bosted.din-adresse';
    } else {
        return 'hvilkebarn.barn.bosted.ikke-din-adresse';
    }
};
