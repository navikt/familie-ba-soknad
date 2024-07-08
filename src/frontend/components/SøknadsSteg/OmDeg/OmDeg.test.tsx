import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ISøker } from '../../../typer/person';
import {
    mekkGyldigSøknad,
    mockEøs,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';

import OmDeg from './OmDeg';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';

const TestKomponent = () => (
    <TestProvidere mocketNettleserHistorikk={['/om-deg']}>
        <OmDeg />
    </TestProvidere>
);

const TestKomponentMedEkteTekster = () => (
    <TestProvidereMedEkteTekster mocketNettleserHistorikk={['/om-deg']}>
        <OmDeg />
    </TestProvidereMedEkteTekster>
);

describe('OmDeg', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        mockEøs();
    });

    test('Alle tekster finnes i språkfil', async () => {
        const { søker } = mekkGyldigSøknad();
        const søkerMedSvarSomViserAlleTekster: ISøker = {
            ...søker,
            værtINorgeITolvMåneder: { ...søker.værtINorgeITolvMåneder, svar: ESvar.NEI },
            planleggerÅBoINorgeTolvMnd: { ...søker.planleggerÅBoINorgeTolvMnd, svar: ESvar.NEI },
        };
        spyOnUseApp({ søker: søkerMedSvarSomViserAlleTekster });
        søkerMedSvarSomViserAlleTekster.adresse = null;
        søkerMedSvarSomViserAlleTekster.adressebeskyttelse = false;
        const { findAllByTestId } = render(<TestKomponentMedEkteTekster />);

        // Vent på effect i AppContext så vi ikke får advarsel om act
        await findAllByTestId(/alertstripe/);
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('Alle tekster finnes når man svarer at man ikke bor på registrert adresse', () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                borPåRegistrertAdresse: {
                    id: OmDegSpørsmålId.borPåRegistrertAdresse,
                    svar: ESvar.NEI,
                },
            }),
        });

        render(<TestKomponentMedEkteTekster />);
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('Skal få en alert dersom bruker ikke bor på folkeregistret adresse', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                borPåRegistrertAdresse: {
                    id: OmDegSpørsmålId.borPåRegistrertAdresse,
                    svar: ESvar.NEI,
                },
            }),
        });

        const { findAllByTestId } = render(<TestKomponentMedEkteTekster />);
        expect(await findAllByTestId(/alertstripe-adresse/)).toHaveLength(1);
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

        expect(
            await findByText(/omdeg.personopplysninger.adressesperre.alert/)
        ).toBeInTheDocument();
    });

    test('Kan gå videre i søknad ved adresse som er ukjent, får ikke spm om bosted, men opphold i norge', async () => {
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
            queryByText(omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse])
        ).not.toBeInTheDocument();
        expect(
            queryByText(omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder])
        ).toBeInTheDocument();
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
        const { queryByText } = render(<TestKomponent />);

        expect(queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])).toBeInTheDocument();
        expect(
            queryByText(omDegSpørsmålSpråkId['søker-vært-i-norge-sammenhengende-tolv-måneder'])
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
            queryByText(omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse])
        ).not.toBeInTheDocument();

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-vært-i-norge-sammenhengende-tolv-måneder'])
        ).toBeInTheDocument();
    });
});
