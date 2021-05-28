import { ClientRequest } from 'http';

import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import environment from './environment.js';

const restream = (proxyReq: ClientRequest, req: Request, _res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const createApiForwardingFunction = () => {
    return createProxyMiddleware('/familie/barnetrygd/soknad/ordinaer/api', {
        target: environment().apiUrl,
        changeOrigin: true,
        logLevel: 'debug',
        secure: true,
        onProxyReq: restream,
        pathRewrite: {
            '^/familie/barnetrygd/soknad/ordinaer/api': '/api',
        },
    });
};
