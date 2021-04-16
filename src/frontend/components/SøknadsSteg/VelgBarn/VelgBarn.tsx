import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { NedChevron } from 'nav-frontend-chevron';
import navFarger from 'nav-frontend-core';
import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { mapBarnResponsTilBarn } from '../../../utils/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { useVelgBarn } from './useVelgBarn';

const BarnekortContainer = styled.div`
    columns: 2;
    column-gap: 0.3rem;
    @media all and ${device.mobile} {
        columns: 1;
    }
`;

const LenkeContainer = styled.div`
    padding: 2rem 0;
    color: ${navFarger.navBla};
`;

const LenkeMedChevron: React.FC<LenkeProps> = props => (
    <LenkeContainer>
        <Lenke {...props} />
        <NedChevron />
    </LenkeContainer>
);

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        håndterVelgBarnToggle,
        barnSomSkalVæreMed,
    } = useVelgBarn();
    const intl = useIntl();

    const barnFraRespons = mapBarnResponsTilBarn(søknad.søker.barn);
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;
    const barn = barnFraRespons.concat(barnManueltLagtTil);

    return (
        <Steg
            tittel={<SpråkTekst id={'velgbarn.tittel'} />}
            skjema={skjema}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            settSøknadsdataCallback={() => {
                oppdaterSøknad();
            }}
        >
            <AlertStripe form={'inline'}>
                <SpråkTekst id={'velgbarn.info.folkeregisteret'} />
            </AlertStripe>

            <LenkeMedChevron href={intl.formatMessage({ id: 'velgbarn.regelverkinfo.lenke' })}>
                <SpråkTekst id={'velgbarn.regelverkinfo.lenke.tittel'} />
            </LenkeMedChevron>

            <BarnekortContainer id={'barnMedISøknad'}>
                {barn.map(barn => (
                    <Barnekort
                        key={barn.ident}
                        barn={barn}
                        velgBarnCallback={håndterVelgBarnToggle}
                        barnSomSkalVæreMed={barnSomSkalVæreMed}
                    />
                ))}
                <NyttBarnKort />
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
