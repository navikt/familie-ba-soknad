import { useSpråk } from '../../../context/SpråkContext';

import { feilsideTekster } from './feilsideTekster';
import { IFeilsideTekst } from './feilsideTyper';

const useFeilsideTekster = (): IFeilsideTekst => {
    const { valgtLocale } = useSpråk();
    return feilsideTekster[valgtLocale];
};

export default useFeilsideTekster;
