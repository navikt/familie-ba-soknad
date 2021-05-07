import React from 'react';

import Masonry from 'react-masonry-css';
import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import { mapBarnResponsTilBarn } from '../../../utils/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from './spørsmål';
import { useVelgBarn } from './useVelgBarn';

/**
 * Vi har prøvd mye for å få til masonry, men før denne teknologien blir implementert
 * av nettlesere ser det ut til at javascript må til for å få godt pakka barnekortkontainer.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout
 */
const BarnekortContainer = styled(Masonry)`
    display: flex;
    margin-top: 5rem;
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
        fjernBarn,
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

            <BarnekortContainer
                id={VelgBarnSpørsmålId.velgBarn}
                className={'BarnekortContainer'}
                breakpointCols={{
                    default: 2,
                    480: 1,
                }}
            >
                {barn.map(barn => (
                    <Barnekort
                        key={barn.ident}
                        barn={barn}
                        velgBarnCallback={håndterVelgBarnToggle}
                        barnSomSkalVæreMed={barnSomSkalVæreMed}
                        fjernBarnCallback={fjernBarn}
                    />
                ))}
                <NyttBarnKort />
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
