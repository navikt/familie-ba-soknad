interface MiljøProps {
    loginService: string;
    visInnsendingsknapp: boolean;
}

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            loginService: 'https://loginservice.dev.nav.no/login?',
            visInnsendingsknapp: true,
        };
    } else if (window.location.hostname.indexOf('familie-ba-soknad.nav') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsknapp: false,
        };
    } else {
        return {
            loginService: `http://localhost:8080/local/cookie?subject=12345678901`,
            visInnsendingsknapp: true,
        };
    }
};

export default Miljø;
