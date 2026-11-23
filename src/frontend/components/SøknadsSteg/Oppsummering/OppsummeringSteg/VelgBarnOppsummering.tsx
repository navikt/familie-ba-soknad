import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import { OppsummeringFelt } from '@components/SøknadsSteg/Oppsummering/OppsummeringFelt';
import Oppsummeringsbolk from '@components/SøknadsSteg/Oppsummering/Oppsummeringsbolk';
import { useVelgBarn } from '@components/SøknadsSteg/VelgBarn/useVelgBarn';
import { useAppContext } from '@context/AppContext';
import { FormSummary } from '@navikt/ds-react';
import { RouteEnum } from '@typer/routes';
import { hentBostedSpråkId } from '@utils/språk';
import { formaterFnr } from '@utils/visning';
import type { Dispatch, FC, SetStateAction } from 'react';
import { ROUTES } from '../../../../routes';

interface Props {
    settFeilAnchors: Dispatch<SetStateAction<string[]>>;
}

const VelgBarnOppsummering: FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useAppContext();
    const velgBarnHook = useVelgBarn();

    const velgBarnTekster = tekster().VELG_BARN;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;
    const leggTilBarnTekster = tekster().FELLES.modaler.leggTilBarn;

    return (
        <Oppsummeringsbolk
            steg={ROUTES[RouteEnum.VelgBarn]}
            tittel={velgBarnTekster.velgBarnTittel}
            skjemaHook={velgBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            {søknad.barnInkludertISøknaden.map((barn, index) => (
                <FormSummary.Answer key={index}>
                    <FormSummary.Label>
                        {plainTekst(frittståendeOrdTekster.barn)} {index + 1}
                    </FormSummary.Label>
                    <FormSummary.Value>
                        <FormSummary.Answers>
                            <OppsummeringFelt
                                tittel={<TekstBlock block={leggTilBarnTekster.barnetsNavnSubtittel} />}
                                søknadsvar={
                                    barn.adressebeskyttelse
                                        ? plainTekst(velgBarnTekster.registrertMedAdressesperre)
                                        : barn.navn
                                }
                            />
                            <OppsummeringFelt
                                tittel={<TekstBlock block={velgBarnTekster.foedselsnummerLabel} />}
                                søknadsvar={formaterFnr(barn.ident)}
                            />
                            {!søknad.barnRegistrertManuelt.find(
                                barnRegistrertManuelt => barnRegistrertManuelt.ident === barn.ident
                            ) && (
                                <OppsummeringFelt
                                    tittel={<TekstBlock block={velgBarnTekster.registrertBostedLabel} />}
                                    søknadsvar={plainTekst(hentBostedSpråkId(barn, velgBarnTekster))}
                                />
                            )}
                        </FormSummary.Answers>
                    </FormSummary.Value>
                </FormSummary.Answer>
            ))}
        </Oppsummeringsbolk>
    );
};

export default VelgBarnOppsummering;
