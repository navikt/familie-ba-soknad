import React from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { barnDataKeySpørsmål } from '../../../typer/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { SøkerMåBrukePDF } from '../../Felleskomponenter/SøkerMåBrukePDF';
import { VedleggNotis, VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { OmBarnaDineSpørsmålId, omBarnaDineSpørsmålSpråkId } from './spørsmål';
import { useOmBarnaDine } from './useOmBarnaDine';

const VedleggNotisWrapper = styled.div`
    margin: -1.5rem 0 4.5rem 0;
`;

const TilleggsinfoWrapper = styled.div`
    margin-top: 0.5rem;
`;

const OmBarnaDine: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useOmBarnaDine();

    const history = useHistory();
    const { søknad } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const { eøsSkruddAv } = useEøs();

    if (!barnInkludertISøknaden.length) {
        history.push('/velg-barn');
        return null;
    }
    return (
        <Steg
            tittel={<SpråkTekst id={'ombarna.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erNoenAvBarnaFosterbarn}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErFosterbarn]
                    }
                    skjemafelt={skjema.felter.hvemErFosterbarn}
                    søknadsdatafelt={barnDataKeySpørsmål.erFosterbarn}
                    nullstillValgteBarn={skjema.felter.erNoenAvBarnaFosterbarn.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIInstitusjon}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon
                        ]
                    }
                />

                <HvilkeBarnCheckboxGruppe
                    legendSpråkId={
                        omBarnaDineSpørsmålSpråkId[
                            OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon
                        ]
                    }
                    skjemafelt={skjema.felter.hvemOppholderSegIInstitusjon}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIInstitusjon}
                    nullstillValgteBarn={
                        skjema.felter.oppholderBarnSegIInstitusjon.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            {skjema.felter.erBarnAdoptertFraUtland.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erBarnAdoptertFraUtland}
                        spørsmålTekstId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland
                            ]
                        }
                        tilleggsinfo={
                            <TilleggsinfoWrapper>
                                <AlertStripe dynamisk>
                                    <SpråkTekst id={'ombarna.adoptert.info'} />
                                </AlertStripe>
                            </TilleggsinfoWrapper>
                        }
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendSpråkId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland
                            ]
                        }
                        skjemafelt={skjema.felter.hvemErAdoptertFraUtland}
                        søknadsdatafelt={barnDataKeySpørsmål.erAdoptertFraUtland}
                        nullstillValgteBarn={
                            skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.NEI
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                    {skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.JA && (
                        <VedleggNotisWrapper>
                            <VedleggNotis dynamisk språkTekstId={'ombarna.adoptert.alert'} />
                        </VedleggNotisWrapper>
                    )}
                </KomponentGruppe>
            )}

            {skjema.felter.søktAsylForBarn.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.søktAsylForBarn}
                        spørsmålTekstId={
                            omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.søktAsylForBarn]
                        }
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendSpråkId={
                            omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErSøktAsylFor]
                        }
                        skjemafelt={skjema.felter.hvemErSøktAsylFor}
                        søknadsdatafelt={barnDataKeySpørsmål.erAsylsøker}
                        nullstillValgteBarn={skjema.felter.søktAsylForBarn.verdi === ESvar.NEI}
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                    {skjema.felter.søktAsylForBarn.verdi === ESvar.JA && (
                        <VedleggNotisWrapper>
                            <VedleggNotis dynamisk språkTekstId={'ombarna.asyl.alert'} />
                        </VedleggNotisWrapper>
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge}
                        spørsmålTekstId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                            ]
                        }
                    />
                    {skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi ===
                        ESvar.NEI && (
                        <AlertStripe>
                            <SpråkTekst id={'felles.korteopphold.info'} />
                        </AlertStripe>
                    )}
                    <HvilkeBarnCheckboxGruppe
                        legendSpråkId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge
                            ]
                        }
                        skjemafelt={skjema.felter.hvemTolvMndSammenhengendeINorge}
                        søknadsdatafelt={barnDataKeySpørsmål.boddMindreEnn12MndINorge}
                        nullstillValgteBarn={
                            skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi ===
                            ESvar.JA
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                </KomponentGruppe>
            )}

            {skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland}
                        spørsmålTekstId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                            ]
                        }
                    />

                    <HvilkeBarnCheckboxGruppe
                        legendSpråkId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland
                            ]
                        }
                        skjemafelt={skjema.felter.hvemBarnetrygdFraAnnetEøsland}
                        søknadsdatafelt={barnDataKeySpørsmål.barnetrygdFraAnnetEøsland}
                        nullstillValgteBarn={
                            skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.verdi === ESvar.NEI
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    >
                        {skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.verdi === ESvar.JA &&
                            (eøsSkruddAv ? (
                                <SøkerMåBrukePDF advarselTekstId={'ombarna.barnetrygd-eøs.alert'} />
                            ) : (
                                <VedleggNotisTilleggsskjema
                                    språkTekstId={'ombarna.barnetrygd-eøs.eøs-info'}
                                />
                            ))}
                    </HvilkeBarnCheckboxGruppe>

                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erAvdødPartnerForelder}
                        spørsmålTekstId={
                            omBarnaDineSpørsmålSpråkId[søknad.erAvdødPartnerForelder.id]
                        }
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendSpråkId={
                            omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemAvdødPartner]
                        }
                        skjemafelt={skjema.felter.hvemAvdødPartner}
                        søknadsdatafelt={barnDataKeySpørsmål.andreForelderErDød}
                        nullstillValgteBarn={
                            skjema.felter.erAvdødPartnerForelder.verdi === ESvar.NEI
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                </KomponentGruppe>
            )}
        </Steg>
    );
};

export default OmBarnaDine;
