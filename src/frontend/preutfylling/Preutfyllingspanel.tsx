import { Box, Button, Checkbox, CheckboxGroup, ExpansionCard, Page, Select, TextField, VStack } from '@navikt/ds-react';
import { hentDataFraRessurs } from '@navikt/familie-typer';
import { idnr } from '@navikt/fnrvalidator';
import type { Alpha3Code } from 'i18n-iso-countries';
import { type FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAppContext } from '../context/AppContext';
import { useEøsContext } from '../context/EøsContext';
import { useStegContext } from '../context/StegContext';
import { ROUTES } from '../routes';
import type { IBarn } from '../typer/person';
import { RouteEnum } from '../typer/routes';
import type { ISøknad } from '../typer/søknad';
import { formaterFnr } from '../utils/visning';

import { byggPreutfyltSøknad, erEøsScenario, finnUgyldigKombinasjon } from './byggPreutfyltSøknad';
import { Avvik, avvikNavn, Scenario, scenarioNavn } from './scenario';

// Danmark er et EØS-land både i kodeverket i preprod og i testdataene. Mangler det, brukes det første EØS-landet.
const FORETRUKKET_EØS_LAND: Alpha3Code = 'DNK';

interface Feilmeldinger {
    scenario?: string;
    avvik?: string;
    barn?: string;
    ekstraBarnIdent?: string;
}

// Navn og fødselsnummer vises ikke for barn med adressebeskyttelse, slik som i steget «Velg barn».
const barnetsEtikett = (barn: IBarn) =>
    [
        ...(barn.adressebeskyttelse ? ['Barn med adressebeskyttelse'] : [barn.navn, formaterFnr(barn.ident)]),
        barn.alder && `${barn.alder} år`,
    ]
        .filter(Boolean)
        .join(', ');

/**
 * Testverktøy som fyller ut hele søknaden for den innloggede testpersonen og sender testeren til oppsummeringen.
 *
 * Panelet bruker bare det AppContext, StegContext og EøsContext allerede tilbyr, på samme måte som når en mellomlagret
 * søknad gjenopprettes (se fortsettPåSøknaden i useBekreftelseOgStartSoknad).
 */
const Preutfyllingspanel = () => {
    const { søknad, settSøknad, settSisteUtfylteStegIndex, eøsLand, systemetOK } = useAppContext();
    const { steg, settBarnForSteg } = useStegContext();
    const { settSøkerTriggerEøs, settBarnSomTriggerEøs } = useEøsContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [scenario, settScenario] = useState(Scenario.ORDINÆR);
    const [avvik, settAvvik] = useState<Avvik[]>([]);
    // Udefinert til testeren har valgt selv. Da er barnet forhåndsvalgt hvis søkeren bare har ett.
    const [valgteBarnIder, settValgteBarnIder] = useState<string[]>();
    const [ekstraBarnIdent, settEkstraBarnIdent] = useState('');
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});
    const [skalGåTilOppsummering, settSkalGåTilOppsummering] = useState(false);

    // Indeksen til oppsummeringen avhenger av barna og EØS-svarene, så den er først riktig etter at søknaden er satt.
    // Derfor skjer navigeringen i en effekt etter at søknaden er satt, og ikke i samme hendelse.
    const oppsummeringIndeks = steg.findIndex(etSteg => etSteg.route === RouteEnum.Oppsummering);
    useEffect(() => {
        if (skalGåTilOppsummering) {
            settSkalGåTilOppsummering(false);
            settSisteUtfylteStegIndex(oppsummeringIndeks);
            navigate(ROUTES[RouteEnum.Oppsummering].path);
        }
    }, [skalGåTilOppsummering, oppsummeringIndeks, settSisteUtfylteStegIndex, navigate]);

    if (pathname !== '/' || !systemetOK()) {
        return null;
    }

    const barnFraFolkeregisteret = søknad.søker.barn;
    const forhåndsvalgteBarnIder = barnFraFolkeregisteret.length === 1 ? [barnFraFolkeregisteret[0].id] : [];
    // Filtrerer på barna som finnes nå, siden id-ene byttes ut når en mellomlagret søknad gjenopprettes.
    const valgteBarn = barnFraFolkeregisteret.filter(barn =>
        (valgteBarnIder ?? forhåndsvalgteBarnIder).includes(barn.id)
    );

    const eøsLandkoder = Object.keys(hentDataFraRessurs(eøsLand) ?? {}) as Alpha3Code[];
    const landForEøsScenarioer = eøsLandkoder.includes(FORETRUKKET_EØS_LAND) ? FORETRUKKET_EØS_LAND : eøsLandkoder[0];

    // Feilmeldingene gjelder valgene som ble sendt inn, så de fjernes når testeren endrer noe.
    const endre =
        <Verdi,>(sett: (verdi: Verdi) => void) =>
        (verdi: Verdi) => {
            sett(verdi);
            settFeilmeldinger({});
        };

    const finnFeil = (ident: string): Feilmeldinger => {
        const feil: Feilmeldinger = {};

        if (barnFraFolkeregisteret.some(barn => barn.ident === ident)) {
            feil.ekstraBarnIdent = 'Barnet med dette fødselsnummeret er allerede hentet fra folkeregisteret.';
        } else if (ident && idnr(ident).status !== 'valid') {
            feil.ekstraBarnIdent = 'Fødselsnummeret er ikke gyldig.';
        }

        if (valgteBarn.length === 0 && !ident) {
            const melding = 'Velg minst ett barn, eller legg til et barn med fødselsnummer.';
            if (barnFraFolkeregisteret.length > 0) {
                feil.barn = melding;
            } else {
                feil.ekstraBarnIdent = melding;
            }
        }

        if (erEøsScenario(scenario) && !landForEøsScenarioer) {
            feil.scenario = 'Fant ingen EØS-land i kodeverket.';
        }
        feil.avvik = finnUgyldigKombinasjon({ scenario, avvik });

        return feil;
    };

    const preutfyll = (event: FormEvent) => {
        event.preventDefault();

        const ident = ekstraBarnIdent.replace(/\s/g, '');
        const feil = finnFeil(ident);
        settFeilmeldinger(feil);
        if (Object.values(feil).some(Boolean)) {
            return;
        }

        let preutfyltSøknad: ISøknad;
        try {
            preutfyltSøknad = byggPreutfyltSøknad(søknad, {
                scenario,
                avvik,
                barn: valgteBarn,
                ekstraBarnIdent: ident || undefined,
                eøsLand: landForEøsScenarioer ?? FORETRUKKET_EØS_LAND,
            });
        } catch (feilFraByggingen) {
            // Feil i en hendelse fanges ikke av Feilgrense, så de vises her i stedet for at klikket ikke gjør noe.
            console.error(feilFraByggingen);
            settFeilmeldinger({ scenario: 'Klarte ikke å lage søknaden. Se konsollen for detaljer.' });
            return;
        }

        settSøknad(preutfyltSøknad);
        settBarnForSteg(preutfyltSøknad.barnInkludertISøknaden);
        settSøkerTriggerEøs(preutfyltSøknad.søker.triggetEøs);
        settBarnSomTriggerEøs(
            preutfyltSøknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs).map(barn => barn.id)
        );
        settSkalGåTilOppsummering(true);
    };

    return (
        <Page.Block width="text" gutters>
            <Box marginBlock="space-24">
                <ExpansionCard aria-label="Testverktøy: preutfyll søknaden" size="small" data-color="warning">
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as="h2" size="small">
                            Testverktøy: preutfyll søknaden
                        </ExpansionCard.Title>
                        <ExpansionCard.Description>
                            Vises bare i testmiljø. Fyller ut hele søknaden for den innloggede testpersonen og tar deg
                            til oppsummeringen, der du kan se over svarene før du sender inn. En søknad du har påbegynt,
                            blir erstattet.
                        </ExpansionCard.Description>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <form onSubmit={preutfyll}>
                            <VStack gap="space-20">
                                <Select
                                    label="Scenario"
                                    value={scenario}
                                    onChange={event => endre(settScenario)(event.target.value as Scenario)}
                                    error={feilmeldinger.scenario}
                                >
                                    {Object.values(Scenario).map(etScenario => (
                                        <option key={etScenario} value={etScenario}>
                                            {scenarioNavn[etScenario]}
                                        </option>
                                    ))}
                                </Select>
                                <CheckboxGroup
                                    legend="Avvik (valgfritt)"
                                    description="Svar som avviker fra happy case. Avvikene som gjelder barn, gjelder alle barna i søknaden."
                                    value={avvik}
                                    onChange={endre(settAvvik)}
                                    error={feilmeldinger.avvik}
                                >
                                    {Object.values(Avvik).map(etAvvik => (
                                        <Checkbox key={etAvvik} value={etAvvik}>
                                            {avvikNavn[etAvvik]}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                                {barnFraFolkeregisteret.length > 0 && (
                                    <CheckboxGroup
                                        legend="Hvilke barn skal søknaden gjelde?"
                                        value={valgteBarn.map(barn => barn.id)}
                                        onChange={endre(settValgteBarnIder)}
                                        error={feilmeldinger.barn}
                                    >
                                        {barnFraFolkeregisteret.map(barn => (
                                            <Checkbox key={barn.id} value={barn.id}>
                                                {barnetsEtikett(barn)}
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                )}
                                <TextField
                                    label="Legg til barn med fødselsnummer (valgfritt)"
                                    description="For barn som ikke hentes fra folkeregisteret, for eksempel barn med adressebeskyttelse."
                                    value={ekstraBarnIdent}
                                    onChange={event => endre(settEkstraBarnIdent)(event.target.value)}
                                    inputMode="numeric"
                                    autoComplete="off"
                                    htmlSize={14}
                                    error={feilmeldinger.ekstraBarnIdent}
                                />
                                <div>
                                    <Button type="submit" variant="secondary">
                                        Preutfyll og gå til oppsummering
                                    </Button>
                                </div>
                            </VStack>
                        </form>
                    </ExpansionCard.Content>
                </ExpansionCard>
            </Box>
        </Page.Block>
    );
};

export default Preutfyllingspanel;
