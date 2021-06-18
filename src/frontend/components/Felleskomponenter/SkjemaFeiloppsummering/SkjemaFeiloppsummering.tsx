import React from 'react';

import { Feiloppsummering, FeiloppsummeringFeil, FeiloppsummeringProps } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { IRoute } from '../../../context/RoutesContext';
import { IBarn } from '../../../typer/person';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    OmBarnaDineSpørsmålId,
    omBarnaDineSpørsmålSpråkId,
} from '../../SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from '../../SøknadsSteg/OmDeg/spørsmål';
import { VelgBarnSpørsmålId } from '../../SøknadsSteg/VelgBarn/spørsmål';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { lagRouteFeilRenderer } from './lagRouteFeilRenderer';

const samletSpørsmålSpråkTekstId = {
    ...omDegSpørsmålSpråkId,
    ...omBarnaDineSpørsmålSpråkId,
    ...omBarnetSpørsmålSpråkId,
};

const samletSpørsmålId = {
    ...OmDegSpørsmålId,
    ...VelgBarnSpørsmålId,
    ...OmBarnaDineSpørsmålId,
    ...OmBarnetSpørsmålsId,
};

interface Props extends Pick<FeiloppsummeringProps, 'customFeilRender'> {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    barn?: IBarn;
    routeForFeilmeldinger?: IRoute;
}

export const SkjemaFeiloppsummering: React.FC<Props> = ({
    skjema,
    barn,
    routeForFeilmeldinger,
}) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const hentFeilmelding = (felt: Felt<any>) => {
        const gyldigId = !!Object.values(samletSpørsmålId).find(id => id === felt.id);
        return !gyldigId ||
            (felt.id === OmDegSpørsmålId.borPåRegistrertAdresse && felt.verdi === ESvar.NEI) ||
            felt.id === VelgBarnSpørsmålId.velgBarn ? (
            felt.feilmelding
        ) : (
            <SpråkTekst id={samletSpørsmålSpråkTekstId[felt.id]} values={{ navn: barn?.navn }} />
        );
    };

    return (
        <Feiloppsummering
            role={'alert'}
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
