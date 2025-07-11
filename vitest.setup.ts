import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './mocks/node.js';

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
}));
