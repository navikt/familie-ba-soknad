import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { NedChevron } from 'nav-frontend-chevron';
import navFarger from 'nav-frontend-core';
import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { IBarnFraPdl } from '../../../typer/person';
import { genererInitialStateBarn } from '../../../utils/person';
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

    const settMedISøknad = (ident: string, erMedISøknad: boolean) => {
        const skalVæreMed = !erMedISøknad;

        const barnFraPDL: IBarnFraPdl | undefined = søknad.søker.barn.find(
            barn => barn.ident === ident
        );

        if (!barnFraPDL) {
            return;
        }

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: skalVæreMed
                ? søknad.barnInkludertISøknaden.concat(genererInitialStateBarn(barnFraPDL))
                : søknad.barnInkludertISøknaden.filter(barn => barn.ident !== ident),
        });
    };

    return (
        <Steg
            tittel={<SpråkTekst id={'velgbarn.tittel'} />}
            skjema={skjema}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            gåVidereOnClickCallback={() => {
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
                {søknad.søker.barn.map(barn => (
                    <Barnekort key={barn.ident} barnFraPdl={barn} settMedISøknad={settMedISøknad} />
                ))}
                <NyttBarnKort />
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
