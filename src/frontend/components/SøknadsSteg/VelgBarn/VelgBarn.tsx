import React from 'react';

import { Alert, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
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
    const { toggles } = useFeatureToggles();

    const barnFraRespons = søknad.søker.barn;
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;
    const barn = barnFraRespons.concat(barnManueltLagtTil);

    const stegTekster = tekster()[ESanitySteg.VELG_BARN];
    const { velgBarnGuide } = stegTekster;

    const visGammelInfo = !toggles.VIS_GUIDE_I_STEG || !velgBarnGuide;

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
                {visGammelInfo && (
                    <Alert variant={'info'} inline>
                        <SpråkTekst id={'hvilkebarn.info.alert'} />
                        <EksternLenke
                            lenkeSpråkId={'hvilkebarn.endre-opplysninger.lenke'}
                            lenkeTekstSpråkId={'hvilkebarn.endre-opplysninger.lenketekst'}
                            target="_blank"
                        />
                    </Alert>
                )}
                <VStack
                    id={VelgBarnSpørsmålId.velgBarn}
                    className={'BarnekortStack'}
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
            </Steg>
            {erÅpen && <LeggTilBarnModal erÅpen={erÅpen} lukkModal={lukkModal} />}
        </>
    );
};

export default VelgBarn;
