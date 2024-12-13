import { type Avhengigheter, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../context/AppContext';
import { ISODateString } from '../../typer/common';
import { LocaleRecordBlock } from '../../typer/sanity/sanity';
import { ISøknadSpørsmål } from '../../typer/spørsmål';
import { validerDatoForSanity } from '../../utils/dato';

const useDatovelgerFeltForSanity = ({
    søknadsfelt,
    skalFeltetVises,
    feilmelding,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
    avhengigheter,
    customStartdatoFeilmelding = '',
    nullstillVedAvhengighetEndring = true,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    skalFeltetVises: boolean;
    feilmelding: LocaleRecordBlock;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    avhengigheter?: Avhengigheter;
    nullstillVedAvhengighetEndring?: boolean;
    customStartdatoFeilmelding?: string;
}) => {
    const { plainTekst, tekster } = useApp();
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const feilmelding = avhengigheter?.feilmelding as LocaleRecordBlock;

            return validerDatoForSanity(
                tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning,
                customStartdatoFeilmelding
            );
        },
        skalFeltetVises: avhengigheter => avhengigheter?.skalFeltetVises,
        avhengigheter: {
            skalFeltetVises,
            feilmelding,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
    });
};

export default useDatovelgerFeltForSanity;
