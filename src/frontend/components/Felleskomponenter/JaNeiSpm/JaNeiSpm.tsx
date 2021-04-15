import React from 'react';

import { guid } from 'nav-frontend-js-utils';
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
}

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({
    skjema,
    felt,
    spørsmålTekstId,
    tilleggsinfoTekstId,
}) => {
    return felt.erSynlig ? (
        <span id={felt.id}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                initiellVerdi={felt.verdi}
                name={guid()}
                legend={
                    <>
                        <Element>
                            <SpråkTekst id={spørsmålTekstId} />
                        </Element>
                        {tilleggsinfoTekstId && (
                            <Normaltekst>
                                <SpråkTekst id={tilleggsinfoTekstId} />
                            </Normaltekst>
                        )}
                    </>
                }
                labelTekstForJaNei={{
                    ja: <SpråkTekst id={'ja'} />,
                    nei: <SpråkTekst id={'nei'} />,
                }}
            />
        </span>
    ) : null;
};

export default JaNeiSpm;
