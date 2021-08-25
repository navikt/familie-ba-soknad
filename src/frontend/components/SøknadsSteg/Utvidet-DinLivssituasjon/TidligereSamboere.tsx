import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';

import SkjemaModal from '../../Felleskomponenter/SkjemaModal/SkjemaModal';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-top: 0.5rem;
`;

interface Props {
    leggTilTidligereSamboer: () => void;
    tidligereSamboere: string[];
}

const TidligereSamboere: React.FC<Props> = ({ leggTilTidligereSamboer, tidligereSamboere }) => {
    const { toggleModal, erÅpen } = useModal();

    return (
        <>
            <Element>
                <SpråkTekst
                    id={
                        dinLivssituasjonSpørsmålSpråkId[
                            DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                        ]
                    }
                />
            </Element>
            {tidligereSamboere[0] && (
                <div>DETTE ER EN PLACEHOLDER FOR FØRSTE TIDLIGERE SAMBOER MED NUMMER 0</div>
            )}
            {tidligereSamboere.length > 0 && (
                <>
                    <Element>
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode
                                ]
                            }
                        />
                    </Element>
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

            <SkjemaModal
                modalTittelSpråkId={'Her kommer en tittel på å legge til samboer'}
                submitKnappSpråkId={'Her kommer en tekst'}
                erÅpen={erÅpen}
                toggleModal={toggleModal}
                onSubmitCallback={() => {
                    leggTilTidligereSamboer();
                    toggleModal();
                }}
                valideringErOk={() => true} //TODO
            >
                <p>HER KOMMER DET EN FORM</p>
            </SkjemaModal>
        </>
    );
};
export default TidligereSamboere;
