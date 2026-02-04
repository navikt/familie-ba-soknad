import React from 'react';

import styled from 'styled-components';

import { ESanitySteg, Typografi } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { TilfeldigBarnIkon } from '../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

const HeaderWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BarnCounterWrapper = styled.div`
    padding: 1rem;
`;

const HorisontalLinje = styled.span`
    width: 100%;
    border-bottom: 1px solid black;
`;

export const OmBarnetHeader: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        søknad: { barnInkludertISøknaden },
        tekster,
    } = useAppContext();
    const barnIndex = barnInkludertISøknaden.findIndex(b => b.id === barn.id);

    return (
        <HeaderWrapper>
            <TilfeldigBarnIkon byttVedRerender={false} />
            <HorisontalLinje />
            <BarnCounterWrapper>
                <TekstBlock
                    block={tekster()[ESanitySteg.OM_BARNET].barnXAvY}
                    flettefelter={{
                        antall: (barnIndex + 1).toString(),
                        totalAntall: barnInkludertISøknaden.length.toString(),
                    }}
                    typografi={Typografi.HeadingH3}
                />
            </BarnCounterWrapper>
        </HeaderWrapper>
    );
};
