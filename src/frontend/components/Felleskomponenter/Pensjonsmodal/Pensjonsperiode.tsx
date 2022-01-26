import React from 'react';

import { useIntl } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IPensjonsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper, IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { PensjonModal } from './Pensjonsmodal';
import { PensjonsperiodeOppsummering } from './PensjonsperiodeOppsummering';
import {
    mottarEllerMottattPensjonSpråkId,
    pensjonsperiodeFeilmelding,
    pensjonFlerePerioderSpmSpråkId,
    pensjonsperiodeKnappSpråkId,
} from './språkUtils';
import { PensjonSpørsmålId } from './spørsmål';

interface PensjonsperiodeProps {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetUtvidetFeltTyper, string>;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean; barn: IBarnMedISøknad };
    mottarEllerMottattPensjonFelt: Felt<ESvar | null>;
    registrertePensjonsperioder: Felt<IPensjonsperiode[]>;
}

export const Pensjonsperiode: React.FC<PensjonsperiodeProps> = ({
    skjema,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
    gjelderUtlandet = false,
    andreForelderData,
    mottarEllerMottattPensjonFelt,
    registrertePensjonsperioder,
}) => {
    const intl = useIntl();
    const { erÅpen: pensjonsmodalErÅpen, toggleModal: togglePensjonsmodal } = useModal();

    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={mottarEllerMottattPensjonFelt}
                spørsmålTekstId={mottarEllerMottattPensjonSpråkId()}
                inkluderVetIkke={gjelderAndreForelder}
                språkValues={{
                    ...(barn && { navn: barnetsNavnValue(barn, intl) }),
                }}
            />
            {mottarEllerMottattPensjonFelt.verdi === ESvar.JA && (
                <>
                    {registrertePensjonsperioder.verdi.map((pensjonsperiode, index) => (
                        <PensjonsperiodeOppsummering
                            key={`pensjonsperiode-${index}`}
                            pensjonsperiode={pensjonsperiode}
                            fjernPeriodeCallback={fjernPensjonsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            andreForelderData={andreForelderData}
                        />
                    ))}
                    {registrertePensjonsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={pensjonFlerePerioderSpmSpråkId(
                                    gjelderUtlandet,
                                    gjelderAndreForelder
                                )}
                                values={{
                                    ...(barn && { barn: barnetsNavnValue(barn, intl) }),
                                }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        onClick={togglePensjonsmodal}
                        språkTekst={pensjonsperiodeKnappSpråkId(gjelderUtlandet)}
                        id={PensjonSpørsmålId.pensjonsperioder}
                        feilmelding={
                            registrertePensjonsperioder.erSynlig &&
                            registrertePensjonsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={pensjonsperiodeFeilmelding(gjelderUtlandet)} />
                            )
                        }
                    />
                    <PensjonModal
                        erÅpen={pensjonsmodalErÅpen}
                        toggleModal={togglePensjonsmodal}
                        onLeggTilPensjonsperiode={leggTilPensjonsperiode}
                        gjelderUtland={gjelderUtlandet}
                        andreForelderData={andreForelderData}
                    />
                </>
            )}
        </>
    );
};
