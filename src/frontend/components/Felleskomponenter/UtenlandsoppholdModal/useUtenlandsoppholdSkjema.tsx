import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

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
    const årsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: felt =>
            felt.verdi !== '' ? ok(felt) : feil(felt, <SpråkTekst id={årsakFeilmeldingSpråkId} />),
    });

    const land = useLanddropdownFelt(
        { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        landFeilmeldingSpråkIds[årsak.verdi],
        årsak.verdi !== ''
    );

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const fraDato = useDatovelgerFelt(
        {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        årsak.verdi !== '',
        fraDatoFeilmeldingSpråkIds[årsak.verdi]
    );

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const tilDatoUkjent = useFelt<ESvar>({
        skalFeltetVises: avhengigheter =>
            avhengigheter.årsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { årsak },
        verdi: ESvar.NEI,
    });

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const tilDato = useDatovelgerFeltMedUkjent(
        UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        '',
        tilDatoUkjent,
        tilDatoFeilmeldingSpråkIds[årsak.verdi],
        årsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
    );

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, 'string'>({
        felter: { årsak, land, fraDato, tilDato, tilDatoUkjent },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
