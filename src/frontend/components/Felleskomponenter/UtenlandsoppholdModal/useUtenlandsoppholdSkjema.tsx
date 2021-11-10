import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';

export interface IUseUtenlandsoppholdSkjemaParams {
    årsakFeilmeldingSpråkId: string;
    landFeilmeldingSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    fraDatoFeilmeldingSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    tilDatoFeilmeldingSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
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

    const oppholdsland = useLanddropdownFelt(
        { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        landFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        utenlandsoppholdÅrsak.verdi !== '',
        true
    );

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const oppholdslandFraDato = useDatovelgerFelt(
        {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        utenlandsoppholdÅrsak.verdi !== '',
        fraDatoFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi]
    );

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const oppholdslandTilDatoUkjent = useFelt<ESvar>({
        skalFeltetVises: avhengigheter =>
            avhengigheter.årsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { årsak: utenlandsoppholdÅrsak },
        verdi: ESvar.NEI,
    });

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const oppholdslandTilDato = useDatovelgerFeltMedUkjent(
        UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        '',
        oppholdslandTilDatoUkjent,
        tilDatoFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
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
