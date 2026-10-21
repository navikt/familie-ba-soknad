import { render, screen } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import type { ISøker } from '../typer/person';
import { hentSvaralternativ, spyOnUseApp, spørsmålFinnes, TestProvidere, ventPåSpørsmål } from './testing';

const renderOmDeg = (søker: Partial<ISøker>) => {
    spyOnUseApp({ søker: mockDeep<ISøker>({ statsborgerskap: [{ landkode: 'NOR' }], ...søker }) });
    render(
        <TestProvidere mocketNettleserHistorikk={['/om-deg']}>
            <OmDeg />
        </TestProvidere>
    );
};

describe('Hjelpere for spørringer på Ja/Nei-spørsmål', () => {
    test('finner spørsmål ut fra nøkkelstien og svaralternativene innenfor det', async () => {
        renderOmDeg({ adressebeskyttelse: false });

        const spørsmål = await ventPåSpørsmål('OM_DEG.borPaaRegistrertAdresse.sporsmal');

        expect(hentSvaralternativ(spørsmål, 'ja')).toBeInTheDocument();
        expect(hentSvaralternativ(spørsmål, 'nei')).toBeInTheDocument();
    });

    test('skiller spørsmål som vises samtidig', async () => {
        renderOmDeg({ adressebeskyttelse: false });

        const bosted = await ventPåSpørsmål('OM_DEG.borPaaRegistrertAdresse.sporsmal');
        const opphold = await ventPåSpørsmål('OM_DEG.vaertINorgeITolvMaaneder.sporsmal');

        expect(bosted).not.toBe(opphold);
        expect(screen.getAllByRole('radio', { name: 'FELLES.frittståendeOrd.ja' }).length).toBeGreaterThanOrEqual(2);
    });

    test('spørsmålFinnes gir false for spørsmål som ikke vises', async () => {
        renderOmDeg({ adresse: undefined, adressebeskyttelse: false });

        await ventPåSpørsmål('OM_DEG.vaertINorgeITolvMaaneder.sporsmal');

        expect(spørsmålFinnes('OM_DEG.borPaaRegistrertAdresse.sporsmal')).toBe(false);
    });
});
