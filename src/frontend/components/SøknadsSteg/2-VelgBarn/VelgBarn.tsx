import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import { hentAlder } from '../../../utils/person';
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
`;

const VelgBarn: React.FC = () => {
    const { søknad, settSøknad } = useApp();
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk } = useVelgBarn();

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
            <FormattedMessage id={'velgbarn.undertittel'} />

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
