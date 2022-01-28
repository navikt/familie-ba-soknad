import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { BarnetsId } from '../../../../typer/common';
import { barnetsNavnValue, skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
    } = useEøsForBarn(barnetsId);
    const intl = useIntl();

    return (
        <Steg
            tittel={
                <SpråkTekst
                    id={'eøs-om-barn.sidetittel'}
                    values={{ barn: barnetsNavnValue(barn, intl) }}
                />
            }
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            {!skalSkjuleAndreForelderFelt(barn) && (
                <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
                    <Arbeidsperiode
                        skjema={skjema}
                        leggTilArbeidsperiode={leggTilArbeidsperiode}
                        fjernArbeidsperiode={fjernArbeidsperiode}
                        arbeiderEllerArbeidetFelt={skjema.felter.andreForelderArbeidNorge}
                        registrerteArbeidsperioder={skjema.felter.andreForelderArbeidsperioderNorge}
                        andreForelderData={{
                            erDød: barn.andreForelderErDød.svar === ESvar.JA,
                            barn: barn,
                        }}
                    />
                    <Pensjonsperiode
                        skjema={skjema}
                        mottarEllerMottattPensjonFelt={skjema.felter.andreForelderPensjonNorge}
                        leggTilPensjonsperiode={leggTilPensjonsperiode}
                        fjernPensjonsperiode={fjernPensjonsperiode}
                        andreForelderData={{
                            erDød: barn.andreForelderErDød.svar === ESvar.JA,
                            barn: barn,
                        }}
                        registrertePensjonsperioder={
                            skjema.felter.andreForelderPensjonsperioderNorge
                        }
                    />
                    <Utbetalingsperiode
                        skjema={skjema}
                        mottarEllerMottattUtbetalingFelt={
                            skjema.felter.andreForelderAndreUtbetalinger
                        }
                        leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiode}
                        fjernUtbetalingsperiode={fjernAndreUtbetalingsperiode}
                        andreForelderData={{
                            erDød: barn.andreForelderErDød.svar === ESvar.JA,
                            barn: barn,
                        }}
                        registrerteUtbetalingsperioder={
                            skjema.felter.andreForelderAndreUtbetalingsperioder
                        }
                    />
                </SkjemaFieldset>
            )}
        </Steg>
    );
};

export default EøsForBarn;
