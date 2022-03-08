import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useEøs } from '../../../../context/EøsContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { barnetsNavnValue, skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import EøsAndreForelderOppsummering from '../../Oppsummering/OppsummeringSteg/Eøs/EøsAndreForelderOppsummering';
import { idNummerLandMedPeriodeType } from '../idnummerUtils';
import IdNummerForBarn from './IdNummerForBarn';
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
        settIdNummerFelterForBarn,
    } = useEøsForBarn(barnetsId);
    const intl = useIntl();
    const { erEøsLand } = useEøs();
    const { søknad } = useApp();
    const { eøsBarnetrygdsperioder, utenlandsperioder } = barn;

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id && !!barnISøknad.andreForelder
    );

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
    );

    const skalSpørreOmIdNummerForPågåendeSøknadEøsLand = (): boolean => {
        return (
            barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar !== '' &&
            !idNummerLandMedPeriodeType(
                {
                    utenlandsperioder,
                    eøsBarnetrygdsperioder,
                },
                erEøsLand
            )
                .map(landMedPeriode => landMedPeriode.land)
                .includes(barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar)
        );
    };

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
            <KomponentGruppe>
                {idNummerLandMedPeriodeType(
                    {
                        utenlandsperioder,
                        eøsBarnetrygdsperioder,
                    },
                    erEøsLand
                ).map((landMedPeriodeType, index) => {
                    return (
                        !!landMedPeriodeType.land && (
                            <IdNummerForBarn
                                skjema={skjema}
                                key={index}
                                settIdNummerFelter={settIdNummerFelterForBarn}
                                landAlphaCode={landMedPeriodeType.land}
                                periodeType={landMedPeriodeType.periodeType}
                                barn={barn}
                            />
                        )
                    );
                })}
                {skalSpørreOmIdNummerForPågåendeSøknadEøsLand() && (
                    <IdNummerForBarn
                        skjema={skjema}
                        settIdNummerFelter={settIdNummerFelterForBarn}
                        landAlphaCode={barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar}
                        barn={barn}
                    />
                )}
            </KomponentGruppe>
            {!skalSkjuleAndreForelderFelt(barn) && (
                <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
                    {!barnMedSammeForelder ? (
                        <KomponentGruppe>
                            <Arbeidsperiode
                                skjema={skjema}
                                leggTilArbeidsperiode={leggTilArbeidsperiode}
                                fjernArbeidsperiode={fjernArbeidsperiode}
                                arbeiderEllerArbeidetFelt={skjema.felter.andreForelderArbeidNorge}
                                registrerteArbeidsperioder={
                                    skjema.felter.andreForelderArbeidsperioderNorge
                                }
                                andreForelderData={{
                                    erDød: barn.andreForelderErDød.svar === ESvar.JA,
                                    barn: barn,
                                }}
                            />
                            <Pensjonsperiode
                                skjema={skjema}
                                mottarEllerMottattPensjonFelt={
                                    skjema.felter.andreForelderPensjonNorge
                                }
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
                        </KomponentGruppe>
                    ) : (
                        barnMedSammeForelder?.andreForelder && (
                            <EøsAndreForelderOppsummering
                                barn={barn}
                                andreForelder={barnMedSammeForelder.andreForelder}
                            />
                        )
                    )}
                </SkjemaFieldset>
            )}
        </Steg>
    );
};

export default EøsForBarn;
