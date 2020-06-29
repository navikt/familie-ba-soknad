module.exports = function () {
    if (process.env.ENV === 'dev') {
        return {
            apiUrl: 'http://familie-ba-soknad-api',
            dekoratørUrl: 'https://www-q1.nav.no/dekoratoren/?simple=true',
        };
    } else {
        return {
            apiUrl: 'http://localhost:8080',
            dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
        };
    }
};
