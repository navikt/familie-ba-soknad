import React from 'react';

import styled from 'styled-components';

import { Heading, HGrid, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import ExpandableInfo from '../expandableContent/ExpandableInfo';
import TekstBlock from '../Sanity/TekstBlock';

import PictureScanningExample from './PictureScanningExample';
import ScanningIcon from './ScanningIcon';

const Container = styled.div`
    svg {
        pointer-events: none;
    }

    ul {
        margin: 0;
        li {
            margin-bottom: 0.5rem;
        }
    }
`;

const PictureScanningGuide = () => {
    const { tekster, plainTekst } = useApp();
    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const svgIconHeight = 100;
    return (
        <ExpandableInfo title={plainTekst(dokumentasjonTekster.slikTarDuEtGodtBildeExpand)}>
            <Container>
                <VStack gap="8">
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.slikTarDuEtGodtBildeTittel)}
                        </Heading>
                        <TekstBlock block={dokumentasjonTekster.slikTarDuEtGodtBilde} />
                    </div>
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.etterDuHarTattBildetTittel)}
                        </Heading>
                        <TekstBlock block={dokumentasjonTekster.etterDuHarTattBildet} />
                    </div>
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.braOgDaarligeTittel)}
                        </Heading>
                        <HGrid gap="6 4" marginBlock="6 0" columns={{ xs: 2, md: 4 }}>
                            <PictureScanningExample
                                image={<ScanningIcon status="good" height={svgIconHeight} />}
                                status="suksess"
                                statusText={plainTekst(dokumentasjonTekster.bra)}
                                description={plainTekst(dokumentasjonTekster.fyllerHeleBildet)}
                            />

                            <PictureScanningExample
                                image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                                status="feil"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.ikkeTattOvenfra)}
                            />

                            <PictureScanningExample
                                image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                                status="feil"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.ikkeRiktigRetning)}
                            />

                            <PictureScanningExample
                                image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                                status="feil"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.skyggePaaDokumentet)}
                            />
                        </HGrid>
                    </div>
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.vaerTryggNaarDuTarBildeTittel)}
                        </Heading>
                        <TekstBlock block={dokumentasjonTekster.vaerTryggNaarDuTarBilde} />
                    </div>
                </VStack>
            </Container>
        </ExpandableInfo>
    );
};
export default PictureScanningGuide;
