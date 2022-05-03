import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    mottarEllerMottattUtbetalingSpråkId,
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
    andreForelderData?: { erDød: boolean; barn: IBarnMedISøknad };
    mottarEllerMottattUtbetalingFelt: Felt<ESvar | null>;
    registrerteUtbetalingsperioder: Felt<IUtbetalingsperiode[]>;
}

export const Utbetalingsperiode: React.FC<UtbetalingsperiodeProps> = ({
    skjema,
    leggTilUtbetalingsperiode,
    fjernUtbetalingsperiode,
    andreForelderData,
    mottarEllerMottattUtbetalingFelt,
    registrerteUtbetalingsperioder,
}) => {
    const { erÅpen: utbetalingermodalErÅpen, toggleModal: toggleUtbetalingsmodal } = useModal();

    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;
    const andreForelderErDød = !!andreForelderData?.erDød;
    const barnetsNavn = barn && barn.navn;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={mottarEllerMottattUtbetalingFelt}
                spørsmålTekstId={mottarEllerMottattUtbetalingSpråkId(
                    gjelderAndreForelder,
                    andreForelderErDød
                )}
                inkluderVetIkke={gjelderAndreForelder}
                språkValues={{
                    ...(barn && {
                        navn: barnetsNavn,
                        barn: barnetsNavn,
                    }),
                }}
            />
            {mottarEllerMottattUtbetalingFelt.verdi === ESvar.JA && (
                <>
                    {registrerteUtbetalingsperioder.verdi.map((utbetalingsperiode, index) => (
                        <UtbetalingsperiodeOppsummering
                            key={`utbetalingsperiode-${index}`}
                            utbetalingsperiode={utbetalingsperiode}
                            fjernPeriodeCallback={fjernUtbetalingsperiode}
                            nummer={index + 1}
                            andreForelderData={andreForelderData}
                        />
                    ))}
                    {registrerteUtbetalingsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={utbetalingerFlerePerioderSpmSpråkId(gjelderAndreForelder)}
                                values={{
                                    ...(barn && { barn: barnetsNavn }),
                                }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        onClick={toggleUtbetalingsmodal}
                        språkTekst={'felles.flereytelser.knapp'}
                        id={UtbetalingerSpørsmålId.utbetalingsperioder}
                        feilmelding={
                            skjema.visFeilmeldinger && registrerteUtbetalingsperioder.feilmelding
                        }
                    />
                    <UtbetalingerModal
                        erÅpen={utbetalingermodalErÅpen}
                        toggleModal={toggleUtbetalingsmodal}
                        onLeggTilUtbetalinger={leggTilUtbetalingsperiode}
                        andreForelderData={andreForelderData}
                    />
                </>
            )}
        </>
    );
};
