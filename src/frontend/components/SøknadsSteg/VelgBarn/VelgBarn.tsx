import React, { useState } from 'react';

import Masonry from 'react-masonry-css';
import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { AdressebeskyttetKort } from './Barnekort/AdressebeskyttetKort';
import Barnekort from './Barnekort/Barnekort';
import LeggTilBarnModal from './LeggTilBarn/LeggTilBarnModal';
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
const LenkeContainer = styled.div`
    margin-top: 1.5rem;
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

    const [modalÅpen, settModalÅpen] = useState<boolean>(false);

    const barnFraRespons = søknad.søker.barn.filter(barn => !barn.adressebeskyttelse);
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;
    const barn = barnFraRespons.concat(barnManueltLagtTil);
    const harBarnMedBeskyttaAdresse = !!søknad.søker.barn.find(barn => barn.adressebeskyttelse);

    const toggleModal = () => {
        settModalÅpen(!modalÅpen);
    };

    return (
        <>
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
                    <EksternLenke
                        lenkeSpråkId={'hvilkebarn.endre-opplysninger.lenke'}
                        lenkeTekstSpråkId={'hvilkebarn.endre-opplysninger.lenketekst'}
                        target="_blank"
                    />
                </AlertStripe>

                <BarnekortContainer
                    id={VelgBarnSpørsmålId.velgBarn}
                    className={'BarnekortContainer'}
                    breakpointCols={{
                        default: 2,
                        480: 1,
                    }}
                >
                    {barn.map(barnet => (
                        <Barnekort
                            key={barnet.id}
                            barn={barnet}
                            velgBarnCallback={håndterVelgBarnToggle}
                            barnSomSkalVæreMed={barnSomSkalVæreMed}
                            fjernBarnCallback={fjernBarn}
                        />
                    ))}
                    {harBarnMedBeskyttaAdresse && <AdressebeskyttetKort />}
                    <NyttBarnKort onLeggTilBarn={toggleModal} />
                </BarnekortContainer>
                <LenkeContainer>
                    <EksternLenke
                        lenkeSpråkId={'hvilkebarn.regelverk.lenke'}
                        lenkeTekstSpråkId={'hvilkebarn.regelverk.lenketekst'}
                        target="_blank"
                    />
                </LenkeContainer>
            </Steg>
            <LeggTilBarnModal modalÅpen={modalÅpen} settModalÅpen={settModalÅpen} />
        </>
    );
};

export default VelgBarn;
