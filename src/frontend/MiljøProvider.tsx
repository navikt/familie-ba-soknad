import React, { PropsWithChildren } from 'react';

import * as Sentry from '@sentry/react';
import { IntlProvider } from 'react-intl';

import { HttpProvider } from '@navikt/familie-http';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { tekster } from '../shared-utils/tekster';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { FeatureTogglesProvider } from './context/FeatureToggleContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { logError } from './utils/amplitude';

const MiljøProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [valgtLocale] = useSprakContext();
    return (
        <IntlProvider locale={valgtLocale} messages={tekster[valgtLocale]}>
            <HttpProvider>
                <Sentry.ErrorBoundary
                    fallback={() => <Feilside />}
                    beforeCapture={scope => scope.setTag('scope', 'familie-ba-soknad')}
                    onError={logError}
                >
                    <LastRessurserProvider>
                        <InnloggetProvider>
                            <FeatureTogglesProvider>{children}</FeatureTogglesProvider>
                        </InnloggetProvider>
                    </LastRessurserProvider>
                </Sentry.ErrorBoundary>
            </HttpProvider>
        </IntlProvider>
    );
};

export default MiljøProvider;
