import React from 'react';

import styled from 'styled-components';

import { BodyLong } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggOppsummering } from '../../Felleskomponenter/VedleggOppsummering';

import AndreForelder from './AndreForelder';
import { OmBarnetHeader } from './OmBarnetHeader';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { barnErUnder16År, useOmBarnet } from './useOmBarnet';

const EksternLenkeContainer = styled.div`
    margin-bottom: 4rem;
`;

const OmBarnet: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { tekster } = useApp();

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

    const stegTekster = tekster()[ESanitySteg.OM_BARNET];
    const { omBarnetGuide } = stegTekster;

    return barn ? (
        <Steg
            tittel={<SpråkTekst id={'ombarnet.sidetittel'} values={{ navn: barn.navn }} />}
            guide={omBarnetGuide}
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
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                />
            )}

            {skjema.felter.borFastMedSøker.erSynlig && (
                <SkjemaFieldset legendSpråkId={'ombarnet.bosted'} dynamisk>
                    {barn.andreForelderErDød?.svar !== ESvar.JA && (
                        <>
                            <div>
                                <BodyLong>
                                    <SpråkTekst id={'ombarnet.bosted-info'} />
                                </BodyLong>
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
                        språkValues={{ navn: barn.navn }}
                    />

                    {skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.skriftligAvtaleOmDeltBosted}
                            spørsmålTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted
                                ]
                            }
                            språkValues={{ navn: barn.navn }}
                        />
                    )}
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
                        språkValues={{ navn: barn.navn }}
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
                                    </div>
                                )}
                            </>
                        </KomponentGruppe>
                    )}
                </KomponentGruppe>
            )}

            <VedleggOppsummering
                vedlegg={[
                    {
                        skalVises: barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA,
                        dokumentasjonsbehov: Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
                    },
                    {
                        skalVises:
                            skjema.felter.borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker,
                        dokumentasjonsbehov: Dokumentasjonsbehov.BOR_FAST_MED_SØKER,
                        flettefeltVerdier: { barnetsNavn: barn.navn },
                    },
                    {
                        skalVises: skjema.felter.skriftligAvtaleOmDeltBosted.verdi === ESvar.JA,
                        dokumentasjonsbehov: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
                    },
                    {
                        skalVises:
                            skjema.felter.borMedAndreForelderCheckbox.erSynlig &&
                            barnErUnder16År(barn),
                        dokumentasjonsbehov: Dokumentasjonsbehov.MEKLINGSATTEST,
                    },
                ]}
            />
        </Steg>
    ) : null;
};

export default OmBarnet;
