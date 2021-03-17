import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { NedChevron } from 'nav-frontend-chevron';
import navFarger from 'nav-frontend-core';
import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import { useApp } from '../../../context/AppContext';
import { hentAlder } from '../../../utils/person';
import { StyledAlertStripe } from '../1-OmDeg/layoutKomponenter';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { useVelgBarn } from './useVelgBarn';

const BarnekortContainer = styled.div<{ kunEttBarn: boolean }>`
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    margin-top: 1rem;
    justify-content: ${props => (props.kunEttBarn ? 'center' : 'flex-start')};
    width: ${props => (props.kunEttBarn ? 'auto' : '38.75rem')};
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

    const kunEttBarn = søknad.søker.barn.length === 1;

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
            tittel={<FormattedMessage id={'velgbarn.tittel'} />}
            skjema={skjema}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
        >
            <StyledAlertStripe type={'info'} form={'inline'}>
                <FormattedMessage id={'velgbarn.info.folkeregisteret'} />
            </StyledAlertStripe>

            <LenkeMedChevron href={intl.formatMessage({ id: 'velgbarn.regelverkinfo.lenke' })}>
                <FormattedMessage id={'velgbarn.regelverkinfo.lenke.tittel'} />
            </LenkeMedChevron>

            <BarnekortContainer id={'barnMedISøknad'} kunEttBarn={kunEttBarn}>
                {søknad.søker.barn.map(barn => (
                    <Barnekort
                        key={barn.ident}
                        {...barn}
                        alder={hentAlder(barn.fødselsdato)}
                        settMedISøknad={settMedISøknad}
                    />
                ))}
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
