import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';

import { ITidligereSamboer } from '../../../typer/person';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import LeggTilSamboerModal from './LeggTilSamboerModal';
import SamboerOpplysninger from './SamboerOpplysninger';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-top: 0.5rem;
`;

interface Props {
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    tidligereSamboere: ITidligereSamboer[];
}

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <StyledElement>
        <SpråkTekst id={språkId} />
    </StyledElement>
);

const TidligereSamboere: React.FC<Props> = ({ leggTilTidligereSamboer, tidligereSamboere }) => {
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
            {tidligereSamboere.map((samboer: ITidligereSamboer, index: number) => (
                <SamboerOpplysninger key={index} samboer={samboer} />
            ))}
            {tidligereSamboere.length > 0 && (
                <Spørsmål
                    språkId={
                        dinLivssituasjonSpørsmålSpråkId[
                            DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode
                        ]
                    }
                />
            )}
            <StyledFlatKnapp
                htmlType={'button'}
                kompakt
                onClick={() => {
                    toggleModal();
                }}
            >
                <AddCircle />
                <span>
                    <SpråkTekst id={'omdeg.leggtilfleresamboere.leggtil'} />
                </span>
            </StyledFlatKnapp>
            <LeggTilSamboerModal
                leggTilTidligereSamboer={leggTilTidligereSamboer}
                toggleModal={toggleModal}
                erÅpen={erÅpen}
            />
        </>
    );
};
export default TidligereSamboere;
