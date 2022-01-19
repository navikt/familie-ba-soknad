import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IArbeidsperiode } from '../../../typer/person';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { arbeidsperiodeOppsummeringOverskrift } from './arbeidsperiodeSpråkUtils';
import {
    arbeidsperiodeAndreForelderSpørsmålSpråkId,
    ArbeidsperiodeSpørsmålsId,
    arbeidsperiodeSøkerSpørsmålSpråkId,
    hentArbeidsperiodeSpørsmålIder,
} from './spørsmål';

const PeriodeContainer = styled.div`
    margin: 2rem 0;
    border-bottom: 1px solid #78706a; // TODO: Bytt til riktig nav farge og bruk variabel
`;

const SlettKnapp = styled(Flatknapp)`
    margin-top: 1rem;
    margin-bottom: 1.5rem;
`;

export const ArbeidsperiodeOppsummering: React.FC<{
    arbeidsperiode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback: (arbeidsperiode: IArbeidsperiode) => void;
    barn?: IBarnMedISøknad;
    visFjernKnapp?: boolean;
    className?: string;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean };
}> = ({
    arbeidsperiode,
    nummer,
    fjernPeriodeCallback,
    visFjernKnapp = true,
    className,
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
        <PeriodeContainer className={className}>
            <Element>
                <SpråkTekst
                    id={arbeidsperiodeOppsummeringOverskrift(gjelderUtlandet)}
                    values={{ x: nummer }}
                />
            </Element>
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
            {visFjernKnapp && (
                <SlettKnapp
                    htmlType={'button'}
                    kompakt
                    onClick={() => fjernPeriodeCallback(arbeidsperiode)}
                >
                    <DeleteFilled />
                    <span>
                        <SpråkTekst id={'felles.fjernarbeidsperiode.knapp'} />
                    </span>
                </SlettKnapp>
            )}
        </PeriodeContainer>
    );
};
