import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IArbeidsperiode } from '../../../typer/person';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { arbeidsperiodeOppsummeringOverskrift } from './arbeidsperiodeSpråkUtils';
import {
    arbeidsperiodeAndreForelderSpørsmålSpråkId,
    ArbeidsperiodeSpørsmålsId,
    arbeidsperiodeSøkerSpørsmålSpråkId,
    hentArbeidsperiodeSpørsmålIder,
} from './spørsmål';

export const ArbeidsperiodeOppsummering: React.FC<{
    arbeidsperiode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback?: (arbeidsperiode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean };
}> = ({
    arbeidsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet = false,
    andreForelderData,
}) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { formatMessage } = intl;
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = arbeidsperiode;

    const tilbakeITid = arbeidsperiodeAvsluttet?.svar === ESvar.JA;
    const gjelderAndreForelder = !!andreForelderData;
    const erAndreForelderDød = !!andreForelderData?.erDød;

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(arbeidsperiode))
            }
            fjernKnappSpråkId={'felles.fjernarbeidsperiode.knapp'}
            nummer={nummer}
            tittelSpråkId={arbeidsperiodeOppsummeringOverskrift(gjelderUtlandet)}
        >
            {arbeidsperiodeAvsluttet && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                gjelderAndreForelder
                                    ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                          tilbakeITid,
                                          erAndreForelderDød
                                      )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]
                                    : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                          ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                                      ]
                            }
                        />
                    }
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentArbeidsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]
                            }
                        />
                    }
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            {arbeidsgiver && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentArbeidsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[ArbeidsperiodeSpørsmålsId.arbeidsgiver]
                            }
                        />
                    }
                    søknadsvar={arbeidsgiver.svar}
                />
            )}
            {fraDatoArbeidsperiode && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentArbeidsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]
                            }
                        />
                    }
                    søknadsvar={formaterDato(fraDatoArbeidsperiode.svar)}
                />
            )}
            {tilDatoArbeidsperiode && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                hentArbeidsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    tilbakeITid,
                                    erAndreForelderDød
                                )[ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]
                            }
                        />
                    }
                    søknadsvar={formaterDatoMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        formatMessage({
                            id: gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(false, false)[
                                      ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                                  ]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(false)[
                                      ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                                  ],
                        })
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
