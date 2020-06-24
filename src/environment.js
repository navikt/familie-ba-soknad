module.exports = function () {
    if (process.env.ENV === 'dev') {
        return {
            apiUrl: 'https://familie-ba-soknad-api.dev-nav.no',
        };
    } else {
        return {
            apiUrl: 'http://localhost:8080',
        };
    }
};
