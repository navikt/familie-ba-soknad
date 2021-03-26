import React from 'react';

import { useApp } from '../../../context/AppContext';

const Oppsummering: React.FC = () => {
    const { søknad } = useApp();
    console.log(søknad);

    return <div>Her kommer det en oppsummering!</div>;
};

export default Oppsummering;
