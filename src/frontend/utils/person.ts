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

/**
 * Konverter fra fnr/dnr til ISO-dato.
 * @param idnummer
 * Enten fødselsnummer eller d-nummer
 * @param årSomRegnesSomForrigeÅrhundre
 * Hvor vi endrer fra base 1900 til 2000 for årstall i idnr. Hvis idnr starter med 010120 kan
 * for eksempel det tolkes som at man er født 1920, eller 2020. Alle årstall fra og med det som
 * sendes inn som andre parameter her vil regnes som 1900 + parameteret, alle årstall opp til
 * det vil regnes som 2000 + parameteret. Default er 60, slik at man eksempelvis får følgende:
 *      010120 => 2020-01-01
 *      010140 => 2040-01-01
 *      010160 => 1960-01-01
 *      010180 => 1980-01-01
 */
export const fødselsdatoSomISOStringFraIdNummer = (
    idnummer: string,
    årSomRegnesSomForrigeÅrhundre = 60
) => {
    // Fjern all whitespace
    const idnummerSanitized = idnummer.replace(/\s/g, '');
    const dato = idnummerSanitized.substr(0, 6);
    const [dag, måned, år] = (dato.match(/[0-9]{2}/g) || []).map(tall => Number.parseInt(tall));

    const fulltÅr = år >= årSomRegnesSomForrigeÅrhundre ? 1900 + år : 2000 + år;

    /**
     * D-nummer starter med fødselsdato pluss 4 på første tall
     * ... med mindre det ikke var noen tilgjengelige for den datoen,
     * da brukes dato man søkte om d-nummer i steden for fødselsdato.
     */
    const dagKompansertForDNummer = dag < 40 ? dag : dag - 40;

    return [
        fulltÅr,
        måned.toString(10).padStart(2, '0'),
        dagKompansertForDNummer.toString(10).padStart(2, '0'),
    ].join('-');
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
