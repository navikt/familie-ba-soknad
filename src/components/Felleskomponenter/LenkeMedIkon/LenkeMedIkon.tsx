import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import endreIkon from '../../../assets/endre-ikon.svg';

interface Props {
    onClick: () => void;
}

const LenkeMedIkon: React.FC<Props> = ({ onClick }) => {
    return (
        <button className="lenke-knapp" onClick={onClick}>
            <img alt="Endre" src={endreIkon} />
            <Normaltekst>Endre informasjon</Normaltekst>
        </button>
    );
};

export default LenkeMedIkon;
