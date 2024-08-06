import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { ArbeidsperiodeModal } from './ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from './ArbeidsperiodeOppsummering';
import {
    arbeidsperiodeFeilmelding,
    arbeidsperiodeLeggTilFlereKnapp,
    arbeidsperiodeSpørsmålSpråkId,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

interface ArbeidsperiodeProps {
    skjema: ISkjema<
        | IDinLivssituasjonFeltTyper
        | IOmBarnetFeltTyper
        | IEøsForSøkerFeltTyper
        | IEøsForBarnFeltTyper,
        string
    >;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
}

type Props = ArbeidsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Arbeidsperiode: React.FC<Props> = ({
    skjema,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    gjelderUtlandet = false,
    arbeiderEllerArbeidetFelt,
    registrerteArbeidsperioder,
    personType,
    erDød,
    barn,
}) => {
    const {
        erÅpen: arbeidsmodalErÅpen,
        lukkModal: lukkArbeidsmodal,
        åpneModal: åpneArbeidsmodal,
    } = useModal();
    const { tekster, plainTekst } = useApp();

    const barnetsNavn = !!barn && barn.navn;
    const arbeidsperiodeSpørsmålId = gjelderUtlandet
        ? ArbeidsperiodeSpørsmålsId.arbeidsperioderUtland
        : ArbeidsperiodeSpørsmålsId.arbeidsperioderNorge;

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];
    const { flerePerioder, leggTilPeriodeForklaring } = teksterForModal;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålTekstId={arbeidsperiodeSpørsmålSpråkId(gjelderUtlandet, personType, erDød)}
                inkluderVetIkke={personType !== PersonType.Søker}
                språkValues={{
                    ...(barnetsNavn && {
                        navn: barnetsNavn,
                        barn: barnetsNavn,
                    }),
                }}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <PerioderContainer>
                    {registrerteArbeidsperioder.verdi.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            arbeidsperiode={periode}
                            fjernPeriodeCallback={fjernArbeidsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                            barn={personType !== PersonType.Søker ? barn : undefined}
                        />
                    ))}
                    <LeggTilKnapp
                        onClick={åpneArbeidsmodal}
                        språkTekst={arbeidsperiodeLeggTilFlereKnapp(gjelderUtlandet)}
                        leggTilFlereTekst={
                            registrerteArbeidsperioder.verdi.length > 0 && plainTekst(flerePerioder)
                        }
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: arbeidsperiodeSpørsmålId,
                            barnetsId: barn?.id,
                        })}
                        feilmelding={
                            registrerteArbeidsperioder.erSynlig &&
                            registrerteArbeidsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={arbeidsperiodeFeilmelding(gjelderUtlandet)} />
                            )
                        }
                    />
                    {arbeidsmodalErÅpen && (
                        <ArbeidsperiodeModal
                            erÅpen={arbeidsmodalErÅpen}
                            lukkModal={lukkArbeidsmodal}
                            onLeggTilArbeidsperiode={leggTilArbeidsperiode}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={erDød}
                            forklaring={plainTekst(leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </>
    );
};
