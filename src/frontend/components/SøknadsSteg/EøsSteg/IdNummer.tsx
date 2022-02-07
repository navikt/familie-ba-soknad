import React, { useEffect, useState } from 'react';

import { feil, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';
import { IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

//TODO: hent fra søknadsobjekt
const idNummerVerdier = [
    { land: 'NOR', verdi: '111' },
    { land: 'NED', verdi: '222' },
    { land: 'ENG', verdi: '333' },
];

export const IdNummer: React.FC<{
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    settIdNummerFelter;
    land;
}> = ({ skjema, settIdNummerFelter, land }) => {
    const felt = useFelt({
        feltId: `id-for-${land}`, //TODO: hva skal være ID?
        verdi: Object.values(idNummerVerdier).find(verdi => verdi.land === land)?.verdi ?? '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'eøs-om-deg.dittidnummer.feilmelding'} />);
        },
    });

    //TODO: trim whitespace

    const [harRendretFørsteGang, settHarRendretFørsteGang] = useState(false);

    //TODO: slå sammen disse useeffectene?

    useEffect(() => {
        if (harRendretFørsteGang) {
            settIdNummerFelter(prev => {
                const idNummerFelter = prev.filter(idNummerFelt => idNummerFelt.id !== felt.id);
                return idNummerFelter.concat(felt);
            });
        } else {
            settHarRendretFørsteGang(true);
        }
    }, [felt.verdi, felt.valideringsstatus]);

    useFørsteRender(() => {
        settIdNummerFelter(prev => {
            return prev.concat(felt);
        });
    });

    return (
        <SkjemaFeltInput
            felt={felt}
            visFeilmeldinger={skjema.visFeilmeldinger}
            labelSpråkTekstId={'idNummer'} // TODO: riktig label
        />
    );
};
