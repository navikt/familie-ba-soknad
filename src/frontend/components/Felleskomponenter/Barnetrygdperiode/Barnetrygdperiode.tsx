import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { HeadingLevel } from '../../../typer/common';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../../typer/personType';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import { IEøsForBarnFeltTyper, IOmBarnetFeltTyper } from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpmForSanity from '../JaNeiSpm/JaNeiSpmForSanity';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { LeggTilKnappForSanity } from '../LeggTilKnapp/LeggTilKnappForSanity';
import PerioderContainer from '../PerioderContainer';
import TekstBlock from '../Sanity/TekstBlock';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { BarnetrygdperiodeModal } from './BarnetrygdperiodeModal';
import { BarnetrygdsperiodeOppsummering } from './BarnetrygdperiodeOppsummering';
import { barnetrygdperiodeFlereSpørsmål } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IOmBarnetFeltTyper | IEøsForBarnFeltTyper, string>;
    registrerteEøsBarnetrygdsperioder: Felt<IEøsBarnetrygdsperiode[]>;
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    barn: IBarnMedISøknad;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
    headingLevel?: HeadingLevel;
}

type BarnetrygdperiodeProps = Props & PeriodePersonTypeProps;

export const Barnetrygdperiode: React.FC<BarnetrygdperiodeProps> = ({
    skjema,
    registrerteEøsBarnetrygdsperioder,
    leggTilBarnetrygdsperiode,
    fjernBarnetrygdsperiode,
    personType,
    erDød,
    barn,
    tilhørendeJaNeiSpmFelt,
    headingLevel = '3',
}) => {
    const { toggles } = useFeatureToggles();
    const {
        erÅpen: barnetrygdsmodalErÅpen,
        lukkModal: lukkBarnetrygdsmodal,
        åpneModal: åpneBarnetrygdsmodal,
    } = useModal();
    const { tekster, plainTekst } = useApp();

    const teksterForModal: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];
    const { leggTilKnapp, flerePerioder, leggTilPeriodeForklaring } = teksterForModal;

    const { ytelseFraAnnetLandAndreForelder, ytelseFraAnnetLandAndreForelderGjenlevende } =
        tekster().EØS_FOR_BARN;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <KomponentGruppe>
            <JaNeiSpmForSanity
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålDokument={
                    erDød
                        ? ytelseFraAnnetLandAndreForelderGjenlevende
                        : ytelseFraAnnetLandAndreForelder
                }
                flettefelter={{ barnetsNavn: barn?.navn }}
                inkluderVetIkke={personType !== PersonType.Søker}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(
                        plainTekst(frittståendeOrdTekster.barnetrygdperioder)
                    )}
                >
                    {registrerteEøsBarnetrygdsperioder.verdi.map((periode, index) => (
                        <BarnetrygdsperiodeOppsummering
                            key={`eøs-barnetrygdsperiode-${index}`}
                            barnetrygdsperiode={periode}
                            fjernPeriodeCallback={fjernBarnetrygdsperiode}
                            nummer={index + 1}
                            barnetsNavn={barn.navn}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                            headingLevel={headingLevel}
                        />
                    ))}
                    {!toggles.NYE_MODAL_TEKSTER &&
                        registrerteEøsBarnetrygdsperioder.verdi.length > 0 && (
                            <Label as="p" spacing>
                                <SpråkTekst
                                    id={barnetrygdperiodeFlereSpørsmål(personType)}
                                    values={{ barn: barn.navn }}
                                />
                            </Label>
                        )}
                    <LeggTilKnappForSanity
                        onClick={åpneBarnetrygdsmodal}
                        leggTilFlereTekst={
                            toggles.NYE_MODAL_TEKSTER &&
                            registrerteEøsBarnetrygdsperioder.verdi.length > 0 &&
                            plainTekst(flerePerioder)
                        }
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs,
                            barnetsId: barn.id,
                        })}
                        feilmelding={
                            registrerteEøsBarnetrygdsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteEøsBarnetrygdsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={leggTilKnapp} />
                    </LeggTilKnappForSanity>
                    {barnetrygdsmodalErÅpen && (
                        <BarnetrygdperiodeModal
                            erÅpen={barnetrygdsmodalErÅpen}
                            lukkModal={lukkBarnetrygdsmodal}
                            onLeggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                            barn={barn}
                            personType={personType}
                            erDød={erDød}
                            forklaring={plainTekst(leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
