import '@testing-library/jest-dom/vitest';

import { server } from './mocks/node.js';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
