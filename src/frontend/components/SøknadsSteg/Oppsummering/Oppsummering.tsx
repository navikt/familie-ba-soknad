import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { RouteEnum } from '../../../routing/Routes';
import { visLabelOgSvar } from '../../../utils/visning';
import Steg from '../Steg/Steg';
import Oppsummeringsbolk from './Oppsummeringsbolk';

const Oppsummering: React.FC = () => {
    const { søknad, innsendingStatus } = useApp();

    return (
        <Steg tittel={'Oppsummering'} erSpørsmålBesvart={true} className={'oppsummering'}>
            <Oppsummeringsbolk tittel="Om Deg">
                {visLabelOgSvar(søknad.søker.verdi.navn, '1rem')}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk tittel="Søknadstype" lenke={RouteEnum.Søknadstype}>
                {visLabelOgSvar(søknad.søknadstype, '1rem')}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk tittel="Barna du søker for" lenke={RouteEnum.VelgBarn}>
                {søknad.barn.verdi
                    .filter(barn => barn.verdi.medISøknad.verdi)
                    .map(barn => {
                        return (
                            <div className={'barn__detaljer'} key={barn.verdi.ident.verdi}>
                                {Object.values(barn.verdi)
                                    .filter(felt => typeof felt.verdi !== 'boolean')
                                    .map(felt => visLabelOgSvar(felt, '1rem'))}
                            </div>
                        );
                    })}
            </Oppsummeringsbolk>
            {innsendingStatus.status === RessursStatus.FEILET && (
                <AlertStripe type="feil">{innsendingStatus.frontendFeilmelding}</AlertStripe>
            )}
        </Steg>
    );
};

export default Oppsummering;
