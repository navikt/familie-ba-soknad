import { RequestHandler } from 'express';

import { KillSwitchToggle } from '../../shared-utils/feature-toggles.js';
import { isEnabled } from '../utils/unleash.js';

/**
 * Express-middleware som returnerer en feil-side hvis familie-ba-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor: RequestHandler = (req, res, next) => {
    const språk: string | undefined = req.cookies['decorator-language'];

    let skalRendreDisabledApp;
    if (process.env.FORCE_DISABLED) {
        skalRendreDisabledApp = true;
    } else {
        skalRendreDisabledApp = isEnabled(KillSwitchToggle.SOKNAD);
    }
    if (skalRendreDisabledApp) {
        res.render('disabled.html', { LOCALE_CODE: språk ?? 'nb' });
    } else {
        next();
    }
};
