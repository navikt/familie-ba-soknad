import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';

import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import LeggTilSamboerModal from './LeggTilSamboerModal';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-top: 0.5rem;
`;

interface Props {
    leggTilTidligereSamboer: () => void;
    tidligereSamboere: string[];
}

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <Element>
        <SpråkTekst id={språkId} />
    </Element>
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
            {tidligereSamboere[0] && (
                <div>DETTE ER EN PLACEHOLDER FOR FØRSTE TIDLIGERE SAMBOER MED NUMMER 0</div>
            )}
            {tidligereSamboere.length > 0 && (
                <>
                    <Spørsmål
                        språkId={
                            dinLivssituasjonSpørsmålSpråkId[
                                DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode
                            ]
                        }
                    />
                    {tidligereSamboere.slice(1).map((_samboer: string, index: number) => (
                        <div key={index}>
                            DETTE ER EN PLACEHOLDER FOR FØRSTE TIDLIGERE SAMBOER MED NUMMER
                            {index + 1}
                        </div>
                    ))}
                </>
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
