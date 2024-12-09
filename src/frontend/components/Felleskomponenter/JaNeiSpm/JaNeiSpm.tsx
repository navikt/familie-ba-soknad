import React, { ReactNode } from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { BodyShort } from '@navikt/ds-react';
import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | null>;
    spørsmålTekstId: string;
    tilleggsinfoTekstId?: string;
    tilleggsinfo?: ReactNode;
    inkluderVetIkke?: boolean;
    språkValues?: Record<string, ReactNode> | undefined;
}

const TilleggsinfoWrapper = styled.div`
    margin-top: 0.5rem;
`;

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    spørsmålTekstId,
    tilleggsinfoTekstId,
    tilleggsinfo,
    inkluderVetIkke = false,
    språkValues,
}) => {
    return felt.erSynlig ? (
        <div id={felt.id}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                initiellVerdi={felt.verdi}
                name={uuidv4()}
                size={'medium'}
                error={felt.hentNavInputProps(skjema.visFeilmeldinger).feil}
                legend={
                    <>
                        <SpråkTekst id={spørsmålTekstId} values={språkValues} />
                        {tilleggsinfoTekstId && (
                            <BodyShort>
                                <SpråkTekst id={tilleggsinfoTekstId} />
                            </BodyShort>
                        )}
                        {tilleggsinfo && <TilleggsinfoWrapper>{tilleggsinfo}</TilleggsinfoWrapper>}
                    </>
                }
                labelTekstForRadios={{
                    ja: <SpråkTekst id={'felles.svaralternativ.ja'} />,
                    nei: <SpråkTekst id={'felles.svaralternativ.nei'} />,
                    vetikke: inkluderVetIkke ? (
                        <SpråkTekst id={'felles.svaralternativ.vetikke'} />
                    ) : undefined,
                }}
            />
        </div>
    ) : null;
};

export default JaNeiSpm;
