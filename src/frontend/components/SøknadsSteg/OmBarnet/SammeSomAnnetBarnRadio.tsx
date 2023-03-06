import React from 'react';

import styled from 'styled-components';

import { Element } from 'nav-frontend-typografi';

import { Radio, RadioGroup } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const StyledRadioGroup = styled(RadioGroup)`
    && label:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

const SammeSomAnnetBarnRadio: React.FC<{
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    barnetsNavn: string;
}> = ({ andreBarnSomErFyltUt, skjema, barnetsNavn }) => {
    const felt = skjema.felter.sammeForelderSomAnnetBarn;

    const radios = andreBarnSomErFyltUt
        .map(barn => ({
            label: (
                <SpråkTekst
                    id={'ombarnet.svaralternativ.samme-som-barn'}
                    values={{ navn: barn.navn }}
                />
            ),
            value: barn.id,
        }))
        .concat({
            label: <SpråkTekst id={'ombarnet.svaralternativ.annen-forelder'} />,
            value: AlternativtSvarForInput.ANNEN_FORELDER,
        });

    return (
        <StyledRadioGroup
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            legend={
                <Element>
                    <SpråkTekst
                        id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn]}
                        values={{ barn: barnetsNavn }}
                    />
                </Element>
            }
            name={OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn}
            onChange={value => {
                felt.onChange(value);
            }}
            error={felt.feilmelding}
            size={'medium'}
        >
            {radios.map(radio => (
                <Radio key={radio.value} value={radio.value}>
                    {radio.label}
                </Radio>
            ))}
        </StyledRadioGroup>
    );
};

export default SammeSomAnnetBarnRadio;
