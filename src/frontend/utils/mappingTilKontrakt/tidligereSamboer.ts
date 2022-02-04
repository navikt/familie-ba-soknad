import { LocaleType } from '@navikt/familie-sprakvelger';

import { TidligereSamboerSpørsmålId } from '../../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { IKontraktTidligereSamboer, ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { ITidligereSamboer } from '../../typer/person';
import { sammeVerdiAlleSpråk, språktekstIdFraSpørsmålId, søknadsfelt } from './hjelpefunksjoner';
import { samboerISøknadKontraktFormat } from './samboer';

export const tidligereSamboerISøknadKontraktFormat = (
    samboer: ITidligereSamboer
): ISøknadsfelt<IKontraktTidligereSamboer> => {
    const { samboerTilDato, navn } = samboer;
    const { verdi: samboerIKontraktFormat } = samboerISøknadKontraktFormat(samboer);

    return søknadsfelt(
        'pdf.tidligeresamboer.label',
        sammeVerdiAlleSpråk({
            ...samboerIKontraktFormat[LocaleType.nb],
            samboerTilDato: søknadsfelt(
                språktekstIdFraSpørsmålId(TidligereSamboerSpørsmålId.tidligereSamboerTilDato),
                sammeVerdiAlleSpråk(samboerTilDato.svar)
            ),
        }),
        { navn: navn.svar }
    );
};
