import React from 'react';

import { useNavigate } from 'react-router';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import JaNeiSpmForSanity from '../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import Steg from '../../Felleskomponenter/Steg/Steg';

import HvilkeBarnCheckboxGruppe from './HvilkeBarnCheckboxGruppe';
import { useOmBarnaDine } from './useOmBarnaDine';
import { avdødPartnerForelderSpørsmålDokument } from './utils';

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
            <JaNeiSpmForSanity
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
            <JaNeiSpmForSanity
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
                    <JaNeiSpmForSanity
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
                    <JaNeiSpmForSanity
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
                    <JaNeiSpmForSanity
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
                    <JaNeiSpmForSanity
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
                    <JaNeiSpmForSanity
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
        </Steg>
    );
};

export default OmBarnaDine;
