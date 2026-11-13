import { RessursStatus } from '@navikt/familie-typer';

import { ESivilstand } from '../../common/typer/kontrakt/generelle';
import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import type { IBarn, ISøker } from '../typer/person';
import { type ISøknad, initialStateSøknad } from '../typer/søknad';
import { spyOnUseApp } from '../utils/testing';

import { byggPreutfyltSøknad, finnUgyldigKombinasjon, type Preutfyllingsvalg } from './byggPreutfyltSøknad';
import { Avvik, Scenario } from './scenario';

// Felles oppsett for testene i denne mappen. Brukes ikke av selve verktøyet.

export const EØS_LAND = 'BEL';
export const EKSTRA_BARN_IDENT = '15859040087';

export const BARN: IBarn[] = [
    { id: 'barn-1', navn: 'Barn En', ident: '12345678987', alder: '4', borMedSøker: true, adressebeskyttelse: false },
    { id: 'barn-2', navn: 'Barn To', ident: '10832350120', alder: '2', borMedSøker: false, adressebeskyttelse: false },
    { id: 'barn-3', navn: 'Barn Tre', ident: '10832350121', alder: '17', borMedSøker: true, adressebeskyttelse: true },
];

export interface Tilfelle {
    navn: string;
    valg: Partial<Preutfyllingsvalg>;
    søker?: Partial<ISøker>;
}

/** Søknaden slik den ser ut på forsiden: opplysningene fra folkeregisteret er hentet, og ingenting er besvart. */
const søknadPåForsiden = (søker: Partial<ISøker> = {}): ISøknad => {
    const søknad = initialStateSøknad();
    const sivilstand = søker.sivilstand ?? { type: ESivilstand.GIFT };

    return {
        ...søknad,
        søker: {
            ...søknad.søker,
            navn: 'Voksen Voksnessen',
            ident: '23058518298',
            statsborgerskap: [{ landkode: 'NOR' }],
            adresse: {
                adressenavn: 'Solveien',
                husnummer: '2',
                husbokstav: 'A',
                bruksenhetsnummer: 'H0101',
                postnummer: '2304',
                poststed: 'HAMAR',
            },
            barn: BARN,
            ...søker,
            sivilstand,
            utvidet: {
                ...søknad.søker.utvidet,
                spørsmål: {
                    ...søknad.søker.utvidet.spørsmål,
                    // AppContext velger id-en ut fra sivilstanden når søkeren hentes.
                    harSamboerNå: {
                        ...søknad.søker.utvidet.spørsmål.harSamboerNå,
                        id:
                            sivilstand.type === ESivilstand.GIFT
                                ? DinLivssituasjonSpørsmålId.harSamboerNåGift
                                : DinLivssituasjonSpørsmålId.harSamboerNå,
                    },
                },
            },
        },
    };
};

export const preutfyll = ({ valg, søker }: Pick<Tilfelle, 'valg' | 'søker'>) =>
    byggPreutfyltSøknad(søknadPåForsiden(søker), {
        scenario: Scenario.ORDINÆR,
        avvik: [],
        barn: BARN,
        eøsLand: EØS_LAND,
        ...valg,
    });

/** Bruker søknaden i stedet for den ekte AppContext, med et kodeverk der landet i EØS-scenarioene er et EØS-land. */
export const brukSøknad = (søknad: ISøknad) => {
    const spion = spyOnUseApp(søknad);
    spion.useAppMock.mockReturnValue({
        ...spion.useAppMock(),
        eøsLand: { status: RessursStatus.SUKSESS, data: { [EØS_LAND]: 'Belgia' } },
    });
    return spion;
};

const ALLE_AVVIK = Object.values(Avvik);

const KOMBINASJONER_AV_AVVIK: Avvik[][] = [
    [],
    ALLE_AVVIK.filter(avvik => avvik !== Avvik.FOSTERBARN),
    ALLE_AVVIK.filter(avvik => avvik !== Avvik.DELT_BOSTED),
    [Avvik.FOSTERBARN, Avvik.INSTITUSJON, Avvik.BOR_IKKE_FAST_MED_SØKER],
];

const medAvvik = (scenario: Scenario, avvik: Avvik[]): Tilfelle => ({
    navn: `${scenario} med avvik [${avvik.join(', ')}]`,
    valg: { scenario, avvik },
});

const medSivilstand = (scenario: Scenario, type: ESivilstand): Tilfelle => ({
    navn: `${scenario} for en søker med sivilstand ${type}`,
    valg: { scenario },
    søker: { sivilstand: { type } },
});

const medAndreSøkereOgBarn = (scenario: Scenario): Tilfelle[] => [
    {
        navn: `${scenario} for en søker med adressebeskyttelse og bare et barn lagt til med fødselsnummer`,
        valg: { scenario, barn: [], ekstraBarnIdent: EKSTRA_BARN_IDENT },
        søker: { adresse: null, adressebeskyttelse: true, barn: [] },
    },
    {
        navn: `${scenario} for ett barn fra folkeregisteret og ett lagt til med fødselsnummer`,
        valg: { scenario, barn: [BARN[1]], ekstraBarnIdent: EKSTRA_BARN_IDENT },
    },
    {
        navn: `${scenario} for en søker uten registrert adresse`,
        valg: { scenario, barn: [BARN[0]] },
        søker: { adresse: null },
    },
];

/** Alle scenarioene uten avvik og med kombinasjoner av avvik. */
export const TILFELLER_MED_KOMBINASJONER: Tilfelle[] = Object.values(Scenario).flatMap(scenario =>
    KOMBINASJONER_AV_AVVIK.filter(avvik => !finnUgyldigKombinasjon({ scenario, avvik })).map(avvik =>
        medAvvik(scenario, avvik)
    )
);

/** Sivilstanden styrer spørsmålene i utvidet barnetrygd og spørsmålet om avdød partner. */
export const TILFELLER_MED_SIVILSTAND: Tilfelle[] = [
    ...Object.values(ESivilstand).map(type => medSivilstand(Scenario.UTVIDET, type)),
    medSivilstand(Scenario.ORDINÆR, ESivilstand.ENKE_ELLER_ENKEMANN),
    medSivilstand(Scenario.EØS_SØKER, ESivilstand.GJENLEVENDE_PARTNER),
];

/**
 * Alle tilfellene testene kjøres for. Hvert avvik alene, sivilstandene og de andre søkerne prøves bare der de gir andre
 * svar, for å holde testene raske.
 */
export const TILFELLER: Tilfelle[] = [
    ...TILFELLER_MED_KOMBINASJONER,
    ...ALLE_AVVIK.map(avvik => medAvvik(Scenario.ORDINÆR, [avvik])),
    ...TILFELLER_MED_SIVILSTAND,
    ...medAndreSøkereOgBarn(Scenario.ORDINÆR),
    ...medAndreSøkereOgBarn(Scenario.EØS_ANDRE_FORELDER),
];

export const erEøs = (tilfelle: Tilfelle) =>
    [Scenario.EØS_SØKER, Scenario.EØS_BARN, Scenario.EØS_ANDRE_FORELDER].includes(tilfelle.valg.scenario as Scenario);
