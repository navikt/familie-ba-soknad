import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { Alpha3Code, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type Felt, type FeltState, type ISkjema, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaCheckboxForSanity } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import { SkjemaFeltInputForSanity } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInputForSanity';
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
    spørsmålDokument?: ISanitySpørsmålDokument;
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
    spørsmålDokument,
    lesevisning = false,
}) => {
    const { plainTekst, tekster } = useApp();
    const { valgtLocale } = useSpråkContext();
    const intl = useIntl();
    const { formatMessage } = intl;

    // Bruker skal ha mulighet til å velge at hen ikke kjenner idnummer for: barn, andre forelder og søker (dersom idnummer for søker trigges av et utenlandsopphold).
    // Barn blir sendt med som prop når vi render Idnummer for andre forelder og barn, derfor kan vi sjekke på den propen.
    const skalViseVetIkkeCheckbox = !!barn || periodeType === PeriodeType.utenlandsperiode;

    const idNummerUkjent = useFelt<ESvar>({
        verdi:
            skalViseVetIkkeCheckbox && idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: `${uuidv4()}idnummer-ukjent-${landAlphaCode}`,
        skalFeltetVises: () => skalViseVetIkkeCheckbox,
    });

    const idNummerFelt = useInputFeltMedUkjent({
        søknadsfelt: {
            id: `${uuidv4()}${idNummerKeyPrefix}${landAlphaCode}`,
            svar:
                idNummerVerdiFraSøknad && idNummerVerdiFraSøknad !== AlternativtSvarForInput.UKJENT
                    ? idNummerVerdiFraSøknad
                    : '',
        },
        avhengighet: idNummerUkjent,
        feilmelding: spørsmålDokument?.feilmelding,
        feilmeldingSpråkId: feilmeldingSpråkId,
        customValidering: (felt: FeltState<string>) => {
            const verdi = trimWhiteSpace(felt.verdi);
            if (verdi.match(/^[0-9A-Za-z\s\-.\\/]{4,20}$/)) {
                return ok(felt);
            } else {
                return feil(
                    felt,
                    plainTekst(tekster().FELLES.formateringsfeilmeldinger.ugyldigIDnummer)
                );
            }
        },
        flettefelter: { barnetsNavn: barn?.navn, land: landAlphaCode },
        ...(barn && { språkVerdier: { barn: barn.navn } }),
    });

    useEffect(() => {
        settIdNummerFelter((prev: Felt<string>[]) =>
            prev.filter(felt => felt.id !== idNummerFelt.id).concat(idNummerFelt)
        );
    }, [idNummerFelt.verdi, idNummerFelt.valideringsstatus]);

    return (
        <>
            {lesevisning ? (
                <OppsummeringFelt
                    tittel={
                        spørsmålDokument ? (
                            <TekstBlock
                                block={spørsmålDokument.sporsmal}
                                flettefelter={{ land: landAlphaCode, barnetsNavn: barn?.navn }}
                            />
                        ) : (
                            <SpråkTekst
                                id={spørsmålSpråkId}
                                values={{
                                    land: getName(landAlphaCode, valgtLocale),
                                    ...(barn && { barn: barn.navn }),
                                }}
                            />
                        )
                    }
                    søknadsvar={
                        idNummerVerdiFraSøknad === AlternativtSvarForInput.UKJENT
                            ? spørsmålDokument
                                ? plainTekst(spørsmålDokument.checkboxLabel, {
                                      land: landAlphaCode,
                                  })
                                : formatMessage(
                                      {
                                          id: spørsmålCheckboxSpråkId,
                                      },
                                      { land: getName(landAlphaCode, valgtLocale) }
                                  )
                            : idNummerVerdiFraSøknad
                    }
                />
            ) : spørsmålDokument ? (
                <div>
                    <SkjemaFeltInputForSanity
                        felt={idNummerFelt}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={
                            <TekstBlock
                                block={spørsmålDokument.sporsmal}
                                flettefelter={{
                                    land: landAlphaCode,
                                    barnetsNavn: barn?.navn,
                                }}
                            />
                        }
                        disabled={idNummerUkjent.verdi === ESvar.JA}
                    />
                    {idNummerUkjent.erSynlig && (
                        <SkjemaCheckboxForSanity
                            label={plainTekst(spørsmålDokument.checkboxLabel, {
                                land: landAlphaCode,
                            })}
                            felt={idNummerUkjent}
                        />
                    )}
                </div>
            ) : (
                <div>
                    <SkjemaFeltInput
                        felt={idNummerFelt}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={spørsmålSpråkId}
                        språkValues={{
                            land: getName(landAlphaCode, valgtLocale),
                            ...(barn && { barn: barn.navn }),
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
                </div>
            )}
        </>
    );
};
