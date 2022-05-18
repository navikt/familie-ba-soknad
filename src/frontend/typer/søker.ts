import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import {
    IArbeidsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer, ISamboer, ISøkerRespons, ITidligereSamboer } from './person';
import { ISøknadSpørsmål } from './spørsmål';
import { Årsak } from './utvidet';

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
    idNummer: IIdNummer[];
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
