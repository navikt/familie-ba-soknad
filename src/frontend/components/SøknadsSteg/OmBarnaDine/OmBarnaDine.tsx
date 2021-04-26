import React from 'react';

import { useHistory } from 'react-router-dom';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { omBarnaDineSpråkTekstId, OmBarnaDineSpørsmålId } from './spørsmål';
import { useOmBarnaDine } from './useOmBarnaDine';

const OmBarnaDine: React.FC = () => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
    } = useOmBarnaDine();

    const history = useHistory();
    const { søknad } = useApp();
    const { barnInkludertISøknaden } = søknad;

    if (!barnInkludertISøknaden.length) {
        history.push('/velg-barn');
        return null;
    }
    return (
        <Steg
            tittel={<SpråkTekst id={'ombarna.sidetittel'} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            settSøknadsdataCallback={oppdaterSøknad}
        >
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erNoenAvBarnaFosterbarn}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.hvemErFosterbarn]}
                        />
                    }
                    skjemafelt={skjema.felter.hvemErFosterbarn}
                    søknadsdatafelt={barnDataKeySpørsmål.erFosterbarn}
                    visFeilmelding={skjema.visFeilmeldinger}
                />

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIInstitusjon}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon]
                    }
                />

                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpråkTekstId[
                                    OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemOppholderSegIInstitusjon}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIInstitusjon}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erBarnAdoptertFraUtland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpråkTekstId[
                                    OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemErAdoptertFraUtland}
                    søknadsdatafelt={barnDataKeySpørsmål.erAdoptertFraUtland}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.JA && (
                    <AlertStripe>
                        <SpråkTekst id={'ombarna.adoptert.alert'} />
                    </AlertStripe>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIUtland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.oppholderBarnSegIUtland]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpråkTekstId[
                                    OmBarnaDineSpørsmålId.hvemOppholderSegIUtland
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemOppholderSegIUtland}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIUtland}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søktAsylForBarn}
                    spørsmålTekstId={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.søktAsylForBarn]}
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.hvemErSøktAsylFor]}
                        />
                    }
                    skjemafelt={skjema.felter.hvemErSøktAsylFor}
                    søknadsdatafelt={barnDataKeySpørsmål.erAsylsøker}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.søktAsylForBarn.verdi === ESvar.JA && (
                    <AlertStripe>
                        <SpråkTekst id={'ombarna.asyl.alert'} />
                    </AlertStripe>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[
                            OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                        ]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpråkTekstId[
                                    OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemTolvMndSammenhengendeINorge}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholdtSegINorgeSammenhengendeTolvMnd}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[
                            OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                        ]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpråkTekstId[
                                    OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemBarnetrygdFraAnnetEøsland}
                    søknadsdatafelt={barnDataKeySpørsmål.barnetrygdFraAnnetEøsland}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default OmBarnaDine;
