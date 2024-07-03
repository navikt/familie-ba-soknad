import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Bleed } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { IDokumentasjonTekstinnhold } from '../Dokumentasjon/innholdTyper';

import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { OmBarnaDineSpørsmålId, omBarnaDineSpørsmålSpråkId } from './spørsmål';
import { useOmBarnaDine } from './useOmBarnaDine';

const OmBarnaDine: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useOmBarnaDine();

    const navigate = useNavigate();
    const { søknad, tekster } = useApp();
    const { barnInkludertISøknaden } = søknad;

    if (!barnInkludertISøknaden.length) {
        navigate('/velg-barn');
        return null;
    }

    const dokumentasjonstekster: IDokumentasjonTekstinnhold = tekster()[ESanitySteg.DOKUMENTASJON];

    const { bekreftelsePaaAdopsjonBarnetrygd } = dokumentasjonstekster; // TODO: Legg til i Sanity: OM_BARNA - asyl

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
                    tilleggsinfo={
                        <FamilieAlert variant={'info'}>
                            <SpråkTekst id={'ombarna.institusjon.info'} />
                        </FamilieAlert>
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
                            <FamilieAlert variant={'info'}>
                                <SpråkTekst id={'ombarna.adoptert.info'} />
                            </FamilieAlert>
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
                        <Bleed marginBlock="4 0">
                            <VedleggNotis dynamisk>
                                {/* <SpråkTekst id="ombarna.adoptert.alert" /> */}
                                <TekstBlock block={bekreftelsePaaAdopsjonBarnetrygd} />
                                {/* TODO: Legg til flettefelt 
                                flettefelter={{ barnetsNavn: ... }} */}
                            </VedleggNotis>
                        </Bleed>
                    )}
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
                        <Bleed marginBlock="4 0">
                            <VedleggNotis dynamisk>
                                {/* <SpråkTekst id="ombarna.asyl.alert" /> */}
                                {/* <TekstBlock block={} /> */}
                            </VedleggNotis>
                        </Bleed>
                    )}
                </KomponentGruppe>
            )}
            {skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.erSynlig && (
                <KomponentGruppe dynamisk>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge}
                        spørsmålTekstId={
                            omBarnaDineSpørsmålSpråkId[
                                OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                            ]
                        }
                        tilleggsinfo={
                            <FamilieAlert variant={'info'}>
                                <SpråkTekst id={'felles.korteopphold.info'} />
                            </FamilieAlert>
                        }
                    />
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
                    ></HvilkeBarnCheckboxGruppe>

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
