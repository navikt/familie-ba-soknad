import { RequestHandler } from 'express';

import { EFeatureToggle, EKillSwitchToggle } from '../../frontend/typer/feature-toggles';
import { isEnabled } from '../utils/unleash';

/**
 * Express-middleware som returnerer en feil-side hvis familie-ba-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor: RequestHandler = (req, res, next) => {
    const språk: string | undefined = req.cookies['decorator-language'];
    const erUtvidet = req.url.includes('utvidet');

    let skalRendreDisabledApp;
    if (process.env.FORCE_DISABLED) {
        skalRendreDisabledApp = true;
    } else if (isEnabled(EFeatureToggle.KOMBINER_SOKNADER)) {
        skalRendreDisabledApp = isEnabled(EKillSwitchToggle.SOKNAD);
    } else if (erUtvidet) {
        skalRendreDisabledApp = isEnabled(EKillSwitchToggle.UTVIDET);
    } else {
        skalRendreDisabledApp = isEnabled(EKillSwitchToggle.ORDINAER);
    }
    skalRendreDisabledApp ? res.render('disabled.html', { LOCALE_CODE: språk ?? 'nb' }) : next();
};
