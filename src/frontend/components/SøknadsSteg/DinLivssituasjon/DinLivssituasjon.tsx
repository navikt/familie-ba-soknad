import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import ÅrsakDropdown from '../../Felleskomponenter/Dropdowns/ÅrsakDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import JaNeiSpmForSanity from '../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

import SamboerSkjema from './SamboerSkjema';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';
import TidligereSamboere from './TidligereSamboere';
import { useDinLivssituasjon } from './useDinLivssituasjon';

const DinLivssituasjon: React.FC = () => {
    const intl = useIntl();
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

    const { erUtvidet, søknad, tekster } = useApp();

    const stegTekster = tekster()[ESanitySteg.DIN_LIVSSITUASJON];
    const {
        dinLivssituasjonGuide,
        serparerteEllerSkilt,
        separertSkiltIUtlandet,
        harSamboerNaa,
        harSamboerNaaGift,
    } = stegTekster;

    const harSamboerSpørsmålDokument =
        søknad.søker.sivilstand.type === ESivilstand.GIFT ? harSamboerNaaGift : harSamboerNaa;

    return (
        <Steg
            tittel={<SpråkTekst id={'dinlivssituasjon.sidetittel'} />}
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
                        felt={skjema.felter.årsak}
                        skjema={skjema}
                        placeholder={intl.formatMessage({ id: 'omdeg.velgårsak.placeholder' })}
                        label={
                            <SpråkTekst
                                id={
                                    dinLivssituasjonSpørsmålSpråkId[
                                        DinLivssituasjonSpørsmålId.årsak
                                    ]
                                }
                            />
                        }
                        dynamisk
                    />
                    <JaNeiSpmForSanity
                        skjema={skjema}
                        felt={skjema.felter.separertEnkeSkilt}
                        spørsmålDokument={serparerteEllerSkilt}
                    />
                    {skjema.felter.separertEnkeSkiltUtland.erSynlig && (
                        <>
                            <JaNeiSpmForSanity
                                skjema={skjema}
                                felt={skjema.felter.separertEnkeSkiltUtland}
                                spørsmålDokument={separertSkiltIUtlandet}
                            />
                            <Datovelger
                                felt={skjema.felter.separertEnkeSkiltDato}
                                skjema={skjema}
                                label={
                                    <SpråkTekst
                                        id={
                                            dinLivssituasjonSpørsmålSpråkId[
                                                DinLivssituasjonSpørsmålId.separertEnkeSkiltDato
                                            ]
                                        }
                                    />
                                }
                            />
                        </>
                    )}
                    <JaNeiSpmForSanity
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
                        hattAnnenSamboerForSøktPeriodeFelt={
                            skjema.felter.hattAnnenSamboerForSøktPeriode
                        }
                        tidligereSamboere={skjema.felter.tidligereSamboere}
                    />
                </>
            )}
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.erAsylsøker}
                spørsmålTekstId={
                    dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.erAsylsøker]
                }
            />
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
