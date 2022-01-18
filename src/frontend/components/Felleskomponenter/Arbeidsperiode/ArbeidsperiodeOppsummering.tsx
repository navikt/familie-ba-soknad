import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IArbeidsperiode } from '../../../typer/person';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { tilDatoUkjentLabelSpråkId } from '../UtenlandsoppholdModal/spørsmål';
import { arbeidsperiodeOppsummeringOverskrift } from './arbeidsperiodeSpråkUtils';
import {
    arbeidsperiodeAndreForelderSpørsmålSpråkId,
    ArbeidsperiodeSpørsmålsId,
    arbeidsperiodeSøkerSpørsmålSpråkId,
} from './spørsmål';

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string; språkValues?: Record<string, ReactNode> }> = ({
    språkId,
    språkValues = {},
}) => (
    <StyledElement>
        <SpråkTekst id={språkId} values={språkValues} />
    </StyledElement>
);

const PeriodeContainer = styled.div`
    margin: 2rem 0;
    border-bottom: 1px solid #78706a; ;
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
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={
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
                    <Normaltekst>
                        <SpråkTekst id={arbeidsperiodeAvsluttet.svar} />
                    </Normaltekst>
                </Informasjonsbolk>
            )}
            {arbeidsperiodeland && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={
                            gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                      ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand
                                  ]
                        }
                    />
                    <Normaltekst>
                        {landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                    </Normaltekst>
                </Informasjonsbolk>
            )}
            {arbeidsgiver && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={
                            gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[ArbeidsperiodeSpørsmålsId.arbeidsgiver]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                      ArbeidsperiodeSpørsmålsId.arbeidsgiver
                                  ]
                        }
                    />
                    <Normaltekst>
                        <SpråkTekst id={arbeidsgiver.svar} />
                    </Normaltekst>
                </Informasjonsbolk>
            )}
            {fraDatoArbeidsperiode && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={
                            gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                      ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode
                                  ]
                        }
                    />
                    <Normaltekst>{formaterDato(fraDatoArbeidsperiode.svar)}</Normaltekst>
                </Informasjonsbolk>
            )}
            {tilDatoArbeidsperiode && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={
                            gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                      ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode
                                  ]
                        }
                    />
                    <Normaltekst>
                        {formaterDatoMedUkjent(
                            tilDatoArbeidsperiode.svar,
                            formatMessage({ id: tilDatoUkjentLabelSpråkId })
                        )}
                    </Normaltekst>
                </Informasjonsbolk>
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
