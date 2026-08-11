import { byggSuksessRessurs, type Ressurs } from '@navikt/familie-typer';
import type { Express, RequestHandler } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

import { BASE_PATH } from '../../common/miljø.js';
import { type AllFeatureToggles, defaultFeatureToggleValues, ToggleKeys } from '../../common/typer/feature-toggles.js';
import { isEnabled } from '../utils/unleash.js';

const fetchAllFeatureTogglesHandler: RequestHandler<ParamsDictionary, Ressurs<AllFeatureToggles>> = (_, res) => {
    const featureToggles = Object.entries(ToggleKeys).reduce((allFeatureToggles, featureToggleEntry) => {
        allFeatureToggles[featureToggleEntry[0]] = isEnabled(
            featureToggleEntry[1],
            defaultFeatureToggleValues[featureToggleEntry[0]]
        );
        return allFeatureToggles;
    }, {} as AllFeatureToggles);
    res.send(byggSuksessRessurs(featureToggles));
};

export const konfigurerAllFeatureTogglesEndpoint = (app: Express): Express => {
    app.get(`${BASE_PATH}toggles/all`, fetchAllFeatureTogglesHandler);
    return app;
};
