import { ISODateString } from '@navikt/familie-form-elements';

import { IUtenlandsperiode } from '../typer/perioder';
import { EUtenlandsoppholdÅrsak } from '../typer/utenlandsopphold';
import { dagensDato, ettÅrTilbakeDato, gårsdagensDato } from './dato';

export const hentMaxAvgrensningPåFraDato = (
    utenlandsoppÅrsak: EUtenlandsoppholdÅrsak | ''
): ISODateString | undefined => {
    switch (utenlandsoppÅrsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE:
        case EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE:
            return dagensDato();
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return gårsdagensDato();
        default:
            return undefined;
    }
};
export const hentMinAvgrensningPåTilDato = (
    utenlandsoppÅrsak: EUtenlandsoppholdÅrsak | ''
): ISODateString | undefined => {
    switch (utenlandsoppÅrsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
            return ettÅrTilbakeDato();
        default:
            return undefined;
    }
};

export const hentMaxAvgrensningPåTilDato = (
    utenlandsoppÅrsak: EUtenlandsoppholdÅrsak | ''
): ISODateString | undefined => {
    switch (utenlandsoppÅrsak) {
        case EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE:
        case EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE:
            return dagensDato();
        default:
            return undefined;
    }
};

export const harTilhørendeFomFelt = (
    utenlandsoppholdÅrsak: EUtenlandsoppholdÅrsak | ''
): boolean => {
    return (
        utenlandsoppholdÅrsak === EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE ||
        utenlandsoppholdÅrsak === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
    );
};

export const flyttetPermanentFraNorge = (utenlandsperioder: IUtenlandsperiode[]) =>
    !!utenlandsperioder.find(
        periode =>
            periode.utenlandsoppholdÅrsak.svar ===
            EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE
    );
