import React from 'react';

import { IntlProvider } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react';
import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';

import { tekster } from '../../../shared-utils/tekster';
import { useSpråk } from '../Felleskomponenter/Dekoratøren/SpråkContext';
import EksternLenke from '../Felleskomponenter/EksternLenke/EksternLenke';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto auto 2rem auto;
`;

const StyledHeading = styled(Heading)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

export const DisabledApp: React.FC = () => {
    const { valgtLocale } = useSpråk();
    return (
        <IntlProvider locale={valgtLocale} messages={tekster[valgtLocale]}>
            <main>
                <InnholdContainer>
                    {
                        // TODO: Dekoratøren språk-handling fra PR: #265
                    }
                    <GuidePanel>
                        <SpråkTekst id={'vedlikehold.veilederhilsen'} />
                    </GuidePanel>
                    <StyledHeading size="xlarge">
                        <SpråkTekst id={'vedlikehold.sidetittel'} />
                    </StyledHeading>
                    <StyledSpråkvelger
                        støttedeSprak={[LocaleType.nb, LocaleType.nn, LocaleType.en]}
                    />
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
        </IntlProvider>
    );
};
