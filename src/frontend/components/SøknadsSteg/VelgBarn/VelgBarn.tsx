import React from 'react';

import styled from 'styled-components';

import { VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

import Barnekort from './Barnekort/Barnekort';
import LeggTilBarnModal from './LeggTilBarn/LeggTilBarnModal';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from './spørsmål';
import { useVelgBarn } from './useVelgBarn';

const LenkeContainer = styled.div`
    margin-top: 1.5rem;
`;

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();
    const { lukkModal, åpneModal, erÅpen } = useModal();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        håndterVelgBarnToggle,
        barnSomSkalVæreMed,
        fjernBarn,
    } = useVelgBarn();

    const barnFraRespons = søknad.søker.barn;
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;
    const barn = barnFraRespons.concat(barnManueltLagtTil);

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
                <FamilieAlert variant={'info'}>
                    <SpråkTekst id={'hvilkebarn.info.alert'} />
                    <EksternLenke
                        lenkeSpråkId={'hvilkebarn.endre-opplysninger.lenke'}
                        lenkeTekstSpråkId={'hvilkebarn.endre-opplysninger.lenketekst'}
                        target="_blank"
                    />
                </FamilieAlert>

                <VStack
                    id={VelgBarnSpørsmålId.velgBarn}
                    className={'BarnekortContainer'}
                    marginBlock="12"
                    gap="12"
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
                    <NyttBarnKort onLeggTilBarn={åpneModal} />
                </VStack>

                <LenkeContainer>
                    <EksternLenke
                        lenkeSpråkId={'hvilkebarn.regelverk.lenke'}
                        lenkeTekstSpråkId={'hvilkebarn.regelverk.lenketekst'}
                        target="_blank"
                    />
                </LenkeContainer>
            </Steg>
            {erÅpen && <LeggTilBarnModal erÅpen={erÅpen} lukkModal={lukkModal} />}
        </>
    );
};

export default VelgBarn;
