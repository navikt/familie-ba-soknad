import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import ÅrsakDropdown from '../../Felleskomponenter/Dropdowns/ÅrsakDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
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
    } = useDinLivssituasjon();

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
            <KomponentGruppe>
                <ÅrsakDropdown
                    felt={skjema.felter.årsak}
                    skjema={skjema}
                    placeholder={intl.formatMessage({ id: 'omdeg.velgårsak.placeholder' })}
                    label={
                        <SpråkTekst
                            id={dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.årsak]}
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
                            labelTekstId={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.separertEnkeSkiltDato
                                ]
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
                        dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.harSamboerNå]
                    }
                />
            </KomponentGruppe>
            <TidligereSamboere skjema={skjema} />
        </Steg>
    );
};

export default DinLivssituasjon;
