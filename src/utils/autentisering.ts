import { AxiosError } from 'axios';
import Miljø from '../Miljø';
import { preferredAxios as axios } from '../context/axios';

const er401Feil = (error: AxiosError) => error && error.response && error.response.status === 401;
const getLoginUrl = () => {
    return `${Miljø().loginService}&redirect=${window.location.origin}`;
};

export const autentiseringsInterceptor = () => {
    axios.interceptors.response.use(
        response => {
            return response;
        },
        (error: AxiosError) => {
            if (er401Feil(error)) {
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
    return verifiserInnloggetApi().then(response => {
        if (response && 200 === response.status) {
            settAutentisering(true);
        }
    });
};

const verifiserInnloggetApi = () => {
    return axios.get(`/api/innlogget`, {
        withCredentials: true,
    });
};
