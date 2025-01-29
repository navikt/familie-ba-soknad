import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../Sanity/TekstBlock';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import {
    pensjonsperiodeModalSpørsmålSpråkId,
    pensjonsperiodeOppsummeringOverskrift,
} from './språkUtils';
import { PensjonsperiodeSpørsmålId } from './spørsmål';

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
    const { valgtLocale } = useSpråk();
    const { tekster } = useApp();
    const teksterForModal = tekster().FELLES.modaler.pensjonsperiode[personType];

    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = pensjonsperiode;

    const periodenErAvsluttet =
        mottarPensjonNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && !!erDød);

    const hentPensjonsperiodeSpråkIder = pensjonsperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const spørsmålSpråkTekst = (spørsmålId: PensjonsperiodeSpørsmålId) => (
        <SpråkTekst
            id={hentPensjonsperiodeSpråkIder(spørsmålId)}
            values={{
                ...(barn && { barn: barn.navn }),
            }}
        />
    );

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
                    tittel={spørsmålSpråkTekst(PensjonsperiodeSpørsmålId.mottarPensjonNå)}
                    søknadsvar={mottarPensjonNå.svar}
                />
            )}
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
                    tittel={spørsmålSpråkTekst(PensjonsperiodeSpørsmålId.pensjonsland)}
                    søknadsvar={landkodeTilSpråk(pensjonsland.svar, valgtLocale)}
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
                    tittel={spørsmålSpråkTekst(PensjonsperiodeSpørsmålId.fraDatoPensjon)}
                    søknadsvar={formaterDato(pensjonFra.svar)}
                />
            )}
            {pensjonFra.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                    søknadsvar={formaterDato(pensjonFra.svar)}
                />
            )}
            {pensjonTil.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(PensjonsperiodeSpørsmålId.tilDatoPensjon)}
                    søknadsvar={formaterDato(pensjonTil.svar)}
                />
            )}
            {pensjonTil.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                    søknadsvar={formaterDato(pensjonTil.svar)}
                />
            )}
        </PeriodeOppsummering>
    );
};
