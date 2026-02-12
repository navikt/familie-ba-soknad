import { ESvar } from '@navikt/familie-form-elements';
import { type ISkjema, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { ITidligereSamoboereTekstinnhold } from '../../../typer/sanity/modaler/tidligereSamboere';
import { ITidligereSamboerFeltTyper } from '../../../typer/skjema';
import { dagenEtterDato, dagensDato, gårsdagensDato, stringTilDate } from '../../../utils/dato';

import { TidligereSamboerSpørsmålId } from './spørsmål';

export const useTidligereSamboer = (): {
    skjema: ISkjema<ITidligereSamboerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
} => {
    const { tekster } = useAppContext();

    const teksterForSøker: ITidligereSamoboereTekstinnhold = tekster().FELLES.modaler.tidligereSamboere.søker;

    const tidligereSamboerNavn = useInputFelt({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
            svar: '',
        },
        feilmeldingSpråkId: 'omdeg.samboerNavn.feilmelding',
        feilmelding: teksterForSøker.samboerNavn.feilmelding,
    });

    const tidligereSamboerFnrUkjent = useFelt<ESvar>({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFnrUkjent,
        verdi: ESvar.NEI,
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerFnr = useInputFeltMedUkjent({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
            svar: '',
        },
        avhengighet: tidligereSamboerFnrUkjent,
        feilmelding: teksterForSøker.foedselsnummerEllerDNummer.feilmelding,
        erFnrInput: true,
    });

    const tidligereSamboerFødselsdatoUkjent = useFelt<ESvar>({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdatoUkjent,
        verdi: ESvar.NEI,
        avhengigheter: { fnrUkjent: tidligereSamboerFnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerFødselsdato = useDatovelgerFeltMedUkjentForSanity({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
        initiellVerdi: '',
        vetIkkeCheckbox: tidligereSamboerFødselsdatoUkjent,
        feilmelding: teksterForSøker.foedselsdato.feilmelding,
        skalFeltetVises: tidligereSamboerFnrUkjent.verdi === ESvar.JA,
    });

    const tidligereSamboerFraDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
            svar: '',
        },
        skalFeltetVises: true,
        feilmelding: teksterForSøker.startdato.feilmelding,
        sluttdatoAvgrensning: gårsdagensDato(),
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerTilDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
            svar: '',
        },
        skalFeltetVises: true,
        feilmelding: teksterForSøker.sluttdato.feilmelding,
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: dagenEtterDato(stringTilDate(tidligereSamboerFraDato.verdi)),
        avhengigheter: { tidligereSamboerFraDato },
        nullstillVedAvhengighetEndring: false,
    });

    const { skjema, kanSendeSkjema, valideringErOk, nullstillSkjema } = useSkjema<ITidligereSamboerFeltTyper, string>({
        felter: {
            tidligereSamboerNavn,
            tidligereSamboerFnr,
            tidligereSamboerFnrUkjent,
            tidligereSamboerFødselsdato,
            tidligereSamboerFødselsdatoUkjent,
            tidligereSamboerFraDato,
            tidligereSamboerTilDato,
        },
        skjemanavn: 'tidligereSamboer',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
    };
};
