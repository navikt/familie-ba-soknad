import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

import { ISkjema } from '@navikt/familie-skjema';

import { AlternativtSvarForInput } from '../../../typer/common';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const StyledRadioPanelGruppe = styled(RadioPanelGruppe)`
    && label:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

const SammeSomAnnetBarnRadio: React.FC<{
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    barnetsNavn: string;
}> = ({ andreBarnSomErFyltUt, skjema, barnetsNavn }) => {
    const felt = skjema.felter.sammeForelderSomAnnetBarn;

    const intl = useIntl();

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
            value: AlternativtSvarForInput.ANNEN_FORELDER,
        });

    return (
        <StyledRadioPanelGruppe
            {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
            legend={
                <Element>
                    <SpråkTekst
                        id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn]}
                        values={{ barn: barnetsNavn }}
                    />
                </Element>
            }
            checked={felt.verdi ?? undefined}
            name={OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn}
            radios={radios}
            onChange={(_event, value) => {
                felt.onChange(value);
            }}
            feil={felt.feilmelding}
        />
    );
};

export default SammeSomAnnetBarnRadio;
