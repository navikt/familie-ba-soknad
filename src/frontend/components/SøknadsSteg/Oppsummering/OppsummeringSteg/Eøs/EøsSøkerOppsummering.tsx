import { ArbeidsperiodeOppsummering } from '@components/Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '@components/Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import { UtbetalingsperiodeOppsummering } from '@components/Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import IdNummerForSøker from '@components/SøknadsSteg/EøsSteg/Søker/IdNummerForSøker';
import { useEøsForSøker } from '@components/SøknadsSteg/EøsSteg/Søker/useEøsForSøker';
import { OppsummeringFelt } from '@components/SøknadsSteg/Oppsummering/OppsummeringFelt';
import Oppsummeringsbolk from '@components/SøknadsSteg/Oppsummering/Oppsummeringsbolk';
import { useAppContext } from '@context/AppContext';
import { PersonType } from '@typer/personType';
import { RouteEnum } from '@typer/routes';
import type { Dispatch, FC, SetStateAction } from 'react';
import { ROUTES } from '../../../../../routes';

interface Props {
    settFeilAnchors: Dispatch<SetStateAction<string[]>>;
}

const EøsSøkerOppsummering: FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster } = useAppContext();
    const { søker } = søknad;
    const eøsForSøkerHook = useEøsForSøker();
    const teskterForSteg = tekster().EØS_FOR_SØKER;

    return (
        <Oppsummeringsbolk
            steg={ROUTES[RouteEnum.EøsForSøker]}
            tittel={teskterForSteg.eoesForSoekerTittel}
            skjemaHook={eøsForSøkerHook}
            settFeilAnchors={settFeilAnchors}
        >
            <IdNummerForSøker
                skjema={eøsForSøkerHook.skjema}
                settIdNummerFelter={eøsForSøkerHook.settIdNummerFelter}
                lesevisning={true}
            />
            {søker.adresseISøkeperiode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teskterForSteg.hvorBor.sporsmal} />}
                    søknadsvar={søker.adresseISøkeperiode.svar}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={teskterForSteg.arbeidNorge.sporsmal} />}
                søknadsvar={søker.arbeidINorge.svar}
            />
            {søker.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-søker-norge-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.Søker}
                    gjelderUtlandet={false}
                />
            ))}
            <OppsummeringFelt
                tittel={<TekstBlock block={teskterForSteg.pensjonNorge.sporsmal} />}
                søknadsvar={søker.pensjonNorge.svar}
            />
            {søker.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-søker-norge-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    gjelderUtlandet={false}
                    personType={PersonType.Søker}
                />
            ))}
            <OppsummeringFelt
                tittel={<TekstBlock block={teskterForSteg.utbetalinger.sporsmal} />}
                søknadsvar={søker.andreUtbetalinger.svar}
            />
            {søker.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                <UtbetalingsperiodeOppsummering
                    key={`utbetalingsperiode-søker-norge-${index}`}
                    utbetalingsperiode={utbetalingsperiode}
                    nummer={index + 1}
                    personType={PersonType.Søker}
                />
            ))}
        </Oppsummeringsbolk>
    );
};

export default EøsSøkerOppsummering;
