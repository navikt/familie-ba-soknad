import React from 'react';

import { useIntl } from 'react-intl';

import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { IRoute } from '../../../context/RoutesContext';
import { IBarn } from '../../../typer/person';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/visning';
import {
    OmBarnaDineSpørsmålId,
    omBarnaDineSpørsmålSpråkId,
} from '../../SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from '../../SøknadsSteg/OmDeg/spørsmål';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
    SamboerSpørsmålId,
    samboerSpørsmålSpråkId,
} from '../../SøknadsSteg/Utvidet-DinLivssituasjon/spørsmål';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from '../../SøknadsSteg/VelgBarn/spørsmål';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { lagRouteFeilRenderer } from './lagRouteFeilRenderer';

const samletSpørsmålSpråkTekstId = {
    ...omDegSpørsmålSpråkId,
    ...velgBarnSpørsmålSpråkId,
    ...omBarnaDineSpørsmålSpråkId,
    ...omBarnetSpørsmålSpråkId,
    ...dinLivssituasjonSpørsmålSpråkId,
    ...samboerSpørsmålSpråkId,
};

const samletSpørsmålId = {
    ...OmDegSpørsmålId,
    ...VelgBarnSpørsmålId,
    ...OmBarnaDineSpørsmålId,
    ...OmBarnetSpørsmålsId,
    ...DinLivssituasjonSpørsmålId,
    ...SamboerSpørsmålId,
};

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    barn?: IBarn;
    routeForFeilmeldinger?: IRoute;
    id?: string;
}

export const SkjemaFeiloppsummering: React.FC<Props> = ({
    skjema,
    barn,
    routeForFeilmeldinger,
    id,
}) => {
    const intl = useIntl();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const hentFeilmelding = (felt: Felt<any>) => {
        const gyldigId = !!Object.values(samletSpørsmålId).find(id => id === felt.id);
        return !gyldigId ||
            (felt.id === OmDegSpørsmålId.borPåRegistrertAdresse && felt.verdi === ESvar.NEI) ||
            felt.id === VelgBarnSpørsmålId.velgBarn ? (
            felt.feilmelding
        ) : (
            <SpråkTekst
                id={samletSpørsmålSpråkTekstId[felt.id]}
                values={{ navn: barn && barnetsNavnValue(barn, intl) }}
            />
        );
    };

    return (
        <Feiloppsummering
            role={'alert'}
            id={id}
            tittel={
                <Element>
                    <SpråkTekst id={'felles.feiloppsummering.tittel'} />
                </Element>
            }
            customFeilRender={
                routeForFeilmeldinger ? lagRouteFeilRenderer(routeForFeilmeldinger) : undefined
            }
            feil={Object.values(skjema.felter)
                .filter(felt => {
                    return felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL;
                })
                .map(
                    (felt): FeiloppsummeringFeil => {
                        return {
                            skjemaelementId: felt.id,
                            feilmelding: hentFeilmelding(felt) as string,
                        };
                    }
                )}
        />
    );
};
