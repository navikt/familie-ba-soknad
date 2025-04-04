import React from 'react';

import { useAppContext } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import Steg from '../../Felleskomponenter/Steg/Steg';

import Barnekort from './Barnekort/Barnekort';
import LeggTilBarnModal from './LeggTilBarn/LeggTilBarnModal';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { useVelgBarn } from './useVelgBarn';

const VelgBarn: React.FC = () => {
    const { søknad, tekster } = useAppContext();
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
    const { velgBarnTittel, velgBarnGuide } = stegTekster;

    return (
        <>
            <Steg
                tittel={<TekstBlock block={velgBarnTittel} />}
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
            </Steg>
            {erÅpen && <LeggTilBarnModal erÅpen={erÅpen} lukkModal={lukkModal} />}
        </>
    );
};

export default VelgBarn;
