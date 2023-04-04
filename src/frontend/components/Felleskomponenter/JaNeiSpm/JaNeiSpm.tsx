import React, { ReactNode, useEffect, useState } from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { AlternativtSvarForInput } from '../../../typer/common';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { logSpørsmålBesvart } from '../../../utils/amplitude';
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
    const [mounted, settMounted] = useState(false);

    useEffect(() => {
        if (mounted) {
            logSpørsmålBesvart(spørsmålTekstId, felt.verdi ?? AlternativtSvarForInput.UKJENT);
        }
        settMounted(true);
    }, [felt.verdi]);

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
                        <Element>
                            <SpråkTekst id={spørsmålTekstId} values={språkValues} />
                        </Element>
                        {tilleggsinfoTekstId && (
                            <Normaltekst>
                                <SpråkTekst id={tilleggsinfoTekstId} />
                            </Normaltekst>
                        )}
                        <TilleggsinfoWrapper>{tilleggsinfo}</TilleggsinfoWrapper>
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
