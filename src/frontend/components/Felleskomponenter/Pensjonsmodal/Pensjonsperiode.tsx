import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import Tilleggsinformasjon from '../Tilleggsinformasjon';
import { useApp } from '../../../context/AppContext';

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
    const { tekster, plainTekst } = useApp();
    const {
        erÅpen: pensjonsmodalErÅpen,
        lukkModal: lukkPensjonsmodal,
        åpneModal: åpnePensjonsmodal,
    } = useModal();
    const pensjonsperiodeSpørsmålId = gjelderUtlandet
        ? PensjonsperiodeSpørsmålId.pensjonsperioderUtland
        : PensjonsperiodeSpørsmålId.pensjonsperioderNorge;

    /* 
    TODO:  
    1. Lag generisk funksjonalitet for å finne hjelpetekst basert på periodetype (f.eks. arbeidsperiode), antall perioder (f.eks. registrerteArbeidsperioder.verdi.length).
    2. Feature toggle for å bytte mellom visning av hjelpetekst gjennom LeggTilKnapp vs bruk av Label over LeggTilKnapp.
    */
    let leggTilPeriodeKnappHjelpetekst: string | undefined = undefined;

    try {
        const modal = tekster()['FELLES'].modaler.pensjonsperiode[personType];
        leggTilPeriodeKnappHjelpetekst =
            registrertePensjonsperioder.verdi.length === 0
                ? plainTekst(modal.leggTilPeriodeKnappHjelpetekst)
                : plainTekst(modal.flerePerioder);
    } catch (error) {
        console.error('Kunne ikke "Legg til periode-knapp hjelpetekst"', error);
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
                    {/* {registrertePensjonsperioder.verdi.length > 0 && (
                        <Label as="p" spacing>
                            <SpråkTekst
                                id={pensjonFlerePerioderSpmSpråkId(gjelderUtlandet, personType)}
                                values={{
                                    ...(barn && { barn: barn.navn }),
                                }}
                            />
                        </Label>
                    )} */}
                    <LeggTilKnapp
                        onClick={åpnePensjonsmodal}
                        språkTekst={pensjonsperiodeKnappSpråkId(gjelderUtlandet)}
                        hjelpetekst={leggTilPeriodeKnappHjelpetekst}
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
                            hjelpetekst={leggTilPeriodeKnappHjelpetekst}
                        />
                    )}
                </Tilleggsinformasjon>
            )}
        </>
    );
};
