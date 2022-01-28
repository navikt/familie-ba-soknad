import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { ISøknadSpørsmål } from '../../../../typer/spørsmål';
import { ArbeidsperiodeOppsummering } from '../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { eøsSøkerSpørsmålSpråkId } from '../../EøsSteg/Søker/spørsmål';
import { useEøsForSøker } from '../../EøsSteg/Søker/useEøsForSøker';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const EøsSøkerOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const { søknad } = useApp();
    const søker = søknad.søker;

    const jaNeiSpmOppsummering = (søknadSpørsmål: ISøknadSpørsmål<ESvar | null>) => (
        <OppsummeringFelt
            tittel={<SpråkTekst id={eøsSøkerSpørsmålSpråkId[søknadSpørsmål.id]} />}
            søknadsvar={søknadSpørsmål.svar}
        />
    );

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.EøsForSøker)}
            tittel={'eøs-om-deg.sidetittel'}
            skjemaHook={useEøsForSøker}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                {jaNeiSpmOppsummering(søker.arbeidINorge)}
                {søker.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                    <ArbeidsperiodeOppsummering
                        key={`arbeidsperiode-søker-norge-${index}`}
                        arbeidsperiode={arbeidsperiode}
                        nummer={index + 1}
                    />
                ))}

                {jaNeiSpmOppsummering(søker.pensjonNorge)}
                {søker.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                    <PensjonsperiodeOppsummering
                        key={`pensjonsperiode-søker-norge-${index}`}
                        pensjonsperiode={pensjonsperiode}
                        nummer={index + 1}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default EøsSøkerOppsummering;
