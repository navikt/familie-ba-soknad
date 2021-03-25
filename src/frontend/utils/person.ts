import { alpha3ToAlpha2, getName } from 'i18n-iso-countries';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESivilstand, IAdresse, IBarn, IBarnFraPdl } from '../typer/person';

export const hentAlder = (dato: string): string => {
    const idag = new Date();
    const fødselsdato = new Date(dato);
    let alder = idag.getFullYear() - fødselsdato.getFullYear();
    const månedDiff = idag.getMonth() - fødselsdato.getMonth();
    if (månedDiff < 0 || (månedDiff === 0 && idag.getDate() < fødselsdato.getDate())) {
        alder--;
    }
    return alder + ' år';
};

export const hentAdressefelterSortert = (adresse: IAdresse) => {
    return [
        `${adresse.adressenavn ?? ''} ${adresse.husnummer ?? ''}${adresse.husbokstav ?? ''} ${
            adresse.bruksenhetsnummer ?? ''
        }`,
        `${adresse.postnummer ?? ''} ${adresse.bostedskommune ?? ''}`,
    ]
        .map(linje => linje.replace(/\s{2+}/, ' ').trim())
        .filter(value => value);
};

export const landkodeTilSpråk = (landkode: string, locale: string) => {
    const landkodeIso = alpha3ToAlpha2(landkode);
    return getName(landkodeIso, locale);
};

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

export const genererInitialStateBarn = (barnFraPDL: IBarnFraPdl): IBarn => {
    return {
        ...barnFraPDL,
        alder: hentAlder(barnFraPDL.fødselsdato),
        erFosterbarn: {
            id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
            svar: undefined,
        },
        erAdoptertFraUtland: {
            id: OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland,
            svar: undefined,
        },
        erAsylsøker: {
            id: OmBarnaDineSpørsmålId.hvemErSøktAsylFor,
            svar: undefined,
        },
        barnetrygdFraAnnetEøsland: {
            id: OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland,
            svar: undefined,
        },
        oppholderSegIInstitusjon: {
            id: OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon,
            svar: undefined,
        },
        oppholdtSegINorgeSammenhengendeTolvMnd: {
            id: OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge,
            svar: undefined,
        },
        oppholderSegIUtland: {
            id: OmBarnaDineSpørsmålId.hvemOppholderSegIUtland,
            svar: undefined,
        },
    };
};
