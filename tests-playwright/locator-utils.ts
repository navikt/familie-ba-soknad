import { Locator } from '@playwright/test';

export function hentFieldset(page, tekst): Locator {
    return page.getByRole('group').filter({ hasText: tekst });
}
