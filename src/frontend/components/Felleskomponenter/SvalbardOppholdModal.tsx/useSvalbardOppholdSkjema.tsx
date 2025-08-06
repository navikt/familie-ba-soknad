import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { type FeltState, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { ISvalbardPeriodeFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';

import { SvalbardOppholdSpørsmålId } from './spørsmål';

export const useSvalbardOppholdSkjema = () => {
    const { tekster } = useAppContext();
    const teksterForModal: ISvalbardOppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.svalbardOpphold;

    const fraDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: SvalbardOppholdSpørsmålId.fraDato,
            svar: '',
        },
        skalFeltetVises: true,
        feilmelding: teksterForModal.startdato.feilmelding,
        sluttdatoAvgrensning: dagensDato(), // FIXME:
    });

    const tilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: SvalbardOppholdSpørsmålId.tilDatoUkjent,
    });

    const tilDato = useDatovelgerFeltMedUkjentForSanity({
        feltId: SvalbardOppholdSpørsmålId.tilDato,
        initiellVerdi: '',
        vetIkkeCheckbox: tilDatoUkjent,
        feilmelding: teksterForModal.sluttdato.feilmelding,
        skalFeltetVises: true,
        sluttdatoAvgrensning: dagensDato(), // FIXME:
        startdatoAvgrensning: dagensDato(), // FIXME:
        avhengigheter: { fraDato },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<ISvalbardPeriodeFeltTyper, 'string'>({
        felter: {
            fraDatoSvalbardOpphold: fraDato,
            tilDatoSvalbardOpphold: tilDato,
            tilDatoSvalbardOppholdUkjent: tilDatoUkjent,
        },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
