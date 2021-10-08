import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus } = useApp();
    const { eøsSkruddAv } = useEøs();
    const { sendInnSkjema } = useSendInnSkjema();

    useFørsteRender(() => {
        if (!eøsSkruddAv && søknad.erEøs) {
            settSøknad({
                ...søknad,
                dokumentasjon: søknad.dokumentasjon.map((dok: IDokumentasjon) =>
                    dok.dokumentasjonsbehov === Dokumentasjonsbehov.EØS_SKJEMA
                        ? { ...dok, gjelderForSøker: true }
                        : dok
                ),
            });
        }
    });

    return (
        <Steg
            tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}
            gåVidereCallback={async () => {
                const [success, _] = await sendInnSkjema();
                return success;
            }}
        >
            <KomponentGruppe>
                <Normaltekst>
                    <SpråkTekst id={'dokumentasjon.info'} />
                </Normaltekst>
                <PictureScanningGuide />
            </KomponentGruppe>
            {søknad.dokumentasjon
                .filter(dokumentasjon => erDokumentasjonRelevant(dokumentasjon))
                .map((dokumentasjon, index) => (
                    <LastOppVedlegg
                        key={index}
                        vedleggNr={index + 1}
                        dokumentasjon={dokumentasjon}
                    />
                ))}
            {innsendingStatus.status === RessursStatus.FEILET && <Feilside />}
        </Steg>
    );
};

export default Dokumentasjon;
