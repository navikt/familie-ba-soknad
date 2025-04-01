import React, { useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useApp } from '../../../context/AppContext';

import OmBarnaDineSkjema from './OmBarnaDineSkjema';

const OmBarnaDine = () => {
    const navigate = useNavigate();
    const { søknad } = useApp();
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
