import React from 'react';

import styled from 'styled-components';

import { Radio, RadioGroup } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import { OmBarnetSpørsmålsId } from './spørsmål';

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
    const { tekster } = useAppContext();
    const felt = skjema.felter.sammeForelderSomAnnetBarn;
    const omBarnetTekster = tekster().OM_BARNET;
    const {
        svaralternativSammeSomAnnenForelder,
        svaralternativAnnenForelder,
        hvemErBarnSinAndreForelder,
    } = omBarnetTekster;

    const radios = andreBarnSomErFyltUt
        .map(barn => ({
            label: (
                <TekstBlock
                    block={svaralternativSammeSomAnnenForelder}
                    flettefelter={{ barnetsNavn: barn.navn }}
                />
            ),
            value: barn.id,
        }))
        .concat({
            label: <TekstBlock block={svaralternativAnnenForelder} />,
            value: AlternativtSvarForInput.ANNEN_FORELDER,
        });

    return (
        <StyledRadioGroup
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            legend={
                <TekstBlock
                    block={hvemErBarnSinAndreForelder.sporsmal}
                    flettefelter={{ barnetsNavn: barnetsNavn }}
                />
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
