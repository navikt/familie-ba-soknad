import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { FileContent } from '@navikt/ds-icons';
import { Delete } from '@navikt/ds-icons';

import { IVedlegg } from '../../../../typer/dokumentasjon';
import { formaterFilstørrelse } from './utils';

interface Props {
    filliste: IVedlegg[];
    slettVedlegg: (vedlegg: IVedlegg) => void;
}

const FilContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const FilTekstContainer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
`;

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
    return (
        <>
            {filliste.map((fil: IVedlegg, index: number) => {
                return (
                    <FilContainer key={fil.dokumentId}>
                        <FilTekstContainer>
                            <FileContent />
                            <Normaltekst>{fil.navn}</Normaltekst>
                            <Normaltekst className="filstørrelse">
                                ({formaterFilstørrelse(fil.størrelse)})
                            </Normaltekst>
                        </FilTekstContainer>
                        <Flatknapp mini kompakt onClick={() => slettVedlegg(fil)}>
                            <span>Slett</span>
                            <Delete />
                        </Flatknapp>
                        {index === filliste.length - 1 ? '' : <hr />}
                    </FilContainer>
                );
            })}
        </>
    );
};

export default OpplastedeFiler;
