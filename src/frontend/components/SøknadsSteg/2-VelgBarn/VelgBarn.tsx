import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { NedChevron } from 'nav-frontend-chevron';
import navFarger from 'nav-frontend-core';
import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import { useApp } from '../../../context/AppContext';
import { hentAlder } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { StyledAlertStripe } from '../1-OmDeg/layoutKomponenter';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { useVelgBarn } from './useVelgBarn';

const BarnekortContainer = styled.div`
    display: flex;
    align-items: flex-start;
    flex-flow: row wrap;
    margin: 1rem auto 0;
    justify-content: space-between;
    width: 100%;
    text-align: left;
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

    function settMedISøknad(ident: string, skalVæreMed: boolean) {
        const barn = søknad.søker.barn.find(barn => barn.ident === ident);

        barn &&
            settSøknad({
                ...søknad,
                barn: skalVæreMed
                    ? søknad.barn.concat([{ ...barn, alder: hentAlder(barn.fødselsdato) }])
                    : søknad.barn.filter(barn => barn.ident !== ident),
            });
    }

    return (
        <Steg
            tittel={<SpråkTekst id={'velgbarn.tittel'} />}
            skjema={skjema}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
        >
            <StyledAlertStripe type={'info'} form={'inline'}>
                <SpråkTekst id={'velgbarn.info.folkeregisteret'} />
            </StyledAlertStripe>

            <LenkeMedChevron href={intl.formatMessage({ id: 'velgbarn.regelverkinfo.lenke' })}>
                <SpråkTekst id={'velgbarn.regelverkinfo.lenke.tittel'} />
            </LenkeMedChevron>

            <BarnekortContainer id={'barnMedISøknad'}>
                {søknad.søker.barn.map(barn => (
                    <Barnekort
                        key={barn.ident}
                        {...barn}
                        alder={hentAlder(barn.fødselsdato)}
                        settMedISøknad={settMedISøknad}
                    />
                ))}
                <NyttBarnKort />
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
