import { Avhengigheter, Felt, FeltConfig, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { ESøknadstype } from '../typer/søknad';

export const useKunUtvidetFelt = <T = string>(feltConfig: FeltConfig<T>): Felt<T> => {
    const {
        søknad: { søknadstype },
    } = useApp();
    const { avhengigheter, skalFeltetVises } = feltConfig;

    const utvidetSkalVises = (avhengigheter: Avhengigheter): boolean => {
        return søknadstype === ESøknadstype.UTVIDET
            ? skalFeltetVises
                ? skalFeltetVises(avhengigheter)
                : true
            : false;
    };

    const utvidetConfig: FeltConfig<T> = {
        ...feltConfig,
        skalFeltetVises: utvidetSkalVises,
        avhengigheter: { ...avhengigheter, søknadstype },
    };

    return useFelt<T>(utvidetConfig);
};
