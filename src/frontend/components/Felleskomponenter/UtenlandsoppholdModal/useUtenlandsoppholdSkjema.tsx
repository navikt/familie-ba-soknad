import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import {
    fraDatoFeilmeldingSpråkId,
    landFeilmeldingSpråkId,
    tilDatoFeilmeldingSpråkId,
    årsakFeilmeldingSpråkId,
} from './utenlandsoppholdSpråkUtils';

export interface IUseUtenlandsoppholdSkjemaParams {
    barn?: IBarnMedISøknad;
}

export const useUtenlandsoppholdSkjema = ({ barn }: IUseUtenlandsoppholdSkjemaParams) => {
    const utenlandsoppholdÅrsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EUtenlandsoppholdÅrsak | ''>) =>
            felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={årsakFeilmeldingSpråkId(barn)} />),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [utenlandsoppholdÅrsak.verdi]);

    const oppholdsland = useLanddropdownFelt(
        { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        landFeilmeldingSpråkId(utenlandsoppholdÅrsak.verdi, barn),
        !!utenlandsoppholdÅrsak.verdi,
        true
    );

    const oppholdslandFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE,
        feilmeldingSpråkId: fraDatoFeilmeldingSpråkId(utenlandsoppholdÅrsak.verdi, barn),
        sluttdatoAvgrensning: hentMaxAvgrensningPåFraDato(utenlandsoppholdÅrsak.verdi),
        avhengigheter: { utenlandsoppholdÅrsak },
        nullstillVedAvhengighetEndring: true,
    });

    const oppholdslandTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsoppholdVetIkke,
        skalFeltetVises: avhengigheter =>
            !!avhengigheter.utenlandsoppholdÅrsak.verdi &&
            avhengigheter.utenlandsoppholdÅrsak.verdi ===
                EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const oppholdslandTilDato = useDatovelgerFeltMedUkjent({
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        initiellVerdi: '',
        vetIkkeCheckbox: oppholdslandTilDatoUkjent,
        feilmeldingSpråkId: tilDatoFeilmeldingSpråkId(utenlandsoppholdÅrsak.verdi, barn),
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE,
        sluttdatoAvgrensning: hentMaxAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        startdatoAvgrensning: harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? oppholdslandFraDato.verdi
            : hentMinAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        customStartdatoFeilmelding: !harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? 'modal.nårflyttettilnorge.mer-enn-ett-år.feilmelding'
            : undefined,
        avhengigheter: { utenlandsoppholdÅrsak },
    });

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
