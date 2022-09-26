import { RequestHandler } from 'express';
import { createRemoteJWKSet } from 'jose';
import { jwtVerify, FlattenedJWSInput, JWSHeaderParameters, JWTVerifyResult } from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';
import { Client, Issuer } from 'openid-client';

let issuer: Issuer<Client>;
let remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

const validerToken = async (token: string | Uint8Array): Promise<JWTVerifyResult> => {
    return await jwtVerify(token, await jwks(), {
        issuer: (await fetchIssuer()).metadata.issuer,
    });
};

const jwks = async () => {
    if (typeof remoteJWKSet === 'undefined') {
        const iss = await fetchIssuer();
        remoteJWKSet = createRemoteJWKSet(new URL(iss.metadata.jwks_uri as string));
    }

    return remoteJWKSet;
};

const fetchIssuer = async () => {
    if (typeof issuer === 'undefined') {
        if (!process.env.LOGINSERVICE_IDPORTEN_DISCOVERY_URL)
            throw new Error(`Miljøvariabelen "LOGINSERVICE_IDPORTEN_DISCOVERY_URL" må være satt`);
        issuer = await Issuer.discover(process.env.LOGINSERVICE_IDPORTEN_DISCOVERY_URL);
    }
    return issuer;
};

export const jwtValidationInterceptor: RequestHandler = async (req, res, next) => {
    const cookieValue = req.cookies['selvbetjening-idtoken'];
    try {
        await validerToken(cookieValue);
        next();
    } catch (e) {
        res.sendStatus(401);
    }
};
