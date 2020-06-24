module.exports = function () {
    if (process.env.ENV === 'dev') {
        return {
            apiUrl: 'http://familie-ba-soknad-api',
        };
    } else {
        return {
            apiUrl: 'http://localhost:8080',
        };
    }
};
