import React from 'react';

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
    return (
        <Steg
            tittel={<SpråkTekst id={'ombarnadine.tittel'} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            gåVidereOnClickCallback={oppdaterSøknad}
        >
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erNoenAvBarnaFosterbarn}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]
                    }
                />

                {skjema.felter.hvemErFosterbarn.erSynlig && (
                    <HvilkeBarnCheckboxGruppe
                        legend={
                            <SpråkTekst
                                id={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.hvemErFosterbarn]}
                            />
                        }
                        felt={skjema.felter.hvemErFosterbarn}
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                )}

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIInstitusjon}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon]
                    }
                />

                {skjema.felter.hvemOppholderSegIInstitusjon.erSynlig && (
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
                )}
            </KomponentGruppe>

            <KomponentGruppe
                avhengigheter={[
                    skjema.felter.erNoenAvBarnaFosterbarn,
                    skjema.felter.oppholderBarnSegIInstitusjon,
                ]}
            >
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erBarnAdoptertFraUtland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]
                    }
                />
                {skjema.felter.hvemErAdoptertFraUtland.erSynlig && (
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
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIUtland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.oppholderBarnSegIUtland]
                    }
                />
                {skjema.felter.hvemOppholderSegIUtland.erSynlig && (
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
                )}
            </KomponentGruppe>

            <KomponentGruppe
                avhengigheter={[
                    skjema.felter.erBarnAdoptertFraUtland,
                    skjema.felter.oppholderBarnSegIUtland,
                ]}
            >
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søktAsylForBarn}
                    spørsmålTekstId={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.søktAsylForBarn]}
                />
                {skjema.felter.hvemErSøktAsylFor.erSynlig && (
                    <HvilkeBarnCheckboxGruppe
                        legend={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.hvemErSøktAsylFor]
                                }
                            />
                        }
                        felt={skjema.felter.hvemErSøktAsylFor}
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
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
                {skjema.felter.hvemTolvMndSammenhengendeINorge.erSynlig && (
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
                )}
            </KomponentGruppe>

            <KomponentGruppe
                avhengigheter={[
                    skjema.felter.søktAsylForBarn,
                    skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge,
                ]}
            >
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[
                            OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                        ]
                    }
                />
                {skjema.felter.hvemBarnetrygdFraAnnetEøsland.erSynlig && (
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
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default OmBarnaDine;
