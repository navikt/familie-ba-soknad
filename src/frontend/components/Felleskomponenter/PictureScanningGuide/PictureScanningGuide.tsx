import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Label } from '@navikt/ds-react';

import EksternLenke from '../EksternLenke/EksternLenke';
import ExpandableInfo from '../expandableContent/ExpandableInfo';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import PictureScanningExample from './PictureScanningExample';
import ScanningIcon from './ScanningIcon';

const Container = styled.div`
    svg {
        pointer-events: none;
    }

    ul {
        margin: 0 0 1rem 0;
        li {
            margin-bottom: 0.5rem;
        }
    }
`;

const StyledLabel = styled(Label)`
    padding-bottom: 1rem;
`;

const EksempelBilderWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
`;

const BildeContainer = styled.div`
    flex: 1 1 50%;
    height: auto;
    padding: 0.5rem 0.5rem 1.5rem 0.5rem;
    &:first-child {
        padding-left: 0;
    }
    &:last-child {
        padding-right: 0;
    }
    @media screen and (min-width: 768px) {
        max-width: 25%;
    }
`;

const PictureScanningGuide = () => {
    const { formatMessage } = useIntl();
    const svgIconHeight = 100;
    return (
        <ExpandableInfo title={formatMessage({ id: 'psg.expandable.tittel' })}>
            <Container>
                <StyledLabel size={'small'}>
                    <SpråkTekst id="psg.section1.tittel" />
                </StyledLabel>
                <ul>
                    <li>
                        <SpråkTekst id="psg.section1.liste.1" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section1.liste.2" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section1.liste.3" />
                    </li>
                </ul>

                <StyledLabel tag="h3">
                    <SpråkTekst id="psg.section2.tittel" />
                </StyledLabel>
                <ul>
                    <li>
                        <SpråkTekst id="psg.section2.liste.1" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section2.liste.2" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section2.liste.3" />
                    </li>
                </ul>
                <div>
                    <StyledLabel tag="h3">
                        <SpråkTekst id="psg.icon.heading" />
                    </StyledLabel>
                    <EksempelBilderWrapper>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="good" height={svgIconHeight} />}
                                status="suksess"
                                statusText={formatMessage({ id: 'psg.good' })}
                                description={formatMessage({ id: 'psg.icon.label.good' })}
                            />
                        </BildeContainer>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                                status="feil"
                                statusText={formatMessage({ id: 'psg.bad' })}
                                description={formatMessage({ id: 'psg.icon.label.keystone' })}
                            />
                        </BildeContainer>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                                status="feil"
                                statusText={formatMessage({ id: 'psg.bad' })}
                                description={formatMessage({ id: 'psg.icon.label.horizontal' })}
                            />
                        </BildeContainer>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                                status="feil"
                                statusText={formatMessage({ id: 'psg.bad' })}
                                description={formatMessage({ id: 'psg.icon.label.shadow' })}
                            />
                        </BildeContainer>
                    </EksempelBilderWrapper>

                    <EksternLenke
                        target="_blank"
                        lenkeSpråkId={'psg.lenkepanel.url'}
                        lenkeTekstSpråkId={'psg.lenkepanel.text'}
                    />
                </div>
            </Container>
        </ExpandableInfo>
    );
};
export default PictureScanningGuide;
