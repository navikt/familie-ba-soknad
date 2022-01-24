import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IPensjonsperiode } from '../../../typer/perioder';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';

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
    const intl = useIntl();
    const { formatMessage } = intl;
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
            tittelSpråkId={'felles.leggtilpensjon.periode'}
        >
            <div>Oppsummering for pensjon</div>
        </PeriodeOppsummering>
    );
};
