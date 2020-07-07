import { AxiosError } from 'axios';
import Miljø from '../Miljø';
import { preferredAxios as axios } from '../context/axios';

const er401Feil = (error: AxiosError) => error && error.response && error.response.status === 401;
const getLoginUrl = () => {
    return `${Miljø().loginService}&redirect=${window.location.origin}`;
};

export enum InnloggetStatus {
    AUTENTISERT,
<<<<<<< HEAD
    IKKE_AUTENTISERT,
=======
>>>>>>> master
    FEILET,
    IKKE_VERIFISERT,
}

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
    settInnloggetStatus: (innloggetStatus: InnloggetStatus) => void
) => {
<<<<<<< HEAD
    return verifiserInnloggetApi()
        .then(response => {
            if (response && 200 === response.status) {
=======
    return hentInnloggetStatus()
        .then(response => {
            if (response && response.status === 200) {
>>>>>>> master
                settInnloggetStatus(InnloggetStatus.AUTENTISERT);
            }
        })
        .catch(error => settInnloggetStatus(InnloggetStatus.FEILET));
};

const hentInnloggetStatus = () => {
    return axios.get(`/api/innlogget`, {
        withCredentials: true,
    });
};
