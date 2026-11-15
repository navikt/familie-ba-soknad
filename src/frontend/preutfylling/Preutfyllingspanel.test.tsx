import { byggSuksessRessurs } from '@navikt/familie-typer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { lagBarn } from '@testutils/testdata/barnTestdata';
import { lagSøker } from '@testutils/testdata/søkerTestdata';
import { HttpResponse, http } from 'msw';
import { useLocation } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../../mocks/node';
import { urlMedBasePath } from '../../../mocks/utils';
import { ESøknadstype } from '../../common/typer/kontrakt/generelle';
import { useAppContext } from '../context/AppContext';
import { useEøsContext } from '../context/EøsContext';
import { useStegContext } from '../context/StegContext';
import { TestProvidere } from '../utils/testing';

import * as bygger from './byggPreutfyltSøknad';
import { Preutfyllingspanel } from './Preutfyllingspanel';
import { Avvik, avvikNavn, Scenario } from './scenario';
import { EKSTRA_BARN_IDENT } from './testoppsett';

const KNAPP_PREUTFYLL = 'Preutfyll og gå til oppsummering';
const FEIL_VELG_BARN = 'Velg minst ett barn, eller legg til et barn med fødselsnummer.';
const FELT_FØDSELSNUMMER = /^Legg til barn med fødselsnummer/;
const STI_OPPSUMMERING = '/oppsummering';

const TO_BARN = [
    lagBarn({ ident: '12345678987', navn: 'Barn En' }),
    lagBarn({ ident: '10832350120', navn: 'Barn To' }),
];

interface Tilstand {
    side: string;
    steg: string[];
    sisteUtfylteStegIndex: number;
    søknadstype: ESøknadstype;
    erEøs: boolean;
    barnISøknaden: string[];
    antallBarnMedSteg: number;
    søkerTriggerEøs: boolean;
    antallBarnSomTriggerEøs: number;
}

function VisTilstand() {
    const { pathname } = useLocation();
    const { søknad, sisteUtfylteStegIndex } = useAppContext();
    const { steg, barnForSteg } = useStegContext();
    const { søkerTriggerEøs, barnSomTriggerEøs } = useEøsContext();

    const tilstand: Tilstand = {
        side: pathname,
        steg: steg.map(etSteg => etSteg.path),
        sisteUtfylteStegIndex,
        søknadstype: søknad.søknadstype,
        erEøs: søknad.erEøs,
        barnISøknaden: søknad.barnInkludertISøknaden.map(barn => barn.ident),
        antallBarnMedSteg: barnForSteg.length,
        søkerTriggerEøs,
        antallBarnSomTriggerEøs: barnSomTriggerEøs.length,
    };

    return <output aria-label="Tilstand">{JSON.stringify(tilstand)}</output>;
}

const tilstand = (): Tilstand => JSON.parse(screen.getByRole('status', { name: 'Tilstand' }).textContent ?? '');

const åpnePanelet = async (søker = lagSøker()) => {
    render(
        <TestProvidere søker={søker}>
            <Preutfyllingspanel />
            <VisTilstand />
        </TestProvidere>
    );
    fireEvent.click(await screen.findByRole('button', { expanded: false }));
};

const trykkPreutfyll = () => fireEvent.click(screen.getByRole('button', { name: KNAPP_PREUTFYLL }));
const velgScenario = (scenario: Scenario) =>
    fireEvent.change(screen.getByRole('combobox', { name: 'Scenario' }), { target: { value: scenario } });
const skrivFødselsnummer = (ident: string) =>
    fireEvent.change(screen.getByRole('textbox', { name: FELT_FØDSELSNUMMER }), { target: { value: ident } });
const barnet = (navn: string) => screen.getByRole('checkbox', { name: new RegExp(`^${navn},`) });
const forventOppsummering = async () => {
    await waitFor(() => expect(tilstand().side).toBe(STI_OPPSUMMERING));
    expect(tilstand().sisteUtfylteStegIndex).toBe(tilstand().steg.indexOf(STI_OPPSUMMERING));
};
const eøsSteg = () => tilstand().steg.filter(sti => sti.startsWith('/eøs'));

describe('Preutfyllingspanel', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('skal sette en ordinær søknad og gå til oppsummeringen', async () => {
        await åpnePanelet();

        trykkPreutfyll();

        await forventOppsummering();
        expect(tilstand().søknadstype).toBe(ESøknadstype.ORDINÆR);
        expect(tilstand().barnISøknaden).toHaveLength(1);
        expect(tilstand().antallBarnMedSteg).toBe(1);
        expect(eøsSteg()).toEqual([]);
    });

    it('skal bare vises på forsiden', async () => {
        await åpnePanelet();

        trykkPreutfyll();

        await forventOppsummering();
        expect(screen.queryByRole('button', { name: KNAPP_PREUTFYLL })).not.toBeInTheDocument();
    });

    it('skal gi EØS-steg for søkeren og hvert barn når søkeren arbeider i et EØS-land', async () => {
        await åpnePanelet(lagSøker({ barn: TO_BARN }));
        velgScenario(Scenario.EØS_SØKER);
        fireEvent.click(barnet('Barn En'));
        fireEvent.click(barnet('Barn To'));

        trykkPreutfyll();

        await forventOppsummering();
        expect(tilstand().barnISøknaden).toEqual(TO_BARN.map(barn => barn.ident));
        expect(tilstand().erEøs).toBe(true);
        expect(tilstand().søkerTriggerEøs).toBe(true);
        expect(eøsSteg()).toHaveLength(3);
    });

    it('skal gi EØS-steg når barna utløser EØS', async () => {
        await åpnePanelet();
        velgScenario(Scenario.EØS_BARN);

        trykkPreutfyll();

        await forventOppsummering();
        expect(tilstand().søkerTriggerEøs).toBe(false);
        expect(tilstand().antallBarnSomTriggerEøs).toBe(1);
        expect(eøsSteg()).toHaveLength(2);
    });

    it('skal spørre hvilke barn søknaden gjelder når søkeren har flere barn', async () => {
        await åpnePanelet(lagSøker({ barn: TO_BARN }));
        expect(barnet('Barn En')).not.toBeChecked();
        expect(barnet('Barn To')).not.toBeChecked();

        trykkPreutfyll();

        expect(await screen.findByText(FEIL_VELG_BARN)).toBeInTheDocument();
        expect(tilstand().side).toBe('/');

        fireEvent.click(barnet('Barn To'));

        await waitFor(() => expect(screen.queryByText(FEIL_VELG_BARN)).not.toBeInTheDocument());
        trykkPreutfyll();
        await forventOppsummering();
        expect(tilstand().barnISøknaden).toEqual([TO_BARN[1].ident]);
    });

    it('skal kunne søke bare for et barn lagt til med fødselsnummer når søkeren har ett barn', async () => {
        await åpnePanelet(lagSøker({ barn: [TO_BARN[0]] }));
        expect(barnet('Barn En')).toBeChecked();
        fireEvent.click(barnet('Barn En'));
        skrivFødselsnummer(EKSTRA_BARN_IDENT);

        trykkPreutfyll();

        await forventOppsummering();
        expect(tilstand().barnISøknaden).toEqual([EKSTRA_BARN_IDENT]);
    });

    it('skal fjerne mellomrom i fødselsnummeret', async () => {
        await åpnePanelet();

        skrivFødselsnummer('158590 40087');

        expect(screen.getByRole('textbox', { name: FELT_FØDSELSNUMMER })).toHaveValue(EKSTRA_BARN_IDENT);
    });

    it('skal kreve et fødselsnummer når søkeren ikke har barn', async () => {
        await åpnePanelet(lagSøker({ barn: [] }));

        trykkPreutfyll();

        await waitFor(() =>
            expect(screen.getByRole('textbox', { name: FELT_FØDSELSNUMMER })).toHaveAccessibleDescription(
                expect.stringContaining(FEIL_VELG_BARN)
            )
        );
        expect(tilstand().side).toBe('/');
    });

    it.each([
        { grunn: 'som ikke er gyldig', ident: '12345678901', feilmelding: 'Fødselsnummeret er ikke gyldig.' },
        {
            grunn: 'som allerede er hentet fra folkeregisteret',
            ident: TO_BARN[0].ident,
            feilmelding: 'Barnet med dette fødselsnummeret er allerede hentet fra folkeregisteret.',
        },
    ])('skal avvise et fødselsnummer $grunn', async ({ ident, feilmelding }) => {
        await åpnePanelet(lagSøker({ barn: [TO_BARN[0]] }));
        skrivFødselsnummer(ident);

        trykkPreutfyll();

        expect(await screen.findByText(feilmelding)).toBeInTheDocument();
        expect(tilstand().side).toBe('/');
    });

    it('skal avvise valg som ikke kan kombineres, til testeren endrer dem', async () => {
        await åpnePanelet();
        velgScenario(Scenario.EØS_ANDRE_FORELDER);
        fireEvent.click(screen.getByRole('checkbox', { name: avvikNavn[Avvik.FOSTERBARN] }));

        trykkPreutfyll();

        expect(await screen.findByText(/^Fosterbarn kan ikke kombineres med scenarioet/)).toBeInTheDocument();
        expect(tilstand().side).toBe('/');
        expect(tilstand().barnISøknaden).toEqual([]);

        velgScenario(Scenario.EØS_SØKER);

        await waitFor(() => expect(screen.queryByText(/^Fosterbarn kan ikke kombineres/)).not.toBeInTheDocument());
    });

    it('skal vise en feilmelding når søknaden ikke lar seg lage', async () => {
        vi.spyOn(bygger, 'byggPreutfyltSøknad').mockImplementationOnce(() => {
            throw new Error('Feil i byggingen');
        });
        await åpnePanelet();

        trykkPreutfyll();

        expect(await screen.findByText('Feil i byggingen')).toBeInTheDocument();
        expect(tilstand().side).toBe('/');
    });

    it('skal vise en feilmelding når kodeverket ikke har EØS-landet verktøyet bruker', async () => {
        server.use(http.get(urlMedBasePath('api/kodeverk/eos-land'), () => HttpResponse.json(byggSuksessRessurs({}))));
        await åpnePanelet();

        trykkPreutfyll();

        expect(await screen.findByText('Kodeverket har ikke DNK som EØS-land.')).toBeInTheDocument();
        expect(tilstand().side).toBe('/');
    });

    it('skal ikke vise navn og fødselsnummer for barn med adressebeskyttelse', async () => {
        const barn = lagBarn({ ident: '12345678987', navn: 'Barn En', adressebeskyttelse: true });

        await åpnePanelet(lagSøker({ barn: [barn] }));

        expect(screen.getByRole('checkbox', { name: /^Barn med adressebeskyttelse/ })).toBeChecked();
        expect(screen.queryByText(/Barn En/)).not.toBeInTheDocument();
        expect(screen.queryByText(/123456/)).not.toBeInTheDocument();
    });
});
