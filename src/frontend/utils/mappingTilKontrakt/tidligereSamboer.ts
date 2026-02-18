import { IKontraktTidligereSamboer, ISøknadsfelt, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import { LocaleType } from '../../../common/typer/localeType';
import { ITidligereSamboer } from '../../typer/person';
import { ITidligereSamoboereTekstinnhold } from '../../typer/sanity/modaler/tidligereSamboere';

import { sammeVerdiAlleSpråk, søknadsfeltHof } from './hjelpefunksjoner';
import { samboerISøknadKontraktFormat } from './samboer';

interface TidligereSamboerIKontraktFormatParams {
    tekster: ITidligereSamoboereTekstinnhold;
    tilRestLocaleRecord: TilRestLocaleRecord;
    samboer: ITidligereSamboer;
}

export const tidligereSamboerISøknadKontraktFormat = ({
    tekster,
    tilRestLocaleRecord,
    samboer,
}: TidligereSamboerIKontraktFormatParams): ISøknadsfelt<IKontraktTidligereSamboer> => {
    const { samboerTilDato } = samboer;
    const { verdi: samboerIKontraktFormat } = samboerISøknadKontraktFormat({
        tekster,
        tilRestLocaleRecord,
        samboer,
    });

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel),
        verdi: sammeVerdiAlleSpråk({
            ...samboerIKontraktFormat[LocaleType.nb],
            samboerTilDato: søknadsfelt(tekster.sluttdato.sporsmal, sammeVerdiAlleSpråk(samboerTilDato.svar)),
        }),
    };
};
