import React from 'react';

import { useIntl } from 'react-intl';

import ÅrsakDropdown from '../../Felleskomponenter/Dropdowns/ÅrsakDropdown';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { useDinLivssituasjon } from './useDinLivssituasjon';

const DinLivssituasjon: React.FC = () => {
    const intl = useIntl();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
    } = useDinLivssituasjon();

    return (
        <Steg
            tittel={<SpråkTekst id={'dinlivssituasjon.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <ÅrsakDropdown
                    felt={skjema.felter.årsak}
                    skjema={skjema}
                    placeholder={intl.formatMessage({ id: 'omdeg.velgårsak.placeholder' })}
                    label={intl.formatMessage({ id: 'omdeg.hvorforsøkerutvidet.spm' })}
                    dynamisk
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default DinLivssituasjon;
