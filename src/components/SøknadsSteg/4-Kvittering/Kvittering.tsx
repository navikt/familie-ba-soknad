import React, { useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { RessursStatus } from '@navikt/familie-typer';
import { useHistory } from 'react-router-dom';
import Steg from '../Steg/Steg';
import AlertStripe from 'nav-frontend-alertstriper';

const Kvittering: React.FC = () => {
    const { innsendingStatus } = useApp();
    const history = useHistory();

    useEffect(() => {
        if (innsendingStatus.status !== RessursStatus.SUKSESS) {
            history.push('/');
        }
    }, []);

    return (
        <Steg tittel={'Takk for søknaden'} erSpørsmålBesvart={true}>
            <AlertStripe type="suksess">Søknaden din om barnetrygd er mottatt</AlertStripe>
        </Steg>
    );
};

export default Kvittering;
