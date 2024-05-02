import React, { PropsWithChildren } from 'react';

import * as Sentry from '@sentry/react';
import { IntlProvider } from 'react-intl';

import { HttpProvider } from '@navikt/familie-http';

import { tekster } from '../shared-utils/tekster';

import { useSpråk } from './components/Felleskomponenter/Dekoratøren/SpråkContext';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { FeatureTogglesProvider } from './context/FeatureToggleContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SanityProvider } from './context/SanityContext';

const MiljøProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { valgtLocale } = useSpråk();
    return (
        <IntlProvider locale={valgtLocale} messages={tekster[valgtLocale]}>
            <HttpProvider>
                <Sentry.ErrorBoundary
                    fallback={() => <Feilside />}
                    beforeCapture={scope => scope.setTag('scope', 'familie-ba-soknad')}
                >
                    <LastRessurserProvider>
                        <SanityProvider>
                            <InnloggetProvider>
                                <FeatureTogglesProvider>{children}</FeatureTogglesProvider>
                            </InnloggetProvider>
                        </SanityProvider>
                    </LastRessurserProvider>
                </Sentry.ErrorBoundary>
            </HttpProvider>
        </IntlProvider>
    );
};

export default MiljøProvider;
