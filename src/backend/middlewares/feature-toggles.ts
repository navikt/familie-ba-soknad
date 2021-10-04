import { RequestHandler } from 'express';

import { EFeatureToggle } from '../../frontend/typer/feature-toggles';
import { getDecorator } from '../routes';
import { isEnabled } from '../utils/unleash';

/**
 * Express-middleware som returnerer en feil-side hvis familie-ba-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor: RequestHandler = (req, res, next) => {
    const språk: string | undefined = req.cookies['decorator-language'];
    const erUtvidet = req.url.includes('utvidet');

    const renderDisabled = () =>
        getDecorator(språk)
            .then(fragments => res.render('disabled.html', fragments))
            // Selv om dekoratøren feiler vil vi rendre siden, vil bare få noen ekle hbs-tags i sidevisningen og mangle no styling
            .catch(() => res.render('disabled.html'));

    let skalRendreDisabledApp;
    if (process.env.FORCE_DISABLED) {
        skalRendreDisabledApp = true;
    } else if (erUtvidet) {
        skalRendreDisabledApp = isEnabled(EFeatureToggle.UTVIDET);
    } else {
        skalRendreDisabledApp = isEnabled(EFeatureToggle.ORDINAER);
    }
    skalRendreDisabledApp ? renderDisabled() : next();
};
