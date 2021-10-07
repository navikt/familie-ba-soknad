import React, { useEffect } from 'react';

import dayjs from 'dayjs';
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
import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface DatoVelgerProps {
    felt: Felt<ISODateString>;
    avgrensDatoFremITid?: boolean;
    avgrensDato?: ISODateString;
    tilhørendeFraOgMedFelt?: Felt<ISODateString>;
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

const Datovelger: React.FC<DatoVelgerProps> = ({
    felt,
    avgrensDatoFremITid = false,
    avgrensDato,
    tilhørendeFraOgMedFelt,
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

        if (tilhørendeFraOgMedFelt) {
            limitations.minDate = dayjs(tilhørendeFraOgMedFelt.verdi)
                .add(1, 'day')
                .format('YYYY-MM-DD');
        }

        if (avgrensDatoFremITid || avgrensDato) {
            limitations.maxDate = avgrensDato ? avgrensDato : dagensDato();
        }

        return limitations;
    };

    useEffect(() => {
        felt.validerOgSettFelt(felt.verdi);
    }, [tilhørendeFraOgMedFelt?.verdi, avgrensDato]);

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
                allowNavigationToDisabledMonths={false}
                calendarSettings={{ position: calendarPosition }}
            />
            {skjema.visFeilmeldinger && <Feilmelding>{felt.feilmelding}</Feilmelding>}
        </span>
    ) : null;
};

export default Datovelger;
