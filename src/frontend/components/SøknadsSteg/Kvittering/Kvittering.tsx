import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import Steg from '../../Felleskomponenter/Steg/Steg';

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
