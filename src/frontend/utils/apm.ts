import { init, setTag } from '@nais/apm';

import { erDev, erProd } from '../../common/miljø';

export const initApm = () => {
    if (erDev() || erProd()) {
        init({
            // app-navn, versjon, miljø og collector-URL løses automatisk fra Nais meta-tags / NAIS_*-variabler
            ignoreErrors: [
                // Støy fra dekoratøren (var i denyUrls i Sentry)
                /dekoratoren\/client/,
                // Støy fra nettleserutvidelser er allerede i DEFAULT_IGNORE_ERRORS
            ],
        });
        // Tagger alle events med app-scope (tilsvarte beforeCapture i Sentry.ErrorBoundary)
        setTag('scope', 'familie-ba-soknad');
    }
};
