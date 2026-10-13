import { test as base, expect } from '@playwright/test';

import { handlers } from '../mocks/handlers';
import { type ApiMock, settOppApiMock } from './apiMock';
import { sanityHandler } from './sanity';

interface Fixtures {
    apiMock: ApiMock;
}

export const test = base.extend<Fixtures>({
    apiMock: [
        async ({ page, baseURL }, use) => {
            if (!baseURL) {
                throw new Error('baseURL må være satt i playwright.config.ts');
            }

            const apiMock = await settOppApiMock(page, new URL(baseURL).origin, [sanityHandler, ...handlers]);

            await use(apiMock);

            await page.unrouteAll({ behavior: 'ignoreErrors' });
            expect(
                apiMock.ubehandledeKall,
                'Det ble gjort kall uten mock-handler. Legg til handler i mocks/handlers.ts eller bruk apiMock.use() i testen.'
            ).toEqual([]);
        },
        { auto: true },
    ],
});

export { expect };
