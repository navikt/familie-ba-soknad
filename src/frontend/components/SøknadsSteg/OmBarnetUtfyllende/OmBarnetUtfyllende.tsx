import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from '../../../typer/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LandDropdown } from '../../Felleskomponenter/LandDropdown/LandDropdown';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { omBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnetUtfyllende } from './useOmBarnetUtfyllende';
import VetIkkeCheckbox from './VetIkkeCheckbox';

const OmBarnetUtfyllende: React.FC<{ barnetsIdent: string }> = ({ barnetsIdent }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
    } = useOmBarnetUtfyllende(barnetsIdent);

    return barn ? (
        <Steg
            tittel={<SpråkTekst id={'ombarnet.sidetittel'} values={{ navn: barn.navn }} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
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
                        labelSpråkTekstId={omBarnetSpørsmålSpråkId.institusjonsnavn}
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsadresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={omBarnetSpørsmålSpråkId.institusjonsadresse}
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonspostnummer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={omBarnetSpørsmålSpråkId.institusjonspostnummer}
                        bredde={'S'}
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdStartdato}
                        skjema={skjema}
                        labelTekstId={omBarnetSpørsmålSpråkId['institusjon-opphold-startdato']}
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdSluttdato}
                        skjema={skjema}
                        labelTekstId={omBarnetSpørsmålSpråkId['institusjon-opphold-sluttdato']}
                        disabled={skjema.felter.institusjonOppholdSluttVetIkke.verdi === ESvar.JA}
                    />
                    <VetIkkeCheckbox
                        barn={barn}
                        labelSpråkId={
                            omBarnetSpørsmålSpråkId['institusjon-opphold-ukjent-sluttdato']
                        }
                        ukjentDatoCheckboxFelt={skjema.felter.institusjonOppholdSluttVetIkke}
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
                        label={<SpråkTekst id={omBarnetSpørsmålSpråkId.oppholdsland} />}
                    />
                    <Datovelger
                        felt={skjema.felter.oppholdslandStartdato}
                        skjema={skjema}
                        labelTekstId={omBarnetSpørsmålSpråkId['utenlandsopphold-startdato ']}
                    />
                    <Datovelger
                        felt={skjema.felter.oppholdslandSluttdato}
                        skjema={skjema}
                        labelTekstId={omBarnetSpørsmålSpråkId['utenlandsopphold-sluttdato']}
                        disabled={skjema.felter.oppholdslandSluttDatoVetIkke.verdi === ESvar.JA}
                    />
                    <VetIkkeCheckbox
                        barn={barn}
                        labelSpråkId={omBarnetSpørsmålSpråkId['utenlandsopphold-ukjent-sluttdato']}
                        ukjentDatoCheckboxFelt={skjema.felter.oppholdslandSluttDatoVetIkke}
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
                        labelTekstId={OmBarnetSpørsmålSpråkId['når-kom-barnet-til-norge']}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.planleggerÅBoINorge12Mnd}
                        spørsmålTekstId={
                            OmBarnetSpørsmålSpråkId['planlegger-å-bo-sammenhengende-i-norge-12mnd']
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
                                id={OmBarnetSpørsmålSpråkId['barnetrygd-hvilket-eøsland']}
                            />
                        }
                    />
                </SkjemaFieldset>
            )}
        </Steg>
    ) : null;
};

export default OmBarnetUtfyllende;
