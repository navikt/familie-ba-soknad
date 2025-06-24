import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import { ISøker } from '../../../typer/person';
import { spyOnUseApp, TestProvidere } from '../../../utils/testing';

import OmDeg from './OmDeg';
import { OmDegSpørsmålId } from './spørsmål';

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
        const { findByTestId } = render(<TestKomponent />);

        expect(await findByTestId('adressevisning-sperre')).toBeInTheDocument();
    });

    test('Kan gå videre i søknad ved adresse som er ukjent, får ikke spm om bosted, men opphold i norge', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByTestId } = render(<TestKomponent />);

        await waitFor(() => {
            expect(queryByTestId(OmDegSpørsmålId.borPåRegistrertAdresse)).not.toBeInTheDocument();
            expect(queryByTestId(OmDegSpørsmålId.værtINorgeITolvMåneder)).toBeInTheDocument();
        });
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
        const { queryByTestId } = render(<TestKomponent />);

        await waitFor(() => {
            expect(queryByTestId(OmDegSpørsmålId.borPåRegistrertAdresse)).toBeInTheDocument();
            expect(queryByTestId(OmDegSpørsmålId.værtINorgeITolvMåneder)).toBeInTheDocument();
        });
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByTestId } = render(<TestKomponent />);

        await waitFor(() => {
            expect(queryByTestId(OmDegSpørsmålId.borPåRegistrertAdresse)).not.toBeInTheDocument();
            expect(queryByTestId(OmDegSpørsmålId.værtINorgeITolvMåneder)).toBeInTheDocument();
        });
    });
});
