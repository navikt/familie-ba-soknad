import { ESvar } from '@navikt/familie-form-elements';

import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../../common/typer/kontrakt/generelle';
import { useAppContext } from '../../../context/AppContext';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import ÅrsakDropdown from '../../Felleskomponenter/Dropdowns/ÅrsakDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import Steg from '../../Felleskomponenter/Steg/Steg';

import SamboerSkjema from './SamboerSkjema';
import TidligereSamboere from './TidligereSamboere';
import { useDinLivssituasjon } from './useDinLivssituasjon';

const DinLivssituasjon: React.FC = () => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilTidligereSamboer,
        fjernTidligereSamboer,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
    } = useDinLivssituasjon();

    const { erUtvidet, søknad, tekster, plainTekst } = useAppContext();

    const stegTekster = tekster()[ESanitySteg.DIN_LIVSSITUASJON];
    const {
        dinLivssituasjonTittel,
        dinLivssituasjonGuide,
        valgalternativAarsakPlaceholder,
        hvorforSoekerUtvidet,
        separertEnkeSkilt,
        separertEnkeSkiltUtland,
        separertEnkeSkiltDato,
        harSamboerNaa,
        harSamboerNaaGift,
        erAsylsoeker,
    } = stegTekster;

    const harSamboerSpørsmålDokument =
        søknad.søker.sivilstand.type === ESivilstand.GIFT ? harSamboerNaaGift : harSamboerNaa;

    return (
        <Steg
            tittel={<TekstBlock block={dinLivssituasjonTittel} />}
            guide={dinLivssituasjonGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
            vedleggOppsummering={[
                {
                    skalVises: skjema.felter.separertEnkeSkilt.verdi === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.SEPARERT_SKILT_ENKE,
                },
                {
                    skalVises: skjema.felter.erAsylsøker.verdi === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE,
                },
            ]}
        >
            {erUtvidet && (
                <>
                    <ÅrsakDropdown
                        skjema={skjema}
                        felt={skjema.felter.årsak}
                        placeholder={plainTekst(valgalternativAarsakPlaceholder)}
                        label={<TekstBlock block={hvorforSoekerUtvidet.sporsmal} />}
                        dynamisk
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.separertEnkeSkilt}
                        spørsmålDokument={separertEnkeSkilt}
                    />
                    {skjema.felter.separertEnkeSkiltUtland.erSynlig && (
                        <>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.separertEnkeSkiltUtland}
                                spørsmålDokument={separertEnkeSkiltUtland}
                            />
                            <Datovelger
                                skjema={skjema}
                                felt={skjema.felter.separertEnkeSkiltDato}
                                label={<TekstBlock block={separertEnkeSkiltDato.sporsmal} />}
                            />
                        </>
                    )}
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.harSamboerNå}
                        spørsmålDokument={harSamboerSpørsmålDokument}
                    />
                    {skjema.felter.harSamboerNå.verdi === ESvar.JA && (
                        <SamboerSkjema
                            skjema={skjema}
                            samboerFelter={{
                                navn: skjema.felter.nåværendeSamboerNavn,
                                fnr: skjema.felter.nåværendeSamboerFnr,
                                fnrUkjent: skjema.felter.nåværendeSamboerFnrUkjent,
                                fødselsdato: skjema.felter.nåværendeSamboerFødselsdato,
                                fødselsdatoUkjent: skjema.felter.nåværendeSamboerFødselsdatoUkjent,
                                samboerFraDato: skjema.felter.nåværendeSamboerFraDato,
                            }}
                        />
                    )}
                    <TidligereSamboere
                        skjema={skjema}
                        leggTilTidligereSamboer={leggTilTidligereSamboer}
                        fjernTidligereSamboer={fjernTidligereSamboer}
                        hattAnnenSamboerForSøktPeriodeFelt={skjema.felter.hattAnnenSamboerForSøktPeriode}
                        tidligereSamboere={skjema.felter.tidligereSamboere}
                    />
                </>
            )}
            <JaNeiSpm skjema={skjema} felt={skjema.felter.erAsylsøker} spørsmålDokument={erAsylsoeker} />
            <Arbeidsperiode
                skjema={skjema}
                leggTilArbeidsperiode={leggTilArbeidsperiode}
                fjernArbeidsperiode={fjernArbeidsperiode}
                gjelderUtlandet={true}
                arbeiderEllerArbeidetFelt={skjema.felter.arbeidIUtlandet}
                registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                personType={PersonType.Søker}
            />
            <Pensjonsperiode
                skjema={skjema}
                mottarEllerMottattPensjonFelt={skjema.felter.mottarUtenlandspensjon}
                registrertePensjonsperioder={skjema.felter.registrertePensjonsperioder}
                leggTilPensjonsperiode={leggTilPensjonsperiode}
                fjernPensjonsperiode={fjernPensjonsperiode}
                gjelderUtlandet={true}
                personType={PersonType.Søker}
            />
        </Steg>
    );
};

export default DinLivssituasjon;
