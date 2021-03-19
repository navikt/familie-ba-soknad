import React from 'react';

import { FormattedMessage } from 'react-intl';

import { guid } from 'nav-frontend-js-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { hentFeltNavn } from '../../../utils/hjelpefunksjoner';
import { ESvarMedUbesvart, IOmDegFeltTyper } from '../../SøknadsSteg/1-OmDeg/useOmdeg';

interface IJaNeiSpmProps {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    felt: Felt<ESvar | ESvarMedUbesvart>;
    spørsmålTekstId: string;
    tilleggsinfo?: string;
}

const JaNeiSpm: React.FC<IJaNeiSpmProps> = ({ skjema, felt, spørsmålTekstId, tilleggsinfo }) => {
    return felt.erSynlig ? (
        <span id={hentFeltNavn(skjema, felt)}>
            <JaNeiSpørsmål
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                name={guid()}
                legend={
                    <>
                        <Element>
                            <FormattedMessage id={spørsmålTekstId} />
                        </Element>
                        {tilleggsinfo && (
                            <Normaltekst>
                                <FormattedMessage id={tilleggsinfo} />
                            </Normaltekst>
                        )}
                    </>
                }
                labelTekstForJaNei={{
                    ja: <FormattedMessage id={'ja'} />,
                    nei: <FormattedMessage id={'nei'} />,
                }}
            />
        </span>
    ) : null;
};

export default JaNeiSpm;
