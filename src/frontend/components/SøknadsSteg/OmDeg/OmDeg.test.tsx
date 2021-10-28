import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ISøker } from '../../../typer/person';
import {
    mekkGyldigSøknad,
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmDeg from './OmDeg';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';

jest.mock('nav-frontend-alertstriper', () => ({ children }) => (
    <div data-testid="alertstripe">{children}</div>
));

const TestKomponent = () => (
    <TestProvidere>
        <OmDeg />
    </TestProvidere>
);

const TestKomponentMedEkteTekster = () => (
    <TestProvidereMedEkteTekster>
        <OmDeg />
    </TestProvidereMedEkteTekster>
);

describe('OmDeg', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        mockEøs();
        mockHistory(['/om-deg']);
    });

    test('Alle tekster finnes i språkfil', async () => {
        const { søker } = mekkGyldigSøknad();
        const søkerMedSvarSomViserAlleTekster: ISøker = {
            ...søker,
            oppholderSegINorge: { ...søker.oppholderSegINorge, svar: ESvar.NEI },
            værtINorgeITolvMåneder: { ...søker.oppholderSegINorge, svar: ESvar.NEI },
            planleggerÅBoINorgeTolvMnd: { ...søker.planleggerÅBoINorgeTolvMnd, svar: ESvar.NEI },
        };
        spyOnUseApp({ søker: søkerMedSvarSomViserAlleTekster });

        const { findAllByTestId } = render(<TestKomponentMedEkteTekster />);

        søkerMedSvarSomViserAlleTekster.borPåRegistrertAdresse.svar = ESvar.NEI;
        render(<TestKomponentMedEkteTekster />);

        søkerMedSvarSomViserAlleTekster.adresse = undefined;
        søkerMedSvarSomViserAlleTekster.adressebeskyttelse = false;
        render(<TestKomponentMedEkteTekster />);

        // Vent på effect i AppContext så vi ikke får advarsel om act
        await findAllByTestId(/alertstripe/);
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('Skal rendre alertstripe i OmDeg', async () => {
        spyOnUseApp({ søker: mockDeep<ISøker>({ statsborgerskap: [] }) });
        const { findAllByTestId } = render(<TestKomponentMedEkteTekster />);
        expect(await findAllByTestId(/alertstripe/)).toHaveLength(1);
    });

    test('Viser adressesperre-melding', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { findByText } = render(<TestKomponent />);

        expect(await findByText(/omdeg.personopplysninger.adresse-sperret/)).toBeInTheDocument();
        expect(
            await findByText(/omdeg.personopplysninger.adressesperre.alert/)
        ).toBeInTheDocument();
    });

    test('Kan ikke gå videre i søknad ved adresse som er ukjent', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText, findAllByTestId } = render(<TestKomponent />);
        // Lar async useEffect i AppContext bli ferdig
        await findAllByTestId('alertstripe');

        expect(
            queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])
        ).not.toBeInTheDocument();
    });

    test('Kan gå videre hvis søker har adresse og ikke sperre', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
                borPåRegistrertAdresse: { id: OmDegSpørsmålId.borPåRegistrertAdresse, svar: null },
                oppholderSegINorge: { id: OmDegSpørsmålId.oppholderSegINorge, svar: null },
                værtINorgeITolvMåneder: { id: OmDegSpørsmålId.værtINorgeITolvMåneder, svar: null },
            }),
        });
        const { queryByText, findByText } = render(<TestKomponent />);

        expect(queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])).toBeInTheDocument();

        const jaKnapp = await findByText(/felles.svaralternativ.ja/);
        act(() => jaKnapp.click());

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-oppholder-seg-i-norge'])
        ).toBeInTheDocument();
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText, findAllByTestId } = render(<TestKomponent />);
        // Lar async useEffect i AppContext bli ferdig
        await findAllByTestId('alertstripe');

        expect(
            queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])
        ).not.toBeInTheDocument();

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-oppholder-seg-i-norge'])
        ).toBeInTheDocument();

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-vært-i-norge-sammenhengende-tolv-måneder'])
        ).toBeInTheDocument();
    });
});
