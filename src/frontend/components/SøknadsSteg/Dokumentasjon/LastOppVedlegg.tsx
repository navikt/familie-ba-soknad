import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import {
    Dokumentasjonsbehov,
    EFiltyper,
    IDokumentasjon,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Filopplaster from './filopplaster/Filopplaster';

interface Props {
    dokumentasjon: IDokumentasjon;
    vedleggNr: number;
}

const Container = styled.div`
    margin-bottom: 4rem;
`;

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjon, vedleggNr }) => {
    const { søknad, settSøknad } = useApp();
    const { formatMessage } = useIntl();
    const settHarSendtInnTidligere = (event: React.ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
    };

    const oppdaterDokumentasjon = (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => {
        settSøknad(prevState => ({
            ...prevState,
            dokumentasjon: prevState.dokumentasjon.map(dok =>
                dok.dokumentasjonsbehov === dokumentasjonsbehov
                    ? { ...dok, opplastedeVedlegg, harSendtInn }
                    : dok
            ),
        }));
    };

    const formatertListeMedBarn = () => {
        const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
            dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
        );

        return barnDokGjelderFor.map((barn, index) => {
            if (index === 0) {
                return barn.navn;
            } else {
                return index === barnDokGjelderFor.length - 1
                    ? ` ${formatMessage({ id: 'felles.og' })} ${barn.navn}`
                    : `, ${barn.navn}`;
            }
        });
    };

    const antallVedlegg = () => {
        const dokSomKrevesForBarn = søknad.dokumentasjon.filter(dok => dok.gjelderForBarnId.length);
        let antallVedlegg = dokSomKrevesForBarn.length;

        const erOppholdtillatelseKravForSøkerMenIkkeBarn = søknad.dokumentasjon.find(
            dok =>
                dok.dokumentasjonsbehov === Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE &&
                !dok.gjelderForBarnId.length &&
                dok.gjelderForSøker
        );

        if (erOppholdtillatelseKravForSøkerMenIkkeBarn) {
            antallVedlegg++;
        }
        return antallVedlegg;
    };

    const dokTittel = formatMessage(
        { id: dokumentasjon.tittelSpråkId },
        { barn: formatertListeMedBarn() }
    );

    return (
        <Container>
            <Undertittel>
                {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                    <>
                        <SpråkTekst
                            id={'dokumentasjon.vedleggsnummer'}
                            values={{
                                vedleggsnummer: vedleggNr,
                                antallvedlegg: antallVedlegg(),
                            }}
                        />
                        &nbsp;
                    </>
                )}
                {dokTittel}
            </Undertittel>
            {dokumentasjon.beskrivelseSpråkId && (
                <SpråkTekst
                    id={dokumentasjon.beskrivelseSpråkId}
                    values={{
                        barn: formatertListeMedBarn(),
                    }}
                />
            )}
            {!dokumentasjon.harSendtInn && (
                <Filopplaster
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                    dokumentasjon={dokumentasjon}
                    maxFilstørrelse={1024 * 1024 * 10}
                    tillatteFiltyper={[EFiltyper.PNG, EFiltyper.PDF, EFiltyper.JPG, EFiltyper.JPEG]}
                />
            )}
            <br />
            {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                <Checkbox
                    label={<SpråkTekst id={'dokumentasjon.har-sendt-inn.spm'} />}
                    aria-label={`${formatMessage({
                        id: 'dokumentasjon.har-sendt-inn.spm',
                    })} (${dokTittel})`}
                    checked={dokumentasjon.harSendtInn}
                    onChange={settHarSendtInnTidligere}
                />
            )}
        </Container>
    );
};

export default LastOppVedlegg;
