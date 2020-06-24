const { createProxyMiddleware } = require('http-proxy-middleware');
const environment = require('./environment');

module.exports = function (app) {
    app.use(createProxyMiddleware('/api', { target: environment().apiUrl }));
};
