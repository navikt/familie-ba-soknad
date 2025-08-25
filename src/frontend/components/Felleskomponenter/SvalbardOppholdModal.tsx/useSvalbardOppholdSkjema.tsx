import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { PersonType } from '../../../typer/personType';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { ISvalbardOppholdPeriodeFeltTyper } from '../../../typer/skjema';
import { gårsdagensDato } from '../../../utils/dato';
import { minTilDatoForPeriode } from '../../../utils/perioder';

import { SvalbardOppholdSpørsmålId } from './spørsmål';

export interface useSvalbardOppholdSkjemaProps {
    personType: PersonType;
}

export const useSvalbardOppholdSkjema = ({ personType }: useSvalbardOppholdSkjemaProps) => {
    const { tekster } = useAppContext();
    const teksterForModal: ISvalbardOppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.svalbardOpphold[personType];

    const fraDatoSvalbardOpphold = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: SvalbardOppholdSpørsmålId.fraDatoSvalbardOpphold,
            svar: '',
        },
        skalFeltetVises: true,
        feilmelding: teksterForModal.startdato.feilmelding,
        sluttdatoAvgrensning: gårsdagensDato(),
    });

    const tilDatoSvalbardOppholdUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: SvalbardOppholdSpørsmålId.tilDatoSvalbardOppholdUkjent,
    });

    const tilDatoSvalbardOpphold = useDatovelgerFeltMedUkjentForSanity({
        feltId: SvalbardOppholdSpørsmålId.tilDatoSvalbardOpphold,
        initiellVerdi: '',
        vetIkkeCheckbox: tilDatoSvalbardOppholdUkjent,
        feilmelding: teksterForModal.sluttdato.feilmelding,
        skalFeltetVises: true,
        startdatoAvgrensning: minTilDatoForPeriode(false, fraDatoSvalbardOpphold.verdi),
        avhengigheter: { fraDatoSvalbardOpphold },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<ISvalbardOppholdPeriodeFeltTyper, 'string'>({
        felter: {
            fraDatoSvalbardOpphold,
            tilDatoSvalbardOpphold,
            tilDatoSvalbardOppholdUkjent,
        },
        skjemanavn: 'svalbardOpphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
