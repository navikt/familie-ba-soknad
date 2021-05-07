import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { IOmBarnetUtvidetFeltTyper } from './useOmBarnet';
import VetIkkeCheckbox from './VetIkkeCheckbox';

const Oppfølgningsspørsmål: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
}> = ({ barn, skjema }) => {
    return (
        <>
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <KomponentGruppe>
                    <Informasjonsbolk
                        tittelId={'ombarnet.fosterbarn'}
                        språkValues={{ navn: barn.navn }}
                    >
                        <VedleggNotis språkTekstId={'ombarnet.fosterbarn.vedleggsinfo'} />
                    </Informasjonsbolk>
                </KomponentGruppe>
            )}

            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <SkjemaFieldset tittelId={'ombarnet.institusjon'} språkValues={{ navn: barn.navn }}>
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
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonOppholdSluttdato]
                        }
                        disabled={skjema.felter.institusjonOppholdSluttVetIkke.verdi === ESvar.JA}
                    />
                    <VetIkkeCheckbox
                        barn={barn}
                        labelSpråkId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonOppholdVetIkke]
                        }
                        checkboxUkjentFelt={skjema.felter.institusjonOppholdSluttVetIkke}
                        søknadsdatafelt={barnDataKeySpørsmål.institusjonOppholdSluttdato}
                    />
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIUtland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.oppholdutland'}
                    språkValues={{ navn: barn.navn }}
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
                    <Datovelger
                        felt={skjema.felter.oppholdslandStartdato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.oppholdslandStartdato]
                        }
                    />
                    <Datovelger
                        felt={skjema.felter.oppholdslandSluttdato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.oppholdslandSluttdato]
                        }
                        disabled={skjema.felter.oppholdslandSluttDatoVetIkke.verdi === ESvar.JA}
                    />
                    <VetIkkeCheckbox
                        barn={barn}
                        labelSpråkId={
                            omBarnetSpørsmålSpråkId[
                                OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke
                            ]
                        }
                        checkboxUkjentFelt={skjema.felter.oppholdslandSluttDatoVetIkke}
                        søknadsdatafelt={barnDataKeySpørsmål.oppholdslandSluttdato}
                    />
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.sammenhengende-opphold'}
                    språkValues={{ navn: barn.navn }}
                >
                    <Datovelger
                        felt={skjema.felter.nårKomBarnTilNorgeDato}
                        skjema={skjema}
                        labelTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.nårKomBarnetTilNorge]
                        }
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.planleggerÅBoINorge12Mnd}
                        spørsmålTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd]
                        }
                    />
                    {skjema.felter.planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
                        <AlertStripe type={'advarsel'}>
                            <SpråkTekst id={'ombarnet.planlagt-sammenhengende-opphold.alert'} />
                        </AlertStripe>
                    )}
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.barnetrygd-eøs'}
                    språkValues={{ navn: barn.navn }}
                >
                    <LandDropdown
                        felt={skjema.felter.barnetrygdFraEøslandHvilketLand}
                        skjema={skjema}
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
