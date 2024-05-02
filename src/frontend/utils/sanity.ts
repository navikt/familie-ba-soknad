import { isPortableTextSpan } from '@portabletext/toolkit';
import {
    ArbitraryTypedObject,
    PortableTextBlock,
    PortableTextMarkDefinition,
    PortableTextSpan,
} from '@portabletext/types';
import { pipe } from 'ramda';

import { LocaleType } from '../components/Felleskomponenter/Dekoratøren/SpråkContext';
import {
    ESanityFlettefeltverdi,
    ESanitySteg,
    FlettefeltVerdier,
    frittståendeOrdPrefix,
    LocaleRecordBlock,
    LocaleRecordString,
    SanityDokument,
} from '../typer/sanity/sanity';
import {
    IFellesTekstInnhold,
    IFrittståendeOrdTekstinnhold,
    ITekstinnhold,
} from '../typer/sanity/tekstInnhold';

export const transformerTilTekstinnhold = (alleDokumenter: SanityDokument[]): ITekstinnhold => {
    const fellesDokumenter = alleDokumenter.filter(dok => dok.steg === ESanitySteg.FELLES);

    const tekstInnhold: Partial<ITekstinnhold> = {};

    for (const steg in ESanitySteg) {
        ESanitySteg[steg] !== ESanitySteg.FELLES &&
            (tekstInnhold[ESanitySteg[steg]] = strukturerInnholdForSteg(
                alleDokumenter,
                ESanitySteg[steg]
            ));
    }

    tekstInnhold[ESanitySteg.FELLES] = {
        frittståendeOrd: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, frittståendeOrdPrefix)
        ) as IFrittståendeOrdTekstinnhold,
    };
    return tekstInnhold as ITekstinnhold;
};

const strukturerInnholdForSteg = (
    dokumenter: SanityDokument[],
    steg: ESanitySteg
): Record<string, SanityDokument> =>
    dokumenter
        .filter(dok => dok.steg === steg)
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});

const struktrerInnholdForFelles = (dokumenter: SanityDokument[]): Partial<IFellesTekstInnhold> =>
    dokumenter.reduce((acc, dok) => {
        return { ...acc, [dok.api_navn]: dok };
    }, {});

const dokumenterFiltrertPåPrefix = (dokumenter: SanityDokument[], prefix) =>
    dokumenter.filter(dok => dok._type.includes(prefix));

// Denne funksjonen har kopiert mye fra en tråd i Sanity-slacken:
// https://sanity-io.slack.com/archives/CF876M37F/p1664206409432079?thread_ts=1663841434.772959&cid=CF876M37F
export const plainTekstHof =
    (
        flettefeltTilTekst: (
            flettefeltVerdi: ESanityFlettefeltverdi,
            flettefelter?: FlettefeltVerdier,
            spesifikkLocale?: LocaleType
        ) => string,
        søknadLocale: LocaleType
    ) =>
    (
        localeRecord: LocaleRecordBlock | LocaleRecordString | undefined,
        flettefelter?: FlettefeltVerdier,
        spesifikkLocale?: LocaleType
    ): string => {
        if (!localeRecord) {
            throw new Error(`Mangler tekst som skulle eksistert`);
        }

        const innholdForLocale = localeRecord[spesifikkLocale ?? søknadLocale];

        if (typeof innholdForLocale === 'string') {
            return innholdForLocale;
        }

        const marks = {
            flettefelt: props => {
                if (props.value.flettefeltVerdi) {
                    return flettefeltTilTekst(
                        props.value.flettefeltVerdi,
                        flettefelter,
                        spesifikkLocale
                    );
                } else {
                    throw new Error(`Fant ikke flettefeltVerdi`);
                }
            },
        };

        const leadingSpace = /^\s/;
        const trailingSpace = /^\s/;

        let tekst = '';

        innholdForLocale.forEach((block, index) => {
            let previousElementIsNonSpan = false;

            block.children.forEach(child => {
                if (isPortableTextSpan(child)) {
                    // If the previous element was a non-span, and we have no natural whitespace
                    // between the previous and the next span, insert it to give the spans some
                    // room to breathe. However, don't do so if this is the first span.
                    tekst +=
                        previousElementIsNonSpan &&
                        tekst &&
                        !trailingSpace.test(tekst) &&
                        !leadingSpace.test(child.text)
                            ? ' '
                            : '';

                    const transformedMarks = tranformMarks(child, block, marks);

                    tekst += transformedMarks
                        ? pipe(node => node, ...transformedMarks)(child).text
                        : pipe(node => node)(child).text;
                    previousElementIsNonSpan = false;
                } else if (child._type == 'flettefelt') {
                    tekst += flettefeltTilTekst(child.flettefelt, flettefelter, spesifikkLocale);
                } else {
                    previousElementIsNonSpan = true;
                }
            });

            if (index !== innholdForLocale.length - 1) {
                tekst += '\n\n';
            }
        });

        return tekst;
    };

const tranformMarks = (
    span: PortableTextSpan,
    block: PortableTextBlock<
        PortableTextMarkDefinition,
        ArbitraryTypedObject | PortableTextSpan,
        string,
        string
    >,
    customMarks: { flettefelt: (props: { value: { flettefeltVerdi } }) => string }
) => {
    return span.marks?.map(name => node => {
        const markDef = block.markDefs?.find(({ _key }) => _key === name);
        const mark = markDef && customMarks[markDef._type];

        return mark
            ? {
                  ...node,
                  text: mark({
                      ...node,
                      value: markDef,
                  }),
              }
            : node;
    });
};
