import React from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, FormSummary } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { AlternativtSvarForInput } from '../../../typer/common';
import { ITidligereSamboer } from '../../../typer/person';
import { ITidligereSamoboereTekstinnhold } from '../../../typer/sanity/modaler/tidligereSamboere';
import { formaterDato } from '../../../utils/dato';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { OppsummeringFelt } from '../Oppsummering/OppsummeringFelt';

const SamboerOpplysninger: React.FC<{
    samboer: ITidligereSamboer;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
}> = ({ samboer, fjernTidligereSamboer }) => {
    const { tekster } = useApp();

    const teksterForModal: ITidligereSamoboereTekstinnhold =
        tekster().FELLES.modaler.tidligereSamboere.søker;

    return (
        <FormSummary.Answer>
            <FormSummary.Value>
                <FormSummary.Answers>
                    <OppsummeringFelt tittel={samboer.navn.svar.toUpperCase()} />
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={teksterForModal.foedselsnummerEllerDNummer.sporsmal}
                            />
                        }
                    >
                        {samboer.ident.svar === AlternativtSvarForInput.UKJENT ? (
                            <TekstBlock
                                block={teksterForModal.foedselsnummerEllerDNummer.checkboxLabel}
                            />
                        ) : (
                            samboer.ident.svar
                        )}
                    </OppsummeringFelt>
                    {samboer.fødselsdato.svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={teksterForModal.foedselsdato.sporsmal} />}
                        >
                            {samboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT ? (
                                <TekstBlock block={teksterForModal.foedselsdato.checkboxLabel} />
                            ) : (
                                formaterDato(samboer.fødselsdato.svar)
                            )}
                        </OppsummeringFelt>
                    )}
                    <OppsummeringFelt
                        tittel={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                    >
                        {formaterDato(samboer.samboerFraDato.svar)}
                    </OppsummeringFelt>
                    <OppsummeringFelt
                        tittel={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                    >
                        {formaterDato(samboer.samboerTilDato.svar)}
                    </OppsummeringFelt>
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        onClick={() => fjernTidligereSamboer(samboer)}
                        icon={<TrashFillIcon aria-hidden />}
                    >
                        <TekstBlock block={teksterForModal.fjernKnapp} />
                    </Button>
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    );
};

export default SamboerOpplysninger;
