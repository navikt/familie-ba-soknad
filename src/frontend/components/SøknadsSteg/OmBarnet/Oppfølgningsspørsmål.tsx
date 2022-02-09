import React from 'react';

import { useIntl } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { IBarnetrygdsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import { BarnetrygdperiodeModal } from '../../Felleskomponenter/Barnetrygdperiode/BarnetrygdperiodeModal';
import { BarnetrygdsperiodeOppsummering } from '../../Felleskomponenter/Barnetrygdperiode/BarnetrygdperiodeOppsummering';
import { BarnetrygdperiodeSpørsmålId } from '../../Felleskomponenter/Barnetrygdperiode/spørsmål';
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
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
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
    leggTilBarnetrygdsperiode: (periode: IBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IBarnetrygdsperiode) => void;
    registrerteEøsBarnetrygdsperioder: Felt<IBarnetrygdsperiode[]>;
}> = ({
    barn,
    skjema,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
    utenlandsperioder,
    leggTilBarnetrygdsperiode,
    fjernBarnetrygdsperiode,
    registrerteEøsBarnetrygdsperioder,
}) => {
    const intl = useIntl();
    const { erÅpen, toggleModal } = useModal();
    const { erEøsLand } = useEøs();
    const { toggles } = useFeatureToggles();
    const { erÅpen: barnetrygdsmodalErÅpen, toggleModal: toggleBarnetrygdsmodal } = useModal();

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
                    <SkjemaCheckbox
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonIUtland]
                        }
                        felt={skjema.felter.institusjonIUtlandCheckbox}
                    />
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
                        avgrensMaxDato={dagensDato()}
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
                    <>
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
                            disabled={
                                skjema.felter.institusjonOppholdSluttVetIkke.verdi === ESvar.JA
                            }
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.institusjonOppholdVetIkke
                                ]
                            }
                            felt={skjema.felter.institusjonOppholdSluttVetIkke}
                        />
                    </>
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.opplystatbarnutlandopphold.info'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    {utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            fjernPeriodeCallback={fjernUtenlandsperiode}
                            barn={barn}
                            erFørsteEøsPeriode={erFørsteEøsPeriode(periode)}
                        />
                    ))}
                    {utenlandsperioder.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={'ombarnet.flereopphold.spm'}
                                values={{ barn: barnetsNavnValue(barn, intl) }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                        språkTekst={'felles.leggtilutenlands.knapp'}
                        onClick={toggleModal}
                        feilmelding={
                            skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                            skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />
                            )
                        }
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
                                språkValues={{ barn: barnetsNavnValue(barn, intl) }}
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
            {/*TODO legge inn alle tekster*/}
            {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.barnetrygd-eøs'}
                    språkValues={{ navn: barnetsNavnValue(barn, intl) }}
                >
                    {toggles.EØS_KOMPLETT ? (
                        <>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.mottarEllerMottokEøsBarnetrygd}
                                spørsmålTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd
                                    ]
                                }
                            />
                            {skjema.felter.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA && (
                                <>
                                    {registrerteEøsBarnetrygdsperioder.verdi.map(
                                        (periode, index) => (
                                            <BarnetrygdsperiodeOppsummering
                                                key={`eøs-barnetrygdsperiode-${index}`}
                                                barnetrygdsperiode={periode}
                                                fjernPeriodeCallback={fjernBarnetrygdsperiode}
                                                nummer={index + 1}
                                                barnetsNavn={barnetsNavnValue(barn, intl)}
                                            />
                                        )
                                    )}

                                    {registrerteEøsBarnetrygdsperioder.verdi.length > 0 && (
                                        <Element>
                                            <SpråkTekst id={'ngøgn'} />
                                        </Element>
                                    )}

                                    <LeggTilKnapp
                                        onClick={toggleBarnetrygdsmodal}
                                        språkTekst={'ombarnet.trygdandreperioder.knapp'}
                                        id={BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs}
                                        feilmelding={
                                            registrerteEøsBarnetrygdsperioder.erSynlig &&
                                            registrerteEøsBarnetrygdsperioder.feilmelding &&
                                            skjema.visFeilmeldinger && <SpråkTekst id={''} />
                                        }
                                    />
                                    <BarnetrygdperiodeModal
                                        erÅpen={barnetrygdsmodalErÅpen}
                                        toggleModal={toggleBarnetrygdsmodal}
                                        onLeggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                                        barn={barn}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
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
