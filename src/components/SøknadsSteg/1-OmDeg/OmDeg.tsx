import React from 'react';
import Steg from '../Steg/Steg';
import { visLabelOgSvar } from '../../../utils/visning';
import { useApp } from '../../../context/AppContext';
import AlertStripe from 'nav-frontend-alertstriper';

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
