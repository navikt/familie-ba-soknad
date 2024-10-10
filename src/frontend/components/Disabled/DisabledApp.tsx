import React, { useEffect } from 'react';

import { IntlProvider } from 'react-intl';

import { BodyLong, GuidePanel, Heading, Page, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { tekster } from '../../../shared-utils/tekster';
import { useLastRessurserContext } from '../../context/LastRessurserContext';
import { useSanity } from '../../context/SanityContext';
import { useSpråk } from '../../context/SpråkContext';
import EksternLenke from '../Felleskomponenter/EksternLenke/EksternLenke';
import { Feilside } from '../Felleskomponenter/Feilside/Feilside';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';

export const DisabledApp: React.FC = () => {
    const { valgtLocale } = useSpråk();
    const { teksterRessurs } = useSanity();
    const { lasterRessurser } = useLastRessurserContext();

    if (lasterRessurser()) {
        return (
            <main>
                <SystemetLaster />
            </main>
        );
    }

    if (teksterRessurs.status !== RessursStatus.SUKSESS) {
        return (
            <main>
                <Page.Block width="text" gutters>
                    <Feilside />
                </Page.Block>
            </main>
        );
    }

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
                <Page.Block width="text" gutters>
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
                </Page.Block>
            </main>
        </IntlProvider>
    );
};
