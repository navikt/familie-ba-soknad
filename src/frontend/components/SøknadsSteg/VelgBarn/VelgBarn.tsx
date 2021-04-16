import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { NedChevron } from 'nav-frontend-chevron';
import navFarger from 'nav-frontend-core';
import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { IBarn } from '../../../typer/person';
import { genererInitialBarnMedISøknad, mapBarnResponsTilBarn } from '../../../utils/person';
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
    const { søknad, settSøknad } = useApp();
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk } = useVelgBarn();
    const intl = useIntl();

    const settMedISøknad = (barn: IBarn, erMedISøknad: boolean) => {
        const skalVæreMed = !erMedISøknad;

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: skalVæreMed
                ? søknad.barnInkludertISøknaden.concat(genererInitialBarnMedISøknad(barn))
                : søknad.barnInkludertISøknaden.filter(
                      barnMedISøknad => barnMedISøknad.ident !== barn.ident
                  ),
        });
    };

    const barnFraRespons = mapBarnResponsTilBarn(søknad.søker.barn);
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;

    return (
        <Steg
            tittel={<SpråkTekst id={'velgbarn.tittel'} />}
            skjema={skjema}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            settSøknadsdataCallback={() => {
                // TODO: Bytt ut settMedISøknad med noe fra useVelgBarn
            }}
        >
            <AlertStripe form={'inline'}>
                <SpråkTekst id={'velgbarn.info.folkeregisteret'} />
            </AlertStripe>

            <LenkeMedChevron href={intl.formatMessage({ id: 'velgbarn.regelverkinfo.lenke' })}>
                <SpråkTekst id={'velgbarn.regelverkinfo.lenke.tittel'} />
            </LenkeMedChevron>

            <BarnekortContainer id={'barnMedISøknad'}>
                {barnFraRespons.map(barn => (
                    <Barnekort key={barn.ident} barn={barn} settMedISøknad={settMedISøknad} />
                ))}
                {barnManueltLagtTil.map(barn => (
                    <Barnekort key={barn.ident} barn={barn} settMedISøknad={settMedISøknad} />
                ))}
                <NyttBarnKort />
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
