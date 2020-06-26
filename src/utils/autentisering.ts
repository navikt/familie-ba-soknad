import axios, { AxiosError } from 'axios';
import Environment from '../EnvironmentTest';
import { erLokaltMedMock } from './miljø';
const er401Feil = (error: AxiosError) => error && error.response && error.response.status === 401;

const loggInn = () => !erLokaltMedMock;

// Mangler redirect path
const getLoginUrl = () => {
    return Environment().loginService;
};

export const autentiseringsInterceptor = () => {
    axios.interceptors.response.use(
        response => {
            return response;
        },
        (error: AxiosError) => {
            if (er401Feil(error) && loggInn()) {
                window.location.href = getLoginUrl();
            } else {
                throw error;
            }
        }
    );
};

export const verifiserAtBrukerErAutentisert = (
    settAutentisering: (autentisering: boolean) => void
) => {
    if (loggInn()) {
        return verifiserInnloggetApi().then(response => {
            if (response && 200 === response.status) {
                settAutentisering(true);
            }
        });
    } else {
        settAutentisering(true);
    }
};

const verifiserInnloggetApi = () => {
    return axios.get(`${Environment().apiUrl}/api/innlogget`, {
        withCredentials: true,
    });
};
