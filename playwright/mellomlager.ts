import { HttpResponse, http, type RequestHandler } from 'msw';

import type { IMellomlagretBarnetrygd } from '../src/frontend/typer/mellomlager';
import { MELLOMLAGRING_URL } from './søknad';

/**
 * Mellomlagring i minnet, laget med {@link lagMellomlager}.
 * - `lagret`: søknaden som sist ble mellomlagret, eller `undefined` hvis ingenting er lagret eller lagringen er slettet.
 * - `endre`: endrer den lagrede søknaden, f.eks. for å simulere at den ble lagret med en eldre modellversjon.
 * - `handlers`: MSW-handlere for GET, POST og DELETE mot mellomlagringsendepunktet.
 */
export interface Mellomlager {
    lagret: () => IMellomlagretBarnetrygd | undefined;
    endre: (endring: Partial<IMellomlagretBarnetrygd>) => void;
    handlers: RequestHandler[];
}

/**
 * Mellomlagring som husker søknaden mellom kall, slik familie-dokument gjør: POST lagrer, GET henter og DELETE sletter.
 * Gjør det mulig å teste at en påbegynt søknad kan gjenopprettes etter at siden er lastet på nytt.
 */
export function lagMellomlager(): Mellomlager {
    let lagret: IMellomlagretBarnetrygd | undefined;

    return {
        lagret: () => lagret,
        endre: endring => {
            if (!lagret) {
                throw new Error('Det finnes ingen mellomlagret søknad å endre');
            }
            lagret = { ...lagret, ...endring };
        },
        handlers: [
            http.get(MELLOMLAGRING_URL, () =>
                lagret ? HttpResponse.json(lagret) : new HttpResponse(null, { status: 204 })
            ),
            http.post<never, IMellomlagretBarnetrygd>(MELLOMLAGRING_URL, async ({ request }) => {
                lagret = await request.json();
                return new HttpResponse(null, { status: 201 });
            }),
            http.delete(MELLOMLAGRING_URL, () => {
                lagret = undefined;
                return new HttpResponse(null, { status: 204 });
            }),
        ],
    };
}
