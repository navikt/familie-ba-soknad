import { preferredAxios as axios } from './context/axios';

export const pdlTest = () => {
    return axios
        .post(`/api/personopplysning`, {
            withCredentials: true,
            ident: '012345678901',
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));
};
