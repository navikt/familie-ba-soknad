import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { useSpråk } from '../../../context/SpråkContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { formaterDato, formaterDatostringKunMåned } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterMånedMedUkjent, uppercaseFørsteBokstav } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import {
    arbeidsperiodeModalSpørsmålSpråkId,
    arbeidsperiodeOppsummeringOverskrift,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

interface Props {
    arbeidsperiode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback?: (arbeidsperiode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
}

type ArbeidperiodeOppsummeringPersonTypeProps =
    | { personType: PersonType.Søker; erDød?: boolean }
    | { personType: PersonType.Omsorgsperson; erDød?: boolean }
    | { personType: PersonType.AndreForelder; erDød: boolean };

type ArbeidsperiodeOppsummeringProps = Props & ArbeidperiodeOppsummeringPersonTypeProps;

export const ArbeidsperiodeOppsummering: React.FC<ArbeidsperiodeOppsummeringProps> = ({
    arbeidsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet,
    personType,
    erDød = false,
}) => {
    const { valgtLocale } = useSpråk();
    const intl = useIntl();
    const { toggles } = useFeatureToggles();

    const { formatMessage } = intl;
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = arbeidsperiode;

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet?.svar === ESvar.JA ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = arbeidsperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet);

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
            {arbeidsperiodeAvsluttet.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet)}
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)}
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            {arbeidsgiver.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.arbeidsgiver)}
                    søknadsvar={arbeidsgiver.svar}
                />
            )}
            {fraDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode)}
                    søknadsvar={
                        toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO]
                            ? uppercaseFørsteBokstav(
                                  formaterDatostringKunMåned(
                                      fraDatoArbeidsperiode.svar,
                                      valgtLocale
                                  )
                              )
                            : formaterDato(fraDatoArbeidsperiode.svar)
                    }
                />
            )}
            {tilDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode)}
                    søknadsvar={formaterMånedMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        formatMessage({
                            id: hentSpørsmålTekstId(
                                ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                            ),
                        }),
                        toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO],
                        valgtLocale
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
