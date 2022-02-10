import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent } from './common';
import { ESivilstand, IAdresse } from './kontrakt/generelle';
import {
    IArbeidsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { ISøknadSpørsmål } from './spørsmål';
import { Årsak } from './utvidet';

export interface IPerson {
    ident: string;
    adressebeskyttelse: boolean;
}

export interface IBarnRespons extends IPerson {
    navn: string | null;
    borMedSøker: boolean;
    fødselsdato: string | undefined;
}

export interface ISøkerRespons extends IPerson {
    navn: string;
    barn: IBarnRespons[];
    statsborgerskap: { landkode: Alpha3Code }[];
    adresse?: IAdresse;
    sivilstand: { type: ESivilstand };
}

export interface IBarn extends IPerson {
    id: BarnetsId;
    navn: string | null;
    borMedSøker: boolean | undefined;
    alder: string | undefined;
}

export interface IIdNummer {
    land: Alpha3Code;
    idnummer: string | AlternativtSvarForInput.UKJENT;
}

export interface ISøker extends Omit<ISøkerRespons, 'barn'> {
    // Steg: Om Deg
    barn: IBarn[];
    triggetEøs: boolean;
    borPåRegistrertAdresse: ISøknadSpørsmål<ESvar | null>;
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | null>;
    utenlandsperioder: IUtenlandsperiode[];
    planleggerÅBoINorgeTolvMnd: ISøknadSpørsmål<ESvar | null>;

    // Steg: Din Livssituasjon
    erAsylsøker: ISøknadSpørsmål<ESvar | null>;
    jobberPåBåt: ISøknadSpørsmål<ESvar | null>;
    arbeidsland: ISøknadSpørsmål<Alpha3Code | ''>;
    arbeidsperioderUtland: IArbeidsperiode[];
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | null>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
    pensjonsperioderUtland: IPensjonsperiode[];
    harSamboerNå: ISøknadSpørsmål<ESvar | null>;
    nåværendeSamboer: ISamboer | null;

    // Steg: EØS-steg
    arbeidINorge: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonNorge: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalinger: ISøknadSpørsmål<ESvar | null>;
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    idNummer: ISøknadSpørsmål<IIdNummer[]>;
    adresseISøkeperiode: ISøknadSpørsmål<string>;

    utvidet: {
        spørsmål: {
            årsak: ISøknadSpørsmål<Årsak | ''>;
            separertEnkeSkilt: ISøknadSpørsmål<ESvar | null>;
            separertEnkeSkiltUtland: ISøknadSpørsmål<ESvar | null>;
            separertEnkeSkiltDato: ISøknadSpørsmål<ISODateString>;
        };
        tidligereSamboere: ITidligereSamboer[];
    };
}

export interface ISamboer {
    navn: ISøknadSpørsmål<string>;
    ident: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    fødselsdato: ISøknadSpørsmål<DatoMedUkjent>;
    samboerFraDato: ISøknadSpørsmål<ISODateString>;
}

export interface ITidligereSamboer extends ISamboer {
    samboerTilDato: ISøknadSpørsmål<ISODateString>;
}
