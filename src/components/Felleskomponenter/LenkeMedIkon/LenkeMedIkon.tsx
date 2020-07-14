import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import endreIkon from '../../../assets/endre-ikon.svg';

interface Props {
    onClick: any;
}

const LenkeMedIkon: React.FC<Props> = ({ onClick }) => {
    return (
        <div className="lenke-knapp" onClick={onClick}>
            <img alt="Endre" src={endreIkon} />
            <Normaltekst>Endre informasjon</Normaltekst>
        </div>
    );
};

export default LenkeMedIkon;
