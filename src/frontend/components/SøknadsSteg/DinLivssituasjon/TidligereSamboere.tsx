import React from 'react';

import styled from 'styled-components';

import { Label } from '@navikt/ds-react';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { ITidligereSamboer } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { hentLeggTilPeriodeTekster } from '../../../utils/modaler';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import LeggTilSamboerModal from './LeggTilSamboerModal';
import SamboerOpplysninger from './SamboerOpplysninger';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

interface Props {
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    tidligereSamboere: ITidligereSamboer[];
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
}

const StyledLabel = styled(Label)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <StyledLabel forwardedAs="p">
        <SpråkTekst id={språkId} />
    </StyledLabel>
);

const TidligereSamboere: React.FC<Props> = ({
    leggTilTidligereSamboer,
    tidligereSamboere,
    fjernTidligereSamboer,
}) => {
    const { toggles } = useFeatureToggles();
    const {
        lukkModal: lukkLeggTilSamboerModal,
        åpneModal: åpneLeggTilSamboerModal,
        erÅpen: erLeggTilSamboerModalÅpen,
    } = useModal();

    let leggTilPeriodeTekster: ReturnType<typeof hentLeggTilPeriodeTekster> = undefined;

    if (toggles.NYE_MODAL_TEKSTER) {
        const antallPerioder = tidligereSamboere.length;
        leggTilPeriodeTekster = hentLeggTilPeriodeTekster(
            'tidligereSamboere',
            PersonType.Søker,
            antallPerioder
        );
    }

    return (
        <>
            <Spørsmål
                språkId={
                    dinLivssituasjonSpørsmålSpråkId[
                        DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                    ]
                }
            />
            <PerioderContainer>
                {tidligereSamboere?.map((samboer: ITidligereSamboer, index: number) => (
                    <SamboerOpplysninger
                        key={index}
                        samboer={samboer}
                        fjernTidligereSamboer={fjernTidligereSamboer}
                    />
                ))}
                <LeggTilKnapp
                    språkTekst="omdeg.leggtilfleresamboere.leggtil"
                    forklaring={leggTilPeriodeTekster?.tekstForKnapp}
                    onClick={åpneLeggTilSamboerModal}
                />
            </PerioderContainer>
            {erLeggTilSamboerModalÅpen && (
                <LeggTilSamboerModal
                    leggTilTidligereSamboer={leggTilTidligereSamboer}
                    lukkModal={lukkLeggTilSamboerModal}
                    erÅpen={erLeggTilSamboerModalÅpen}
                    forklaring={leggTilPeriodeTekster?.tekstForModal}
                />
            )}
        </>
    );
};
export default TidligereSamboere;
