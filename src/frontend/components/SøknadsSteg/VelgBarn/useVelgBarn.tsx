import React, { useEffect, useState } from 'react';

import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useRoutes } from '../../../routing/RoutesContext';
import { IBarn } from '../../../typer/person';
import { genererInitialBarnMedISøknad } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export interface IVelgBarnFeltTyper {
    barnMedISøknad: IBarn[];
}

export const useVelgBarn = (): {
    skjema: ISkjema<IVelgBarnFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    håndterVelgBarnToggle: (barn: IBarn, erMedISøknad: boolean) => void;
    barnSomSkalVæreMed: IBarn[];
} => {
    const { søknad, settSøknad } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const { settBarnForRoutes } = useRoutes();
    const [barnSomSkalVæreMed, settBarnSomSkalVæreMed] = useState<IBarn[]>(barnInkludertISøknaden);

    useEffect(() => {
        settBarnForRoutes(barnSomSkalVæreMed);
    }, [barnSomSkalVæreMed]);

    const barnMedISøknad = useFelt<IBarn[]>({
        verdi: barnSomSkalVæreMed,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.barnSomSkalVæreMed.length > 0
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'velgbarn.feilmelding.du-må-velge-barn'} />);
        },
        avhengigheter: { barnSomSkalVæreMed },
    });

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            barnInkludertISøknaden: barnSomSkalVæreMed.map(barn =>
                genererInitialBarnMedISøknad(barn)
            ),
        });
    };

    const håndterVelgBarnToggle = (barn: IBarn, erMedISøknad: boolean) => {
        const skalVæreMed = !erMedISøknad;
        settBarnSomSkalVæreMed(prevState =>
            skalVæreMed
                ? prevState.concat(genererInitialBarnMedISøknad(barn))
                : prevState.filter(barnMedISøknad => barnMedISøknad.ident !== barn.ident)
        );
    };

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IVelgBarnFeltTyper, string>({
        felter: {
            barnMedISøknad,
        },
        skjemanavn: 'velgbarn',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        håndterVelgBarnToggle,
        barnSomSkalVæreMed,
    };
};
