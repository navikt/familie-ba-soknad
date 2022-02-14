import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { BarnetsId } from '../../../typer/common';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { Årsak } from '../../../typer/utvidet';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import AndreForelder from './AndreForelder';
import { OmBarnetHeader } from './OmBarnetHeader';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';

const EksternLenkeContainer = styled.div`
    margin-bottom: 4rem;
`;

const OmBarnet: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { erUtvidet, søknad } = useApp();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        andreBarnSomErFyltUt,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilBarnetrygdsperiode,
        fjernBarnetrygdsperiode,
    } = useOmBarnet(barnetsId);
    const intl = useIntl();

    return barn ? (
        <Steg
            tittel={
                <SpråkTekst
                    id={'ombarnet.sidetittel'}
                    values={{ navn: barnetsNavnValue(barn, intl) }}
                />
            }
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <OmBarnetHeader barn={barn} />
            <Oppfølgningsspørsmål
                barn={barn}
                skjema={skjema}
                leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                fjernUtenlandsperiode={fjernUtenlandsperiode}
                utenlandsperioder={utenlandsperioder}
                leggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                fjernBarnetrygdsperiode={fjernBarnetrygdsperiode}
                registrerteEøsBarnetrygdsperioder={skjema.felter.registrerteEøsBarnetrygdsperioder}
            />
            {barn.andreForelder && (
                <AndreForelder
                    barn={barn}
                    skjema={skjema}
                    andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                    andreForelder={barn.andreForelder}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                />
            )}

            {skjema.felter.borFastMedSøker.erSynlig && (
                <SkjemaFieldset tittelId={'ombarnet.bosted'} dynamisk>
                    {barn.andreForelderErDød?.svar !== ESvar.JA && (
                        <>
                            <div>
                                <Normaltekst>
                                    <SpråkTekst id={'ombarnet.bosted-info'} />
                                </Normaltekst>
                            </div>
                            <EksternLenkeContainer>
                                <EksternLenke
                                    lenkeSpråkId={'ombarnet.les-mer-om-bosted.lenke'}
                                    lenkeTekstSpråkId={'ombarnet.les-mer-om-bosted.lenketekst'}
                                    target="_blank"
                                />
                            </EksternLenkeContainer>
                        </>
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borFastMedSøker}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.borFastMedSøker]
                        }
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                    />
                    {skjema.felter.borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker && (
                        <VedleggNotis språkTekstId={'ombarnet.bor-fast.vedleggsinfo'} dynamisk />
                    )}

                    {skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                        <>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.skriftligAvtaleOmDeltBosted}
                                spørsmålTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted
                                    ]
                                }
                                språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                            />
                            {skjema.felter.skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && (
                                <VedleggNotis
                                    språkTekstId={'ombarnet.delt-bosted.vedleggsinfo'}
                                    dynamisk
                                />
                            )}
                        </>
                    )}
                </SkjemaFieldset>
            )}
            {skjema.felter.søkerForTidsrom.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.søkerForTidsrom}
                        spørsmålTekstId={'ombarnet.søker-for-periode.spm'}
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                        tilleggsinfo={
                            <AlertStripe>
                                <SpråkTekst id={'ombarnet.søker-for-periode.alert'} />
                            </AlertStripe>
                        }
                    />
                    {skjema.felter.søkerForTidsromStartdato.erSynlig && (
                        <KomponentGruppe dynamisk>
                            <Datovelger
                                felt={skjema.felter.søkerForTidsromStartdato}
                                skjema={skjema}
                                label={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.søkerForTidsromStartdato
                                            ]
                                        }
                                    />
                                }
                                avgrensMaxDato={dagensDato()}
                            />
                            {erUtvidet &&
                                (søknad.søker.sivilstand.type === ESivilstand.SKILT ||
                                    søknad.søker.utvidet.spørsmål.årsak.svar === Årsak.SKILT) && (
                                    <VedleggNotis
                                        språkTekstId={'ombarnet.barnetrygdtilbakeitid.info'}
                                    />
                                )}
                            <>
                                <Datovelger
                                    felt={skjema.felter.søkerForTidsromSluttdato}
                                    tilhørendeFraOgMedFelt={skjema.felter.søkerForTidsromStartdato}
                                    skjema={skjema}
                                    label={
                                        <SpråkTekst
                                            id={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.søkerForTidsromSluttdato
                                                ]
                                            }
                                        />
                                    }
                                    disabled={
                                        skjema.felter.søkerForTidsromSluttdatoVetIkke.verdi ===
                                        ESvar.JA
                                    }
                                    avgrensDatoFremITid
                                />
                                <SkjemaCheckbox
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.søkerForTidsromSluttdatoVetIkke
                                        ]
                                    }
                                    felt={skjema.felter.søkerForTidsromSluttdatoVetIkke}
                                />
                            </>
                            <AlertStripe>
                                <SpråkTekst id={'ombarnet.søker-for-periode.sluttdato.info'} />
                            </AlertStripe>
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            )}
            {skjema.felter.søkerHarBoddMedAndreForelder.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.søkerHarBoddMedAndreForelder}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[
                                OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder
                            ]
                        }
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                    />
                    {skjema.felter.søkerFlyttetFraAndreForelderDato.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <>
                                <Datovelger
                                    felt={skjema.felter.søkerFlyttetFraAndreForelderDato}
                                    skjema={skjema}
                                    label={
                                        <SpråkTekst
                                            id={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId
                                                        .søkerFlyttetFraAndreForelderDato
                                                ]
                                            }
                                        />
                                    }
                                    disabled={
                                        skjema.felter.borMedAndreForelderCheckbox.verdi === ESvar.JA
                                    }
                                    avgrensDatoFremITid={true}
                                />
                                {skjema.felter.borMedAndreForelderCheckbox.erSynlig && (
                                    <div>
                                        <SkjemaCheckbox
                                            felt={skjema.felter.borMedAndreForelderCheckbox}
                                            visFeilmeldinger={skjema.visFeilmeldinger}
                                            labelSpråkTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.søkerBorMedAndreForelder
                                                ]
                                            }
                                        />
                                        <VedleggNotis
                                            språkTekstId={'ombarnet.nårflyttetfra.info'}
                                            dynamisk
                                        />
                                    </div>
                                )}
                            </>
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            )}
        </Steg>
    ) : null;
};

export default OmBarnet;
