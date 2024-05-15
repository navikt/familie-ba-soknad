import React, { useEffect } from 'react';

import { IntlProvider } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { tekster } from '../../../shared-utils/tekster';
import { useSpråk } from '../../context/SpråkContext';
import EksternLenke from '../Felleskomponenter/EksternLenke/EksternLenke';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledHeading = styled(Heading)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

export const DisabledApp: React.FC = () => {
    const { valgtLocale } = useSpråk();

    useEffect(() => {
        visSpråkvelger();
    }, []);

    const visSpråkvelger = () => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]).then();
    };
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
