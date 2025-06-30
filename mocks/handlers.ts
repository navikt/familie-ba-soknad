import { http, HttpResponse } from 'msw';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { hentTekstInnhold } from './testdata/sanity';
import { urlMedBasePath } from './utils';

export const handlers = [
    http.get(urlMedBasePath('api/personopplysning'), () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                ident: '23058518298',
                navn: 'Voksen Voksnessen',
                barn: [
                    {
                        ident: '12345678987',
                        navn: 'Barn Barnessen III',
                        borMedSøker: true,
                        fødselsdato: '2022-01-01',
                        adressebeskyttelse: false,
                    },
                ],
                statsborgerskap: [
                    {
                        landkode: 'NOR',
                    },
                    {
                        landkode: 'AFG',
                    },
                ],
                sivilstand: {
                    type: 'GIFT',
                },
                adresse: {
                    adressenavn: 'Solveien',
                    postnummer: '2304',
                    husbokstav: 'A',
                    bruksenhetsnummer: 'H0101',
                    husnummer: '2',
                    poststed: 'HAMAR',
                },
                adressebeskyttelse: false,
            })
        );
    }),
    http.get(urlMedBasePath('modellversjon'), () => {
        return HttpResponse.json(byggSuksessRessurs(50));
    }),
    http.get(urlMedBasePath('toggles/all'), () => {
        return HttpResponse.json(byggSuksessRessurs({}));
    }),
    http.get(urlMedBasePath('api/innlogget/barnetrygd'), () => {
        return HttpResponse.json(byggSuksessRessurs('Autentisert kall'));
    }),
    http.delete(urlMedBasePath('dokument/soknad/barnetrygd'), () => {
        return HttpResponse.json(byggSuksessRessurs(''));
    }),
    http.get(urlMedBasePath('dokument/soknad/barnetrygd'), () => {
        return new HttpResponse(null, { status: 404 });
    }),
    http.get(urlMedBasePath('api/kontoregister/hent-kontonr'), () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                kontonummer: '815.493.00',
            })
        );
    }),
    http.get(urlMedBasePath('api/kodeverk/eos-land'), () => {
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
    http.get('https://by26nl8j.apicdn.sanity.io/v2021-10-21/data/query/ba-production', () => {
        return HttpResponse.json(hentTekstInnhold());
    }),
];
