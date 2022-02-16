import React, { useEffect, useState } from 'react';

import { Alpha3Code, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OppsummeringFelt } from '../Oppsummering/OppsummeringFelt';
import { idNummerKeyPrefix, PeriodeType } from './idnummerUtils';
import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from './Søker/spørsmål';

export const IdNummer: React.FC<{
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    settIdNummerFelter;
    landAlphaCode: Alpha3Code;
    periodeType: PeriodeType;
    lesevisning?: boolean;
}> = ({ skjema, settIdNummerFelter, landAlphaCode, periodeType, lesevisning = false }) => {
    const [valgtLocale] = useSprakContext();
    const { søknad } = useApp();
    const { formatMessage } = useIntl();

    const idNummerVerdiFraSøknad = Object.values(søknad.søker.idNummer.svar).find(
        verdi => verdi.land === landAlphaCode
    )?.idnummer;

    const idNummerUkjent = useFelt<ESvar>({
        verdi:
            periodeType === PeriodeType.utenlandsperiode &&
            idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: `idnummer-ukjent-${landAlphaCode}`,
        skalFeltetVises: () => periodeType === PeriodeType.utenlandsperiode,
    });
    const idNummerFelt = useInputFeltMedUkjent({
        søknadsfelt: {
            id: `${idNummerKeyPrefix}${landAlphaCode}`,
            svar:
                idNummerVerdiFraSøknad && idNummerVerdiFraSøknad !== AlternativtSvarForInput.UKJENT
                    ? idNummerVerdiFraSøknad
                    : '',
        },
        avhengighet: idNummerUkjent,
        feilmeldingSpråkId: 'eøs-om-deg.dittidnummer.feilmelding',
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9A-Za-z\s\-.\\/]{4,20}$/)) {
                return ok(felt);
            } else {
                return feil(felt, <SpråkTekst id={'felles.idnummer-feilformat.feilmelding'} />);
            }
        },
    });

    const [harRendretFørsteGang, settHarRendretFørsteGang] = useState(false);

    useEffect(() => {
        if (harRendretFørsteGang) {
            settIdNummerFelter(prev =>
                prev.filter(felt => felt.id !== idNummerFelt.id).concat(idNummerFelt)
            );
        } else {
            settIdNummerFelter(prev => {
                return prev.concat(idNummerFelt);
            });
            settHarRendretFørsteGang(true);
        }
    }, [idNummerFelt.verdi, idNummerFelt.valideringsstatus]);

    return lesevisning ? (
        <OppsummeringFelt
            tittel={
                <SpråkTekst
                    id={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer]}
                    values={{ land: getName(landAlphaCode, valgtLocale) }}
                />
            }
            søknadsvar={
                idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                    ? formatMessage(
                          {
                              id: eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummerUkjent],
                          },
                          { land: getName(landAlphaCode, valgtLocale) }
                      )
                    : idNummerVerdiFraSøknad
            }
        />
    ) : (
        <>
            <SkjemaFeltInput
                felt={idNummerFelt}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer]}
                språkValues={{ land: getName(landAlphaCode, valgtLocale) }}
                disabled={idNummerUkjent.verdi === ESvar.JA}
            />
            {idNummerUkjent.erSynlig && (
                <SkjemaCheckbox
                    labelSpråkTekstId={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummerUkjent]}
                    felt={idNummerUkjent}
                    språkVerdier={{ land: getName(landAlphaCode, valgtLocale) }}
                />
            )}
        </>
    );
};
