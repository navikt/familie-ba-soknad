import React from 'react';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { useApp } from '../../context/AppContext';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';

const Helse: React.FC = () => {
    const { helseApi, helseMottak } = useApp();
    return (
        <div className={'helse'}>
            <Undertittel>Helse</Undertittel>
            {renderHelse(helseApi, 'søknad api')}
            {renderHelse(helseMottak, 'mottak')}
        </div>
    );
};

const renderHelse = (ressurs: Ressurs<string>, tjeneste: string) => {
    return (
        <div className={'helse__tjeneste'}>
            <Normaltekst>{`Svar fra ${tjeneste}:`}</Normaltekst>
            {ressurs.status === RessursStatus.SUKSESS && (
                <Normaltekst children={`suksess (${ressurs.data})`} />
            )}
            {ressurs.status === RessursStatus.HENTER && <NavFrontendSpinner />}
            {ressurs.status === RessursStatus.FEILET && (
                <Normaltekst children={`feilet (${ressurs.frontendFeilmelding})`} />
            )}
        </div>
    );
};

export default Helse;
