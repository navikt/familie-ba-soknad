import { useAppContext } from '@context/AppContext';
import { FormSummary } from '@navikt/ds-react';
import { formaterSøknadsvar } from '@utils/språk';
import type { FC, ReactNode } from 'react';

interface IOppsummeringsFeltProps {
    tittel?: ReactNode;
    søknadsvar?: string | null;
    children?: ReactNode;
}

export const OppsummeringFelt: FC<IOppsummeringsFeltProps> = ({ tittel, søknadsvar, children }) => {
    const { plainTekst, tekster } = useAppContext();

    return (
        <FormSummary.Answer>
            {tittel && <FormSummary.Label>{tittel}</FormSummary.Label>}
            {(søknadsvar || children) && (
                <FormSummary.Value>
                    {søknadsvar
                        ? formaterSøknadsvar(søknadsvar, plainTekst, tekster().FELLES.frittståendeOrd)
                        : children}
                </FormSummary.Value>
            )}
        </FormSummary.Answer>
    );
};
