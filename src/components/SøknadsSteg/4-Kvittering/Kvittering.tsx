import React, { useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { RessursStatus } from '@navikt/familie-typer';
import { useHistory } from 'react-router-dom';
import Steg from '../Steg/Steg';
import AlertStripe from 'nav-frontend-alertstriper';

const Kvittering: React.FC = () => {
    const { innsendingStatus } = useApp();
    const innsendtDato =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : null;

    const klokkeslett = innsendtDato?.toLocaleTimeString();
    const dato = innsendtDato?.toLocaleDateString();

    return (
        <Steg tittel={'Takk for søknaden'} erSpørsmålBesvart={true}>
            <AlertStripe type="suksess">
                {`Søknaden din om barnetrygd er mottatt ${klokkeslett}, 
                ${dato}`}
            </AlertStripe>
        </Steg>
    );
};

export default Kvittering;
