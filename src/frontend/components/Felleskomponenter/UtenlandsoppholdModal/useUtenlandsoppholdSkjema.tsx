import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { ESanitySteg } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { IBarnMedISøknad } from '../../../typer/barn';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { dagenEtterDato, stringTilDate } from '../../../utils/dato';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';

import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import { hentFraDatoFeilmelding, hentLandFeilmelding, landFeilmeldingSpråkId } from './utenlandsoppholdSpråkUtils';

export interface IUseUtenlandsoppholdSkjemaParams {
    personType: PersonType;
    barn?: IBarnMedISøknad;
}

export const useUtenlandsoppholdSkjema = ({ personType, barn }: IUseUtenlandsoppholdSkjemaParams) => {
    const { tekster, plainTekst } = useAppContext();
    const teksterForPersontype: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    const utenlandsoppholdÅrsak = useFelt<EUtenlandsoppholdÅrsak | ''>({
        feltId: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<EUtenlandsoppholdÅrsak | ''>) =>
            felt.verdi !== '' ? ok(felt) : feil(felt, plainTekst(teksterForPersontype.periodeBeskrivelse.feilmelding)),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [utenlandsoppholdÅrsak.verdi]);

    const oppholdsland = useLanddropdownFelt({
        søknadsfelt: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: '' },
        feilmelding: hentLandFeilmelding(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
        feilmeldingSpråkId: landFeilmeldingSpråkId(utenlandsoppholdÅrsak.verdi, barn),
        skalFeltetVises: !!utenlandsoppholdÅrsak.verdi,
        nullstillVedAvhengighetEndring: true,
    });

    const oppholdslandFraDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE,
        feilmelding: hentFraDatoFeilmelding(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
        sluttdatoAvgrensning: hentMaxAvgrensningPåFraDato(utenlandsoppholdÅrsak.verdi),
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const oppholdslandTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsoppholdVetIkke,
        skalFeltetVises: avhengigheter =>
            !!avhengigheter.utenlandsoppholdÅrsak.verdi &&
            avhengigheter.utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        avhengigheter: { utenlandsoppholdÅrsak },
    });

    const oppholdslandTilDato = useDatovelgerFeltMedUkjentForSanity({
        feltId: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
        initiellVerdi: '',
        vetIkkeCheckbox: oppholdslandTilDatoUkjent,
        feilmelding: hentFraDatoFeilmelding(utenlandsoppholdÅrsak.verdi, teksterForPersontype),
        skalFeltetVises:
            !!utenlandsoppholdÅrsak.verdi &&
            utenlandsoppholdÅrsak.verdi !== EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE,
        sluttdatoAvgrensning: hentMaxAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        startdatoAvgrensning: harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? dagenEtterDato(stringTilDate(oppholdslandFraDato.verdi))
            : hentMinAvgrensningPåTilDato(utenlandsoppholdÅrsak.verdi),
        customStartdatoFeilmelding: !harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
            ? utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE
                ? plainTekst(tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid)
                : plainTekst(tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaere12MndTilbake)
            : undefined,
        avhengigheter: { utenlandsoppholdÅrsak, oppholdslandFraDato },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, 'string'>({
        felter: {
            utenlandsoppholdÅrsak,
            oppholdsland,
            oppholdslandFraDato,
            oppholdslandTilDato,
            oppholdslandTilDatoUkjent,
        },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
