import { IBarnMedISøknad } from '../../../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';

export enum UtenlandsoppholdSpørsmålId {
    årsakUtenlandsopphold = 'årsak-utenlandsopphold',
    landUtenlandsopphold = 'land-utenlandsopphold',
    fraDatoUtenlandsopphold = 'fra-dato-utenlandsopphold',
    tilDatoUtenlandsopphold = 'til-dato-utenlandsopphold',
    tilDatoUtenlandsoppholdVetIkke = 'til-dato-utenlandsopphold-vet-ikke',
}

export const tilDatoUkjentLabelSpråkId = 'felles.vetikkenåravsluttes.spm';

export const årsakFeilmeldingSpråkId = (barn?: IBarnMedISøknad): string =>
    barn ? 'ombarnet.beskriveopphold.feilmelding' : 'modal.beskriveopphold.feilmelding';

export const årsakLabelSpråkId = (barn?: IBarnMedISøknad): string =>
    barn ? 'ombarnet.beskriveopphold.spm' : 'modal.beskriveopphold.spm';

export const årsakSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', barn?: IBarnMedISøknad): string =>
    barn ? årsakSpråkIdsBarn[årsak] : årsakSpråkIdsSøker[årsak];

export const årsakSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.oppholdalternativ.flyttettilnorge',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.oppholdalternativ.flyttetfranorge',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.oppholdalternativ.oppholdtidligere',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.oppholdalternativ.utenfornå',
};

export const årsakSpråkIdsBarn: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]:
        'ombarnet.oppholdalternativ.flyttettilnorge',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]:
        'ombarnet.oppholdalternativ.flyttetfranorge',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'ombarnet.oppholdalternativ.oppholdtidligere',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'ombarnet.oppholdalternativ.utenfornå',
};

export const landLabelSpråkId = (årsak: EUtenlandsoppholdÅrsak | '', barn?: IBarnMedISøknad) =>
    barn ? landLabelSpråkIdsBarn[årsak] : landLabelSpråkIdsSøker[årsak];

export const landLabelSpråkIdsBarn: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'ombarnet.hvilketlandflyttetfra.spm',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'ombarnet.hvilketlandflyttettil.spm',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'ombarnet.hvilketlandoppholdti.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'ombarnet.hvilketlandoppholderi.spm',
};

export const landLabelSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.spm',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.spm',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholdti.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.spm',
};

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

export const landFeilmeldingSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.hvilketlandoppholdti.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.feilmelding',
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
