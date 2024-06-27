import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import { hentLeggTilPeriodeTekster } from '../../../utils/modaler';
import { genererPeriodeId } from '../../../utils/perioder';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import Tilleggsinformasjon from '../Tilleggsinformasjon';

import { PensjonModal } from './Pensjonsmodal';
import { PensjonsperiodeOppsummering } from './PensjonsperiodeOppsummering';
import {
    mottarEllerMottattPensjonSpråkId,
    pensjonFlerePerioderSpmSpråkId,
    pensjonsperiodeFeilmelding,
    pensjonsperiodeKnappSpråkId,
} from './språkUtils';
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
    const pensjonsperiodeSpørsmålId = gjelderUtlandet
        ? PensjonsperiodeSpørsmålId.pensjonsperioderUtland
        : PensjonsperiodeSpørsmålId.pensjonsperioderNorge;

    let leggTilPeriodeTekster: ReturnType<typeof hentLeggTilPeriodeTekster> = undefined;

    if (toggles.NYE_MODAL_TEKSTER) {
        const antallPerioder = registrertePensjonsperioder.verdi.length;
        leggTilPeriodeTekster = hentLeggTilPeriodeTekster(
            'pensjonsperiode',
            personType,
            antallPerioder,
            undefined,
            {
                gjelderUtland: gjelderUtlandet,
            }
        );
    }

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={mottarEllerMottattPensjonFelt}
                spørsmålTekstId={mottarEllerMottattPensjonSpråkId(
                    gjelderUtlandet,
                    personType,
                    erDød
                )}
                inkluderVetIkke={personType !== PersonType.Søker}
                språkValues={{
                    ...(barn && {
                        navn: barn.navn,
                        barn: barn.navn,
                    }),
                }}
            />
            {mottarEllerMottattPensjonFelt.verdi === ESvar.JA && (
                <Tilleggsinformasjon>
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
                    <LeggTilKnapp
                        onClick={åpnePensjonsmodal}
                        språkTekst={pensjonsperiodeKnappSpråkId(gjelderUtlandet)}
                        forklaring={leggTilPeriodeTekster?.tekstForKnapp}
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: pensjonsperiodeSpørsmålId,
                            barnetsId: barn?.id,
                        })}
                        feilmelding={
                            registrertePensjonsperioder.erSynlig &&
                            registrertePensjonsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={pensjonsperiodeFeilmelding(gjelderUtlandet)} />
                            )
                        }
                    />
                    {pensjonsmodalErÅpen && (
                        <PensjonModal
                            erÅpen={pensjonsmodalErÅpen}
                            lukkModal={lukkPensjonsmodal}
                            onLeggTilPensjonsperiode={leggTilPensjonsperiode}
                            gjelderUtland={gjelderUtlandet}
                            personType={personType}
                            erDød={erDød}
                            barn={barn}
                            forklaring={leggTilPeriodeTekster?.tekstForModal}
                        />
                    )}
                </Tilleggsinformasjon>
            )}
        </>
    );
};
