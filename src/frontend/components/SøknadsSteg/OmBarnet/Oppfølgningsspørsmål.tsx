import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { barnDataKeySpørsmål } from '../../../typer/person';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotis, VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const Oppfølgningsspørsmål: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
}> = ({ barn, skjema }) => {
    const intl = useIntl();
    const { erEøsLand } = useEøs();
    return (
        <>
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <KomponentGruppe>
                    <Informasjonsbolk
                        tittelId={'ombarnet.fosterbarn'}
                        språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                    >
                        <VedleggNotis språkTekstId={'ombarnet.fosterbarn.vedleggsinfo'} />
                    </Informasjonsbolk>
                </KomponentGruppe>
            )}

            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.institusjon'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsnavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsnavn]
                        }
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsadresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsadresse]
                        }
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonspostnummer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonspostnummer]
                        }
                        bredde={'S'}
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdStartdato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonOppholdStartdato]
                        }
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdSluttdato}
                        tilhørendeFraOgMedFelt={skjema.felter.institusjonOppholdStartdato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonOppholdSluttdato]
                        }
                        disabled={skjema.felter.institusjonOppholdSluttVetIkke.verdi === ESvar.JA}
                    />
                    <SkjemaCheckbox
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonOppholdVetIkke]
                        }
                        felt={skjema.felter.institusjonOppholdSluttVetIkke}
                    />
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIUtland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.oppholdutland'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    <LandDropdown
                        felt={skjema.felter.oppholdsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.oppholdsland]}
                            />
                        }
                    />
                    {erEøsLand(skjema.felter.oppholdsland.verdi) && (
                        <VedleggNotisTilleggsskjema
                            språkTekstId={'ombarnet.oppholdutland.eøs-info'}
                            språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                        />
                    )}
                    <Datovelger
                        avgrensMaxDato={dagensDato()}
                        felt={skjema.felter.oppholdslandStartdato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.oppholdslandStartdato]
                        }
                    />
                    <Datovelger
                        felt={skjema.felter.oppholdslandSluttdato}
                        tilhørendeFraOgMedFelt={skjema.felter.oppholdslandStartdato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.oppholdslandSluttdato]
                        }
                        disabled={skjema.felter.oppholdslandSluttDatoVetIkke.verdi === ESvar.JA}
                    />
                    <SkjemaCheckbox
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[
                                OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke
                            ]
                        }
                        felt={skjema.felter.oppholdslandSluttDatoVetIkke}
                    />
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.sammenhengende-opphold'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    <Datovelger
                        avgrensDatoFremITid={true}
                        felt={skjema.felter.nårKomBarnTilNorgeDato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.nårKomBarnetTilNorge]
                        }
                        disabled={
                            skjema.felter.nårKomBarnTilNorgeDatoIkkeAnkommet.verdi === ESvar.JA
                        }
                    />
                    <SkjemaCheckbox
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[
                                OmBarnetSpørsmålsId.nårKomBarnetTilNorgeIkkeAnkommet
                            ]
                        }
                        felt={skjema.felter.nårKomBarnTilNorgeDatoIkkeAnkommet}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.planleggerÅBoINorge12Mnd}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd]
                        }
                    />
                    {skjema.felter.planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
                        <AlertStripe type={'advarsel'} dynamisk>
                            <SpråkTekst id={'ombarnet.planlagt-sammenhengende-opphold.alert'} />
                        </AlertStripe>
                    )}
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.barnetrygd-eøs'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    <LandDropdown
                        felt={skjema.felter.barnetrygdFraEøslandHvilketLand}
                        skjema={skjema}
                        kunEøs={true}
                        label={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand
                                    ]
                                }
                            />
                        }
                    />
                </SkjemaFieldset>
            )}
        </>
    );
};

export default Oppfølgningsspørsmål;
