import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import Steg from '../../Felleskomponenter/Steg/Steg';

import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { useOmBarnaDine } from './useOmBarnaDine';
import { avdødPartnerForelderSpørsmålDokument } from './utils';

const OmBarnaDineSkjema: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useOmBarnaDine();

    const { søknad, tekster } = useAppContext();

    const stegTekster = tekster()[ESanitySteg.OM_BARNA];
    const {
        omBarnaTittel,
        omBarnaGuide,
        fosterbarn,
        hvemFosterbarn,
        institusjon,
        hvemInstitusjon,
        adoptertFraUtlandet,
        hvemAdoptertFraUtlandet,
        asyl,
        hvemAsyl,
        sammenhengendeOppholdINorge,
        hvemOppholdUtenforNorge,
        soektYtelseEuEoes,
        hvemSoektYtelse,
        hvemAvBarnaAvdoedPartner,
        boddPaaSvalbard,
    } = stegTekster;

    return (
        <Steg
            tittel={<TekstBlock block={omBarnaTittel} />}
            guide={omBarnaGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
            vedleggOppsummering={[
                {
                    skalVises: skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.ADOPSJON_DATO,
                },
                {
                    skalVises: skjema.felter.søktAsylForBarn.verdi === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE,
                },
            ]}
        >
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.erNoenAvBarnaFosterbarn}
                spørsmålDokument={fosterbarn}
            />
            <HvilkeBarnCheckboxGruppe
                legendTekst={<TekstBlock block={hvemFosterbarn.sporsmal} />}
                skjemafelt={skjema.felter.hvemErFosterbarn}
                søknadsdatafelt={barnDataKeySpørsmål.erFosterbarn}
                nullstillValgteBarn={skjema.felter.erNoenAvBarnaFosterbarn.verdi === ESvar.NEI}
                visFeilmelding={skjema.visFeilmeldinger}
            />
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.oppholderBarnSegIInstitusjon}
                spørsmålDokument={institusjon}
                tilleggsinfo={
                    <TekstBlock block={institusjon.beskrivelse} typografi={Typografi.BodyShort} />
                }
            />
            <HvilkeBarnCheckboxGruppe
                legendTekst={<TekstBlock block={hvemInstitusjon.sporsmal} />}
                skjemafelt={skjema.felter.hvemOppholderSegIInstitusjon}
                søknadsdatafelt={barnDataKeySpørsmål.oppholderSegIInstitusjon}
                nullstillValgteBarn={skjema.felter.oppholderBarnSegIInstitusjon.verdi === ESvar.NEI}
                visFeilmelding={skjema.visFeilmeldinger}
            />
            {skjema.felter.erBarnAdoptertFraUtland.erSynlig && (
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erBarnAdoptertFraUtland}
                        spørsmålDokument={adoptertFraUtlandet}
                        tilleggsinfo={
                            <TekstBlock
                                block={adoptertFraUtlandet.beskrivelse}
                                typografi={Typografi.BodyShort}
                            />
                        }
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendTekst={<TekstBlock block={hvemAdoptertFraUtlandet.sporsmal} />}
                        skjemafelt={skjema.felter.hvemErAdoptertFraUtland}
                        søknadsdatafelt={barnDataKeySpørsmål.erAdoptertFraUtland}
                        nullstillValgteBarn={
                            skjema.felter.erBarnAdoptertFraUtland.verdi === ESvar.NEI
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.søktAsylForBarn}
                        spørsmålDokument={asyl}
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendTekst={<TekstBlock block={hvemAsyl.sporsmal} />}
                        skjemafelt={skjema.felter.hvemErSøktAsylFor}
                        søknadsdatafelt={barnDataKeySpørsmål.erAsylsøker}
                        nullstillValgteBarn={skjema.felter.søktAsylForBarn.verdi === ESvar.NEI}
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                </>
            )}
            {skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.erSynlig && (
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge}
                        spørsmålDokument={sammenhengendeOppholdINorge}
                        tilleggsinfo={
                            <TekstBlock block={sammenhengendeOppholdINorge.beskrivelse} />
                        }
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendTekst={<TekstBlock block={hvemOppholdUtenforNorge.sporsmal} />}
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
                        spørsmålDokument={soektYtelseEuEoes}
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendTekst={<TekstBlock block={hvemSoektYtelse.sporsmal} />}
                        skjemafelt={skjema.felter.hvemBarnetrygdFraAnnetEøsland}
                        søknadsdatafelt={barnDataKeySpørsmål.barnetrygdFraAnnetEøsland}
                        nullstillValgteBarn={
                            skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.verdi === ESvar.NEI
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erAvdødPartnerForelder}
                        spørsmålDokument={avdødPartnerForelderSpørsmålDokument(søknad, stegTekster)}
                    />
                    <HvilkeBarnCheckboxGruppe
                        legendTekst={<TekstBlock block={hvemAvBarnaAvdoedPartner.sporsmal} />}
                        skjemafelt={skjema.felter.hvemAvdødPartner}
                        søknadsdatafelt={barnDataKeySpørsmål.andreForelderErDød}
                        nullstillValgteBarn={
                            skjema.felter.erAvdødPartnerForelder.verdi === ESvar.NEI
                        }
                        visFeilmelding={skjema.visFeilmeldinger}
                    />
                </>
            )}
            {skjema.felter.barnBoddPåSvalbard.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.barnBoddPåSvalbard}
                    spørsmålDokument={boddPaaSvalbard}
                    tilleggsinfo={
                        <TekstBlock
                            block={boddPaaSvalbard.beskrivelse}
                            typografi={Typografi.BodyShort}
                        />
                    }
                />
            )}
        </Steg>
    );
};

export default OmBarnaDineSkjema;
