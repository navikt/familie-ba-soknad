import { RequestHandler } from 'express';
import { initialize, Strategy } from 'unleash-client';

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
export const expressToggleInterceptor: RequestHandler = (_req, res, next) => {
    isEnabled('familie-ba-soknad.disable-soknad') ? res.send('Haha nei') : next();
};
