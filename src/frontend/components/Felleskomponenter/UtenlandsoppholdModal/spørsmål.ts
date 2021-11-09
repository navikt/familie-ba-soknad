import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';

export enum UtenlandsoppholdSpørsmålId {
    årsakUtenlandsopphold = 'årsak-utenlandsopphold',
    landUtenlandsopphold = 'land-utenlandsopphold',
    fraDatoUtenlandsopphold = 'fra-dato-utenlandsopphold',
    tilDatoUtenlandsopphold = 'til-dato-utenlandsopphold',
}

export const årsakSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.oppholdalternativ.flyttettilnorge',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.oppholdalternativ.flyttetfranorge',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.oppholdalternativ.oppholdtidligere',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.oppholdalternativ.utenfornå',
};
export const landLabelSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.spm',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.spm',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholdti.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.spm',
};
export const landFeilmeldingSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.hvilketlandflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.hvilketlandflyttettil.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'modal.hvilketlandoppholdti.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.hvilketlandoppholderi.feilmelding',
};
export const fraDatoLabelSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.nårflyttetfra.spm',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.nårflyttettilnorge.spm',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'felles.nårstartetoppholdet.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'felles.nårstartetoppholdet.spm',
};
export const fraDatoFeilmeldingSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: 'modal.nårflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: 'modal.nårflyttettilnorge.feilmelding',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'modal.nårflyttetfra.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'modal.nårflyttetfra.feilmelding',
};
export const tilDatoLabelSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: '',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: '',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: 'felles.nåravsluttetoppholdet.spm',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: 'felles.nåravsluttesoppholdet.spm',
};
export const tilDatoFeilmeldingSpråkIdsSøker: Record<EUtenlandsoppholdÅrsak, string> = {
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: '',
    [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: '',
    [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]:
        'felles.nåravsluttetoppholdet.feilmelding',
    [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]:
        'felles.nåravsluttesoppholdet.feilmelding',
};

export const tilDatoUkjentLabelSpråkIdSøker = 'felles.vetikkenåravsluttes.spm';
export const årsakFeilmeldingSpråkIdSøker = 'modal.beskriveopphold.feilmelding';
