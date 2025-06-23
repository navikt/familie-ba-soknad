import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

import { server } from './mocks/node.js';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Dekoratøren feiler på grunn av timeouts i CSP-oppsettet.
// Den er ikke relevant for testene våre, fjerner den dermed
vi.mock('src/frontend/decorator.ts');
