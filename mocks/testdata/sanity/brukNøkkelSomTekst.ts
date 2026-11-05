import { STANDARD_BLOCK_TEKST, STANDARD_STRING_TEKST } from './lagSanityObjekter';

const språk = ['nb', 'nn', 'en'] as const;

type Objekt = Record<string, unknown>;

const erObjekt = (verdi: unknown): verdi is Objekt =>
    typeof verdi === 'object' && verdi !== null && !Array.isArray(verdi);

const erLocaleRecordString = (verdi: Objekt): boolean => språk.every(locale => typeof verdi[locale] === 'string');

const erLocaleRecordBlock = (verdi: Objekt): boolean => språk.every(locale => Array.isArray(verdi[locale]));

const settBlokktekst = (blokker: unknown[], tekst: string) => {
    for (const blokk of blokker) {
        if (erObjekt(blokk) && Array.isArray(blokk.children)) {
            for (const barn of blokk.children) {
                if (erObjekt(barn) && barn.text === STANDARD_BLOCK_TEKST) {
                    barn.text = tekst;
                }
            }
        }
    }
};

const brukNøkkel = (innhold: unknown, sti: string[]): void => {
    if (Array.isArray(innhold)) {
        innhold.forEach((element, indeks) => {
            brukNøkkel(element, [...sti, String(indeks)]);
        });
        return;
    }
    if (!erObjekt(innhold)) {
        return;
    }

    const stiTekst = sti.join('.');

    if (erLocaleRecordString(innhold)) {
        for (const locale of språk) {
            if (innhold[locale] === STANDARD_STRING_TEKST) {
                innhold[locale] = stiTekst;
            }
        }
        innhold.api_navn = stiTekst;
        return;
    }

    if (erLocaleRecordBlock(innhold)) {
        for (const locale of språk) {
            settBlokktekst(innhold[locale] as unknown[], stiTekst);
        }
        innhold.api_navn = stiTekst;
        return;
    }

    for (const [nøkkel, verdi] of Object.entries(innhold)) {
        brukNøkkel(verdi, [...sti, nøkkel]);
    }
    if (typeof innhold.api_navn === 'string' && sti.length > 0) {
        innhold.api_navn = stiTekst;
    }
};

/** Setter standardtekstene til nøkkelstien, f.eks. `OM_DEG.navn`. Endrer objektet som sendes inn. */
export function brukNøkkelSomTekst<T>(innhold: T): T {
    brukNøkkel(innhold, []);
    return innhold;
}
