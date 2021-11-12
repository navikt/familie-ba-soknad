import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';

export interface IUseUtenlandsoppholdSkjemaParams {
    årsakFeilmeldingSpråkId: string;
    landFeilmeldingSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    fraDatoFeilmeldingSpråkIds: Record<
        Exclude<EUtenlandsoppholdÅrsak, EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE>,
        string
    >;
    tilDatoFeilmeldingSpråkIds: Record<
        Exclude<EUtenlandsoppholdÅrsak, EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE>,
        string
    >;
}

export const useUtenlandsoppholdSkjema = ({
    landFeilmeldingSpråkIds,
    årsakFeilmeldingSpråkId,
    fraDatoFeilmeldingSpråkIds,
    tilDatoFeilmeldingSpråkIds,
}: IUseUtenlandsoppholdSkjemaParams) => {
    const utenlandsoppholdÅrsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EUtenlandsoppholdÅrsak | ''>) =>
            felt.verdi !== '' ? ok(felt) : feil(felt, <SpråkTekst id={årsakFeilmeldingSpråkId} />),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [utenlandsoppholdÅrsak.verdi]);

    const oppholdsland = useLanddropdownFelt(
        { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        landFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        !!utenlandsoppholdÅrsak.verdi,
        true
    );

    const oppholdslandFraDato = useDatovelgerFelt(
        {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE,
        fraDatoFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        hentMaxAvgrensningPåFraDato(utenlandsoppholdÅrsak.verdi),
        undefined,
        { utenlandsoppholdÅrsak },
        true
    );

    const oppholdslandTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsoppholdVetIkke,
        skalFeltetVises: avhengigheter =>
            !!avhengigheter.utenlandsoppholdÅrsak.verdi &&
            avhengigheter.utenlandsoppholdÅrsak.verdi ===
                EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const oppholdslandTilDato = useDatovelgerFeltMedUkjent(
        UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        '',
        oppholdslandTilDatoUkjent,
        tilDatoFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE,
        true,
        hentMaxAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? oppholdslandFraDato.verdi
            : hentMinAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        !harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? 'modal.nårflyttettilnorge.mer-enn-ett-år.feilmelding'
            : undefined,
        { utenlandsoppholdÅrsak }
    );

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, 'string'>({
        felter: {
            utenlandsoppholdÅrsak,
            oppholdsland,
            oppholdslandFraDato,
            oppholdslandTilDato,
            oppholdslandTilDatoUkjent,
        },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
