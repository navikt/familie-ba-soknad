import React from 'react';

import { Heading, Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { IEøsBarnetrygdsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    morgendagensDato,
    stringTilDate,
} from '../../../utils/dato';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import { Barnetrygdperiode } from '../../Felleskomponenter/Barnetrygdperiode/Barnetrygdperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpmForSanity from '../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import { LeggTilKnappForSanity } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnappForSanity';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeltInputForSanity } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInputForSanity';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';

import { IOmBarnetTekstinnhold } from './innholdTyper';

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
    const { tekster, plainTekst } = useAppContext();
    const { toggles } = useFeatureToggles();
    const {
        erÅpen: utenlandsmodalErÅpen,
        lukkModal: lukkUtenlandsmodal,
        åpneModal: åpneUtenlandsmodal,
    } = useModal();

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

    const teksterForSteg: IOmBarnetTekstinnhold = tekster().OM_BARNET;
    const {
        opplystFosterbarn,
        opplystInstitusjon,
        institusjonIUtlandetCheckbox,
        institusjonNavn,
        institusjonAdresse,
        institusjonPostnummer,
        institusjonStartdato,
        institusjonSluttdato,
        institusjonUkjentSluttCheckbox,
        opplystBarnOppholdUtenforNorge,
        planlagtBoSammenhengendeINorge,
        opplystFaarHarFaattEllerSoektYtelse,
        paagaaendeSoeknadYtelse,
        hvilketLandYtelse,
    } = teksterForSteg;

    const teksterForModal: IUtenlandsoppholdTekstinnhold =
        tekster().FELLES.modaler.utenlandsopphold.barn;
    const { leggTilKnapp, flerePerioder, leggTilPeriodeForklaring } = teksterForModal;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <>
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <Heading level="4" size="xsmall">
                    <TekstBlock
                        block={opplystFosterbarn}
                        flettefelter={{ barnetsNavn: barn.navn }}
                    />
                </Heading>
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <SkjemaFieldset
                    legend={
                        <TekstBlock
                            block={opplystInstitusjon}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                    legendSpråkId={'ombarnet.institusjon'}
                    språkValues={{ navn: barn.navn }}
                >
                    <SkjemaCheckboxForSanity
                        felt={institusjonIUtlandCheckbox}
                        label={<TekstBlock block={institusjonIUtlandetCheckbox} />}
                    />
                    <SkjemaFeltInputForSanity
                        felt={institusjonsnavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={institusjonNavn.sporsmal} />}
                    />
                    <SkjemaFeltInputForSanity
                        felt={institusjonsadresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={institusjonAdresse.sporsmal} />}
                    />
                    <SkjemaFeltInputForSanity
                        felt={institusjonspostnummer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={institusjonPostnummer.sporsmal} />}
                        fullbredde={false}
                    />
                    <Datovelger
                        felt={institusjonOppholdStartdato}
                        skjema={skjema}
                        avgrensMaxDato={dagensDato()}
                        label={<TekstBlock block={institusjonStartdato.sporsmal} />}
                    />
                    <div>
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
                            label={<TekstBlock block={institusjonSluttdato.sporsmal} />}
                            disabled={institusjonOppholdSluttVetIkke.verdi === ESvar.JA}
                        />
                        <SkjemaCheckboxForSanity
                            felt={institusjonOppholdSluttVetIkke}
                            label={<TekstBlock block={institusjonUkjentSluttCheckbox} />}
                        />
                    </div>
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    legend={
                        <TekstBlock
                            block={opplystBarnOppholdUtenforNorge}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                    legendSpråkId={'ombarnet.opplystatbarnutlandopphold.info'}
                    språkValues={{ navn: barn.navn }}
                >
                    <PerioderContainer
                        tittel={uppercaseFørsteBokstav(
                            plainTekst(frittståendeOrdTekster.utenlandsopphold, {
                                barnetsNavn: barn.navn,
                            })
                        )}
                    >
                        {utenlandsperioder.map((periode, index) => (
                            <UtenlandsperiodeOppsummering
                                key={index}
                                periode={periode}
                                nummer={index + 1}
                                fjernPeriodeCallback={fjernUtenlandsperiode}
                                personType={PersonType.Barn}
                                barn={barn}
                            />
                        ))}
                        {!toggles.NYE_MODAL_TEKSTER && utenlandsperioder.length > 0 && (
                            <Label as="p" spacing>
                                <SpråkTekst
                                    id={'ombarnet.flereopphold.spm'}
                                    values={{ barn: barn.navn }}
                                />
                            </Label>
                        )}
                        <LeggTilKnappForSanity
                            id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                            leggTilFlereTekst={
                                toggles.NYE_MODAL_TEKSTER &&
                                registrerteUtenlandsperioder.verdi.length > 0 &&
                                plainTekst(flerePerioder, { barnetsNavn: barn.navn })
                            }
                            onClick={åpneUtenlandsmodal}
                            feilmelding={
                                registrerteUtenlandsperioder.erSynlig &&
                                skjema.visFeilmeldinger &&
                                registrerteUtenlandsperioder.feilmelding
                            }
                        >
                            <TekstBlock block={leggTilKnapp} />
                        </LeggTilKnappForSanity>
                    </PerioderContainer>
                    {planleggerÅBoINorge12Mnd.erSynlig && (
                        <JaNeiSpmForSanity
                            skjema={skjema}
                            felt={planleggerÅBoINorge12Mnd}
                            spørsmålDokument={planlagtBoSammenhengendeINorge}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    )}
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    legend={
                        <TekstBlock
                            block={opplystFaarHarFaattEllerSoektYtelse}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                    legendSpråkId={'ombarnet.barnetrygd-eøs'}
                    språkValues={{ navn: barn.navn }}
                >
                    <JaNeiSpmForSanity
                        skjema={skjema}
                        felt={pågåendeSøknadFraAnnetEøsLand}
                        spørsmålDokument={paagaaendeSoeknadYtelse}
                    />
                    {pågåendeSøknadHvilketLand.erSynlig && (
                        <LandDropdown
                            felt={pågåendeSøknadHvilketLand}
                            skjema={skjema}
                            kunEøs={true}
                            ekskluderNorge
                            label={<TekstBlock block={hvilketLandYtelse.sporsmal} />}
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
                        headingLevel="4"
                    />
                </SkjemaFieldset>
            )}
            {utenlandsmodalErÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={utenlandsmodalErÅpen}
                    lukkModal={lukkUtenlandsmodal}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                    personType={PersonType.Barn}
                    barn={barn}
                    forklaring={plainTekst(leggTilPeriodeForklaring)}
                />
            )}
        </>
    );
};

export default Oppfølgningsspørsmål;
