import { isPortableTextSpan } from '@portabletext/toolkit';
import {
    ArbitraryTypedObject,
    PortableTextBlock,
    PortableTextMarkDefinition,
    PortableTextSpan,
} from '@portabletext/types';
import { pipe } from 'ramda';

import { LocaleType } from '../typer/common';
import { IAndreUtbetalingerTekstinnhold } from '../typer/sanity/modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from '../typer/sanity/modaler/arbeidsperiode';
import { IBarnetrygdsperiodeTekstinnhold } from '../typer/sanity/modaler/barnetrygdperiode';
import { ILeggTilBarnTekstinnhold } from '../typer/sanity/modaler/leggTilBarn';
import { IPensjonsperiodeTekstinnhold } from '../typer/sanity/modaler/pensjonsperiode';
import { IStartPåNyttModal } from '../typer/sanity/modaler/startPåNytt';
import { ITidligereSamoboereTekstinnhold } from '../typer/sanity/modaler/tidligereSamboere';
import { IUtenlandsoppholdTekstinnhold } from '../typer/sanity/modaler/utenlandsopphold';
import {
    ESanityFlettefeltverdi,
    ESanitySteg,
    FlettefeltVerdier,
    formateringsfeilmeldingerPrefix,
    frittståendeOrdPrefix,
    hjelpeteksterForInputPrefix,
    kanIkkeBrukeSoeknadPrefix,
    LocaleRecordBlock,
    LocaleRecordString,
    modalPrefix,
    navigasjonPrefix,
    SanityDokument,
    vedlikeholdsarbeidPrefix,
} from '../typer/sanity/sanity';
import {
    IFellesTekstInnhold,
    IFormateringsfeilmeldingerTekstinnhold,
    IFrittståendeOrdTekstinnhold,
    IHjelpeteksterForInputTekstInnhold,
    IKanIkkeBrukeSoeknadTekstinnhold,
    IModalerTekstinnhold,
    INavigasjonTekstinnhold,
    ITekstinnhold,
    IVedlikeholdsarbeidTekstinnhold,
    SanityModalPrefix,
    SanityPersonType,
} from '../typer/sanity/tekstInnhold';

const strukturerInnholdForSteg = (
    dokumenter: SanityDokument[],
    steg: ESanitySteg
): Record<string, SanityDokument> =>
    dokumenter
        .filter(dok => dok.steg === steg)
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});

const struktrerInnholdForFelles = (
    dokumenter: SanityDokument[],
    personType?: SanityPersonType
): Partial<IFellesTekstInnhold> =>
    dokumenter
        .filter(dok => (personType ? dok._type.includes(personType) : dok))
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});

const dokumenterFiltrertPåPrefix = (dokumenter: SanityDokument[], prefix) =>
    dokumenter.filter(dok => dok._type.includes(prefix));

const strukturertInnholdForModaler = (dokumenter: SanityDokument[]): IModalerTekstinnhold => {
    const strukturerInnholdForModal = (prefix: string, personType?: SanityPersonType) =>
        struktrerInnholdForFelles(dokumenterFiltrertPåPrefix(dokumenter, prefix), personType);

    const arbeidsperiode = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.ARBEIDSPERIODE,
            personType
        ) as IArbeidsperiodeTekstinnhold;

    const barnetrygsdperiode = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.BARNETRYGDSPERIODE,
            personType
        ) as IBarnetrygdsperiodeTekstinnhold;

    const pensjonsperiode = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.PENSJONSPERIODE,
            personType
        ) as IPensjonsperiodeTekstinnhold;

    const andreUtbetalinger = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.ANDRE_UTBETALINGER,
            personType
        ) as IAndreUtbetalingerTekstinnhold;

    const tidligereSamboere = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.TIDLIGERE_SAMBOERE,
            personType
        ) as ITidligereSamoboereTekstinnhold;

    const utenlandsopphold = (personType: SanityPersonType) =>
        strukturerInnholdForModal(
            SanityModalPrefix.UTENLANDSOPPHOLD,
            personType
        ) as IUtenlandsoppholdTekstinnhold;

    return {
        arbeidsperiode: {
            søker: arbeidsperiode(SanityPersonType.SOKER),
            andreForelder: arbeidsperiode(SanityPersonType.ANDRE_FORELDER),
            omsorgsperson: arbeidsperiode(SanityPersonType.OMSORGSPERSON),
        },
        barnetrygdsperiode: {
            søker: barnetrygsdperiode(SanityPersonType.SOKER),
            andreForelder: barnetrygsdperiode(SanityPersonType.ANDRE_FORELDER),
            omsorgsperson: barnetrygsdperiode(SanityPersonType.OMSORGSPERSON),
        },
        pensjonsperiode: {
            søker: pensjonsperiode(SanityPersonType.SOKER),
            andreForelder: pensjonsperiode(SanityPersonType.ANDRE_FORELDER),
            omsorgsperson: pensjonsperiode(SanityPersonType.OMSORGSPERSON),
        },
        andreUtbetalinger: {
            søker: andreUtbetalinger(SanityPersonType.SOKER),
            andreForelder: andreUtbetalinger(SanityPersonType.ANDRE_FORELDER),
            omsorgsperson: andreUtbetalinger(SanityPersonType.OMSORGSPERSON),
        },
        tidligereSamboere: {
            søker: tidligereSamboere(SanityPersonType.SOKER),
        },
        utenlandsopphold: {
            søker: utenlandsopphold(SanityPersonType.SOKER),
            barn: utenlandsopphold(SanityPersonType.BARN),
            andreForelder: utenlandsopphold(SanityPersonType.ANDRE_FORELDER),
        },
        leggTilBarn: strukturerInnholdForModal(
            SanityModalPrefix.LEGG_TIL_BARN
        ) as ILeggTilBarnTekstinnhold,
        startPåNytt: strukturerInnholdForModal(
            SanityModalPrefix.START_PAA_NYTT
        ) as IStartPåNyttModal,
    };
};

export const transformerTilTekstinnhold = (alleDokumenter: SanityDokument[]): ITekstinnhold => {
    const fellesDokumenter = alleDokumenter.filter(dok => dok.steg === ESanitySteg.FELLES);

    const tekstInnhold: Partial<ITekstinnhold> = {};

    for (const steg in ESanitySteg) {
        if (ESanitySteg[steg] !== ESanitySteg.FELLES) {
            tekstInnhold[ESanitySteg[steg]] = strukturerInnholdForSteg(
                alleDokumenter,
                ESanitySteg[steg]
            );
        }
    }

    tekstInnhold[ESanitySteg.FELLES] = {
        modaler: {
            ...strukturertInnholdForModaler(
                dokumenterFiltrertPåPrefix(fellesDokumenter, modalPrefix)
            ),
        },
        frittståendeOrd: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, frittståendeOrdPrefix)
        ) as IFrittståendeOrdTekstinnhold,
        navigasjon: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, navigasjonPrefix)
        ) as INavigasjonTekstinnhold,
        formateringsfeilmeldinger: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, formateringsfeilmeldingerPrefix)
        ) as IFormateringsfeilmeldingerTekstinnhold,
        vedlikeholdsarbeid: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, vedlikeholdsarbeidPrefix)
        ) as IVedlikeholdsarbeidTekstinnhold,
        kanIkkeBrukeSoeknad: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, kanIkkeBrukeSoeknadPrefix)
        ) as IKanIkkeBrukeSoeknadTekstinnhold,
        hjelpeteksterForInput: struktrerInnholdForFelles(
            dokumenterFiltrertPåPrefix(fellesDokumenter, hjelpeteksterForInputPrefix)
        ) as IHjelpeteksterForInputTekstInnhold,
    };
    return tekstInnhold as ITekstinnhold;
};

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
