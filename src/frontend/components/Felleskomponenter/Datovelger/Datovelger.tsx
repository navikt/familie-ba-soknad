import React from 'react';

import { useIntl } from 'react-intl';
import { css } from 'styled-components';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Feilmelding } from 'nav-frontend-typografi';

import { FamilieDatovelger, ISODateString } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface DatoVelgerProps {
    avgrensDatoFremITid?: boolean;
    felt: Felt<ISODateString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    labelTekstId: string;
    disabled?: boolean;
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

const Datovelger: React.FC<DatoVelgerProps> = ({
    avgrensDatoFremITid = false,
    felt,
    skjema,
    labelTekstId,
    disabled = false,
}) => {
    const { formatMessage } = useIntl();

    return felt.erSynlig ? (
        <>
            <StyledFamilieDatovelger
                aria-live={'polite'}
                allowInvalidDateSelection={false}
                limitations={
                    avgrensDatoFremITid
                        ? {
                              maxDate: new Date().toISOString(),
                          }
                        : {}
                }
                placeholder={formatMessage({ id: 'felles.velg-dato.placeholder' })}
                valgtDato={disabled ? '' : felt.verdi}
                label={<SpråkTekst id={labelTekstId} />}
                {...felt.hentNavBaseSkjemaProps(skjema.visFeilmeldinger)}
                onChange={dato => {
                    felt.hentNavInputProps(false).onChange(dato);
                }}
                feil={!!(felt.feilmelding && skjema.visFeilmeldinger)}
                disabled={disabled}
            />
            {skjema.visFeilmeldinger && <Feilmelding>{felt.feilmelding}</Feilmelding>}
        </>
    ) : null;
};

export default Datovelger;
