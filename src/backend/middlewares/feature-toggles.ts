import { RequestHandler } from 'express';

import { EKillSwitchToggle } from '../../frontend/typer/feature-toggles';
import { isEnabled } from '../utils/unleash';

/**
 * Express-middleware som returnerer en feil-side hvis familie-ba-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor: RequestHandler = (req, res, next) => {
    const språk: string | undefined = req.cookies['decorator-language'];

    let skalRendreDisabledApp;
    if (process.env.FORCE_DISABLED) {
        skalRendreDisabledApp = true;
    } else {
        skalRendreDisabledApp = isEnabled(EKillSwitchToggle.SOKNAD);
    }
    skalRendreDisabledApp ? res.render('disabled.html', { LOCALE_CODE: språk ?? 'nb' }) : next();
};
