import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { barnetsNavnValue } from '../../../utils/barn';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { hentUtbetalingsperiodeSpørsmålIder, UtbetalingerSpørsmålId } from './spørsmål';

export const UtbetalingsperiodeOppsummering: React.FC<{
    utbetalingsperiode: IUtbetalingsperiode;
    nummer: number;
    fjernPeriodeCallback?: (utbetalingsperiode: IUtbetalingsperiode) => void;
    andreForelderData?: { erDød: boolean; barn: IBarnMedISøknad };
}> = ({ utbetalingsperiode, nummer, fjernPeriodeCallback = undefined, andreForelderData }) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } =
        utbetalingsperiode;

    const gjelderAndreForelder = !!andreForelderData;
    const erAndreForelderDød = !!andreForelderData?.erDød;
    const periodenErAvsluttet = fårUtbetalingNå?.svar === ESvar.NEI || erAndreForelderDød;
    const barn = andreForelderData?.barn;

    const utbetalingerSpørsmålSpråkTekst = (spørsmålId: UtbetalingerSpørsmålId) => (
        <SpråkTekst
            id={
                hentUtbetalingsperiodeSpørsmålIder(gjelderAndreForelder, periodenErAvsluttet)[
                    spørsmålId
                ]
            }
            values={{
                ...(barn && { barn: barnetsNavnValue(barn, intl) }),
            }}
        />
    );

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(utbetalingsperiode))
            }
            fjernKnappSpråkId={'felles.fjernytelse.knapp'}
            nummer={nummer}
            tittelSpråkId={'felles.flereytelser.periode'}
        >
            {fårUtbetalingNå.svar && (
                <OppsummeringFelt
                    tittel={utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.fårUtbetalingNå)}
                    søknadsvar={fårUtbetalingNå.svar}
                />
            )}
            {utbetalingLand.svar && (
                <OppsummeringFelt
                    tittel={utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.utbetalingLand)}
                    søknadsvar={landkodeTilSpråk(utbetalingLand.svar, valgtLocale)}
                />
            )}
            {utbetalingFraDato.svar && (
                <OppsummeringFelt
                    tittel={utbetalingerSpørsmålSpråkTekst(
                        UtbetalingerSpørsmålId.utbetalingFraDato
                    )}
                    søknadsvar={formaterDato(utbetalingFraDato.svar)}
                />
            )}
            {utbetalingTilDato.svar && (
                <OppsummeringFelt
                    tittel={utbetalingerSpørsmålSpråkTekst(
                        UtbetalingerSpørsmålId.utbetalingTilDato
                    )}
                    søknadsvar={formaterDatoMedUkjent(
                        utbetalingTilDato.svar,
                        <SpråkTekst
                            id={
                                hentUtbetalingsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    periodenErAvsluttet
                                )[UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]
                            }
                        />
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
