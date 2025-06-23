import { http, HttpResponse } from 'msw';

import { byggSuksessRessurs } from '@navikt/familie-typer';

export const handlers = [
    http.get('/modellversjon', () => {
        return HttpResponse.json(byggSuksessRessurs(50));
    }),
    http.get('/toggles/all', () => {
        return HttpResponse.json(byggSuksessRessurs('toggle1'));
    }),
    http.get('api/innlogget/barnetrygd', () => {
        return HttpResponse.json(byggSuksessRessurs('Autentisert kall'));
    }),

    http.get('/dokument/soknad/barnetrygd', () => {
        return new HttpResponse(null, { status: 404 });
    }),
    http.get('/api/kontoregister/hent-kontonr', () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                kontonummer: '815.493.00',
            })
        );
    }),
    http.get('/api/kodeverk/eos-land', () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                BEL: 'Belgia',
                DNK: 'Danmark',
                CHE: 'Sveits',
                IRL: 'Irland',
                NLD: 'Nederland',
            })
        );
    }),
];
