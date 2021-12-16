import { IBarnMedISøknad } from '../../../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import {} from './spørsmål';

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

export const fraDatoFeilmeldingSpråkId = (annenForelder = false, barn?: IBarnMedISøknad) => {
    return 'TODO velg gyldig dato';
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
