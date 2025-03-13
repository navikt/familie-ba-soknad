import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { formaterDatostringKunMåned } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterMånedMedUkjent, uppercaseFørsteBokstav } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../Sanity/TekstBlock';

import { arbeidsperiodeOppsummeringOverskrift } from './arbeidsperiodeSpråkUtils';

interface Props {
    arbeidsperiode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback?: (arbeidsperiode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
}

type ArbeidsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const ArbeidsperiodeOppsummering: React.FC<ArbeidsperiodeOppsummeringProps> = ({
    arbeidsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet,
    personType,
    erDød = false,
}) => {
    const { tekster, plainTekst } = useApp();
    const { valgtLocale } = useSpråk();
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = arbeidsperiode;

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet?.svar === ESvar.JA ||
        (personType === PersonType.AndreForelder && erDød);

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(arbeidsperiode))
            }
            fjernKnappSpråkId={'felles.fjernarbeidsperiode.knapp'}
            fjernKnappTekst={teksterForModal.fjernKnapp}
            nummer={nummer}
            tittelSpråkId={arbeidsperiodeOppsummeringOverskrift(gjelderUtlandet)}
            tittel={
                <TekstBlock
                    block={teksterForModal.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString(), gjelderUtland: gjelderUtlandet }}
                />
            }
        >
            {arbeidsperiodeAvsluttet.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock block={teksterForModal.arbeidsperiodenAvsluttet.sporsmal} />
                    }
                    søknadsvar={arbeidsperiodeAvsluttet.svar}
                />
            )}
            {arbeidsperiodeland.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.hvilketLandFortid.sporsmal
                                    : teksterForModal.hvilketLandNaatid.sporsmal
                            }
                        />
                    }
                    søknadsvar={landkodeTilSpråk(arbeidsperiodeland.svar, valgtLocale)}
                />
            )}
            {arbeidsgiver.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForModal.arbeidsgiver.sporsmal} />}
                    søknadsvar={arbeidsgiver.svar}
                />
            )}
            {/* {fraDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                    søknadsvar={formaterDato(fraDatoArbeidsperiode.svar)}
                />
            )} */}
            {fraDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                    søknadsvar={uppercaseFørsteBokstav(
                        formaterDatostringKunMåned(fraDatoArbeidsperiode.svar, valgtLocale)
                    )}
                />
            )}
            {/* {tilDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.sluttdatoFortid.sporsmal
                                    : teksterForModal.sluttdatoFremtid.sporsmal
                            }
                        />
                    }
                    søknadsvar={formaterDatoMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel)
                    )}
                />
            )} */}
            {tilDatoArbeidsperiode.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.sluttdatoFortid.sporsmal
                                    : teksterForModal.sluttdatoFremtid.sporsmal
                            }
                        />
                    }
                    søknadsvar={formaterMånedMedUkjent(
                        tilDatoArbeidsperiode.svar,
                        plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel),
                        true,
                        valgtLocale
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
