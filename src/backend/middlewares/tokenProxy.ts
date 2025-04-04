import { NextFunction, Request, RequestHandler, Response } from 'express';

import { LOG_LEVEL } from '@navikt/familie-logging';

import { erLokalt } from '../../shared-utils/Miljø';
import { logRequest } from '../logger';
import TokenXClient from '../tokenx';
import { ApplicationName } from '../types';

const { exchangeToken } = new TokenXClient();

export const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const attachToken = (applicationName: ApplicationName): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await prepareSecuredRequest(req, applicationName);
            req.headers[AUTHORIZATION_HEADER] = token;
            req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
            next();
        } catch (error) {
            logRequest(
                req,
                `Noe gikk galt ved setting av token (${req.method} - ${req.path}): `,
                LOG_LEVEL.WARNING,
                error
            );
            res.status(401).send('En uventet feil oppstod. Ingen gyldig token');
        }
    };
};

const harBearerToken = (authorization: string) => {
    return authorization.includes('Bearer ');
};

const utledToken = (authorization: string | undefined): string => {
    if (erLokalt()) {
        throw Error('Lokal profil kan bruke fakedings direkte');
    } else if (authorization && harBearerToken(authorization)) {
        return authorization.split(' ')[1];
    } else {
        throw Error('Mangler authorization i header');
    }
};

const prepareSecuredRequest = async (req: Request, applicationName: ApplicationName) => {
    logRequest(req, 'PrepareSecuredRequest', LOG_LEVEL.INFO);
    const { authorization } = req.headers;
    if (erLokalt()) {
        return await getFakedingsToken(applicationName);
    }
    const token = utledToken(authorization);
    logRequest(req, 'IdPorten-token found: ' + (token.length > 1), LOG_LEVEL.INFO);
    const accessToken = await exchangeToken(token, applicationName).then(
        accessToken => accessToken
    );
    return `Bearer ${accessToken}`;
};

const getFakedingsToken = async (applicationName: string): Promise<string> => {
    const clientId = 'dev-gcp:teamfamilie:familie-ks-soknad';
    const audience = `dev-gcp:teamfamilie:${applicationName}`;
    const url = `http://fakedings.intern.dev.nav.no/fake/tokenx?client_id=${clientId}&aud=${audience}&acr=Level4&pid=31458931375`;
    const token = await fetch(url).then(function (body) {
        return body.text();
    });
    return `Bearer ${token}`;
};

export default attachToken;
