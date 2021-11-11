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

export const erDatoFremITid = (dato: ISODateString) => {
    return dayjs(dato).isAfter(dayjs());
};

export const erDatoEtterSluttdatoAvgresning = (dato: ISODateString, sluttdato: ISODateString) => {
    return dayjs(dato).isAfter(dayjs(sluttdato));
};

export const erDatoFørEllerSammeSomStartDatoAvgrensning = (
    dato: ISODateString,
    startdato: ISODateString
) => {
    return dayjs(dato).isBefore(dayjs(startdato)) || dayjs(dato).isSame(dayjs(startdato));
};

export const gårsdagensDato = () => dayjs().subtract(1, 'day').format('YYYY-MM-DD');

export const ettÅrTilbakeDato = () => dayjs().subtract(1, 'year').format('YYYY-MM-DD');

export const dagensDato = () => dayjs().format('YYYY-MM-DD');

export const validerDato = (
    feltState: FeltState<string>,
    feilmeldingSpråkId: string,
    startdatoAvgrensning = '',
    sluttdatoAvgrensning = ''
): FeltState<string> => {
    if (feltState.verdi === '') {
        return feil(feltState, feilmeldingSpråkId ? <SpråkTekst id={feilmeldingSpråkId} /> : '');
    }
    if (!erDatoFormatGodkjent(feltState.verdi)) {
        return feil(feltState, <SpråkTekst id={'felles.dato-format.feilmelding'} />);
    }
    if (
        !!sluttdatoAvgrensning &&
        erDatoEtterSluttdatoAvgresning(feltState.verdi, sluttdatoAvgrensning)
    ) {
        return feil(
            feltState,
            <SpråkTekst
                id={
                    sluttdatoAvgrensning === dagensDato()
                        ? 'felles.dato-frem-i-tid.feilmelding'
                        : 'felles.dato-frem-i-tid-eller-i-idag.feilmelding'
                }
            />
        );
    }
    if (
        !!startdatoAvgrensning &&
        erDatoFørEllerSammeSomStartDatoAvgrensning(feltState.verdi, startdatoAvgrensning)
    ) {
        return feil(feltState, <SpråkTekst id={'felles.tilogmedfeilformat.feilmelding'} />);
    }
    return ok(feltState);
};

export const formaterDato = (isoDateString: ISODateString) =>
    dayjs(isoDateString).format('DD.MM.YYYY');
