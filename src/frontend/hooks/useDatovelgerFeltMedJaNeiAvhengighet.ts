import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { type Felt, useFelt } from '@navikt/familie-skjema';

import { LocaleRecordBlock } from '../../common/sanity';
import { ISODateString } from '../../common/typer/ISODateString';
import { useAppContext } from '../context/AppContext';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    avhengigSvarCondition,
    avhengighet,
    feilmelding,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    feilmelding: LocaleRecordBlock;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
}) => {
    const { plainTekst, tekster } = useAppContext();

    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const dato = useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(
                tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | null>)
                ? skalFeltetVises(avhengigheter.jaNeiSpm.verdi)
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalFeltetVises(avhengighet.verdi);

        if (skalVises && dato.verdi !== '') {
            dato.validerOgSettFelt(dato.verdi);
        }

        return () => {
            if (!skalFeltetVises(avhengighet.verdi)) {
                dato.validerOgSettFelt('');
            }
        };
    }, [avhengighet]);

    return dato;
};

export default useDatovelgerFeltMedJaNeiAvhengighet;
