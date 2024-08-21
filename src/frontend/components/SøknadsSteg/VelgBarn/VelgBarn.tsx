import React from 'react';

import { Alert, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

import Barnekort from './Barnekort/Barnekort';
import LeggTilBarnModal from './LeggTilBarn/LeggTilBarnModal';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from './spørsmål';
import { useVelgBarn } from './useVelgBarn';

const VelgBarn: React.FC = () => {
    const { søknad, tekster } = useApp();
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

    const stegTekster = tekster()[ESanitySteg.VELG_BARN];
    const { velgBarnGuide, finnerIngenBarnAlert } = stegTekster;

    return (
        <>
            <Steg
                tittel={<SpråkTekst id={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.velgBarn]} />}
                guide={velgBarnGuide}
                skjema={{
                    validerFelterOgVisFeilmelding,
                    valideringErOk,
                    skjema,
                    settSøknadsdataCallback: () => {
                        oppdaterSøknad();
                    },
                }}
            >
                <VStack
                    id={VelgBarnSpørsmålId.velgBarn}
                    className={'BarnekortStack'}
                    marginBlock="12"
                    gap="12"
                >
                    {barn.length === 0 && (
                        <Alert variant="info">
                            <TekstBlock block={finnerIngenBarnAlert} />
                        </Alert>
                    )}
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
            </Steg>
            {erÅpen && <LeggTilBarnModal erÅpen={erÅpen} lukkModal={lukkModal} />}
        </>
    );
};

export default VelgBarn;
