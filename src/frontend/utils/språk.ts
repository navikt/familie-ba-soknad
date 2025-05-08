import { Alpha3Code, alpha3ToAlpha2, getName } from 'i18n-iso-countries';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createIntl, createIntlCache } from 'react-intl';

import engelsk from '../assets/lang/en.json' assert { type: 'json' };
import bokmål from '../assets/lang/nb.json' assert { type: 'json' };
import nynorsk from '../assets/lang/nn.json' assert { type: 'json' };
import { innebygdeFormatterere } from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { IDinLivssituasjonTekstinnhold } from '../components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import { IEøsForBarnTekstinnhold } from '../components/SøknadsSteg/EøsSteg/Barn/innholdTyper';
import { IVelgBarnTekstinnhold } from '../components/SøknadsSteg/VelgBarn/innholdTyper';
import { AlternativtSvarForInput, LocaleType } from '../typer/common';
import { ESivilstand, Slektsforhold } from '../typer/kontrakt/generelle';
import { IBarn } from '../typer/person';
import { ESanitySivilstandApiKey, LocaleRecordString } from '../typer/sanity/sanity';
import { Årsak } from '../typer/utvidet';

export const hentÅrsak = (
    årsak: Årsak,
    tekster: IDinLivssituasjonTekstinnhold
): LocaleRecordString => {
    switch (årsak) {
        case Årsak.SEPARERT:
            return tekster.valgalternativSeparert;
        case Årsak.SKILT:
            return tekster.valgalternativSkilt;
        case Årsak.BRUDD_SAMBOER:
            return tekster.valgalternativBruddSamboer;
        case Årsak.BODD_ALENE:
            return tekster.valgalternativBoddAlene;
        case Årsak.ENKE_ENKEMANN:
            return tekster.valgalternativEnkeEnkemann;
        case Årsak.FENGSEL_VARETEKT:
            return tekster.valgalternativFengselVaretekt;
        case Årsak.BRUDD_GIFT:
            return tekster.valgalternativBruddGift;
        case Årsak.FORSVUNNET:
            return tekster.valgalternativForsvunnet;
        case Årsak.FORVARING:
            return tekster.valgalternativForvaring;
        case Årsak.PSYKISK_HELSEVERN:
            return tekster.valgalternativPsykiskHelsevern;
    }
};

export const toSlektsforholdSpråkId = (slektsforhold: Slektsforhold): string => {
    switch (slektsforhold) {
        case Slektsforhold.FORELDER:
            return 'felles.velgslektsforhold.forelder';
        case Slektsforhold.BESTEFORELDER:
            return 'felles.velgslektsforhold.besteforelder';
        case Slektsforhold.ONKEL_ELLER_TANTE:
            return 'felles.velgslektsforhold.onkeltante';
        case Slektsforhold.ANNEN_FAMILIERELASJON:
            return 'felles.velgslektsforhold.annenfamilie';
        case Slektsforhold.ANNEN_RELASJON:
            return 'felles.velgslektsforhold.annenrelasjon';
    }
};

export const hentSlektsforhold = (
    slektsforhold: Slektsforhold,
    tekster: IEøsForBarnTekstinnhold
) => {
    switch (slektsforhold) {
        case Slektsforhold.FORELDER:
            return tekster.valgalternativForelder;
        case Slektsforhold.BESTEFORELDER:
            return tekster.valgalternativBesteforelder;
        case Slektsforhold.ONKEL_ELLER_TANTE:
            return tekster.valgalternativOnkelTante;
        case Slektsforhold.ANNEN_FAMILIERELASJON:
            return tekster.valgalternativAnnenFamilierelasjon;
        case Slektsforhold.ANNEN_RELASJON:
            return tekster.valgalternativAnnenRelasjon;
    }
};

export const landkodeTilSpråk = (landkode: Alpha3Code | '', locale: string): string => {
    const alpha3ToAlpha2Land = landkode && alpha3ToAlpha2(landkode);
    return (
        (alpha3ToAlpha2Land && getName(alpha3ToAlpha2Land, locale)) ??
        AlternativtSvarForInput.UKJENT
    );
};

const stripSpråkfil = (språkfilInnhold: Record<string, string>): Record<string, string> => {
    const språkEntries = Object.entries(språkfilInnhold);
    return Object.fromEntries(
        språkEntries.map(([key, value]) => {
            return [key, value.trim()];
        })
    );
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
        const message = tekstId
            ? formatMessage(
                  { id: tekstId },
                  // Fjerner bokmål-tagen, skapte problemer og trenger ikke være med til pdf-gen
                  { ...formatValues, ...innebygdeFormatterere, bokmål: msg => msg }
              )
            : '';

        map[locale] = message && reactElementToJSXString(message);
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

export const sivilstandTilSanitySivilstandApiKey = (
    statuskode: ESivilstand
): ESanitySivilstandApiKey => {
    switch (statuskode) {
        case ESivilstand.UGIFT:
            return ESanitySivilstandApiKey.UGIFT;
        case ESivilstand.GIFT:
            return ESanitySivilstandApiKey.GIFT;
        case ESivilstand.ENKE_ELLER_ENKEMANN:
            return ESanitySivilstandApiKey.ENKE_ELLER_ENKEMANN;
        case ESivilstand.SKILT:
            return ESanitySivilstandApiKey.SKILT;
        case ESivilstand.SEPARERT:
            return ESanitySivilstandApiKey.SEPARERT;
        case ESivilstand.REGISTRERT_PARTNER:
            return ESanitySivilstandApiKey.REGISTRERT_PARTNER;
        case ESivilstand.SEPARERT_PARTNER:
            return ESanitySivilstandApiKey.SEPARERT_PARTNER;
        case ESivilstand.SKILT_PARTNER:
            return ESanitySivilstandApiKey.SKILT_PARTNER;
        case ESivilstand.GJENLEVENDE_PARTNER:
            return ESanitySivilstandApiKey.GJENLEVENDE_PARTNER;
        case ESivilstand.UOPPGITT:
            return ESanitySivilstandApiKey.UOPPGITT;
    }
};

export const hentBostedSpråkId = (barn: IBarn, teksterForSteg: IVelgBarnTekstinnhold) => {
    if (barn.adressebeskyttelse) {
        return teksterForSteg.registrertMedAdressesperre;
    } else if (barn.borMedSøker) {
        return teksterForSteg.registrertPaaAdressenDin;
    } else {
        return teksterForSteg.ikkeRegistrertPaaAdressenDin;
    }
};
