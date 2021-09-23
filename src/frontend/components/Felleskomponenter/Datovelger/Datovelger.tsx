import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import { css } from 'styled-components';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';

import {
    DatepickerLimitations,
    FamilieDatovelger,
    ISODateString,
} from '@navikt/familie-form-elements';
import { Felt, ISkjema, Valideringsstatus } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface DatoVelgerProps {
    avgrensDatoFremITid?: boolean;
    felt: Felt<ISODateString>;
    fraOgMedFelt?: Felt<ISODateString>;
    tilOgMedFelt?: Felt<ISODateString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    labelTekstId: string;
    disabled?: boolean;
    dynamisk?: boolean;
    calendarPosition?: '' | 'fullscreen' | 'responsive';
}

const StyledFamilieDatovelger = styled(FamilieDatovelger)<{ feil: boolean }>`
    ${props =>
        props.feil &&
        css`
            .nav-datovelger:not(:hover) {
                input:not(:focus, :active),
                input:not(:focus, :active) + button {
                    border-color: ${navFarger.redError};
                }
                input:not(:focus, :active) {
                    box-shadow: 0 0 0 1px ${navFarger.redError};
                }
            }
        `}
`;

const max = (a: ISODateString, b: ISODateString): ISODateString => {
    return a > b ? a : b;
};

const min = (a: ISODateString, b: ISODateString): ISODateString => {
    return a > b ? b : a;
};

const Datovelger: React.FC<DatoVelgerProps> = ({
    avgrensDatoFremITid = false,
    felt,
    fraOgMedFelt,
    tilOgMedFelt,
    skjema,
    labelTekstId,
    disabled = false,
    dynamisk = false,
    calendarPosition = '',
}) => {
    const { formatMessage } = useIntl();
    const [valgtLocale] = useSprakContext();

    const hentBegrensninger = () => {
        const limitations: DatepickerLimitations = {};

        const fraOgMed =
            fraOgMedFelt?.valideringsstatus === Valideringsstatus.OK ? fraOgMedFelt.verdi : null;

        const tilOgMed =
            tilOgMedFelt?.valideringsstatus === Valideringsstatus.OK ? tilOgMedFelt.verdi : null;

        if (avgrensDatoFremITid || tilOgMed) {
            limitations.maxDate = tilOgMed ?? new Date().toISOString();
        }

        if (fraOgMed) {
            limitations.minDate = fraOgMed;
        }

        return limitations;
    };

    useEffect(() => {
        /**
         * Hvis dette feltet settes før avhengighetsfeltet settes bør vi opdatere dette feltet
         * slik at vi holder oss innenfor de satte begresningene.
         */
        fraOgMedFelt?.valideringsstatus === Valideringsstatus.OK &&
            felt.verdi &&
            felt.hentNavInputProps(false).onChange(max(felt.verdi, fraOgMedFelt.verdi));

        tilOgMedFelt?.valideringsstatus === Valideringsstatus.OK &&
            felt.verdi &&
            felt.hentNavInputProps(false).onChange(min(felt.verdi, tilOgMedFelt.verdi));
    }, [fraOgMedFelt?.verdi, tilOgMedFelt?.verdi]);

    return felt.erSynlig ? (
        <span aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledFamilieDatovelger
                description={
                    <Normaltekst>
                        <SpråkTekst id={'felles.velg-dato.hjelpetekst'} />
                    </Normaltekst>
                }
                allowInvalidDateSelection={false}
                limitations={hentBegrensninger()}
                placeholder={formatMessage({ id: 'felles.velg-dato.placeholder' })}
                valgtDato={disabled ? '' : felt.verdi}
                label={<SpråkTekst id={labelTekstId} />}
                {...felt.hentNavBaseSkjemaProps(skjema.visFeilmeldinger)}
                onChange={dato => {
                    felt.hentNavInputProps(false).onChange(dato);
                }}
                feil={!!(felt.feilmelding && skjema.visFeilmeldinger)}
                disabled={disabled}
                locale={valgtLocale}
                allowNavigationToDisabledMonths={true}
                calendarSettings={{ position: calendarPosition }}
            />
            {skjema.visFeilmeldinger && <Feilmelding>{felt.feilmelding}</Feilmelding>}
        </span>
    ) : null;
};

export default Datovelger;
