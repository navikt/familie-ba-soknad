import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { formaterDatostringKunMåned } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../Sanity/TekstBlock';

import { pensjonsperiodeOppsummeringOverskrift } from './språkUtils';

interface Props {
    pensjonsperiode: IPensjonsperiode;
    nummer: number;
    fjernPeriodeCallback?: (pensjonsperiode: IPensjonsperiode) => void;
    gjelderUtlandet: boolean;
}

type PensjonsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const PensjonsperiodeOppsummering: React.FC<PensjonsperiodeOppsummeringProps> = ({
    pensjonsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet,
    personType,
    erDød = false,
    barn = undefined,
}) => {
    const { valgtLocale } = useSpråkContext();
    const { tekster } = useAppContext();
    const teksterForModal = tekster().FELLES.modaler.pensjonsperiode[personType];

    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = pensjonsperiode;

    const periodenErAvsluttet =
        mottarPensjonNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && !!erDød);

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(pensjonsperiode))
            }
            fjernKnappSpråkId={'felles.fjernpensjon.knapp'}
            fjernKnappTekst={teksterForModal.fjernKnapp}
            nummer={nummer}
            tittelSpråkId={pensjonsperiodeOppsummeringOverskrift(gjelderUtlandet)}
            tittel={
                <TekstBlock
                    block={teksterForModal.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString(), gjelderUtland: gjelderUtlandet }}
                />
            }
        >
            {mottarPensjonNå.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={teksterForModal.faarPensjonNaa.sporsmal}
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    søknadsvar={mottarPensjonNå.svar}
                />
            )}
            {pensjonsland.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.pensjonLandFortid.sporsmal
                                    : teksterForModal.pensjonLandNaatid.sporsmal
                            }
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    søknadsvar={landkodeTilSpråk(pensjonsland.svar, valgtLocale)}
                />
            )}
            {pensjonFra.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.startdatoFortid.sporsmal
                                    : teksterForModal.startdatoNaatid.sporsmal
                            }
                            flettefelter={{
                                barnetsNavn: barn?.navn,
                            }}
                        />
                    }
                    søknadsvar={uppercaseFørsteBokstav(
                        formaterDatostringKunMåned(pensjonFra.svar, valgtLocale)
                    )}
                />
            )}
            {pensjonTil.svar && (
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
                    søknadsvar={uppercaseFørsteBokstav(
                        formaterDatostringKunMåned(pensjonTil.svar, valgtLocale)
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
