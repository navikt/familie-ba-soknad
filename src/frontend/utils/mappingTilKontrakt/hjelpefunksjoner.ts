import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../typer/barn';
import { AlternativtSvarForInput } from '../../typer/common';
import { ISøknadsfelt, SpørsmålMap as KontraktpørsmålMap } from '../../typer/kontrakt/generelle';
import { ISøknadSpørsmål, SpørsmålId, ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { Årsak } from '../../typer/utvidet';
import { barnetsNavnValue } from '../barn';
import { hentTekster, landkodeTilSpråk, toÅrsakSpråkId } from '../språk';
import { språkIndexListe } from '../spørsmål';
import { isAlpha3Code } from '../typeguards';

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const sammeVerdiAlleSpråkEllerUkjentSpråktekst = (
    svar: string | AlternativtSvarForInput,
    ukjentTekstid: string
) =>
    svar === AlternativtSvarForInput.UKJENT
        ? hentTekster(ukjentTekstid)
        : sammeVerdiAlleSpråk(svar);

export const spørmålISøknadsFormat = (
    spørsmålMap: ISøknadSpørsmålMap,
    formatMessageValues: object = {}
): KontraktpørsmålMap => {
    return Object.fromEntries(
        Object.entries(spørsmålMap)
            .map(
                (
                    entry: [string, ISøknadSpørsmål<any>]
                ): [
                    string,
                    { label: Record<LocaleType, string>; verdi: Record<LocaleType, any> }
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
                        formatertVerdi = hentTekster(toÅrsakSpråkId(verdi));
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
    intl: IntlShape,
    labelTekstId: string,
    value: Record<LocaleType, T>,
    barn?: IBarnMedISøknad,
    labelMessageValues: object = {}
): ISøknadsfelt<T> =>
    barn
        ? søknadsfelt(labelTekstId, value, {
              ...labelMessageValues,
              navn: barnetsNavnValue(barn, intl),
              barn: barnetsNavnValue(barn, intl),
          })
        : søknadsfelt(labelTekstId, value);
