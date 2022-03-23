import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { Alpha3Code, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { guid } from 'nav-frontend-js-utils';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OppsummeringFelt } from '../Oppsummering/OppsummeringFelt';
import { idNummerKeyPrefix, PeriodeType } from './idnummerUtils';

export const IdNummer: React.FC<{
    skjema: ISkjema<IEøsForSøkerFeltTyper | IEøsForBarnFeltTyper, string>;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    landAlphaCode: Alpha3Code | '';
    periodeType?: PeriodeType;
    idNummerVerdiFraSøknad: string | undefined;
    feilmeldingSpråkId: string;
    spørsmålSpråkId: string;
    spørsmålCheckboxSpråkId: string;
    lesevisning?: boolean;
    barn?: IBarnMedISøknad;
}> = ({
    skjema,
    settIdNummerFelter,
    landAlphaCode,
    periodeType = undefined,
    idNummerVerdiFraSøknad,
    feilmeldingSpråkId,
    spørsmålSpråkId,
    spørsmålCheckboxSpråkId,
    barn,
    lesevisning = false,
}) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { formatMessage } = intl;

    const idNummerUkjent = useFelt<ESvar>({
        verdi:
            (periodeType === undefined ||
                periodeType === PeriodeType.utenlandsperiode ||
                periodeType === PeriodeType.eøsBarnetrygdPeriode) &&
            idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: `idnummer-ukjent-${landAlphaCode}`,
        skalFeltetVises: () =>
            periodeType === undefined ||
            periodeType === PeriodeType.utenlandsperiode ||
            periodeType === PeriodeType.eøsBarnetrygdPeriode,
    });

    const idNummerFelt = useInputFeltMedUkjent({
        søknadsfelt: {
            id: `${guid()}${idNummerKeyPrefix}${landAlphaCode}`,
            svar:
                idNummerVerdiFraSøknad && idNummerVerdiFraSøknad !== AlternativtSvarForInput.UKJENT
                    ? idNummerVerdiFraSøknad
                    : '',
        },
        avhengighet: idNummerUkjent,
        feilmeldingSpråkId: feilmeldingSpråkId,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9A-Za-z\s\-.\\/]{4,20}$/)) {
                return ok(felt);
            } else {
                return feil(felt, <SpråkTekst id={'felles.idnummer-feilformat.feilmelding'} />);
            }
        },
        ...(barn && { språkVerdier: { barn: barnetsNavnValue(barn, intl) } }),
    });

    useEffect(() => {
        settIdNummerFelter((prev: Felt<string>[]) =>
            prev.filter(felt => felt.id !== idNummerFelt.id).concat(idNummerFelt)
        );
    }, [idNummerFelt.verdi, idNummerFelt.valideringsstatus]);

    return lesevisning ? (
        <OppsummeringFelt
            tittel={
                <SpråkTekst
                    id={spørsmålSpråkId}
                    values={{
                        land: getName(landAlphaCode, valgtLocale),
                        ...(barn && { barn: barnetsNavnValue(barn, intl) }),
                    }}
                />
            }
            søknadsvar={
                idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                    ? formatMessage(
                          {
                              id: spørsmålCheckboxSpråkId,
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
                labelSpråkTekstId={spørsmålSpråkId}
                språkValues={{
                    land: getName(landAlphaCode, valgtLocale),
                    ...(barn && { barn: barnetsNavnValue(barn, intl) }),
                }}
                disabled={idNummerUkjent.verdi === ESvar.JA}
            />
            {idNummerUkjent.erSynlig && (
                <SkjemaCheckbox
                    labelSpråkTekstId={spørsmålCheckboxSpråkId}
                    felt={idNummerUkjent}
                    språkVerdier={{ land: getName(landAlphaCode, valgtLocale) }}
                />
            )}
        </>
    );
};
