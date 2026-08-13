import { ESvar } from '@navikt/familie-form-elements';

import { type Alpha3Code, alpha3ToAlpha2, getName } from 'i18n-iso-countries';
import type { ReactNode } from 'react';

import { ESanitySivilstandApiKey, type LocaleRecordString, type PlainTekst } from '../../common/sanity';
import { ESivilstand, Slektsforhold } from '../../common/typer/kontrakt/generelle';
import type { IDinLivssituasjonTekstinnhold } from '../components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import type { IEøsForBarnTekstinnhold } from '../components/SøknadsSteg/EøsSteg/Barn/innholdTyper';
import type { IVelgBarnTekstinnhold } from '../components/SøknadsSteg/VelgBarn/innholdTyper';
import type { IBarn } from '../typer/person';
import type { IFrittståendeOrdTekstinnhold } from '../typer/sanity/tekstInnhold';
import { AlternativtSvarForInput } from '../typer/svar';
import { Årsak } from '../typer/utvidet';

export const hentÅrsak = (årsak: Årsak, tekster: IDinLivssituasjonTekstinnhold): LocaleRecordString => {
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

export const hentSlektsforhold = (slektsforhold: Slektsforhold, tekster: IEøsForBarnTekstinnhold) => {
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
    return (alpha3ToAlpha2Land && getName(alpha3ToAlpha2Land, locale)) ?? AlternativtSvarForInput.UKJENT;
};

export const sivilstandTilSanitySivilstandApiKey = (statuskode: ESivilstand): ESanitySivilstandApiKey => {
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

export const formaterSøknadsvar = (
    søknadsvar: ReactNode,
    plainTekst: PlainTekst,
    tekster: IFrittståendeOrdTekstinnhold
) => {
    switch (søknadsvar) {
        case ESvar.JA: {
            return plainTekst(tekster.ja);
        }
        case ESvar.NEI: {
            return plainTekst(tekster.nei);
        }
        case ESvar.VET_IKKE: {
            return plainTekst(tekster.jegVetIkke);
        }
        default:
            return søknadsvar;
    }
};
