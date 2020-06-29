interface MiljøProps {
    loginService: string;
}

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('www-q0') > -1) {
        return {
            loginService: 'https://loginservice-q.nav.no/login?',
        };
    } else if (window.location.hostname.indexOf('www') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
        };
    } else {
        return {
            loginService: `http://localhost:8080/local/cookie?subject=21057822284`,
        };
    }
};

export default Miljø;
