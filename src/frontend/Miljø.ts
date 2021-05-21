interface MiljøProps {
    loginService: string;
    visInnsendingsknapp: boolean;
    dokumentUrl: string;
}

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ba-soknad.dev') > -1) {
        return {
            loginService: 'https://loginservice.dev.nav.no/login?',
            visInnsendingsknapp: true,
            dokumentUrl:
                'https://familie-dokument.dev.nav.no/familie/dokument/api/mapper/ANYTTHING', //Vil uansett gå til bucket "familievedlegg" enn så lenge
        };
    } else if (window.location.hostname.indexOf('familie-ba-soknad.nav') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsknapp: false,
            dokumentUrl: `https://www.nav.no/familie/dokument/api/mapper/ANYTTHING`, //Vil uansett gå til bucket "familievedlegg" enn så lenge,
        };
    } else {
        return {
            loginService: `http://localhost:8080/local/cookie?subject=12345678901`,
            visInnsendingsknapp: true,
            dokumentUrl: `http://localhost:8082/api/mapper/ANYTTHING`,
        };
    }
};

export default Miljø;
