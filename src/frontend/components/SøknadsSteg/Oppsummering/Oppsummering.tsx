import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../context/RoutesContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import OmBarnaOppsummering from './OppsummeringSteg/OmBarnaOppsummering';
import OmBarnetOppsummering from './OppsummeringSteg/OmBarnet/OmBarnetOppsummering';
import OmDegOppsummering from './OppsummeringSteg/OmDegOppsummering';
import VelgBarnOppsummering from './OppsummeringSteg/VelgBarnOppsummering';

const StyledNormaltekst = styled(Normaltekst)`
    padding-bottom: 4rem;
`;

export const StyledOppsummeringsFeltGruppe = styled.div`
    padding: 1rem 0 1rem 0;
`;

const Oppsummering: React.FC = () => {
    const { søknad } = useApp();
    const { hentStegNummer } = useRoutes();
    const { push: pushHistory } = useHistory();
    const [feilAnchors, settFeilAnchors] = useState<string[]>([]);

    const scrollTilFeil = (elementId: string) => {
        // Gjør dette for syns skyld, men push scroller ikke vinduet
        pushHistory({ hash: elementId });
        const element = document.getElementById(elementId);
        element && element.scrollIntoView();
    };

    const gåVidereCallback = (): Promise<boolean> => {
        feilAnchors[0] && scrollTilFeil(feilAnchors[0]);
        return Promise.resolve(feilAnchors.length === 0);
    };

    return (
        <Steg
            tittel={<SpråkTekst id={'oppsummering.sidetittel'} />}
            gåVidereCallback={gåVidereCallback}
        >
            <StyledNormaltekst>
                <SpråkTekst id={'oppsummering.info'} />
            </StyledNormaltekst>

            <OmDegOppsummering settFeilAnchors={settFeilAnchors} />
            <VelgBarnOppsummering settFeilAnchors={settFeilAnchors} />
            <OmBarnaOppsummering settFeilAnchors={settFeilAnchors} />

            {søknad.barnInkludertISøknaden.map((barn, index) => {
                const enIndeksert = index + 1;
                const nummer = (hentStegNummer(RouteEnum.OmBarna) + enIndeksert).toString();
                return (
                    <OmBarnetOppsummering
                        key={index}
                        barn={barn}
                        nummer={nummer}
                        settFeilAnchors={settFeilAnchors}
                        index={index}
                    />
                );
            })}
        </Steg>
    );
};

export default Oppsummering;
