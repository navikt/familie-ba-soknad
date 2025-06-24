import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

import * as decorator from '@navikt/nav-dekoratoren-moduler';

import { server } from './mocks/node.js';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

window.scrollTo = () => {
    // Ikke implementert
};
