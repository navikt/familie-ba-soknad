import { Express, RequestHandler } from 'express';

import { byggFeiletRessurs, byggSuksessRessurs } from '@navikt/familie-typer';

import { basePath } from '../environment';
import { isEnabled } from '../utils/unleash';

const toggleFetchHandler: RequestHandler = (req, res) => {
    const toggleId = req.params.id;
    if (!toggleId) {
        res.status(404).send(byggFeiletRessurs('Mangler toggle-id'));
        return;
    }

    res.send(byggSuksessRessurs(isEnabled(toggleId)));
};

export const konfigurerFeatureTogglesEndpoint = (app: Express): Express => {
    // Matcher bare toggles som tilhører oss, bruker {0,} pga en express-quirk
    // ref http://expressjs.com/en/guide/routing.html#route-parameters
    app.get(`${basePath}toggles/:id(familie-ba-soknad.[a-zA-Z-]{0,})`, toggleFetchHandler);
    return app;
};
