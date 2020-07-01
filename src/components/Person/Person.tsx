import React from 'react';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { useApp } from '../../context/AppContext';
import { RessursStatus } from '../../typer/ressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';

const Person: React.FC = () => {
    const { personData } = useApp();
    return (
        <div>
            <Undertittel>Persondata</Undertittel>
            {personData.status === RessursStatus.SUKSESS && console.log(personData.data)}
            {personData.status === RessursStatus.HENTER && <NavFrontendSpinner />}
            {personData.status === RessursStatus.FEILET && (
                <Normaltekst>Feilet {personData.frontendFeilmelding}</Normaltekst>
            )}
        </div>
    );
};

export default Person;
