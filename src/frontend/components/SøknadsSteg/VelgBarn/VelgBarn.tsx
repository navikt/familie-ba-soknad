import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { NedChevron } from 'nav-frontend-chevron';
import navFarger from 'nav-frontend-core';
import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { hentAlder } from '../../../utils/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
    @media all and ${device.tablet} {
        justify-content: left;
    }
    @media all and ${device.mobile} {
        justify-content: center;
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
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } = useVelgBarn();
    const { barnMedISøknad } = skjema.felter;
    const intl = useIntl();

    const settMedISøknad = (ident: string, skalVæreMed: boolean) => {
        // Hvis barnet allerede er i søknaden, bruk info fra søknad, ellers finn fra søker
        const barn =
            søknad.barn.find(barn => barn.ident === ident) ??
            søknad.søker.barn.find(barn => barn.ident === ident);

        barn &&
            barnMedISøknad.validerOgSettFelt(
                skalVæreMed
                    ? barnMedISøknad.verdi.concat([{ ...barn, alder: hentAlder(barn.fødselsdato) }])
                    : barnMedISøknad.verdi.filter(barn => barn.ident !== ident)
            );
    };

    return (
        <Steg
            tittel={<SpråkTekst id={'velgbarn.tittel'} />}
            skjema={skjema}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            gåVidereOnClickCallback={oppdaterSøknad}
        >
            <AlertStripe form={'inline'}>
                <SpråkTekst id={'velgbarn.info.folkeregisteret'} />
            </AlertStripe>

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
