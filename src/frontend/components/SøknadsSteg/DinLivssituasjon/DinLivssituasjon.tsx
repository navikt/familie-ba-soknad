import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { ArbeidsperiodeModal } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeModal';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import ÅrsakDropdown from '../../Felleskomponenter/Dropdowns/ÅrsakDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis, VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
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
        tidligereSamboere,
        leggTilTidligereSamboer,
        fjernTidligereSamboer,
    } = useDinLivssituasjon();

    const { erUtvidet, søknad } = useApp();
    const { erEøsLand } = useEøs();
    const { erÅpen: erArbeidsperiodeÅpen, toggleModal: toggleArbeidsperiodeModal } = useModal();
    const { erÅpen: erArbeidsperiodeUtlandetÅpen, toggleModal: toggleArbeidsperiodeUtlandetModal } =
        useModal();
    const {
        erÅpen: erArbeidsperiodeAndreForelderÅpen,
        toggleModal: toggleArbeidsperiodeAndreForelderModal,
    } = useModal();
    const {
        erÅpen: erArbeidsperiodeAndreForelderUtlandetÅpen,
        toggleModal: toggleArbeidsperiodeAndreForelderUtlandetModal,
    } = useModal();

    return (
        <Steg
            tittel={<SpråkTekst id={'dinlivssituasjon.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            {erUtvidet && (
                <>
                    <KomponentGruppe>
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
                    </KomponentGruppe>
                    <KomponentGruppe>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.separertEnkeSkilt}
                            spørsmålTekstId={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.separertEnkeSkilt
                                ]
                            }
                        />
                        {skjema.felter.separertEnkeSkilt.verdi === ESvar.JA && (
                            <VedleggNotis språkTekstId={'omdeg.separertellerskilt.info'} dynamisk />
                        )}
                        {skjema.felter.separertEnkeSkiltUtland.erSynlig && (
                            <KomponentGruppe inline dynamisk>
                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.separertEnkeSkiltUtland}
                                    spørsmålTekstId={
                                        dinLivssituasjonSpørsmålSpråkId[
                                            DinLivssituasjonSpørsmålId.separertEnkeSkiltUtland
                                        ]
                                    }
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
                            </KomponentGruppe>
                        )}
                    </KomponentGruppe>
                </>
            )}

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.harSamboerNå}
                    spørsmålTekstId={dinLivssituasjonSpørsmålSpråkId[søknad.søker.harSamboerNå.id]}
                />

                {skjema.felter.harSamboerNå.verdi === ESvar.JA && (
                    <KomponentGruppe dynamisk>
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
                    </KomponentGruppe>
                )}
                {erUtvidet && (
                    <TidligereSamboere
                        tidligereSamboere={tidligereSamboere}
                        leggTilTidligereSamboer={leggTilTidligereSamboer}
                        fjernTidligereSamboer={fjernTidligereSamboer}
                    />
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={
                        dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.erAsylsøker]
                    }
                />
                {skjema.felter.erAsylsøker.verdi === ESvar.JA && (
                    <VedleggNotis dynamisk språkTekstId={'omdeg.asylsøker.alert'} />
                )}
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.jobberPåBåt}
                    spørsmålTekstId={
                        dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.jobberPåBåt]
                    }
                />
                <div>Søker arbeidsopphold Norge</div>
                <ArbeidsperiodeModal
                    erÅpen={erArbeidsperiodeÅpen}
                    toggleModal={toggleArbeidsperiodeModal}
                    gjelderUtlandet={false}
                    gjelderAndreForelder={false}
                />
                <LeggTilKnapp
                    språkTekst={'felles.flerearbeidsperiodernorge.tittel'}
                    onClick={toggleArbeidsperiodeModal}
                    id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                    feilmelding={''}
                />
                <div>Søker arbeidsopphold utlandet</div>
                <ArbeidsperiodeModal
                    erÅpen={erArbeidsperiodeUtlandetÅpen}
                    toggleModal={toggleArbeidsperiodeUtlandetModal}
                    gjelderUtlandet={true}
                    gjelderAndreForelder={false}
                />
                <LeggTilKnapp
                    språkTekst={'felles.flerearbeidsperioderutland.tittel'}
                    onClick={toggleArbeidsperiodeUtlandetModal}
                    id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                    feilmelding={''}
                />
                <div>Andre forelder arbeidsopphold Norge</div>
                <ArbeidsperiodeModal
                    erÅpen={erArbeidsperiodeAndreForelderÅpen}
                    toggleModal={toggleArbeidsperiodeAndreForelderModal}
                    gjelderUtlandet={false}
                    gjelderAndreForelder={true}
                />
                <LeggTilKnapp
                    språkTekst={'felles.flerearbeidsperiodernorge.tittel'}
                    onClick={toggleArbeidsperiodeAndreForelderModal}
                    id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                    feilmelding={''}
                />
                <div>Andre forelder arbeidsopphold utlandett</div>
                <ArbeidsperiodeModal
                    erÅpen={erArbeidsperiodeAndreForelderUtlandetÅpen}
                    toggleModal={toggleArbeidsperiodeAndreForelderUtlandetModal}
                    gjelderUtlandet={true}
                    gjelderAndreForelder={true}
                    erAndreForelderDød={true}
                />
                <LeggTilKnapp
                    språkTekst={'felles.flerearbeidsperioderutland.tittel'}
                    onClick={toggleArbeidsperiodeAndreForelderUtlandetModal}
                    id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                    feilmelding={''}
                />

                <LandDropdown
                    felt={skjema.felter.arbeidsland}
                    skjema={skjema}
                    label={
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.arbeidsland
                                ]
                            }
                        />
                    }
                    dynamisk
                />
                {erEøsLand(skjema.felter.arbeidsland.verdi) && (
                    <VedleggNotisTilleggsskjema
                        språkTekstId={'omdeg.arbeid-utland.eøs-info'}
                        dynamisk
                    />
                )}

                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarUtenlandspensjon}
                    spørsmålTekstId={
                        dinLivssituasjonSpørsmålSpråkId[
                            DinLivssituasjonSpørsmålId.mottarUtenlandspensjon
                        ]
                    }
                />
                <LandDropdown
                    felt={skjema.felter.pensjonsland}
                    skjema={skjema}
                    label={
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.pensjonsland
                                ]
                            }
                        />
                    }
                    dynamisk
                />
                {erEøsLand(skjema.felter.pensjonsland.verdi) && (
                    <VedleggNotisTilleggsskjema
                        språkTekstId={'omdeg.utenlandspensjon.eøs-info'}
                        dynamisk
                    />
                )}
            </KomponentGruppe>
        </Steg>
    );
};

export default DinLivssituasjon;
