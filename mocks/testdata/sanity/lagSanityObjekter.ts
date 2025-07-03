import { ESanitySteg } from '../../../src/frontend/typer/sanity/sanity';

export function lagSanitySpørsmålDokument() {
    return {
        sporsmal: lagLocaleRecordBlock(),
        feilmelding: lagLocaleRecordBlock(),
        alert: lagLocaleRecordBlock(),
        beskrivelse: lagLocaleRecordBlock(),
        vedleggsnotis: lagLocaleRecordBlock(),
        checkboxLabel: lagLocaleRecordBlock(),
        _createdAt: 'string',
        _rev: 'string',
        _type: 'string',
        _id: 'string',
        api_navn: 'string',
        steg: ESanitySteg.FORSIDE,
        visningsnavn: 'string',
        ytelse: 'string',
    };
}

export function lagLocaleRecordString(text = 'default string') {
    return {
        _createdAt: '2022-09-01T09:31:48Z',
        _id: '3cb3d89a-cbdb-4804-8091-9532b687d8b0',
        _rev: 'X3H4QZC9mPz23OIbafWpY9',
        _type: 'FORSIDE_BEKREFTELSESBOKS_ANDRE_TEKSTER',
        _updatedAt: '2024-07-31T10:22:59Z',
        api_navn: 'bekreftelsesboksTittel',
        en: text,
        nb: text,
        nn: text,
        steg: 'FORSIDE',
        visningsnavn: 'Tittel',
        ytelse: ['BARNETRYGD'],
    };
}

export function lagLocaleRecordBlock(text = 'default block') {
    return {
        _createdAt: '2024-03-14T12:14:45Z',
        _id: 'FORSIDE_TITTEL_BARNETRYGD',
        _rev: 'SRrrMQUr2Cz7iHxH62d4PQ',
        _type: 'FORSIDE_TITTEL_BARNETRYGD',
        _updatedAt: '2024-07-31T10:22:59Z',
        api_navn: 'soeknadstittelBarnetrygd',
        en: [
            {
                _key: '687852dd7e05',
                _type: 'block',
                children: [
                    {
                        _key: '582adfe933a20',
                        _type: 'span',
                        marks: [],
                        text: text,
                    },
                ],
                markDefs: [],
                style: 'normal',
            },
        ],
        nb: [
            {
                _key: '5608dad0883b',
                _type: 'block',
                children: [
                    {
                        _key: '91d698ff5f5b',
                        _type: 'span',
                        marks: [],
                        text: text,
                    },
                ],
                markDefs: [],
                style: 'normal',
            },
        ],
        nn: [
            {
                _key: '809e101954ae',
                _type: 'block',
                children: [
                    {
                        _key: '0a9b7c5418a8',
                        _type: 'span',
                        marks: [],
                        text: text,
                    },
                ],
                markDefs: [],
                style: 'normal',
            },
        ],
        steg: 'FORSIDE',
        visningsnavn: 'Søknadstittel barnetrygd',
        ytelse: ['BARNETRYGD'],
    };
}
