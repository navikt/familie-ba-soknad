import React from 'react';

import { FormattedMessage } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { JaNeiSpørsmål } from '@navikt/familie-form-elements';

import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { skjema, kanSendeSkjema } = useOmdeg();

    return (
        <Steg tittel={'Om deg'} kanGåTilNesteSteg={kanSendeSkjema}>
            <Personopplysninger skjema={skjema} />
            <section>
                {skjema.felter.oppholderSegINorge.erSynlig && (
                    <JaNeiSpørsmål
                        {...skjema.felter.oppholderSegINorge.hentNavInputProps(true)}
                        name={'søker.oppholderseginorge'}
                        legend={
                            <>
                                <Element>
                                    <FormattedMessage id={'omdeg.spm.oppholderSegINorge'} />
                                </Element>
                            </>
                        }
                        labelTekstForJaNei={{
                            ja: <FormattedMessage id={'ja'} />,
                            nei: <FormattedMessage id={'nei'} />,
                        }}
                    />
                )}
            </section>
        </Steg>
    );
};

export default OmDeg;
