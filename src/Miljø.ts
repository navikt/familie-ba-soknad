interface MiljøProps {
    loginService: string;
}

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            loginService: 'https://loginservice.dev-nav.no/login?',
        };
    } else if (window.location.hostname.indexOf('familie-ba-soknad.adeo') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
        };
    } else {
        return {
            loginService: `http://localhost:8080/local/cookie?subject=12345678900`,
        };
    }
};

export default Miljø;
