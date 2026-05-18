import React from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, FormSummary } from '@navikt/ds-react';

import { ESanitySteg } from '../../../../../common/sanity';
import { useAppContext } from '../../../../context/AppContext';
import { IBarn } from '../../../../typer/person';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr, uppercaseFørsteBokstav } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';

interface IBarnekortProps {
    velgBarnCallback: (barn: IBarn, barnMedISøknad: boolean) => void;
    barn: IBarn;
    barnSomSkalVæreMed: IBarn[];
    fjernBarnCallback: (ident: string) => void;
}

const Barnekort: React.FC<IBarnekortProps> = ({ barn, velgBarnCallback, barnSomSkalVæreMed, fjernBarnCallback }) => {
    const { plainTekst, tekster } = useAppContext();
    const {
        søknad: { barnRegistrertManuelt },
    } = useAppContext();

    const teksterForSteg = tekster().VELG_BARN;
    const {
        alderLabel,
        aar,
        registrertBostedLabel,
        soekOmYtelseForBarnetSjekkboks,
        foedselsnummerLabel,
        navnErstatterForAdressesperre,
    } = teksterForSteg;

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    const fødselsnummerTekst = !barn.adressebeskyttelse
        ? formaterFnr(barn.ident)
        : uppercaseFørsteBokstav(plainTekst(tekster()[ESanitySteg.FELLES].frittståendeOrd.skjult));

    const knappetekst = tekster()[ESanitySteg.FELLES].modaler.leggTilBarn.fjernKnapp;

    return (
        <FormSummary.Answer>
            <FormSummary.Label>
                {barn.adressebeskyttelse ? <TekstBlock block={navnErstatterForAdressesperre} /> : barn.navn}
            </FormSummary.Label>
            <FormSummary.Value>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <FormSummary.Label>{plainTekst(foedselsnummerLabel)}</FormSummary.Label>
                        <FormSummary.Value>{fødselsnummerTekst}</FormSummary.Value>
                    </FormSummary.Answer>
                    {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                        <FormSummary.Answer>
                            <FormSummary.Label>{plainTekst(alderLabel)}</FormSummary.Label>
                            <FormSummary.Value>{`${barn.alder} ${plainTekst(aar)}`}</FormSummary.Value>
                        </FormSummary.Answer>
                    )}
                    {!erRegistrertManuelt && (
                        <FormSummary.Answer>
                            <FormSummary.Label>{plainTekst(registrertBostedLabel)}</FormSummary.Label>
                            <FormSummary.Value>
                                {
                                    <span
                                        data-testid={
                                            barn.adressebeskyttelse ? 'registrert-bosted-adressesperre' : undefined
                                        }
                                    >
                                        {plainTekst(hentBostedSpråkId(barn, teksterForSteg))}
                                    </span>
                                }
                            </FormSummary.Value>
                        </FormSummary.Answer>
                    )}
                    <FormSummary.Answer>
                        <Checkbox
                            checked={erMedISøknad}
                            aria-label={`${plainTekst(soekOmYtelseForBarnetSjekkboks)} ${barn.navn}`}
                            onChange={() => velgBarnCallback(barn, erMedISøknad)}
                            data-testid={`søk-om-barnetrygd-for-barn-${barn.ident}`}
                        >
                            <TekstBlock block={soekOmYtelseForBarnetSjekkboks} />
                        </Checkbox>
                    </FormSummary.Answer>
                </FormSummary.Answers>
            </FormSummary.Value>
            {erRegistrertManuelt && (
                <FormSummary.Answer>
                    <Button
                        type={'button'}
                        variant="tertiary"
                        onClick={() => fjernBarnCallback(barn.id)}
                        icon={<TrashFillIcon aria-hidden />}
                        data-testid="fjern-barn-knapp"
                    >
                        <TekstBlock block={knappetekst} />
                    </Button>
                </FormSummary.Answer>
            )}
        </FormSummary.Answer>
    );
};

export default Barnekort;
