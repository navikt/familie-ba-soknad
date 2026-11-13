import {
    BodyShort,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Page,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';
import { hentDataFraRessurs } from '@navikt/familie-typer';
import type { Alpha3Code } from 'i18n-iso-countries';
import { type FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAppContext } from '../context/AppContext';
import { useEøsContext } from '../context/EøsContext';
import { useStegContext } from '../context/StegContext';
import type { IBarn } from '../typer/person';
import { RouteEnum } from '../typer/routes';
import { formaterFnr } from '../utils/visning';

import { byggPreutfyltSøknad, finnUgyldigKombinasjon } from './byggPreutfyltSøknad';
import { Avvik, avvikNavn, Scenario, scenarioNavn } from './scenario';

const FORETRUKKET_EØS_LAND: Alpha3Code = 'DNK';

interface Feilmeldinger {
    valg?: string;
    barn?: string;
    ekstraBarnIdent?: string;
}

const barnetsEtikett = (barn: IBarn) =>
    [barn.navn, formaterFnr(barn.ident), barn.alder && `${barn.alder} år`].filter(Boolean).join(', ');

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

    const barnFraFolkeregisteret = søknad.søker.barn;
    const måVelgeBarn = barnFraFolkeregisteret.length > 1;

    const [scenario, settScenario] = useState(Scenario.ORDINÆR);
    const [avvik, settAvvik] = useState<Avvik[]>([]);
    const [valgteBarnIder, settValgteBarnIder] = useState<string[]>([]);
    const [ekstraBarnIdent, settEkstraBarnIdent] = useState('');
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});
    const [skalGåTilOppsummering, settSkalGåTilOppsummering] = useState(false);

    // Stegene avhenger av barna og EØS-svarene, så oppsummeringen finnes først etter at søknaden er satt.
    useEffect(() => {
        if (skalGåTilOppsummering) {
            const oppsummeringIndeks = steg.findIndex(etSteg => etSteg.route === RouteEnum.Oppsummering);
            settSisteUtfylteStegIndex(oppsummeringIndeks);
            navigate(steg[oppsummeringIndeks].path);
            settSkalGåTilOppsummering(false);
        }
    }, [skalGåTilOppsummering, steg, settSisteUtfylteStegIndex, navigate]);

    if (pathname !== '/' || !systemetOK()) {
        return null;
    }

    const eøsLandkoder = Object.keys(hentDataFraRessurs(eøsLand) ?? {}) as Alpha3Code[];
    const landForEøsScenarioer = eøsLandkoder.includes(FORETRUKKET_EØS_LAND) ? FORETRUKKET_EØS_LAND : eøsLandkoder[0];

    const preutfyll = (event: FormEvent) => {
        event.preventDefault();

        const ident = ekstraBarnIdent.replace(/\s/g, '');
        const barnIder = måVelgeBarn ? valgteBarnIder : barnFraFolkeregisteret.map(barn => barn.id);

        const feil: Feilmeldinger = {};
        if (ident && !/^\d{11}$/.test(ident)) {
            feil.ekstraBarnIdent = 'Fødselsnummeret må ha 11 siffer.';
        } else if (barnFraFolkeregisteret.some(barn => barn.ident === ident)) {
            feil.ekstraBarnIdent = 'Barnet med dette fødselsnummeret er allerede hentet fra folkeregisteret.';
        }
        if (barnIder.length === 0 && !ident) {
            const melding = 'Velg minst ett barn, eller legg til et barn med fødselsnummer.';
            if (måVelgeBarn) {
                feil.barn = melding;
            } else {
                feil.ekstraBarnIdent = melding;
            }
        }
        feil.valg = landForEøsScenarioer
            ? finnUgyldigKombinasjon({ scenario, avvik })
            : 'Fant ingen EØS-land i kodeverket.';

        settFeilmeldinger(feil);
        if (feil.valg || feil.barn || feil.ekstraBarnIdent) {
            return;
        }

        const preutfyltSøknad = byggPreutfyltSøknad(søknad, {
            scenario,
            avvik,
            valgteBarnIder: barnIder,
            ekstraBarnIdent: ident || undefined,
            eøsLand: landForEøsScenarioer,
        });

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
            <Box
                as="section"
                aria-labelledby="preutfylling-tittel"
                padding="space-24"
                marginBlock="space-24"
                borderWidth="2"
                borderRadius="12"
                borderColor="warning"
                background="warning-soft"
            >
                <form onSubmit={preutfyll}>
                    <VStack gap="space-20">
                        <div>
                            <Heading id="preutfylling-tittel" level="2" size="small" spacing>
                                Testverktøy: preutfyll søknaden
                            </Heading>
                            <BodyShort>
                                Vises bare i testmiljø. Fyller ut hele søknaden for den innloggede testpersonen og tar
                                deg til oppsummeringen, der du kan se over svarene før du sender inn.
                            </BodyShort>
                        </div>
                        <Select
                            label="Scenario"
                            value={scenario}
                            onChange={event => settScenario(event.target.value as Scenario)}
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
                            onChange={settAvvik}
                            error={feilmeldinger.valg}
                        >
                            {Object.values(Avvik).map(etAvvik => (
                                <Checkbox key={etAvvik} value={etAvvik}>
                                    {avvikNavn[etAvvik]}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                        {måVelgeBarn && (
                            <CheckboxGroup
                                legend="Hvilke barn skal søknaden gjelde?"
                                value={valgteBarnIder}
                                onChange={settValgteBarnIder}
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
                            onChange={event => settEkstraBarnIdent(event.target.value)}
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
            </Box>
        </Page.Block>
    );
};

export default Preutfyllingspanel;
