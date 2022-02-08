import React, { useEffect, useState } from 'react';

import { getName } from 'i18n-iso-countries';

import { feil, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from './Søker/spørsmål';

//TODO: hent fra søknadsobjekt
//TODO: trim whitespace ved setting av søknadsobjekt

const idNummerVerdier = [
    { landAlphaCode: 'NOR', verdi: '111' },
    { landAlphaCode: 'AFG', verdi: '222' },
    { landAlphaCode: 'ALB', verdi: '333' },
];

export const IdNummer: React.FC<{
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    settIdNummerFelter;
    landAlphaCode;
}> = ({ skjema, settIdNummerFelter, landAlphaCode }) => {
    const [valgtLocale] = useSprakContext();

    const felt = useFelt({
        feltId: `id-for-${landAlphaCode}`, //TODO: hva skal være ID?
        verdi:
            Object.values(idNummerVerdier).find(verdi => verdi.landAlphaCode === landAlphaCode)
                ?.verdi ?? '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9A-Za-z\s\-.\\/]{1,20}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    <SpråkTekst
                        id={
                            verdi === ''
                                ? 'eøs-om-deg.dittidnummer.feilmelding'
                                : 'felles.idnummer-feilformat.feilmelding'
                        }
                    />
                );
            }
        },
    });

    const [harRendretFørsteGang, settHarRendretFørsteGang] = useState(false);

    useEffect(() => {
        if (harRendretFørsteGang) {
            settIdNummerFelter(prev => {
                const idNummerFelter = prev.filter(idNummerFelt => idNummerFelt.id !== felt.id);
                return idNummerFelter.concat(felt);
            });
        } else {
            settIdNummerFelter(prev => {
                return prev.concat(felt);
            });
            settHarRendretFørsteGang(true);
        }
    }, [felt.verdi, felt.valideringsstatus]);

    return (
        <SkjemaFeltInput
            felt={felt}
            visFeilmeldinger={skjema.visFeilmeldinger}
            labelSpråkTekstId={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer]}
            språkVerdier={{ land: getName(landAlphaCode, valgtLocale) }}
        />
    );
};
