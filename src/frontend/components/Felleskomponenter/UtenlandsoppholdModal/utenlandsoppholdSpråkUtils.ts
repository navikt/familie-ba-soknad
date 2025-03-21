import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/sanity/sanity';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';

import {
    landFeilmeldingSpråkIdsSøker,
    landLabelSpråkIdsBarn,
    landLabelSpråkIdsSøker,
    årsakSpråkIdsBarn,
    årsakSpråkIdsSøker,
} from './spørsmål';

export const hentUtenlandsoppholdÅrsak = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordString => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE: {
            return tekster.valgalternativPermanentIUtland;
        }
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE: {
            return tekster.valgalternativPermanentINorge;
        }
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.valgalternativOppholdUtenforNorgeTidligere;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
            return tekster.valgalternativOppholdUtenforNorgeNaa;
        default: {
            return tekster.valgalternativPlaceholder;
        }
    }
};

export const hentLandSpørsmål = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.landFlyttetTil.sporsmal;
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return tekster.landFlyttetFra.sporsmal;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.tidligereOpphold.sporsmal;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.naavaerendeOpphold.sporsmal;
        }
    }
};

export const hentLandFeilmelding = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return tekster.landFlyttetFra.feilmelding;
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.landFlyttetTil.feilmelding;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.tidligereOpphold.feilmelding;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.naavaerendeOpphold.feilmelding;
        }
    }
};

export const hentFraDatoFeilmelding = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.flyttetFraNorgeDato.feilmelding;
        default:
            return tekster.startdato.feilmelding;
    }
};

export const hentFraDatoSpørsmål = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return tekster.flyttetFraNorgeDato.sporsmal;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.startdato.sporsmal;
        }
    }
};

export const hentTilDatoSpørsmål = (
    årsak: EUtenlandsoppholdÅrsak | '',
    tekster: IUtenlandsoppholdTekstinnhold
): LocaleRecordBlock => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return tekster.flyttetTilNorgeDato.sporsmal;
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return tekster.sluttdatoFortid.sporsmal;
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
        default: {
            return tekster.sluttdatoFremtid.sporsmal;
        }
    }
};

export const årsakFeilmeldingSpråkId = (barn?: IBarnMedISøknad): string =>
    barn ? 'ombarnet.beskriveopphold.feilmelding' : 'modal.beskriveopphold.feilmelding';

export const årsakLabelSpråkId = (barn?: IBarnMedISøknad): string =>
    barn ? 'ombarnet.beskriveopphold.spm' : 'modal.beskriveopphold.spm';

export const årsakSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', barn?: IBarnMedISøknad): string =>
    barn ? årsakSpråkIdsBarn[årsak] : årsakSpråkIdsSøker[årsak];

export const landLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', barn?: IBarnMedISøknad) =>
    barn ? landLabelSpråkIdsBarn[årsak] : landLabelSpråkIdsSøker[årsak];

export const landFeilmeldingSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    barn?: IBarnMedISøknad
) => (barn ? landFeilmeldingSpråkIdsBarn[årsak] : landFeilmeldingSpråkIdsSøker[årsak]);

export const landFeilmeldingSpråkIdsBarn: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]:
        'ombarnet.hvilketlandflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]:
        'ombarnet.hvilketlandflyttettil.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'ombarnet.hvilketlandoppholdti.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]:
        'ombarnet.hvilketlandoppholderi.feilmelding',
};

export const fraDatoFeilmeldingSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    barn?: IBarnMedISøknad
) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return barn
                ? 'ombarnet.nårflyttetfranorge.feilmelding'
                : 'modal.nårflyttetfra.feilmelding';
        default:
            return 'felles.nårstartetoppholdet.feilmelding';
    }
};

export const fraDatoLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', barn?: IBarnMedISøknad) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
            return barn ? 'ombarnet.nårflyttetfranorge.spm' : 'modal.nårflyttetfra.spm';
        default:
            return 'felles.nårstartetoppholdet.spm';
    }
};

export const tilDatoLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', barn?: IBarnMedISøknad) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return barn ? 'ombarnet.nårflyttettilnorge.spm' : 'modal.nårflyttettilnorge.spm';
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return 'felles.nåravsluttetoppholdet.spm';
        default:
            return 'felles.nåravsluttesoppholdet.spm';
    }
};

export const tilDatoFeilmeldingSpråkId = (
    årsak: EUtenlandsoppholdÅrsak | '',
    barn?: IBarnMedISøknad
) => {
    switch (årsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return barn
                ? 'ombarnet.nårflyttettilnorge.feilmelding'
                : 'modal.nårflyttettilnorge.feilmelding';
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return 'felles.nåravsluttetoppholdet.feilmelding';
        default:
            return 'felles.nåravsluttesoppholdet.feilmelding';
    }
};
