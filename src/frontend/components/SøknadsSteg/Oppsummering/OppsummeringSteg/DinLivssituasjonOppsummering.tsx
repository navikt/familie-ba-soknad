import { ESivilstand } from '@common/typer/kontrakt/generelle';
import { ArbeidsperiodeOppsummering } from '@components/Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '@components/Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import { useDinLivssituasjon } from '@components/SøknadsSteg/DinLivssituasjon/useDinLivssituasjon';
import { OppsummeringFelt } from '@components/SøknadsSteg/Oppsummering/OppsummeringFelt';
import Oppsummeringsbolk from '@components/SøknadsSteg/Oppsummering/Oppsummeringsbolk';
import { useAppContext } from '@context/AppContext';
import { FormSummary } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { ISamboer, ITidligereSamboer } from '@typer/person';
import { PersonType } from '@typer/personType';
import { RouteEnum } from '@typer/routes';
import { AlternativtSvarForInput } from '@typer/svar';
import { formaterDato } from '@utils/dato';
import { hentÅrsak } from '@utils/språk';
import { formaterFnr } from '@utils/visning';
import type { Dispatch, FC, SetStateAction } from 'react';
import { ROUTES } from '../../../../routes';

interface Props {
    settFeilAnchors: Dispatch<SetStateAction<string[]>>;
}

const SamboerOppsummering: FC<{ samboer: ISamboer | ITidligereSamboer }> = ({ samboer }) => {
    const { tekster, plainTekst } = useAppContext();

    const tidligereSamboereModalTekster = tekster().FELLES.modaler.tidligereSamboere.søker;

    return (
        <FormSummary.Answer>
            <FormSummary.Value>
                <FormSummary.Answers>
                    <OppsummeringFelt
                        tittel={<TekstBlock block={tidligereSamboereModalTekster.samboerNavn.sporsmal} />}
                        søknadsvar={samboer.navn.svar}
                    />
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={tidligereSamboereModalTekster.foedselsnummerEllerDNummer.sporsmal} />
                        }
                        søknadsvar={
                            samboer.ident.svar === AlternativtSvarForInput.UKJENT
                                ? plainTekst(tidligereSamboereModalTekster.foedselsnummerEllerDNummer.checkboxLabel)
                                : formaterFnr(samboer.ident.svar)
                        }
                    />
                    {samboer.fødselsdato.svar && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={tidligereSamboereModalTekster.foedselsdato.sporsmal} />}
                            søknadsvar={
                                samboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT
                                    ? plainTekst(tidligereSamboereModalTekster.foedselsdato.checkboxLabel)
                                    : formaterDato(samboer.fødselsdato.svar)
                            }
                        />
                    )}
                    <OppsummeringFelt
                        tittel={<TekstBlock block={tidligereSamboereModalTekster.startdato.sporsmal} />}
                        søknadsvar={formaterDato(samboer.samboerFraDato.svar)}
                    />
                    {'samboerTilDato' in samboer && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={tidligereSamboereModalTekster.sluttdato.sporsmal} />}
                            søknadsvar={formaterDato(samboer.samboerTilDato.svar)}
                        />
                    )}
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    );
};

const DinLivssituasjonOppsummering: FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, erUtvidet, tekster, plainTekst } = useAppContext();
    const dinLivsituasjonHook = useDinLivssituasjon();

    const tidligereSamboere = søknad.søker.utvidet.tidligereSamboere;
    const dinLivssituasjonTekster = tekster().DIN_LIVSSITUASJON;

    return (
        <Oppsummeringsbolk
            steg={ROUTES[RouteEnum.DinLivssituasjon]}
            tittel={dinLivssituasjonTekster.dinLivssituasjonTittel}
            skjemaHook={dinLivsituasjonHook}
            settFeilAnchors={settFeilAnchors}
        >
            {erUtvidet && (
                <>
                    <OppsummeringFelt
                        tittel={<TekstBlock block={dinLivssituasjonTekster.hvorforSoekerUtvidet.sporsmal} />}
                        søknadsvar={
                            søknad.søker.utvidet.spørsmål.årsak.svar &&
                            plainTekst(hentÅrsak(søknad.søker.utvidet.spørsmål.årsak.svar, dinLivssituasjonTekster))
                        }
                    />
                    {søknad.søker.sivilstand.type === ESivilstand.GIFT && (
                        <>
                            <OppsummeringFelt
                                tittel={<TekstBlock block={dinLivssituasjonTekster.separertEnkeSkilt.sporsmal} />}
                                søknadsvar={søknad.søker.utvidet.spørsmål.separertEnkeSkilt.svar}
                            />
                            {søknad.søker.utvidet.spørsmål.separertEnkeSkilt.svar === ESvar.JA && (
                                <>
                                    <OppsummeringFelt
                                        tittel={
                                            <TekstBlock
                                                block={dinLivssituasjonTekster.separertEnkeSkiltUtland.sporsmal}
                                            />
                                        }
                                        søknadsvar={søknad.søker.utvidet.spørsmål.separertEnkeSkiltUtland.svar}
                                    />
                                    <OppsummeringFelt
                                        tittel={
                                            <TekstBlock
                                                block={dinLivssituasjonTekster.separertEnkeSkiltDato.sporsmal}
                                            />
                                        }
                                        søknadsvar={formaterDato(
                                            søknad.søker.utvidet.spørsmål.separertEnkeSkiltDato.svar
                                        )}
                                    />
                                </>
                            )}
                        </>
                    )}

                    <OppsummeringFelt
                        tittel={<TekstBlock block={dinLivssituasjonTekster.harSamboerNaa.sporsmal} />}
                        søknadsvar={søknad.søker.utvidet.spørsmål.harSamboerNå.svar}
                    />
                    {søknad.søker.utvidet.nåværendeSamboer && (
                        <SamboerOppsummering samboer={søknad.søker.utvidet.nåværendeSamboer} />
                    )}

                    <OppsummeringFelt
                        tittel={<TekstBlock block={dinLivssituasjonTekster.hattAnnenSamboerForSoektPeriode.sporsmal} />}
                        søknadsvar={søknad.søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode.svar}
                    />
                    {tidligereSamboere.map((tidligereSamboer, index) => (
                        <SamboerOppsummering key={index} samboer={tidligereSamboer} />
                    ))}
                </>
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={dinLivssituasjonTekster.erAsylsoeker.sporsmal} />}
                søknadsvar={søknad.søker.erAsylsøker.svar}
            />
            <OppsummeringFelt
                tittel={<TekstBlock block={dinLivssituasjonTekster.arbeidUtenforNorge.sporsmal} />}
                søknadsvar={søknad.søker.arbeidIUtlandet.svar}
            />

            {søknad.søker.arbeidsperioderUtland.map((periode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-${index}`}
                    nummer={index + 1}
                    arbeidsperiode={periode}
                    gjelderUtlandet={true}
                    personType={PersonType.Søker}
                />
            ))}

            <OppsummeringFelt
                tittel={<TekstBlock block={dinLivssituasjonTekster.pensjonUtland.sporsmal} />}
                søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
            />

            {søknad.søker.pensjonsperioderUtland.map((periode, index) => (
                <PensjonsperiodeOppsummering
                    key={`utenlandsperiode-${index}`}
                    nummer={index + 1}
                    pensjonsperiode={periode}
                    gjelderUtlandet={true}
                    personType={PersonType.Søker}
                />
            ))}
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
