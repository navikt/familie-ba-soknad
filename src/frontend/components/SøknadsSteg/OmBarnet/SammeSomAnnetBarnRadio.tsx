import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { RadioPanelGruppe } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledRadioPanelGruppe = styled(RadioPanelGruppe)`
    && label:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

export const ANNEN_FORELDER = 'ANNEN_FORELDER';

const SammeSomAnnetBarnRadio: React.FC<{
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    onChangeCallback: (radioVerdi: string) => void;
}> = ({ andreBarnSomErFyltUt, skjema, onChangeCallback }) => {
    const [checked, setChecked] = useState(ESvar.NEI);
    const intl = useIntl();

    const felt = skjema.felter.sammeForelderSomAnnetBarn;

    const radios = andreBarnSomErFyltUt
        .map(barn => ({
            label: (
                <SpråkTekst
                    id={'ombarnet.svaralternativ.samme-som-barn'}
                    values={{ navn: barnetsNavnValue(barn, intl) }}
                />
            ),
            value: barn.id,
        }))
        .concat({
            label: <SpråkTekst id={'ombarnet.svaralternativ.annen-forelder'} />,
            value: ANNEN_FORELDER,
        });

    return (
        <StyledRadioPanelGruppe
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            name={'sammeForelderSomAnnetBarn'}
            radios={radios}
            checked={checked}
            onChange={(_event, value) => {
                setChecked(value);
                felt.onChange(value);
                onChangeCallback(value);
            }}
            feil={felt.feilmelding}
        />
    );
};

export default SammeSomAnnetBarnRadio;
