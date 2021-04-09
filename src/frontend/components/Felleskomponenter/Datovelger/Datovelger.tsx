import React from 'react';

import { css } from 'styled-components';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Feilmelding } from 'nav-frontend-typografi';

import { FamilieDatovelger, ISODateString } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface DatoVelgerProps {
    felt: Felt<ISODateString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    feilTekstId: string;
}

const StyledFamilieDatovelger = styled(FamilieDatovelger)<{ feil: boolean }>`
    ${props =>
        props.feil &&
        css`
            .nav-datovelger:not(:hover) {
                input:not(:focus, :active),
                input:not(:focus, :active) + button {
                    border-color: ${navFarger.redError};
                }
                input:not(:focus, :active) {
                    box-shadow: 0 0 0 1px ${navFarger.redError};
                }
            }
        `}
`;

const Datovelger: React.FC<DatoVelgerProps> = ({ felt, skjema, feilTekstId }) => {
    return felt.erSynlig ? (
        <>
            <StyledFamilieDatovelger
                placeholder={'ddmmåå'}
                valgtDato={felt.verdi}
                label={<SpråkTekst id={feilTekstId} />}
                {...felt.hentNavBaseSkjemaProps(skjema.visFeilmeldinger)}
                onChange={dato => {
                    felt.hentNavInputProps(false).onChange(dato);
                }}
                feil={!!(felt.feilmelding && skjema.visFeilmeldinger)}
            />
            {skjema.visFeilmeldinger && <Feilmelding>{felt.feilmelding}</Feilmelding>}
        </>
    ) : null;
};

export default Datovelger;
