import React, { useState } from 'react';

import { useNavigate } from 'react-router';

import { VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import { useStegContext } from '../../../context/StegContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import Steg from '../../Felleskomponenter/Steg/Steg';

import DinLivssituasjonOppsummering from './OppsummeringSteg/DinLivssituasjonOppsummering';
import EøsBarnOppsummering from './OppsummeringSteg/Eøs/EøsBarnOppsummering';
import EøsSøkerOppsummering from './OppsummeringSteg/Eøs/EøsSøkerOppsummering';
import OmBarnaOppsummering from './OppsummeringSteg/OmBarnaOppsummering';
import OmBarnetOppsummering from './OppsummeringSteg/OmBarnet/OmBarnetOppsummering';
import OmDegOppsummering from './OppsummeringSteg/OmDegOppsummering';
import VelgBarnOppsummering from './OppsummeringSteg/VelgBarnOppsummering';

const Oppsummering: React.FC = () => {
    const { søknad, tekster } = useApp();
    const { hentStegNummer } = useStegContext();
    const navigate = useNavigate();
    const [feilAnchors, settFeilAnchors] = useState<string[]>([]);
    const { barnSomTriggerEøs, søkerTriggerEøs } = useEøsContext();
    const søkerHarEøsSteg = søkerTriggerEøs || !!barnSomTriggerEøs.length;
    const barnSomHarEøsSteg: IBarnMedISøknad[] = søkerTriggerEøs
        ? søknad.barnInkludertISøknaden
        : søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs);

    const stegTekster = tekster()[ESanitySteg.OPPSUMMERING];
    const { oppsummeringTittel, oppsummeringGuide } = stegTekster;

    const scrollTilFeil = (elementId: string) => {
        // Gjør dette for syns skyld, men push scroller ikke vinduet
        navigate({ hash: elementId });
        const element = document.getElementById(elementId);
        if (element && element.scrollIntoView) {
            element.scrollIntoView();
        }
    };

    const gåVidereCallback = (): Promise<boolean> => {
        if (feilAnchors[0]) {
            scrollTilFeil(feilAnchors[0]);
        }
        return Promise.resolve(feilAnchors.length === 0);
    };

    return (
        <Steg
            tittel={<TekstBlock block={oppsummeringTittel} />}
            guide={oppsummeringGuide}
            gåVidereCallback={gåVidereCallback}
        >
            <VStack gap="12">
                <OmDegOppsummering settFeilAnchors={settFeilAnchors} />
                <DinLivssituasjonOppsummering settFeilAnchors={settFeilAnchors} />
                <VelgBarnOppsummering settFeilAnchors={settFeilAnchors} />
                <OmBarnaOppsummering settFeilAnchors={settFeilAnchors} />

                {søknad.barnInkludertISøknaden.map((barn, index) => {
                    const enIndeksert = index + 1;
                    const nummer = (hentStegNummer(RouteEnum.OmBarna) + enIndeksert).toString();
                    return (
                        <OmBarnetOppsummering
                            key={`om-barnet-${index}`}
                            barn={barn}
                            nummer={nummer}
                            settFeilAnchors={settFeilAnchors}
                            index={index}
                        />
                    );
                })}

                <>
                    {søkerHarEøsSteg && <EøsSøkerOppsummering settFeilAnchors={settFeilAnchors} />}
                    {barnSomHarEøsSteg.map((barn, index) => {
                        const enIndeksert = index + 1;
                        const nummer = (
                            hentStegNummer(RouteEnum.EøsForSøker) + enIndeksert
                        ).toString();
                        return (
                            <EøsBarnOppsummering
                                key={`om-barnet-eøs-${index}`}
                                nummer={nummer}
                                settFeilAnchors={settFeilAnchors}
                                barn={barn}
                            />
                        );
                    })}
                </>
            </VStack>
        </Steg>
    );
};

export default Oppsummering;
