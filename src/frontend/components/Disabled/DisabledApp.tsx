import React, { useEffect } from 'react';

import { IntlProvider } from 'react-intl';

import { BodyLong, GuidePanel, Heading, VStack } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { tekster } from '../../../shared-utils/tekster';
import { useSpråk } from '../../context/SpråkContext';
import EksternLenke from '../Felleskomponenter/EksternLenke/EksternLenke';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

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
            <VStack gap="12" marginBlock="32">
                <GuidePanel>
                    <SpråkTekst id={'vedlikehold.veilederhilsen'} />
                </GuidePanel>
                <div>
                    <Heading level="1" size="large" spacing>
                        <SpråkTekst id={'vedlikehold.sidetittel'} />
                    </Heading>
                    <BodyLong>
                        <SpråkTekst id={'vedlikehold.brødtekst'} />
                    </BodyLong>
                </div>
                <EksternLenke
                    lenkeSpråkId={'felles.bruk-pdfskjema.lenke'}
                    lenkeTekstSpråkId={'felles.bruk-pdfskjema.lenketekst'}
                    target="_blank"
                />
            </VStack>
        </IntlProvider>
    );
};
