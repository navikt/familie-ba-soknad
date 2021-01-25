/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

const environment = require('./environment');

module.exports = function (app) {
    const restream = (proxyReq, req, _res) => {
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    };

    app.use(
        createProxyMiddleware('/api', {
            target: environment().apiUrl,
            changeOrigin: true,
            logLevel: 'debug',
            secure: true,
            onProxyReq: restream,
        })
    );
};
