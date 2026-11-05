import { render, screen } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import type { ISøker } from '../../../typer/person';
import { spyOnUseApp, spørsmålFinnes, TestProvidere, ventPåSpørsmål } from '../../../utils/testing';

import OmDeg from './OmDeg';
import { OmDegSpørsmålId } from './spørsmål';

const borPåRegistrertAdresse = 'OM_DEG.borPaaRegistrertAdresse.sporsmal';
const værtINorgeITolvMåneder = 'OM_DEG.vaertINorgeITolvMaaneder.sporsmal';

const TestKomponent = () => (
    <TestProvidere mocketNettleserHistorikk={['/om-deg']}>
        <OmDeg />
    </TestProvidere>
);

describe('OmDeg', () => {
    test('Viser adressesperre-melding', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        render(<TestKomponent />);

        expect(await screen.findByText('OM_DEG.soekerAdressesperre')).toBeInTheDocument();
    });

    test('Kan gå videre i søknad ved adresse som er ukjent, får ikke spm om bosted, men opphold i norge', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        render(<TestKomponent />);

        expect(await ventPåSpørsmål(værtINorgeITolvMåneder)).toBeInTheDocument();
        expect(spørsmålFinnes(borPåRegistrertAdresse)).toBe(false);
    });

    test('Søker med adresse får opp to spørsmål med en gang', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
                borPåRegistrertAdresse: { id: OmDegSpørsmålId.borPåRegistrertAdresse, svar: null },
                værtINorgeITolvMåneder: { id: OmDegSpørsmålId.værtINorgeITolvMåneder, svar: null },
            }),
        });
        render(<TestKomponent />);

        expect(await ventPåSpørsmål(borPåRegistrertAdresse)).toBeInTheDocument();
        expect(await ventPåSpørsmål(værtINorgeITolvMåneder)).toBeInTheDocument();
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        render(<TestKomponent />);

        expect(await ventPåSpørsmål(værtINorgeITolvMåneder)).toBeInTheDocument();
        expect(spørsmålFinnes(borPåRegistrertAdresse)).toBe(false);
    });
});
