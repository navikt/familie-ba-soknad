import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './mocks/node.js';
import { mockTekstInnhold } from './mocks/testdata/sanity/sanity';

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    cleanup();
});
afterAll(() => server.close());

window.scrollTo = () => {
    // Ikke implementert
};

vi.mock('@navikt/nav-dekoratoren-moduler', () => ({
    setAvailableLanguages: vi.fn().mockImplementation(() => {
        return Promise.resolve();
    }),
    onLanguageSelect: vi.fn(),
    getCurrentConsent: vi.fn(),
    setParams: vi.fn().mockResolvedValue(undefined),
}));

// useHentSanityTekster henter tekster over nett via @sanity/client, som forventer et respons-format
// (`{ result: SanityDokument[] }`) som ikke samsvarer med den ferdigtransformerte ITekstinnhold-formen
// i mocks/testdata/sanity. Vi mocker derfor selve hooken slik at den returnerer testdataene direkte.
vi.mock('./src/frontend/hooks/useHentSanityTekster', () => ({
    useHentSanityTekster: () => ({
        data: mockTekstInnhold(),
        isPending: false,
        error: null,
    }),
}));
