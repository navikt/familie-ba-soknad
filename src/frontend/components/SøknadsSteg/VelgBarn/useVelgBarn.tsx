import React, { useEffect, useState } from 'react';

import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useRoutes } from '../../../context/RoutesContext';
import { IBarn, IBarnMedISøknad } from '../../../typer/person';
import { genererInitialBarnMedISøknad } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VelgBarnSpørsmålId } from './spørsmål';

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
    fjernBarn: (ident: string) => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const { settBarnForRoutes } = useRoutes();
    const [barnSomSkalVæreMed, settBarnSomSkalVæreMed] = useState<IBarnMedISøknad[]>(
        barnInkludertISøknaden
    );

    useEffect(() => {
        settBarnForRoutes(barnSomSkalVæreMed);
    }, [barnSomSkalVæreMed]);

    const fjernBarn = (ident: string) => {
        settSøknad({
            ...søknad,
            barnRegistrertManuelt: søknad.barnRegistrertManuelt.filter(
                barn => ident !== barn.ident
            ),
        });
        settBarnSomSkalVæreMed(barnSomSkalVæreMed.filter(barn => ident !== barn.ident));
    };

    const barnMedISøknad = useFelt<IBarn[]>({
        feltId: VelgBarnSpørsmålId.velgBarn,
        verdi: barnSomSkalVæreMed,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.barnSomSkalVæreMed.length > 0
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'hvilkebarn.ingen-barn-valgt.feilmelding'} />);
        },
        avhengigheter: { barnSomSkalVæreMed },
    });

    const oppdaterSøknad = () => {
        const barnSomAlleredeErLagtTil = barnSomSkalVæreMed.filter(
            barnSomSkalVæreMed =>
                !!barnInkludertISøknaden.find(barn => barn.ident === barnSomSkalVæreMed.ident)
        );

        const nyeBarnSomSkalLeggesTil = barnSomSkalVæreMed.filter(
            barnSomSkalVæreMed =>
                !barnSomAlleredeErLagtTil.find(
                    barnLagtTil => barnLagtTil.ident === barnSomSkalVæreMed.ident
                )
        );

        const oppdaterteBarn = barnSomAlleredeErLagtTil.concat(
            nyeBarnSomSkalLeggesTil.map(barn => genererInitialBarnMedISøknad(barn))
        );
        const mapIdentTilId = oppdaterteBarn.map(barn => barn.id);
        const oppdatertDokumentasjon = søknad.dokumentasjon.map(dok => {
            return {
                ...dok,
                gjelderForBarnId: dok.gjelderForBarnId.filter(barnId =>
                    mapIdentTilId.includes(barnId)
                ),
            };
        });

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdaterteBarn,
            dokumentasjon: oppdatertDokumentasjon,
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

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<IVelgBarnFeltTyper, string>({
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
        fjernBarn,
        validerAlleSynligeFelter
    };
};
