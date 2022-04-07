import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IArbeidsperiode } from '../../../typer/perioder';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { arbeidsperiodeOppsummeringOverskrift } from './arbeidsperiodeSpråkUtils';
import { arbeidsperiodeSpørsmålSpråkId, ArbeidsperiodeSpørsmålsId } from './spørsmål';

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

    const erAndreForelderDød = !!andreForelderData?.erDød;
    const tilbakeITid = arbeidsperiodeAvsluttet?.svar === ESvar.JA || erAndreForelderDød;
    const gjelderAndreForelder = !!andreForelderData;

    const hentSpørsmålTekstId = arbeidsperiodeSpørsmålSpråkId(gjelderAndreForelder, tilbakeITid);

    const spørsmålSpråkTekst = (spørsmålId: ArbeidsperiodeSpørsmålsId) => (
        <SpråkTekst id={hentSpørsmålTekstId(spørsmålId)} />
    );

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
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)}
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)}
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            {arbeidsgiver && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsgiver)}
                    søknadsvar={arbeidsgiver.svar}
                />
            )}
            {fraDatoArbeidsperiode && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)}
                    søknadsvar={formaterDato(fraDatoArbeidsperiode.svar)}
                />
            )}
            {tilDatoArbeidsperiode && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)}
                    søknadsvar={formaterDatoMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        formatMessage({
                            id: hentSpørsmålTekstId(
                                ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                            ),
                        })
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
