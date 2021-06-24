import React, { ReactNode, useEffect, useRef } from 'react';

import { guid } from 'nav-frontend-js-utils';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface IJaNeiSpmProps {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    felt: Felt<ESvar | undefined>;
    spørsmålTekstId: string;
    tilleggsinfoTekstId?: string;
    inkluderVetIkke?: boolean;
    språkValues?: Record<string, ReactNode> | undefined;
}

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    spørsmålTekstId,
    tilleggsinfoTekstId,
    inkluderVetIkke = false,
    språkValues,
}) => {
    const ref = useRef<RadioPanelGruppe>(null);

    useEffect(() => {
        const jaNeiRef = ref.current;
        if (jaNeiRef) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jaNeiRef.props.onChange(null, felt.verdi);
        }
    }, [felt.verdi]);

    return felt.erSynlig ? (
        <span id={felt.id}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                initiellVerdi={felt.verdi}
                name={guid()}
                ref={ref}
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
        </span>
    ) : null;
};

export default JaNeiSpm;
