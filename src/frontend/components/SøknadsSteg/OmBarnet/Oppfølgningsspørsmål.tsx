import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { IEøsBarnetrygdsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    morgendagensDato,
    stringTilDate,
} from '../../../utils/dato';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import { Barnetrygdperiode } from '../../Felleskomponenter/Barnetrygdperiode/Barnetrygdperiode';
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
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    registrerteEøsBarnetrygdsperioder: Felt<IEøsBarnetrygdsperiode[]>;
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
    const { erÅpen: utenlandsmodalErÅpen, toggleModal: toggleUtenlandsmodal } = useModal();

    const {
        institusjonIUtlandCheckbox,
        institusjonOppholdStartdato,
        institusjonOppholdSluttdato,
        institusjonOppholdSluttVetIkke,
        institusjonspostnummer,
        institusjonsadresse,
        institusjonsnavn,
        registrerteUtenlandsperioder,
        mottarEllerMottokEøsBarnetrygd,
        planleggerÅBoINorge12Mnd,
        pågåendeSøknadHvilketLand,
        pågåendeSøknadFraAnnetEøsLand,
    } = skjema.felter;

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
                    <SkjemaCheckbox
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonIUtland]
                        }
                        felt={institusjonIUtlandCheckbox}
                    />
                    <SkjemaFeltInput
                        felt={institusjonsnavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsnavn]
                        }
                    />
                    <SkjemaFeltInput
                        felt={institusjonsadresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsadresse]
                        }
                    />
                    <SkjemaFeltInput
                        felt={institusjonspostnummer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonspostnummer]
                        }
                        bredde={'S'}
                    />
                    <Datovelger
                        felt={institusjonOppholdStartdato}
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
                            felt={institusjonOppholdSluttdato}
                            avgrensMinDato={
                                erSammeDatoSomDagensDato(
                                    stringTilDate(institusjonOppholdStartdato.verdi)
                                )
                                    ? morgendagensDato()
                                    : dagensDato()
                            }
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
                            disabled={institusjonOppholdSluttVetIkke.verdi === ESvar.JA}
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.institusjonOppholdVetIkke
                                ]
                            }
                            felt={institusjonOppholdSluttVetIkke}
                        />
                    </>
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.opplystatbarnutlandopphold.info'}
                    språkValues={{ navn: barn.navn }}
                >
                    {utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            fjernPeriodeCallback={fjernUtenlandsperiode}
                            barn={barn}
                        />
                    ))}
                    {utenlandsperioder.length > 0 && (
                        <Label>
                            <SpråkTekst
                                id={'ombarnet.flereopphold.spm'}
                                values={{ barn: barn.navn }}
                            />
                        </Label>
                    )}
                    <LeggTilKnapp
                        id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                        språkTekst={'felles.leggtilutenlands.knapp'}
                        onClick={toggleUtenlandsmodal}
                        feilmelding={
                            registrerteUtenlandsperioder.erSynlig &&
                            registrerteUtenlandsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />
                            )
                        }
                    />
                    {planleggerÅBoINorge12Mnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={planleggerÅBoINorge12Mnd}
                                spørsmålTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd
                                    ]
                                }
                                språkValues={{ barn: barn.navn }}
                            />
                            {planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
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
                    språkValues={{ navn: barn.navn }}
                >
                    <KomponentGruppe>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={pågåendeSøknadFraAnnetEøsLand}
                            spørsmålTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand
                                ]
                            }
                        />
                        {pågåendeSøknadHvilketLand.erSynlig && (
                            <LandDropdown
                                felt={pågåendeSøknadHvilketLand}
                                skjema={skjema}
                                kunEøs={true}
                                ekskluderNorge
                                label={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand
                                            ]
                                        }
                                    />
                                }
                            />
                        )}
                        <Barnetrygdperiode
                            skjema={skjema}
                            registrerteEøsBarnetrygdsperioder={registrerteEøsBarnetrygdsperioder}
                            tilhørendeJaNeiSpmFelt={mottarEllerMottokEøsBarnetrygd}
                            leggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                            fjernBarnetrygdsperiode={fjernBarnetrygdsperiode}
                            barn={barn}
                            personType={PersonType.Søker}
                        />
                    </KomponentGruppe>
                </SkjemaFieldset>
            )}
            <UtenlandsoppholdModal
                erÅpen={utenlandsmodalErÅpen}
                toggleModal={toggleUtenlandsmodal}
                onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                barn={barn}
            />
        </>
    );
};

export default Oppfølgningsspørsmål;
