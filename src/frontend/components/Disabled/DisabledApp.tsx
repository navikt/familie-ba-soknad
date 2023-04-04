import React from 'react';

import styled from 'styled-components';

import { Sidetittel } from 'nav-frontend-typografi';

import { BodyLong } from '@navikt/ds-react';
import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { DekoratørenSpråkHandler } from '../Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import EksternLenke from '../Felleskomponenter/EksternLenke/EksternLenke';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto auto 2rem auto;
`;

const StyledSidetittel = styled(Sidetittel)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

export const DisabledApp: React.FC = () => {
    return (
        <main>
            <DekoratørenSpråkHandler />
            <InnholdContainer>
                {
                    // TODO: Dekoratøren språk-handling fra PR: #265
                }
                <VeilederSnakkeboble
                    tekst={<SpråkTekst id={'vedlikehold.veilederhilsen'} />}
                    posisjon={'høyre'}
                />
                <StyledSidetittel>
                    <SpråkTekst id={'vedlikehold.sidetittel'} />
                </StyledSidetittel>
                <StyledSpråkvelger støttedeSprak={[LocaleType.nb, LocaleType.nn, LocaleType.en]} />
                <BodyLong>
                    <SpråkTekst id={'vedlikehold.brødtekst'} />
                </BodyLong>
                <EksternLenke
                    lenkeSpråkId={'felles.bruk-pdfskjema.lenke'}
                    lenkeTekstSpråkId={'felles.bruk-pdfskjema.lenketekst'}
                    target="_blank"
                />
            </InnholdContainer>
        </main>
    );
};
