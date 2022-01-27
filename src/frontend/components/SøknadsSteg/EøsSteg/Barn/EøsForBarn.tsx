import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { BarnetsId } from '../../../../typer/common';
import { barnetsNavnValue } from '../../../../utils/barn';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
    } = useEøsForBarn(barnetsId);
    const intl = useIntl();

    return (
        <Steg
            tittel={'Steg for eøs: ' + barnetsNavnValue(barn, intl)}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
                <Pensjonsperiode
                    skjema={skjema}
                    mottarEllerMottattPensjonFelt={skjema.felter.andreForelderPensjonNorge}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                    andreForelderData={{
                        erDød: barn.andreForelderErDød.svar === ESvar.JA,
                        barn: barn,
                    }}
                    registrertePensjonsperioder={skjema.felter.andreForelderPensjonsperioderNorge}
                />
            </SkjemaFieldset>
        </Steg>
    );
};

export default EøsForBarn;
