import React from 'react';

import {
    add,
    format,
    isAfter,
    isBefore,
    isFuture,
    isToday,
    isValid,
    Locale,
    parse,
    startOfDay,
    startOfToday,
    sub,
} from 'date-fns';
import { enGB, nb, nn } from 'date-fns/locale';

import { feil, FeltState, ok } from '@navikt/familie-skjema';
import { LocaleType } from '@navikt/familie-sprakvelger';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { AlternativtSvarForInput, DatoMedUkjent, ISODateString } from '../typer/common';

export const erDatoFormatGodkjent = (dato: Date) => isValid(dato);

export const erDatoFremITid = (dato: Date) => isFuture(dato);

export const erDatoEtterSluttdatoAvgresning = (dato: Date, sluttdato: Date) =>
    isAfter(dato, sluttdato);

export const erDatoFørStartDatoAvgrensning = (dato: Date, startdato: Date) =>
    isBefore(dato, startdato);

export const gårsdagensDato = () => sub(dagensDato(), { days: 1 });

export const ettÅrTilbakeDato = () => sub(dagensDato(), { years: 1 });

export const dagensDato = () => startOfToday();

export const morgendagensDato = () => add(dagensDato(), { days: 1 });

export const erSammeDatoSomDagensDato = (dato: Date) => isToday(dato);

export const dagenEtterDato = (dato: Date) => add(dato, { days: 1 });

export const tidenesMorgen = () => startOfDay(new Date(1000, 0));

export const tidenesEnde = () => startOfDay(new Date(3000, 0));

export const stringTilDate = (dato: string) => startOfDay(new Date(dato));

export const parseTilGyldigDato = (dateString: string, format: string): Date | undefined => {
    const parsetDato = parse(dateString, format, new Date());
    const parsetDatoErGyldig = erDatoFormatGodkjent(parsetDato);
    return parsetDatoErGyldig ? parsetDato : undefined;
};

export const validerDato = (
    feltState: FeltState<string>,
    feilmeldingSpråkId: string,
    startdatoAvgrensning: Date | undefined = undefined,
    sluttdatoAvgrensning: Date | undefined = undefined,
    customStartdatoFeilmelding = ''
): FeltState<string> => {
    if (feltState.verdi === '') {
        return feil(feltState, feilmeldingSpråkId ? <SpråkTekst id={feilmeldingSpråkId} /> : '');
    }

    const dato = parseTilGyldigDato(feltState.verdi, 'yyyy-MM-dd');

    if (!dato) {
        return feil(feltState, <SpråkTekst id={'felles.dato-format.feilmelding'} />);
    }

    if (!!sluttdatoAvgrensning && erDatoEtterSluttdatoAvgresning(dato, sluttdatoAvgrensning)) {
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

    if (!!startdatoAvgrensning && erDatoFørStartDatoAvgrensning(dato, startdatoAvgrensning)) {
        return feil(
            feltState,
            <SpråkTekst
                id={
                    customStartdatoFeilmelding
                        ? customStartdatoFeilmelding
                        : 'felles.tilogmedfeilformat.feilmelding'
                }
            />
        );
    }
    return ok(feltState);
};

export const formaterDato = (datoString: ISODateString) =>
    format(new Date(datoString), 'dd.MM.yyyy');

export const formaterDatoMedUkjent = (datoMedUkjent: DatoMedUkjent, tekstForUkjent): string => {
    return datoMedUkjent === AlternativtSvarForInput.UKJENT
        ? tekstForUkjent
        : format(new Date(datoMedUkjent), 'dd.MM.yyyy');
};

export const formaterDatoKunMåned = (datoString: ISODateString, språk: LocaleType) =>
    format(new Date(datoString), 'MMMM yyyy', { locale: mapSpråkvalgTilDateFnsLocale(språk) });

const mapSpråkvalgTilDateFnsLocale = (språkvalg: LocaleType): Locale => {
    switch (språkvalg) {
        case LocaleType.nb:
            return nb;
        case LocaleType.nn:
            return nn;
        case LocaleType.en:
            return enGB;
    }
};
