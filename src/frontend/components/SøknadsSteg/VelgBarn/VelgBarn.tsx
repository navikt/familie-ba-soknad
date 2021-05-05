import React from 'react';

import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import { mapBarnResponsTilBarn } from '../../../utils/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from './spørsmål';
import { useVelgBarn } from './useVelgBarn';

const BarnekortContainer = styled.div`
    columns: 2;
    column-gap: 0.3rem;
    margin-top: 5rem;
    @media all and ${device.mobile} {
        columns: 1;
    }
`;

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

    const barnFraRespons = mapBarnResponsTilBarn(søknad.søker.barn);
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;
    const barn = barnFraRespons.concat(barnManueltLagtTil);

    return (
        <Steg
            tittel={<SpråkTekst id={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.velgBarn]} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: () => {
                    oppdaterSøknad();
                },
            }}
        >
            <AlertStripe form={'inline'}>
                <SpråkTekst id={'hvilkebarn.info.alert'} />
            </AlertStripe>

            <EksternLenke
                lenkeSpråkId={'#'}
                lenkeTekstSpråkId={'hvilkebarn.endre-opplysninger.lenketekst'}
            />

            <BarnekortContainer id={VelgBarnSpørsmålId.velgBarn}>
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
