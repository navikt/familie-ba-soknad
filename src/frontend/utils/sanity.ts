import { PortableTextBlock } from '@portabletext/types';

import { ESanitySteg, frittståendeOrdPrefix, SanityDokument } from '../typer/sanity/sanity';
import {
    IFellesTekstInnhold,
    IFrittståendeOrdTekstinnhold,
    ITekstinnhold,
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

const struktrerInnholdForFelles = (dokumenter: SanityDokument[]): Partial<IFellesTekstInnhold> =>
    dokumenter.reduce((acc, dok) => {
        return { ...acc, [dok.api_navn]: dok };
    }, {});

const dokumenterFiltrertPåPrefix = (dokumenter: SanityDokument[], prefix) =>
    dokumenter.filter(dok => dok._type.includes(prefix));

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

export const toPlainText = (blocks: PortableTextBlock[] = []) => {
    return (
        blocks
            // loop through each block
            .map(block => {
                // if it's not a text block with children,
                // return nothing
                if (block._type !== 'block' || !block.children) {
                    return '';
                }
                // loop through the children spans, and join the
                // text strings
                return block.children.map(child => child.text).join('');
            })
            // join the paragraphs leaving split by two linebreaks
            .join('\n\n')
    );
};
