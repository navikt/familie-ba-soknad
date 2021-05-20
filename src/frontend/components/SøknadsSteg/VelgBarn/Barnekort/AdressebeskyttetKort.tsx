import React from 'react';

import styled from 'styled-components/macro';

import { device } from '../../../../Theme';
import EksternLenke from '../../../Felleskomponenter/EksternLenke/EksternLenke';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

// Dimensjoner tatt fra StyledBarnekort men fjernet bl.a. farge
const KortContainer = styled.div`
    max-width: calc(16.3rem - 0.3rem * 2);
    padding: 9rem 0 0;
    margin: 0 auto 0.625rem;
    text-align: center;
    @media all and ${device.mobile} {
        width: 100%;
        padding: 2rem 0 2rem;
    }
`;

const LenkeContainer = styled.div`
    margin: 1rem 0 1rem;
`;

export const AdressebeskyttetKort: React.FC = () => {
    return (
        <KortContainer>
            <SpråkTekst id={'hvilkebarn.adressesperreinformasjon'} />
            <LenkeContainer>
                <EksternLenke
                    lenkeSpråkId={'felles.bruk-pdfskjema.lenke'}
                    lenkeTekstSpråkId={'felles.bruk-pdfskjema.lenketekst'}
                />
            </LenkeContainer>
            <SpråkTekst id={'felles.sende-skjema.info'} />
        </KortContainer>
    );
};
