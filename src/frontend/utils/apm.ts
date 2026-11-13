import { init, setTag } from '@nais/apm';

import { erDev, erProd } from '../../common/miljø';

export const NETTVERKSFEIL_LOGGET_AV_DEKORATØREN =
    /^console\.error: \[ERROR\] .*\{"error":"TypeError: (Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.)"/;

export const initApm = () => {
    if (erDev() || erProd()) {
        init({
            // app-navn, versjon, miljø og collector-URL løses automatisk fra Nais meta-tags / NAIS_*-variabler
            ignoreErrors: [
                // Støy fra dekoratøren
                /dekoratoren\/client/,
                NETTVERKSFEIL_LOGGET_AV_DEKORATØREN,
                // Støy fra nettleserutvidelser er allerede i DEFAULT_IGNORE_ERRORS
            ],
        });
        // Tagger alle events med app-scope
        setTag('scope', 'familie-ba-soknad');
    }
};
