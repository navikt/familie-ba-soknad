import { useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useAppContext } from '../../../context/AppContext';

import OmBarnaDineSkjema from './OmBarnaDineSkjema';

const OmBarnaDine = () => {
    const navigate = useNavigate();
    const { søknad } = useAppContext();
    const { barnInkludertISøknaden } = søknad;
    const manglerData = !barnInkludertISøknaden.length;

    useEffect(() => {
        if (manglerData) {
            navigate('/velg-barn');
        }
    }, []);

    if (manglerData) {
        return null;
    } else {
        return <OmBarnaDineSkjema />;
    }
};

export default OmBarnaDine;
