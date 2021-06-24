import * as path from 'path';

import { RequestHandler } from 'express';
import { initialize, Strategy } from 'unleash-client';

import { getDecorator } from './dekorator';

class ByClusterStrategy extends Strategy {
    private cluster: string = process.env.NAIS_CLUSTER_NAME ?? 'lokalutvikling';

    constructor() {
        super('byCluster');
    }

    isEnabled(parameters: Record<string, string> | undefined): boolean {
        return parameters !== undefined && parameters['cluster'] === this.cluster;
    }
}

const unleash = initialize({
    url: 'https://unleash.nais.io/api/',
    appName: process.env.NAIS_APP_NAME ?? 'familie-ba-soknad',
    strategies: [new ByClusterStrategy()],
});

export const isEnabled = (feature: string): boolean => {
    // Hvis vi bare deconstructer og eksporterer isEnabled fra unleash crasher det fordi isEnabled ikke veit hva `this` er...
    return unleash.isEnabled(feature);
};

/**
 * Express-middleware som returnerer en feil-side hvis familie-ba-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor: RequestHandler = (req, res, next) => {
    const { path: urlPath } = req;
    const { ext } = path.parse(urlPath);
    // Vi lar requests til disse filtypene gå igjennom, ellers rendrer vi disabled.html.
    const tillatteExtensions = ['.json', '.js', '.png'];
    const slippIgjenomForFiltype = !!tillatteExtensions.find(tillatt => tillatt === ext);

    const renderDisabled = () =>
        getDecorator()
            .then(fragments => res.render('disabled.html', fragments))
            // Selv om dekoratøren feiler vil vi rendre siden, vil bare få noen ekle hbs-tags i sidevisningen og mangle no styling
            .catch(() => res.render('disabled.html'));

    isEnabled('familie-ba-soknad.disable-soknad') && !slippIgjenomForFiltype
        ? renderDisabled()
        : next();
};
