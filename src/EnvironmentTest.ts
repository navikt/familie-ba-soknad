interface EnvironmentProps {
    loginService: string;
    apiUrl: string;
}

const Environment = (): EnvironmentProps => {
    if (window.location.hostname.indexOf('www-q0') > -1) {
        return {
            loginService: 'https://loginservice-q.nav.no/login?',
            apiUrl: 'http://familie-ba-soknad-api',
        };
    } else if (window.location.hostname.indexOf('www') > -1) {
        return {
            loginService: 'https://loginservice.nav.no/login?',
            apiUrl: 'http://familie-ba-soknad-api',
        };
    } else {
        return {
            loginService: `http://localhost:8091/local/cookie?subject=21057822284`,
            apiUrl: 'http://localhost:8080',
        };
    }
};

export default Environment;
