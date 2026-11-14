import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { lagBarn } from '@testutils/testdata/barnTestdata';
import { lagSøker } from '@testutils/testdata/søkerTestdata';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { ESøknadstype } from '../../common/typer/kontrakt/generelle';
import { useAppContext } from '../context/AppContext';
import { useEøsContext } from '../context/EøsContext';
import { useStegContext } from '../context/StegContext';
import { TestProvidere } from '../utils/testing';

import Preutfyllingspanel from './Preutfyllingspanel';
import { Avvik, avvikNavn, Scenario } from './scenario';
import { EKSTRA_BARN_IDENT } from './testoppsett';

const PREUTFYLL = 'Preutfyll og gå til oppsummering';
const VELG_BARN = 'Velg minst ett barn, eller legg til et barn med fødselsnummer.';
const EKSTRA_BARN = /^Legg til barn med fødselsnummer/;

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

const besøkteSider: string[] = [];
let tilstand: Tilstand;

const Sonde = () => {
    const { pathname, key } = useLocation();
    const { søknad, sisteUtfylteStegIndex } = useAppContext();
    const { steg, barnForSteg } = useStegContext();
    const { søkerTriggerEøs, barnSomTriggerEøs } = useEøsContext();

    // biome-ignore lint/correctness/useExhaustiveDependencies: effekten skal kjøre for hver navigering
    useEffect(() => {
        besøkteSider.push(pathname);
    }, [key]);

    tilstand = {
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
    return null;
};

const åpnePanelet = async (søker = lagSøker()) => {
    render(
        <TestProvidere søker={søker}>
            <Preutfyllingspanel />
            <Sonde />
        </TestProvidere>
    );
    fireEvent.click(await screen.findByRole('button', { expanded: false }));
};

const preutfyll = () => act(async () => fireEvent.click(screen.getByRole('button', { name: PREUTFYLL })));
const barnet = (navn: string) => screen.getByRole('checkbox', { name: new RegExp(`^${navn},`) });
const eøsSteg = () => tilstand.steg.filter(sti => sti.startsWith('/eøs'));

describe('Preutfyllingspanel', () => {
    beforeEach(() => {
        besøkteSider.length = 0;
    });

    it('skal sette en ordinær søknad og gå én gang til oppsummeringen', async () => {
        await åpnePanelet(lagSøker());

        await preutfyll();

        await waitFor(() => expect(tilstand.side).toBe('/oppsummering'));
        expect(besøkteSider).toEqual(['/', '/oppsummering']);
        expect(tilstand.søknadstype).toBe(ESøknadstype.ORDINÆR);
        expect(tilstand.barnISøknaden).toHaveLength(1);
        expect(tilstand.antallBarnMedSteg).toBe(1);
        expect(eøsSteg()).toEqual([]);
        expect(tilstand.sisteUtfylteStegIndex).toBe(tilstand.steg.indexOf('/oppsummering'));
        expect(screen.queryByRole('button', { name: PREUTFYLL })).not.toBeInTheDocument();
    });

    it('skal gi EØS-steg for søkeren og hvert barn når søkeren arbeider i et EØS-land', async () => {
        await åpnePanelet(lagSøker({ barn: TO_BARN }));
        fireEvent.change(screen.getByRole('combobox', { name: 'Scenario' }), { target: { value: Scenario.EØS_SØKER } });
        fireEvent.click(barnet('Barn En'));
        fireEvent.click(barnet('Barn To'));

        await preutfyll();

        await waitFor(() => expect(tilstand.side).toBe('/oppsummering'));
        expect(besøkteSider).toEqual(['/', '/oppsummering']);
        expect(tilstand.barnISøknaden).toEqual(TO_BARN.map(barn => barn.ident));
        expect(tilstand.erEøs).toBe(true);
        expect(tilstand.søkerTriggerEøs).toBe(true);
        expect(eøsSteg()).toHaveLength(3);
        expect(tilstand.sisteUtfylteStegIndex).toBe(tilstand.steg.indexOf('/oppsummering'));
    });

    it('skal gi EØS-steg når barna utløser EØS', async () => {
        await åpnePanelet(lagSøker());
        fireEvent.change(screen.getByRole('combobox', { name: 'Scenario' }), { target: { value: Scenario.EØS_BARN } });

        await preutfyll();

        await waitFor(() => expect(tilstand.side).toBe('/oppsummering'));
        expect(tilstand.søkerTriggerEøs).toBe(false);
        expect(tilstand.antallBarnSomTriggerEøs).toBe(1);
        expect(eøsSteg()).toHaveLength(2);
    });

    it('skal spørre hvilke barn søknaden gjelder når søkeren har flere barn', async () => {
        await åpnePanelet(lagSøker({ barn: TO_BARN }));
        expect(barnet('Barn En')).not.toBeChecked();
        expect(barnet('Barn To')).not.toBeChecked();

        await preutfyll();

        expect(screen.getByText(VELG_BARN)).toBeInTheDocument();
        expect(tilstand.side).toBe('/');
        fireEvent.click(barnet('Barn To'));
        expect(screen.queryByText(VELG_BARN)).not.toBeInTheDocument();
        await preutfyll();
        await waitFor(() => expect(tilstand.side).toBe('/oppsummering'));
        expect(tilstand.barnISøknaden).toEqual([TO_BARN[1].ident]);
    });

    it('skal kunne søke bare for et barn lagt til med fødselsnummer når søkeren har ett barn', async () => {
        await åpnePanelet(lagSøker({ barn: [TO_BARN[0]] }));
        expect(barnet('Barn En')).toBeChecked();
        fireEvent.click(barnet('Barn En'));
        fireEvent.change(screen.getByRole('textbox', { name: EKSTRA_BARN }), { target: { value: '158590 40087' } });

        await preutfyll();

        await waitFor(() => expect(tilstand.side).toBe('/oppsummering'));
        expect(tilstand.barnISøknaden).toEqual([EKSTRA_BARN_IDENT]);
    });

    it('skal vise feilen på feltet for fødselsnummer når søkeren ikke har barn', async () => {
        await åpnePanelet(lagSøker({ barn: [] }));

        await preutfyll();

        expect(screen.getByRole('textbox', { name: EKSTRA_BARN })).toHaveAccessibleDescription(
            expect.stringContaining(VELG_BARN)
        );
        expect(tilstand.side).toBe('/');
    });

    it.each([
        { ident: '12345678901', feilmelding: 'Fødselsnummeret er ikke gyldig.' },
        {
            ident: TO_BARN[0].ident,
            feilmelding: 'Barnet med dette fødselsnummeret er allerede hentet fra folkeregisteret.',
        },
    ])('skal avvise fødselsnummeret $ident', async ({ ident, feilmelding }) => {
        await åpnePanelet(lagSøker({ barn: [TO_BARN[0]] }));
        fireEvent.change(screen.getByRole('textbox', { name: EKSTRA_BARN }), { target: { value: ident } });

        await preutfyll();

        expect(screen.getByText(feilmelding)).toBeInTheDocument();
        expect(tilstand.side).toBe('/');
    });

    it('skal avvise valg som ikke kan kombineres', async () => {
        await åpnePanelet(lagSøker());
        fireEvent.click(screen.getByRole('checkbox', { name: avvikNavn[Avvik.FOSTERBARN] }));
        fireEvent.click(screen.getByRole('checkbox', { name: avvikNavn[Avvik.DELT_BOSTED] }));

        await preutfyll();

        expect(screen.getByText('Fosterbarn kan ikke kombineres med avtale om delt bosted.')).toBeInTheDocument();
        expect(tilstand.side).toBe('/');
        expect(tilstand.barnISøknaden).toEqual([]);
    });

    it('skal ikke vise navn og fødselsnummer for barn med adressebeskyttelse', async () => {
        const barn = lagBarn({ ident: '12345678987', navn: 'Barn En', adressebeskyttelse: true });

        await åpnePanelet(lagSøker({ barn: [barn] }));

        expect(screen.getByRole('checkbox', { name: /^Barn med adressebeskyttelse/ })).toBeChecked();
        expect(screen.queryByText(/Barn En/)).not.toBeInTheDocument();
        expect(screen.queryByText(/123456/)).not.toBeInTheDocument();
    });
});
