import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';
import Steg from '../Steg/Steg';

const OmDeg: React.FC = () => {
    const { søknad } = useApp();

    return (
        <Steg tittel={'Om deg'} erSpørsmålBesvart={true}>
            <div className={'om-deg'}>
                <AlertStripe type="info" form="inline">
                    Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos
                    Folkeregisteret.
                </AlertStripe>
                {visLabelOgSvar(søknad.søker.verdi.navn)}
            </div>
        </Steg>
    );
};

export default OmDeg;
