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

                <HvilkeBarnCheckboxGruppe
                    legend={
                        <SpråkTekst
                            id={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.hvemErFosterbarn]}
                        />
                    }
                    felt={skjema.felter.hvemErFosterbarn}
                />

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIInstitusjon}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon]
                    }
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
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.oppholderBarnSegIUtland}
                    spørsmålTekstId={
                        omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.oppholderBarnSegIUtland]
                    }
                />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.søktAsylForBarn}
                    spørsmålTekstId={omBarnaDineSpråkTekstId[OmBarnaDineSpørsmålId.søktAsylForBarn]}
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
            </KomponentGruppe>
        </Steg>
    );
};

export default OmBarnaDine;
