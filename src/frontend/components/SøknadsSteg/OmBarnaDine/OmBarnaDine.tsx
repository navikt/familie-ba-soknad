import React from 'react';

import { useHistory } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
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
                    felt={skjema.felter.hvemErFosterbarn}
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
                    felt={skjema.felter.hvemOppholderSegIInstitusjon}
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
                    felt={skjema.felter.hvemErAdoptertFraUtland}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
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
                    felt={skjema.felter.hvemOppholderSegIUtland}
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
                    felt={skjema.felter.hvemErSøktAsylFor}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
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
                    felt={skjema.felter.hvemTolvMndSammenhengendeINorge}
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
                    felt={skjema.felter.hvemBarnetrygdFraAnnetEøsland}
                    visFeilmelding={skjema.visFeilmeldinger}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default OmBarnaDine;
