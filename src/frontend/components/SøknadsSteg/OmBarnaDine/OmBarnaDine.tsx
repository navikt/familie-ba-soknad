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
import { omBarnaDineSpørsmålSpråkId, OmBarnaDineSpørsmålId } from './spørsmål';
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
                    legend={
                        <SpråkTekst
                            id={omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErFosterbarn]}
                        />
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
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemOppholderSegIInstitusjon}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIInstitusjon}
                    nullstillValgteBarn={
                        skjema.felter.oppholderBarnSegIInstitusjon.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            <KomponentGruppe dynamisk>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erBarnAdoptertFraUtland}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemErAdoptertFraUtland}
                    søknadsdatafelt={barnDataKeySpørsmål.erAdoptertFraUtland}
                    nullstillValgteBarn={skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.JA && (
                    <AlertStripe dynamisk>
                        <SpråkTekst id={'ombarna.adoptert.alert'} />
                    </AlertStripe>
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIUtland}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.oppholderBarnSegIUtland]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.hvemOppholderSegIUtland
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemOppholderSegIUtland}
                    søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIUtland}
                    nullstillValgteBarn={skjema.felter.oppholderBarnSegIUtland.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

            <KomponentGruppe dynamisk>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søktAsylForBarn}
                    spørsmålTekstId={
                        omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.søktAsylForBarn]
                    }
                />
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.hvemErSøktAsylFor]}
                        />
                    }
                    skjemafelt={skjema.felter.hvemErSøktAsylFor}
                    søknadsdatafelt={barnDataKeySpørsmål.erAsylsøker}
                    nullstillValgteBarn={skjema.felter.søktAsylForBarn.verdi === ESvar.NEI}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
                {skjema.felter.søktAsylForBarn.verdi === ESvar.JA && (
                    <AlertStripe dynamisk>
                        <SpråkTekst id={'ombarna.asyl.alert'} />
                    </AlertStripe>
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
                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemTolvMndSammenhengendeINorge}
                    søknadsdatafelt={barnDataKeySpørsmål.boddMindreEnn12MndINorge}
                    nullstillValgteBarn={
                        skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi === ESvar.JA
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>

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
                    legend={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland
                                ]
                            }
                        />
                    }
                    skjemafelt={skjema.felter.hvemBarnetrygdFraAnnetEøsland}
                    søknadsdatafelt={barnDataKeySpørsmål.barnetrygdFraAnnetEøsland}
                    nullstillValgteBarn={
                        skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.verdi === ESvar.NEI
                    }
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default OmBarnaDine;
