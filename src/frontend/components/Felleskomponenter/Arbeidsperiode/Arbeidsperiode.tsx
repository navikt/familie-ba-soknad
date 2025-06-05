import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
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
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import TekstBlock from '../Sanity/TekstBlock';
import useModal from '../SkjemaModal/useModal';

import { ArbeidsperiodeModal } from './ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from './ArbeidsperiodeOppsummering';
import { arbeidsperiodeSpørsmålDokument } from './arbeidsperiodeSpråkUtils';
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
    const { tekster, plainTekst } = useAppContext();
    const {
        erÅpen: arbeidsmodalErÅpen,
        lukkModal: lukkArbeidsmodal,
        åpneModal: åpneArbeidsmodal,
    } = useModal();

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];
    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = teksterForModal;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;
    const { arbeidsperioder, utenfor, i, norge } = frittståendeOrdTekster;

    const perioderContainerTittel = uppercaseFørsteBokstav(
        `${plainTekst(arbeidsperioder)} ${plainTekst(gjelderUtlandet ? utenfor : i)} ${plainTekst(norge)}`
    );

    const arbeidsperiodeSpørsmålId = gjelderUtlandet
        ? ArbeidsperiodeSpørsmålsId.arbeidsperioderUtland
        : ArbeidsperiodeSpørsmålsId.arbeidsperioderNorge;

    return (
        <KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålDokument={arbeidsperiodeSpørsmålDokument(
                    gjelderUtlandet,
                    personType,
                    tekster,
                    erDød
                )}
                inkluderVetIkke={personType !== PersonType.Søker}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <PerioderContainer tittel={perioderContainerTittel}>
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
                        leggTilFlereTekst={
                            registrerteArbeidsperioder.verdi.length > 0 &&
                            plainTekst(flerePerioder, {
                                gjelderUtland: gjelderUtlandet,
                                barnetsNavn: barn?.navn,
                            })
                        }
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: arbeidsperiodeSpørsmålId,
                            barnetsId: barn?.id,
                        })}
                        feilmelding={
                            registrerteArbeidsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteArbeidsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={leggTilKnapp} />
                    </LeggTilKnapp>
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
        </KomponentGruppe>
    );
};
