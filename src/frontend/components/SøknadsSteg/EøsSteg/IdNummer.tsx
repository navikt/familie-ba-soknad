import React, { useEffect, useState } from 'react';

import { Alpha3Code, getName } from 'i18n-iso-countries';

import { feil, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { idNummerKeyPrefix, PeriodeType } from './idnummerUtils';
import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from './Søker/spørsmål';

// Hva med doble land?
//TODO: trim whitespace ved setting av søknadsobjekt

export const IdNummer: React.FC<{
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    settIdNummerFelter;
    landAlphaCode: Alpha3Code;
    periodeType: PeriodeType;
}> = ({ skjema, settIdNummerFelter, landAlphaCode, periodeType }) => {
    const [valgtLocale] = useSprakContext();
    const { søknad } = useApp();

    const felt = useFelt({
        feltId: `${idNummerKeyPrefix}${landAlphaCode}`,
        verdi:
            Object.values(søknad.søker.idNummer.svar).find(verdi => verdi.land === landAlphaCode)
                ?.idnummer ?? '',
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
        <>
            <SkjemaFeltInput
                felt={felt}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer]}
                språkVerdier={{ land: getName(landAlphaCode, valgtLocale) }}
            />
            {periodeType === PeriodeType.utenlandsperiode && (
                <div>Dette er en utenlandsperiode</div>
            )}
        </>
    );
};
