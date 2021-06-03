import React from 'react';

import dayjs from 'dayjs';

import { ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ok } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';

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
    avgrensDatoFremITid: boolean
): FeltState<string> => {
    if (feltState.verdi === '') {
        return feil(feltState, <SpråkTekst id={'felles.velg-dato.feilmelding'} />);
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
