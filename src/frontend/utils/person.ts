import { alpha3ToAlpha2, getName } from 'i18n-iso-countries';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import {
    barnDataKeySpørsmål,
    ESivilstand,
    IAdresse,
    IBarn,
    IBarnMedISøknad,
    IBarnRespons,
} from '../typer/person';
import { ISøknad } from '../typer/søknad';

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

export const erBarnRegistrertFraFør = (søknad: ISøknad, ident: string) => {
    const barnFraPdl = søknad.søker.barn.find(barn => barn.ident === ident);
    const barnRegistrertManuelt = søknad.barnRegistrertManuelt.find(barn => barn.ident === ident);
    return barnFraPdl || barnRegistrertManuelt;
};

const uppercaseFørsteBokstav = text => {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
};

export const hentAdressefelterSortert = (adresse: IAdresse) => {
    return [
        `${adresse.adressenavn ?? ''} ${adresse.husnummer ?? ''}${adresse.husbokstav ?? ''} ${
            adresse.bruksenhetsnummer ?? ''
        }`,
        `${adresse.postnummer ?? ''} ${
            adresse.poststed ? uppercaseFørsteBokstav(adresse.poststed) : ''
        }`,
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

export const genererInitialBarnMedISøknad = (barn: IBarn): IBarnMedISøknad => {
    return {
        ...barn,
        [barnDataKeySpørsmål.erFosterbarn]: {
            id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
            svar: undefined,
        },
        [barnDataKeySpørsmål.erAdoptertFraUtland]: {
            id: OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland,
            svar: undefined,
        },
        [barnDataKeySpørsmål.erAsylsøker]: {
            id: OmBarnaDineSpørsmålId.hvemErSøktAsylFor,
            svar: undefined,
        },
        [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
            id: OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland,
            svar: undefined,
        },
        [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
            id: OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon,
            svar: undefined,
        },
        [barnDataKeySpørsmål.institusjonsnavn]: {
            id: OmBarnetSpørsmålsId.institusjonsnavn,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonsadresse]: {
            id: OmBarnetSpørsmålsId.institusjonsadresse,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonspostnummer]: {
            id: OmBarnetSpørsmålsId.institusjonspostnummer,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonOppholdStartdato]: {
            id: OmBarnetSpørsmålsId.institusjonOppholdStartdato,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
            id: OmBarnetSpørsmålsId.institusjonOppholdSluttdato,
            svar: '',
        },
        [barnDataKeySpørsmål.oppholderSegIUtland]: {
            id: OmBarnaDineSpørsmålId.hvemOppholderSegIUtland,
            svar: undefined,
        },
        [barnDataKeySpørsmål.oppholdsland]: {
            id: OmBarnetSpørsmålsId.oppholdsland,
            svar: '',
        },
        [barnDataKeySpørsmål.oppholdslandSluttdato]: {
            id: OmBarnetSpørsmålsId.oppholdslandSluttdato,
            svar: '',
        },
        [barnDataKeySpørsmål.oppholdslandStartdato]: {
            id: OmBarnetSpørsmålsId.oppholdslandStartdato,
            svar: '',
        },
        [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
            id: OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge,
            svar: undefined,
        },
        [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: {
            id: OmBarnetSpørsmålsId.nårKomBarnetTilNorge,
            svar: '',
        },
        [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
            id: OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd,
            svar: undefined,
        },
        [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: {
            id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderNavn]: {
            id: OmBarnetSpørsmålsId.andreForelderNavn,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderFnr]: {
            id: OmBarnetSpørsmålsId.andreForelderFnr,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderFødselsdato]: {
            id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
            svar: undefined,
        },
        [barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderPensjonUtland]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
            svar: undefined,
        },
        [barnDataKeySpørsmål.andreForelderPensjonHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.borFastMedSøker]: {
            id: OmBarnetSpørsmålsId.borFastMedSøker,
            svar: undefined,
        },
        [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
            id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
            svar: undefined,
        },
        [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
            id: OmBarnetSpørsmålsId.søkerForTidsromStartdato,
            svar: '',
        },
        [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
            id: OmBarnetSpørsmålsId.søkerForTidsromSluttdato,
            svar: '',
        },
    };
};

export const mapBarnResponsTilBarn = (barn: IBarnRespons[]): IBarn[] => {
    return barn.map(barnRespons => ({
        navn: barnRespons.navn,
        ident: barnRespons.ident,
        alder: barnRespons.fødselsdato && hentAlder(barnRespons.fødselsdato),
        borMedSøker: barnRespons.borMedSøker,
        adressebeskyttelse: barnRespons.adressebeskyttelse,
    }));
};
