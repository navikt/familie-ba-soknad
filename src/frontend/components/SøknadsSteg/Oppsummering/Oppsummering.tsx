import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useSteg } from '../../../context/StegContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

// import DinLivssituasjonOppsummering from './OppsummeringSteg/DinLivssituasjonOppsummering';
import EøsBarnOppsummering from './OppsummeringSteg/Eøs/EøsBarnOppsummering';
import EøsSøkerOppsummering from './OppsummeringSteg/Eøs/EøsSøkerOppsummering';
// import OmBarnaOppsummering from './OppsummeringSteg/OmBarnaOppsummering';
import OmBarnetOppsummering from './OppsummeringSteg/OmBarnet/OmBarnetOppsummering';
// import OmDegOppsummering from './OppsummeringSteg/OmDegOppsummering';
// import VelgBarnOppsummering from './OppsummeringSteg/VelgBarnOppsummering';

const Oppsummering: React.FC = () => {
    const { søknad, tekster } = useApp();
    const { hentStegNummer } = useSteg();
    const navigate = useNavigate();
    const [feilAnchors, settFeilAnchors] = useState<string[]>([]);
    const { barnSomTriggerEøs, søkerTriggerEøs } = useEøs();
    const søkerHarEøsSteg = søkerTriggerEøs || !!barnSomTriggerEøs.length;
    const barnSomHarEøsSteg: IBarnMedISøknad[] = søkerTriggerEøs
        ? søknad.barnInkludertISøknaden
        : søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs);

    const scrollTilFeil = (elementId: string) => {
        // Gjør dette for syns skyld, men push scroller ikke vinduet
        navigate({ hash: elementId });
        const element = document.getElementById(elementId);
        element && element.scrollIntoView && element.scrollIntoView();
    };

    const gåVidereCallback = (): Promise<boolean> => {
        feilAnchors[0] && scrollTilFeil(feilAnchors[0]);
        return Promise.resolve(feilAnchors.length === 0);
    };

    const stegTekster = tekster()[ESanitySteg.OPPSUMMERING];
    const { oppsummeringGuide } = stegTekster;

    return (
        <Steg
            tittel={<SpråkTekst id={'oppsummering.sidetittel'} />}
            guide={oppsummeringGuide}
            gåVidereCallback={gåVidereCallback}
        >
            {/* <OmDegOppsummering settFeilAnchors={settFeilAnchors} /> */}
            {/* <DinLivssituasjonOppsummering settFeilAnchors={settFeilAnchors} /> */}
            {/* <VelgBarnOppsummering settFeilAnchors={settFeilAnchors} /> */}
            {/* <OmBarnaOppsummering settFeilAnchors={settFeilAnchors} /> */}

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
                    const nummer = (hentStegNummer(RouteEnum.EøsForSøker) + enIndeksert).toString();
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
        </Steg>
    );
};

export default Oppsummering;
