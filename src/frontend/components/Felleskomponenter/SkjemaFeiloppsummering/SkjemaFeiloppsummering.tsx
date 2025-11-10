import { ErrorSummary } from '@navikt/ds-react';
import { type ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { ISteg } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { AppLenke } from '../AppLenke/AppLenke';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    stegMedFeil?: ISteg;
    id?: string;
}

export const SkjemaFeiloppsummering: React.FC<Props> = ({ skjema, stegMedFeil, id }) => {
    const { tekster, plainTekst } = useAppContext();
    return (
        <ErrorSummary
            id={id}
            heading={plainTekst(tekster().FELLES.navigasjon.duMaaRetteOppFoelgende)}
            headingTag="h3"
            data-testid="skjema-feiloppsummering"
        >
            {Object.values(skjema.felter)
                .filter(felt => felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL)
                .map(felt => (
                    <ErrorSummary.Item
                        href={`#${felt.id}`}
                        data-testid={`feilmelding-${felt.id}`}
                        key={`feil-${felt.id}`}
                    >
                        {stegMedFeil ? (
                            <AppLenke steg={stegMedFeil} hash={felt.id} key={`feil-${stegMedFeil}`}>
                                {felt.feilmelding}
                            </AppLenke>
                        ) : (
                            felt.feilmelding
                        )}
                    </ErrorSummary.Item>
                ))}
        </ErrorSummary>
    );
};
