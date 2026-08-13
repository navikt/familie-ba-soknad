import type { RequestHandler } from 'express';
import type { ViteDevServer } from 'vite';

import { KillSwitchToggle } from '../../common/typer/feature-toggles.js';
import { renderHtml } from '../utils/render-html.js';
import { isEnabled } from '../utils/unleash.js';

/**
 * Express-middleware som returnerer en feil-side hvis familie-ba-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor = (viteDevServer?: ViteDevServer): RequestHandler => {
    return (req, res, next) => {
        let skalRendreDisabledApp: boolean;
        if (process.env.FORCE_DISABLED) {
            skalRendreDisabledApp = true;
        } else {
            skalRendreDisabledApp = isEnabled(KillSwitchToggle.SOKNAD);
        }
        if (skalRendreDisabledApp) {
            renderHtml('disabled.html', viteDevServer, req, res, next);
        } else {
            next();
        }
    };
};
