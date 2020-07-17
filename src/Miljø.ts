interface MiljøProps {
    loginService: string;
    visInnsendingsKnapp: boolean;
}

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            loginService: 'https://loginservice.dev.nav.no/login?',
            visInnsendingsKnapp: true,
        };
    } else if (window.location.hostname.indexOf('familie-ba-soknad.nav') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsKnapp: false,
        };
    } else {
        return {
            loginService: `http://localhost:8080/local/cookie?subject=12345678901`,
            visInnsendingsKnapp: true,
        };
    }
};

export default Miljø;
