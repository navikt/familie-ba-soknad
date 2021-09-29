import React from 'react';

import dayjs from 'dayjs';

import { ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, ValiderFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { AlternativtSvarForInput, DatoMedUkjent } from '../typer/person';

export const erDatoFormatGodkjent = (verdi: string) => {
    /*FamilieDatoVelger har allerede sin egen validering.
      Dersom valideringen går igjennom der, blir datoen formatert til YYYY-MM-DD.
      Derfor sjekker vi her om FamilieDatoVelger har klart å formatere den,
      i tillegg til om det er en gyldig dato med dayjs.*/
    return dayjs(verdi, 'YYYY-MM-DD').format('YYYY-MM-DD') === verdi;
};

export const erDatoFremITid = (verdi: ISODateString) => {
    return dayjs(verdi).isAfter(dayjs());
};

export const validerDato = (
    feltState: FeltState<string>,
    avgrensDatoFremITid: boolean,
    feilmeldingSpråkId: string
): FeltState<string> => {
    if (feltState.verdi === '') {
        return feil(feltState, <SpråkTekst id={feilmeldingSpråkId} />);
    }
    if (!erDatoFormatGodkjent(feltState.verdi)) {
        return feil(feltState, <SpråkTekst id={'felles.dato-format.feilmelding'} />);
    }
    if (avgrensDatoFremITid && erDatoFremITid(feltState.verdi)) {
        return feil(feltState, <SpråkTekst id={'felles.dato-frem-i-tid.feilmelding'} />);
    }
    return ok(feltState);
};

export const formaterDato = (isoDateString: ISODateString) =>
    dayjs(isoDateString).format('DD.MM.YYYY');

export const validerDatoAvgrensetFremITid: ValiderFelt<ISODateString> = (
    felt: FeltState<ISODateString>
) => validerDato(felt, true);

export const validerDatoMedUkjentAvgrensetFremITid: ValiderFelt<DatoMedUkjent> = felt =>
    felt.verdi === AlternativtSvarForInput.UKJENT ? ok(felt) : validerDatoAvgrensetFremITid(felt);
