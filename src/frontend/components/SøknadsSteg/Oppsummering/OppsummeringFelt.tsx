import { ReactNode } from 'react';

import { FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand } from '../../../../common/typer/kontrakt/generelle';
import { jaNeiSvarTilSpråkId } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface IOppsummeringsFeltProps {
    tittel?: ReactNode;
    søknadsvar?: string | null;
    children?: ReactNode;
}

export const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({ tittel, søknadsvar, children }) => {
    let språktekstid: boolean | string = false;
    if (søknadsvar && søknadsvar in ESvar) {
        språktekstid = jaNeiSvarTilSpråkId(søknadsvar as ESvar);
    } else if (søknadsvar && søknadsvar in ESivilstand) {
        språktekstid = 'felles.sivilstatus.kode.' + søknadsvar;
    }

    return (
        <FormSummary.Answer>
            {tittel && <FormSummary.Label>{tittel}</FormSummary.Label>}
            {(søknadsvar || children) && (
                <FormSummary.Value>
                    {søknadsvar ? <>{språktekstid ? <SpråkTekst id={språktekstid} /> : søknadsvar}</> : children}
                </FormSummary.Value>
            )}
        </FormSummary.Answer>
    );
};
