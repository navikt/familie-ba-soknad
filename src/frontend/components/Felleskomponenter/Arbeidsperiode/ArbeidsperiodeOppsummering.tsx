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
import { ArbeidsperiodeSpørsmålsId, hentArbeidsperiodeSpørsmålIder } from './spørsmål';

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

    const spørsmålSpråkTekst = (spørsmålId: ArbeidsperiodeSpørsmålsId) => (
        <SpråkTekst
            id={
                hentArbeidsperiodeSpørsmålIder(
                    gjelderAndreForelder,
                    tilbakeITid,
                    erAndreForelderDød
                )[spørsmålId]
            }
        />
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
            {arbeidsperiodeAvsluttet?.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)}
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland?.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)}
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            {arbeidsgiver?.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsgiver)}
                    søknadsvar={arbeidsgiver.svar}
                />
            )}
            {fraDatoArbeidsperiode?.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)}
                    søknadsvar={formaterDato(fraDatoArbeidsperiode.svar)}
                />
            )}
            {tilDatoArbeidsperiode?.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)}
                    søknadsvar={formaterDatoMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        formatMessage({
                            id: hentArbeidsperiodeSpørsmålIder(
                                gjelderAndreForelder,
                                tilbakeITid,
                                erAndreForelderDød
                            )[ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke],
                        })
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
