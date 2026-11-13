import { describe, expect, it } from 'vitest';

import { skalVisePreutfylling } from './skalVisePreutfylling';

describe('skalVisePreutfylling', () => {
    it('skal vise panelet i preprod', () => {
        expect(skalVisePreutfylling({ hostname: 'familie-ba-soknad.ansatt.dev.nav.no', search: '' })).toBe(true);
    });

    it.each(['www.nav.no', 'nav.no', 'familie-ba-soknad.intern.nav.no', 'dev.nav.no.eksempel.no', 'eksempel.no'])(
        'skal ikke vise panelet på %s',
        hostname => {
            expect(skalVisePreutfylling({ hostname, search: '?preutfylling' })).toBe(false);
        }
    );

    it.each(['localhost', '127.0.0.1'])('skal vise panelet på %s når adressen har ?preutfylling', hostname => {
        expect(skalVisePreutfylling({ hostname, search: '?preutfylling' })).toBe(true);
    });

    it.each(['localhost', '127.0.0.1'])('skal ikke vise panelet på %s uten ?preutfylling', hostname => {
        expect(skalVisePreutfylling({ hostname, search: '' })).toBe(false);
    });
});
