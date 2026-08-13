import { Radio, RadioGroup } from '@navikt/ds-react';
import type { ISkjema } from '@navikt/familie-skjema';
import type { FC } from 'react';

import { useAppContext } from '../../../context/AppContext';
import type { IBarnMedISøknad } from '../../../typer/barn';
import type { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { AlternativtSvarForInput } from '../../../typer/svar';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import { OmBarnetSpørsmålsId } from './spørsmål';

const SammeSomAnnetBarnRadio: FC<{
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    barnetsNavn: string;
}> = ({ andreBarnSomErFyltUt, skjema, barnetsNavn }) => {
    const { tekster } = useAppContext();
    const felt = skjema.felter.sammeForelderSomAnnetBarn;
    const omBarnetTekster = tekster().OM_BARNET;
    const { svaralternativSammeSomAnnenForelder, svaralternativAnnenForelder, hvemErBarnSinAndreForelder } =
        omBarnetTekster;

    const radios = andreBarnSomErFyltUt
        .map(barn => ({
            label: <TekstBlock block={svaralternativSammeSomAnnenForelder} flettefelter={{ barnetsNavn: barn.navn }} />,
            value: barn.id,
        }))
        .concat({
            label: <TekstBlock block={svaralternativAnnenForelder} />,
            value: AlternativtSvarForInput.ANNEN_FORELDER,
        });

    return (
        <RadioGroup
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            legend={
                <TekstBlock block={hvemErBarnSinAndreForelder.sporsmal} flettefelter={{ barnetsNavn: barnetsNavn }} />
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
        </RadioGroup>
    );
};

export default SammeSomAnnetBarnRadio;
