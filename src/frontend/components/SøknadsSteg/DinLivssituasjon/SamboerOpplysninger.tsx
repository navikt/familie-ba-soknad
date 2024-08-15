import React, { ReactNode } from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, FormSummary } from '@navikt/ds-react';

import { AlternativtSvarForInput } from '../../../typer/common';
import { ITidligereSamboer } from '../../../typer/person';
import { formaterDato } from '../../../utils/dato';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OppsummeringFelt } from '../Oppsummering/OppsummeringFelt';

import { samboerSpråkIder } from './spørsmål';

const SamboerOpplysninger: React.FC<{
    samboer: ITidligereSamboer;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
}> = ({ samboer, fjernTidligereSamboer }) => {
    const svarSomKanVæreUkjent = (svar: string, språkIdForUkjent: string): ReactNode =>
        svar === AlternativtSvarForInput.UKJENT ? <SpråkTekst id={språkIdForUkjent} /> : svar;

    return (
        <FormSummary.Answer>
            <FormSummary.Value>
                <FormSummary.Answers>
                    <OppsummeringFelt tittel={samboer.navn.svar.toUpperCase()} />
                    <OppsummeringFelt tittel={<SpråkTekst id={samboerSpråkIder.fnr} />}>
                        {svarSomKanVæreUkjent(samboer.ident.svar, samboerSpråkIder.fnrUkjent)}
                    </OppsummeringFelt>
                    {samboer.fødselsdato.svar && (
                        <OppsummeringFelt tittel={<SpråkTekst id={samboerSpråkIder.fødselsdato} />}>
                            {samboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT ? (
                                <SpråkTekst id={samboerSpråkIder.fødselsdatoUkjent} />
                            ) : (
                                formaterDato(samboer.fødselsdato.svar)
                            )}
                        </OppsummeringFelt>
                    )}
                    <OppsummeringFelt tittel={<SpråkTekst id={samboerSpråkIder.samboerFraDato} />}>
                        {formaterDato(samboer.samboerFraDato.svar)}
                    </OppsummeringFelt>
                    <OppsummeringFelt tittel={<SpråkTekst id={samboerSpråkIder.samboerTilDato} />}>
                        {formaterDato(samboer.samboerTilDato.svar)}
                    </OppsummeringFelt>
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        onClick={() => fjernTidligereSamboer(samboer)}
                        icon={<TrashFillIcon aria-hidden />}
                    >
                        <SpråkTekst id={'omdeg.fjernsamboer.knapp'} />
                    </Button>
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    );
};

export default SamboerOpplysninger;
