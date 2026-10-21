import { isPortableTextSpan } from '@portabletext/toolkit';
import { describe, expect, it } from 'vitest';

import { ESanitySteg, type LocaleRecordBlock } from '../../../src/common/sanity';
import { LocaleType } from '../../../src/common/typer/localeType';
import { brukNøkkelSomTekst } from './brukNøkkelSomTekst';
import { lagLocaleRecordBlock, lagLocaleRecordString, lagSanitySpørsmålDokument } from './lagSanityObjekter';
import { mockTekstInnhold } from './sanity';

const blokkTekst = (block: LocaleRecordBlock, locale: LocaleType = LocaleType.nb) => {
    const barn = block[locale][0].children[0];
    return isPortableTextSpan(barn) ? barn.text : undefined;
};

describe('brukNøkkelSomTekst', () => {
    it('gir strenger tekst og api_navn lik nøkkelstien', () => {
        const innhold = brukNøkkelSomTekst({ steg: { tittel: lagLocaleRecordString() } });

        expect(innhold.steg.tittel.nb).toBe('steg.tittel');
        expect(innhold.steg.tittel.nn).toBe('steg.tittel');
        expect(innhold.steg.tittel.en).toBe('steg.tittel');
        expect(innhold.steg.tittel.api_navn).toBe('steg.tittel');
    });

    it('gir blokker tekst lik nøkkelstien på alle språk', () => {
        const innhold = brukNøkkelSomTekst({ steg: { guide: lagLocaleRecordBlock() } });

        expect(blokkTekst(innhold.steg.guide, LocaleType.nb)).toBe('steg.guide');
        expect(blokkTekst(innhold.steg.guide, LocaleType.nn)).toBe('steg.guide');
        expect(blokkTekst(innhold.steg.guide, LocaleType.en)).toBe('steg.guide');
        expect(innhold.steg.guide.api_navn).toBe('steg.guide');
    });

    it('gir hvert felt i et spørsmålsdokument egen tekst', () => {
        const innhold = brukNøkkelSomTekst({ steg: { spm: lagSanitySpørsmålDokument() } });

        expect(blokkTekst(innhold.steg.spm.sporsmal)).toBe('steg.spm.sporsmal');
        expect(blokkTekst(innhold.steg.spm.feilmelding)).toBe('steg.spm.feilmelding');
        expect(innhold.steg.spm.api_navn).toBe('steg.spm');
    });

    it('beholder tekst som er satt eksplisitt', () => {
        const innhold = brukNøkkelSomTekst({
            a: lagLocaleRecordBlock('fosterhjem-beskrivelse'),
            b: lagLocaleRecordString('egen tekst'),
        });

        expect(blokkTekst(innhold.a)).toBe('fosterhjem-beskrivelse');
        expect(innhold.b.nb).toBe('egen tekst');
    });
});

describe('mockTekstInnhold', () => {
    it('gir ulike tekster til ulike felt', () => {
        const { OM_DEG } = mockTekstInnhold();

        expect(blokkTekst(OM_DEG.borPaaRegistrertAdresse.sporsmal)).toBe('OM_DEG.borPaaRegistrertAdresse.sporsmal');
        expect(blokkTekst(OM_DEG.vaertINorgeITolvMaaneder.sporsmal)).toBe('OM_DEG.vaertINorgeITolvMaaneder.sporsmal');
        expect(OM_DEG.navn.nb).toBe('OM_DEG.navn');
    });

    it('gir de samme objektene ved hvert kall', () => {
        expect(mockTekstInnhold()[ESanitySteg.OM_DEG]).toBe(mockTekstInnhold()[ESanitySteg.OM_DEG]);
    });
});
