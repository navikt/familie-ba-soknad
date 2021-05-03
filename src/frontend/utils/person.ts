import { alpha3ToAlpha2, getName } from 'i18n-iso-countries';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnetUtfyllende/spørsmål';
import { ESivilstand, IAdresse, IBarn, IBarnMedISøknad, IBarnRespons } from '../typer/person';
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
        institusjonsnavn: {
            id: OmBarnetSpørsmålsId.institusjonsnavn,
            svar: '',
        },
        institusjonsadresse: {
            id: OmBarnetSpørsmålsId.institusjonsadresse,
            svar: '',
        },
        institusjonspostnummer: {
            id: OmBarnetSpørsmålsId.institusjonspostnummer,
            svar: '',
        },
        institusjonOppholdStart: {
            id: OmBarnetSpørsmålsId.institusjonOppholdStart,
            svar: '',
        },
        institusjonOppholdSlutt: {
            id: OmBarnetSpørsmålsId.institusjonOppholdSlutt,
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
    }));
};
