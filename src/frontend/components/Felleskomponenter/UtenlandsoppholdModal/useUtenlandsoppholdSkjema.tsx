import React from 'react';

import { useLocation } from 'react-router-dom';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useRoutes } from '../../../context/RoutesContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { ILokasjon } from '../../../typer/lokasjon';
import { RouteEnum } from '../../../typer/routes';
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
    const location = useLocation<ILokasjon>();
    const { hentNåværendeRoute } = useRoutes();
    const erSøker = hentNåværendeRoute(location.pathname).route === RouteEnum.OmDeg;

    const utenlandsoppholdÅrsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EUtenlandsoppholdÅrsak | ''>) =>
            felt.verdi !== '' ? ok(felt) : feil(felt, <SpråkTekst id={årsakFeilmeldingSpråkId} />),
    });

    const land = useLanddropdownFelt(
        { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        landFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        utenlandsoppholdÅrsak.verdi !== ''
    );

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const fraDato = useDatovelgerFelt(
        {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        utenlandsoppholdÅrsak.verdi !== '',
        fraDatoFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi]
    );

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const tilDatoUkjent = useFelt<ESvar>({
        skalFeltetVises: avhengigheter =>
            avhengigheter.årsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { årsak: utenlandsoppholdÅrsak },
        verdi: ESvar.NEI,
    });

    // TODO: Datovaldiering
    // TODO: Feilmeldinger basert på datovalidering
    const tilDato = useDatovelgerFeltMedUkjent(
        UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        '',
        tilDatoUkjent,
        tilDatoFeilmeldingSpråkIds[utenlandsoppholdÅrsak.verdi],
        utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
    );

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, 'string'>({
        felter: { årsak: utenlandsoppholdÅrsak, land, fraDato, tilDato, tilDatoUkjent },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
