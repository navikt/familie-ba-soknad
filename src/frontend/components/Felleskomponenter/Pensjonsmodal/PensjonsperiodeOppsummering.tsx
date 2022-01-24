import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IPensjonsperiode } from '../../../typer/perioder';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { pensjonsperiodeOppsummeringOverskrift } from './språkUtils';
import { hentPensjonsperiodeSpørsmålIder, PensjonSpørsmålId } from './spørsmål';

export const PensjonsperiodeOppsummering: React.FC<{
    pensjonsperiode: IPensjonsperiode;
    nummer: number;
    fjernPeriodeCallback?: (pensjonsperiode: IPensjonsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean };
}> = ({
    pensjonsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet = false,
    andreForelderData,
}) => {
    const [valgtLocale] = useSprakContext();
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = pensjonsperiode;

    const tilbakeITid = mottarPensjonNå?.svar === ESvar.NEI;
    const gjelderAndreForelder = !!andreForelderData;
    const erAndreForelderDød = !!andreForelderData?.erDød;

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(pensjonsperiode))
            }
            fjernKnappSpråkId={'felles.fjernpensjon.knapp'}
            nummer={nummer}
            tittelSpråkId={pensjonsperiodeOppsummeringOverskrift(gjelderUtlandet)}
        >
            {mottarPensjonNå.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentPensjonsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[PensjonSpørsmålId.mottarPensjonNå]
                            }
                        />
                    }
                    søknadsvar={mottarPensjonNå.svar}
                />
            )}
            {pensjonsland.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentPensjonsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[PensjonSpørsmålId.pensjonsland]
                            }
                        />
                    }
                    søknadsvar={landkodeTilSpråk(pensjonsland.svar, valgtLocale)}
                />
            )}
            {pensjonFra?.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentPensjonsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[PensjonSpørsmålId.fraDatoPensjon]
                            }
                        />
                    }
                    søknadsvar={formaterDato(pensjonFra.svar)}
                />
            )}
            {pensjonTil?.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentPensjonsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[PensjonSpørsmålId.tilDatoPensjon]
                            }
                        />
                    }
                    søknadsvar={formaterDato(pensjonTil.svar)}
                />
            )}
        </PeriodeOppsummering>
    );
};
