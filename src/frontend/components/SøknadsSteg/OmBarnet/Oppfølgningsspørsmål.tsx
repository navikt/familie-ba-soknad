import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { barnDataKeySpørsmål, IUtenlandsperiode } from '../../../typer/person';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const Oppfølgningsspørsmål: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
}> = ({ barn, skjema, leggTilUtenlandsperiode, fjernUtenlandsperiode, utenlandsperioder }) => {
    const intl = useIntl();
    const { erÅpen, toggleModal } = useModal();
    const { erEøsLand } = useEøs();

    const erFørsteEøsPeriode = (periode: IUtenlandsperiode) => {
        return periode === utenlandsperioder.find(p => erEøsLand(p.oppholdsland.svar));
    };

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
                        label={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdStartdato
                                    ]
                                }
                            />
                        }
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdSluttdato}
                        tilhørendeFraOgMedFelt={skjema.felter.institusjonOppholdStartdato}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdSluttdato
                                    ]
                                }
                            />
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
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.opplystatbarnutlandopphold.info'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    {utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            periode={periode}
                            nummer={index + 1}
                            fjernPeriodeCallback={fjernUtenlandsperiode}
                            barn={barn}
                            erFørsteEøsPeriode={erFørsteEøsPeriode(periode)}
                        />
                    ))}
                    <LeggTilKnapp
                        språkTekst={'felles.leggtilutenlands.knapp'}
                        onClick={toggleModal}
                    />
                    {skjema.felter.planleggerÅBoINorge12Mnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorge12Mnd}
                                spørsmålTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd
                                    ]
                                }
                            />
                            {skjema.felter.planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
                                <AlertStripe type={'advarsel'} dynamisk>
                                    <SpråkTekst
                                        id={'ombarnet.planlagt-sammenhengende-opphold.alert'}
                                    />
                                </AlertStripe>
                            )}
                        </KomponentGruppe>
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
            <UtenlandsoppholdModal
                erÅpen={erÅpen}
                toggleModal={toggleModal}
                onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                barn={barn}
            />
        </>
    );
};

export default Oppfølgningsspørsmål;
