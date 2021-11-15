export default function () {
    if (process.env.ENV === 'prod') {
        return {
            apiUrl: 'http://familie-ba-soknad-api',
            dekoratørUrl: 'https://www.nav.no/dekoratoren/',
            port: 9000,
        };
    } else if (process.env.ENV === 'dev') {
        return {
            apiUrl: 'http://familie-ba-soknad-api',
            dekoratørUrl: 'https://www-q1.nav.no/dekoratoren/',
            port: 9000,
        };
    } else if (process.env.ENV === 'docker-compose') {
        return {
            apiUrl: 'http://api:8080',
            dekoratørUrl: 'https://www.nav.no/dekoratoren/',
            port: 55554,
        };
    } else {
        return {
            apiUrl: 'http://localhost:8080',
            dekoratørUrl: 'https://www.nav.no/dekoratoren/',
            port: 55554,
        };
    }
}

export const basePath = process.env.BASE_PATH ?? '/';
