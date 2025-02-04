import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpmForSanity from '../JaNeiSpm/JaNeiSpmForSanity';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { LeggTilKnappForSanity } from '../LeggTilKnapp/LeggTilKnappForSanity';
import PerioderContainer from '../PerioderContainer';
import TekstBlock from '../Sanity/TekstBlock';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { PensjonModal } from './Pensjonsmodal';
import { PensjonsperiodeOppsummering } from './PensjonsperiodeOppsummering';
import { pensjonFlerePerioderSpmSpråkId, pensjonSpørsmålDokument } from './språkUtils';
import { PensjonsperiodeSpørsmålId } from './spørsmål';

interface PensjonsperiodeProps {
    skjema: ISkjema<
        | IDinLivssituasjonFeltTyper
        | IOmBarnetFeltTyper
        | IEøsForSøkerFeltTyper
        | IEøsForBarnFeltTyper,
        string
    >;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtlandet: boolean;
    mottarEllerMottattPensjonFelt: Felt<ESvar | null>;
    registrertePensjonsperioder: Felt<IPensjonsperiode[]>;
}

type Props = PensjonsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Pensjonsperiode: React.FC<Props> = ({
    skjema,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
    gjelderUtlandet,
    mottarEllerMottattPensjonFelt,
    registrertePensjonsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { toggles } = useFeatureToggles();

    const {
        erÅpen: pensjonsmodalErÅpen,
        lukkModal: lukkPensjonsmodal,
        åpneModal: åpnePensjonsmodal,
    } = useModal();
    const { tekster, plainTekst } = useApp();

    const pensjonsperiodeSpørsmålId = gjelderUtlandet
        ? PensjonsperiodeSpørsmålId.pensjonsperioderUtland
        : PensjonsperiodeSpørsmålId.pensjonsperioderNorge;

    const teksterForModal: IPensjonsperiodeTekstinnhold =
        tekster().FELLES.modaler.pensjonsperiode[personType];
    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = teksterForModal;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;
    const { pensjonsperioder, fra, utlandet, norge } = frittståendeOrdTekster;

    const perioderContainerTittel = uppercaseFørsteBokstav(
        `${plainTekst(pensjonsperioder)} ${plainTekst(fra)} ${plainTekst(gjelderUtlandet ? utlandet : norge)}`
    );

    return (
        <KomponentGruppe>
            <JaNeiSpmForSanity
                skjema={skjema}
                felt={mottarEllerMottattPensjonFelt}
                spørsmålDokument={pensjonSpørsmålDokument(
                    gjelderUtlandet,
                    personType,
                    tekster,
                    erDød
                )}
                inkluderVetIkke={personType !== PersonType.Søker}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {mottarEllerMottattPensjonFelt.verdi === ESvar.JA && (
                <PerioderContainer tittel={perioderContainerTittel}>
                    {registrertePensjonsperioder.verdi.map((pensjonsperiode, index) => (
                        <PensjonsperiodeOppsummering
                            key={`pensjonsperiode-${index}`}
                            pensjonsperiode={pensjonsperiode}
                            fjernPeriodeCallback={fjernPensjonsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                            barn={personType !== PersonType.Søker ? barn : undefined}
                        />
                    ))}
                    {!toggles.NYE_MODAL_TEKSTER && registrertePensjonsperioder.verdi.length > 0 && (
                        <Label as="p" spacing>
                            <SpråkTekst
                                id={pensjonFlerePerioderSpmSpråkId(gjelderUtlandet, personType)}
                                values={{
                                    ...(barn && { barn: barn.navn }),
                                }}
                            />
                        </Label>
                    )}
                    <LeggTilKnappForSanity
                        onClick={åpnePensjonsmodal}
                        leggTilFlereTekst={
                            toggles.NYE_MODAL_TEKSTER &&
                            registrertePensjonsperioder.verdi.length > 0 &&
                            plainTekst(flerePerioder, {
                                gjelderUtland: gjelderUtlandet,
                                barnetsNavn: barn?.navn,
                            })
                        }
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: pensjonsperiodeSpørsmålId,
                            barnetsId: barn?.id,
                        })}
                        feilmelding={
                            registrertePensjonsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrertePensjonsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={leggTilKnapp} />
                    </LeggTilKnappForSanity>
                    {pensjonsmodalErÅpen && (
                        <PensjonModal
                            erÅpen={pensjonsmodalErÅpen}
                            lukkModal={lukkPensjonsmodal}
                            onLeggTilPensjonsperiode={leggTilPensjonsperiode}
                            gjelderUtland={gjelderUtlandet}
                            personType={personType}
                            erDød={erDød}
                            barn={barn}
                            forklaring={plainTekst(leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
