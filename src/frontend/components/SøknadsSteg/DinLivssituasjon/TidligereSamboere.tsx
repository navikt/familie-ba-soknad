import React from 'react';

import styled from 'styled-components';

import { Label } from '@navikt/ds-react';

import { ITidligereSamboer } from '../../../typer/person';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
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
    <StyledLabel>
        <SpråkTekst id={språkId} />
    </StyledLabel>
);

const TidligereSamboere: React.FC<Props> = ({
    leggTilTidligereSamboer,
    tidligereSamboere,
    fjernTidligereSamboer,
}) => {
    const { toggleModal, erÅpen } = useModal();

    return (
        <>
            <Spørsmål
                språkId={
                    dinLivssituasjonSpørsmålSpråkId[
                        DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                    ]
                }
            />
            {tidligereSamboere?.map((samboer: ITidligereSamboer, index: number) => (
                <SamboerOpplysninger
                    key={index}
                    samboer={samboer}
                    fjernTidligereSamboer={fjernTidligereSamboer}
                />
            ))}
            <LeggTilKnapp språkTekst="omdeg.leggtilfleresamboere.leggtil" onClick={toggleModal} />
            <LeggTilSamboerModal
                leggTilTidligereSamboer={leggTilTidligereSamboer}
                toggleModal={toggleModal}
                erÅpen={erÅpen}
            />
        </>
    );
};
export default TidligereSamboere;
