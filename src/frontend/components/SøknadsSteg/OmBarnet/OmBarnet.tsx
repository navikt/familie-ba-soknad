import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { BarnetsId, ESivilstand } from '../../../typer/person';
import { barnetsNavnValue } from '../../../utils/visning';
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
        settSammeForelder,
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
            barn={barn}
        >
            <OmBarnetHeader barn={barn} />
            <Oppfølgningsspørsmål barn={barn} skjema={skjema} />
            {skjema.felter.andreForelderNavn.erSynlig && (
                <AndreForelder
                    settSammeForelder={settSammeForelder}
                    barn={barn}
                    skjema={skjema}
                    andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                />
            )}

            {skjema.felter.borFastMedSøker.erSynlig && (
                <SkjemaFieldset tittelId={'hvilkebarn.barn.bosted'} dynamisk>
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
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borFastMedSøker}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.borFastMedSøker]
                        }
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                    />

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

            {skjema.felter.søkerForTidsromCheckbox.erSynlig &&
                skjema.felter.søkerForTidsromStartdato.erSynlig &&
                skjema.felter.søkerForTidsromSluttdato.erSynlig && (
                    <SkjemaFieldset
                        tittelId={'ombarnet.søker-for-periode.spm'}
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                        dynamisk
                    >
                        <AlertStripe>
                            <SpråkTekst id={'ombarnet.søker-for-periode.alert'} />
                        </AlertStripe>
                        <Datovelger
                            felt={skjema.felter.søkerForTidsromStartdato}
                            skjema={skjema}
                            labelTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.søkerForTidsromStartdato
                                ]
                            }
                            disabled={skjema.felter.søkerForTidsromCheckbox.verdi === ESvar.JA}
                        />
                        {erUtvidet && søknad.søker.sivilstand.type === ESivilstand.SKILT && (
                            <VedleggNotis språkTekstId={'ombarnet.barnetrygdtilbakeitid.info'} />
                        )}
                        <Datovelger
                            felt={skjema.felter.søkerForTidsromSluttdato}
                            fraOgMedFelt={skjema.felter.søkerForTidsromStartdato}
                            skjema={skjema}
                            labelTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.søkerForTidsromSluttdato
                                ]
                            }
                            disabled={skjema.felter.søkerForTidsromCheckbox.verdi === ESvar.JA}
                        />
                        <SkjemaCheckbox
                            felt={skjema.felter.søkerForTidsromCheckbox}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.søkerIkkeForTidsrom]
                            }
                        />
                    </SkjemaFieldset>
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
                            <Datovelger
                                felt={skjema.felter.søkerFlyttetFraAndreForelderDato}
                                skjema={skjema}
                                labelTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato
                                    ]
                                }
                                disabled={
                                    skjema.felter.borMedAndreForelderCheckbox.verdi === ESvar.JA
                                }
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
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            )}
        </Steg>
    ) : null;
};

export default OmBarnet;
