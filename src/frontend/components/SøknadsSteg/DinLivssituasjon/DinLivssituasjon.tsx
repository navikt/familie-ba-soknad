import React from 'react';

import { useIntl } from 'react-intl';

import { Bleed } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import ÅrsakDropdown from '../../Felleskomponenter/Dropdowns/ÅrsakDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';

import { IDinLivssituasjonTekstinnhold } from './innholdTyper';
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
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
    } = useDinLivssituasjon();

    const { erUtvidet, søknad, tekster } = useApp();

    const teskterForSteg: IDinLivssituasjonTekstinnhold = tekster()[ESanitySteg.DIN_LIVSSITUASJON];

    const { asylsoeker, separertSkiltEllerEnkeEnkemannUtenRegistrert } = teskterForSteg;

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
                            <Bleed marginBlock="4 0">
                                <VedleggNotis dynamisk>
                                    {/* <SpråkTekst id="omdeg.separertellerskilt.info" /> */}
                                    <TekstBlock
                                        block={
                                            separertSkiltEllerEnkeEnkemannUtenRegistrert.vedleggsnotis
                                        }
                                    />
                                </VedleggNotis>
                            </Bleed>
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

                    <KomponentGruppe>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.harSamboerNå}
                            spørsmålTekstId={
                                dinLivssituasjonSpørsmålSpråkId[
                                    søknad.søker.utvidet.spørsmål.harSamboerNå.id
                                ]
                            }
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
                                        fødselsdatoUkjent:
                                            skjema.felter.nåværendeSamboerFødselsdatoUkjent,
                                        samboerFraDato: skjema.felter.nåværendeSamboerFraDato,
                                    }}
                                />
                            </KomponentGruppe>
                        )}

                        <TidligereSamboere
                            tidligereSamboere={tidligereSamboere}
                            leggTilTidligereSamboer={leggTilTidligereSamboer}
                            fjernTidligereSamboer={fjernTidligereSamboer}
                        />
                    </KomponentGruppe>
                </>
            )}

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erAsylsøker}
                    spørsmålTekstId={
                        dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.erAsylsøker]
                    }
                />
                {skjema.felter.erAsylsøker.verdi === ESvar.JA && (
                    <Bleed marginBlock="4 0">
                        <VedleggNotis dynamisk>
                            {/* <SpråkTekst id="omdeg.asylsøker.alert" /> */}
                            <TekstBlock block={asylsoeker.vedleggsnotis} />
                        </VedleggNotis>
                    </Bleed>
                )}

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
            </KomponentGruppe>
        </Steg>
    );
};

export default DinLivssituasjon;
