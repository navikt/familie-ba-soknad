import { ReactNode } from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { AlternativtSvarForInput, LocaleType } from '../../typer/common';
import {
    ISøknadsfelt,
    Slektsforhold,
    SpørsmålMap as KontraktpørsmålMap,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import {
    FlettefeltVerdier,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmål, SpørsmålId, ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { Årsak } from '../../typer/utvidet';
import { hentTekster, hentÅrsak, landkodeTilSpråk, toSlektsforholdSpråkId } from '../språk';
import { språkIndexListe } from '../spørsmål';
import { isAlpha3Code } from '../typeguards';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const søknadsfeltHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    <T>(
        labelLocaleRecord: LocaleRecordString | LocaleRecordBlock | undefined,
        svar: Record<LocaleType, T>,
        flettefelter?: FlettefeltVerdier
    ): ISøknadsfelt<T> => {
        if (!labelLocaleRecord) {
            throw Error('Mangler tekst fra Sanity som burde vært implementert');
        }
        return { label: tilRestLocaleRecord(labelLocaleRecord, flettefelter), verdi: svar };
    };

export const søknadsfeltForESvarHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    (
        spørsmål: LocaleRecordBlock,
        svar: ESvar | null,
        flettefelter?: FlettefeltVerdier
    ): ISøknadsfelt<ESvar> => {
        const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
        if (!svar) {
            throw Error(`Svar for ${spørsmål.nb} kan ikke være null`);
        }
        return søknadsfelt(spørsmål, sammeVerdiAlleSpråk(svar), flettefelter);
    };

export const nullableSøknadsfeltForESvarHof =
    (tilRestLocaleRecord: TilRestLocaleRecord) =>
    (spørsmål: LocaleRecordBlock, svar: ESvar | null, flettefelter?: FlettefeltVerdier) => {
        const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
        return svar ? søknadsfelt(spørsmål, sammeVerdiAlleSpråk(svar), flettefelter) : null;
    };

export const søknadsfelt = <T>(
    labelTekstId: string,
    value: Record<LocaleType, T>,
    labelMessageValues: object = {}
): ISøknadsfelt<T> => {
    return { label: hentTekster(labelTekstId, labelMessageValues), verdi: value };
};

export const verdiCallbackAlleSpråk = <T>(
    cb: (locale: LocaleType) => T
): Record<LocaleType, T> => ({
    [LocaleType.nb]: cb(LocaleType.nb),
    [LocaleType.nn]: cb(LocaleType.nn),
    [LocaleType.en]: cb(LocaleType.en),
});

export const sammeVerdiAlleSpråk = <T>(verdi: T): Record<LocaleType, T> =>
    verdiCallbackAlleSpråk(() => verdi);

export const sammeVerdiAlleSpråkEllerUkjent = <T>(
    tilRestLocaleRecord: TilRestLocaleRecord,
    svar: T | AlternativtSvarForInput,
    checkboxLabel?: LocaleRecordBlock,
    flettefelter?: FlettefeltVerdier
): Record<LocaleType, T | string> =>
    checkboxLabel && svar === AlternativtSvarForInput.UKJENT
        ? tilRestLocaleRecord(checkboxLabel, flettefelter)
        : sammeVerdiAlleSpråk(svar);

export const sammeVerdiAlleSpråkEllerUkjentSpråktekst = <T>(
    svar: T | AlternativtSvarForInput,
    ukjentTekstid: string,
    språkVerdier: Record<string, ReactNode> = {}
): Record<LocaleType, T | string> =>
    svar === AlternativtSvarForInput.UKJENT
        ? hentTekster(ukjentTekstid, språkVerdier)
        : sammeVerdiAlleSpråk(svar);

export const spørmålISøknadsFormat = (
    spørsmålMap: ISøknadSpørsmålMap,
    formatMessageValues: object = {},
    tekster: ITekstinnhold
): KontraktpørsmålMap => {
    const dinLivssituasjonTekster = tekster.DIN_LIVSSITUASJON;

    return Object.fromEntries(
        Object.entries(spørsmålMap)
            .map(
                (
                    entry: [string, ISøknadSpørsmål<any>]
                ): [
                    string,
                    { label: Record<LocaleType, string>; verdi: Record<LocaleType, any> },
                ] => {
                    const verdi = entry[1].svar;
                    let formatertVerdi: Record<LocaleType, string>;

                    if (isAlpha3Code(verdi)) {
                        formatertVerdi = verdiCallbackAlleSpråk(locale =>
                            landkodeTilSpråk(verdi, locale)
                        );
                    } else if (verdi in ESvar) {
                        // Slår opp språktekst i språkteksterUtenomSpørsmål i dokgen
                        formatertVerdi = sammeVerdiAlleSpråk(verdi);
                    } else if (verdi in Årsak) {
                        formatertVerdi = hentÅrsak(verdi, dinLivssituasjonTekster);
                    } else if (verdi in Slektsforhold) {
                        formatertVerdi = hentTekster(toSlektsforholdSpråkId(verdi));
                    } else {
                        formatertVerdi = sammeVerdiAlleSpråk(verdi);
                    }

                    return [
                        entry[0],
                        søknadsfelt(
                            språktekstIdFraSpørsmålId(entry[1].id),
                            formatertVerdi,
                            formatMessageValues
                        ),
                    ];
                }
            )
            .filter(entry => entry[1].verdi[LocaleType.nb])
    );
};

export const språktekstIdFraSpørsmålId = (spørsmålId: SpørsmålId): string => {
    for (const språkIndex of språkIndexListe) {
        if (spørsmålId in språkIndex) {
            return språkIndex[spørsmålId];
        }
    }
    return 'ukjent-spørsmål';
};

export const søknadsfeltBarn = <T>(
    labelTekstId: string,
    value: Record<LocaleType, T>,
    barn?: IBarnMedISøknad,
    labelMessageValues: object = {}
): ISøknadsfelt<T> =>
    barn
        ? søknadsfelt(labelTekstId, value, {
              ...labelMessageValues,
              navn: barn.navn,
              barn: barn.navn,
          })
        : søknadsfelt(labelTekstId, value);
