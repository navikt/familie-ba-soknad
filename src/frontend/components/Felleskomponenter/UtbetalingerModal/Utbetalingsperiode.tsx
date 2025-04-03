import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IAndreUtbetalingerTekstinnhold } from '../../../typer/sanity/modaler/andreUtbetalinger';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpmForSanity from '../JaNeiSpm/JaNeiSpmForSanity';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { LeggTilKnappForSanity } from '../LeggTilKnapp/LeggTilKnappForSanity';
import PerioderContainer from '../PerioderContainer';
import TekstBlock from '../Sanity/TekstBlock';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import {
    mottarEllerMottattUtbetalingApiNavn,
    utbetalingerFlerePerioderSpmSpråkId,
} from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';
import { UtbetalingerModal } from './UtbetalingerModal';
import { UtbetalingsperiodeOppsummering } from './UtbetalingsperiodeOppsummering';

interface UtbetalingsperiodeProps {
    skjema: ISkjema<IEøsForBarnFeltTyper | IEøsForSøkerFeltTyper, string>;
    leggTilUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    gjelderUtlandet?: boolean;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
    registrerteUtbetalingsperioder: Felt<IUtbetalingsperiode[]>;
}

type Props = UtbetalingsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Utbetalingsperiode: React.FC<Props> = ({
    skjema,
    leggTilUtbetalingsperiode,
    fjernUtbetalingsperiode,
    tilhørendeJaNeiSpmFelt,
    registrerteUtbetalingsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { toggles } = useFeatureToggles();
    const { tekster, plainTekst } = useApp();
    const {
        erÅpen: erUtbetalingerModalÅpen,
        lukkModal: lukkUtbetalingerModal,
        åpneModal: åpneUtbetalingerModal,
    } = useModal();

    const teksterForPersontype: IAndreUtbetalingerTekstinnhold =
        tekster().FELLES.modaler.andreUtbetalinger[personType];
    const { flerePerioder, leggTilPeriodeForklaring } = teksterForPersontype;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const barnetsNavn = barn && barn.navn;

    return (
        <KomponentGruppe>
            <JaNeiSpmForSanity
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                inkluderVetIkke={personType !== PersonType.Søker}
                spørsmålDokument={mottarEllerMottattUtbetalingApiNavn(personType, tekster(), erDød)}
                flettefelter={{ barnetsNavn: barnetsNavn }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(
                        plainTekst(frittståendeOrdTekster.utbetalingsperioder)
                    )}
                >
                    {registrerteUtbetalingsperioder.verdi.map((utbetalingsperiode, index) => (
                        <UtbetalingsperiodeOppsummering
                            key={`utbetalingsperiode-${index}`}
                            utbetalingsperiode={utbetalingsperiode}
                            fjernPeriodeCallback={fjernUtbetalingsperiode}
                            nummer={index + 1}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                            barn={barn}
                        />
                    ))}
                    {!toggles.NYE_MODAL_TEKSTER &&
                        registrerteUtbetalingsperioder.verdi.length > 0 && (
                            <Label as="p" spacing>
                                <SpråkTekst
                                    id={utbetalingerFlerePerioderSpmSpråkId(personType)}
                                    values={{
                                        ...(barn && { barn: barnetsNavn }),
                                    }}
                                />
                            </Label>
                        )}
                    <LeggTilKnappForSanity
                        onClick={åpneUtbetalingerModal}
                        leggTilFlereTekst={
                            toggles.NYE_MODAL_TEKSTER &&
                            registrerteUtbetalingsperioder.verdi.length > 0 &&
                            plainTekst(flerePerioder, {
                                ...(barnetsNavn && { barnetsNavn: barnetsNavn }),
                            })
                        }
                        id={genererPeriodeId({
                            personType: personType,
                            spørsmålsId: UtbetalingerSpørsmålId.utbetalingsperioder,
                            barnetsId: barn?.id,
                        })}
                        feilmelding={
                            skjema.visFeilmeldinger && registrerteUtbetalingsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForPersontype.leggTilKnapp} />
                    </LeggTilKnappForSanity>
                    {erUtbetalingerModalÅpen && (
                        <UtbetalingerModal
                            erÅpen={erUtbetalingerModalÅpen}
                            lukkModal={lukkUtbetalingerModal}
                            onLeggTilUtbetalinger={leggTilUtbetalingsperiode}
                            personType={personType}
                            barn={barn}
                            erDød={erDød}
                            forklaring={plainTekst(leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
