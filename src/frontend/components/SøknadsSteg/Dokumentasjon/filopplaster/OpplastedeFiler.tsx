import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { FileContent } from '@navikt/ds-icons';
import { Delete } from '@navikt/ds-icons';

import { IVedlegg } from '../../../../typer/dokumentasjon';
import { formaterFilstørrelse } from './utils';

interface Props {
    filliste: IVedlegg[];
    slettVedlegg: (vedlegg: IVedlegg) => void;
}

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
    return (
        <>
            {filliste.map((fil: IVedlegg, index: number) => {
                return (
                    <div key={fil.dokumentId}>
                        <div className="fil">
                            <div>
                                <FileContent />
                                <Normaltekst className="filnavn">{fil.navn}</Normaltekst>
                                <Normaltekst className="filstørrelse">
                                    ({formaterFilstørrelse(fil.størrelse)})
                                </Normaltekst>
                            </div>
                            <div
                                className="slett"
                                onClick={() => {
                                    slettVedlegg(fil);
                                }}
                            >
                                <Normaltekst>slett</Normaltekst>
                                <Delete />
                            </div>
                        </div>
                        {index === filliste.length - 1 ? '' : <hr />}
                    </div>
                );
            })}
        </>
    );
};

export default OpplastedeFiler;
