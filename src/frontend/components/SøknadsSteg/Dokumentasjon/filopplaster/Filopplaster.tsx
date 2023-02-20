import React from 'react';

import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import { Normaltekst } from 'nav-frontend-typografi';

import { Upload } from '@navikt/ds-icons';
import { Modal } from '@navikt/ds-react';

import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import AlertStripe from '../../../Felleskomponenter/AlertStripe/AlertStripe';
import ModalContent from '../../../Felleskomponenter/ModalContent';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import OpplastedeFiler from './OpplastedeFiler';
import { useFilopplaster } from './useFilopplaster';

interface Props {
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
    dokumentasjon: IDokumentasjon;
    tillatteFiltyper: string[];
    maxFilstørrelse: number;
}

const FilopplastningBoks = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed ${navFarger.navGra80};
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    width: 100%;
    padding: 1rem;
    margin: 2rem 0 1rem 0;
    color: ${navFarger.navBla};
    box-sizing: border-box;

    :focus,
    :hover {
        border: 2px solid ${navFarger.navBla};
        cursor: pointer;
    }
`;

const StyledUpload = styled(Upload)`
    margin-right: 1rem;
    min-width: 1rem;
`;

const FeilmeldingWrapper = styled.div`
    margin-right: 3rem;
`;

const Filopplaster: React.FC<Props> = ({
    oppdaterDokumentasjon,
    dokumentasjon,
    tillatteFiltyper,
    maxFilstørrelse,
}) => {
    const { onDrop, åpenModal, lukkModal, feilmeldinger, slettVedlegg } = useFilopplaster(
        maxFilstørrelse,
        dokumentasjon,
        oppdaterDokumentasjon
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: tillatteFiltyper,
    });

    return (
        <>
            <Modal
                open={åpenModal}
                onClose={() => lukkModal()}
                closeButton={true}
                aria-label="Modal"
            >
                <ModalContent>
                    <FeilmeldingWrapper>
                        {feilmeldinger.map((feilmelding, index) => (
                            <AlertStripe type={'feil'} form={'default'} key={index}>
                                {feilmelding}
                            </AlertStripe>
                        ))}
                    </FeilmeldingWrapper>
                </ModalContent>
            </Modal>
            <FilopplastningBoks type={'button'} {...getRootProps()}>
                <input {...getInputProps()} />
                <StyledUpload focusable={false} />
                <Normaltekst>
                    <SpråkTekst
                        id={
                            isDragActive
                                ? 'dokumentasjon.last-opp-dokumentasjon.aktivknapp'
                                : 'dokumentasjon.last-opp-dokumentasjon.knapp'
                        }
                    />
                </Normaltekst>
            </FilopplastningBoks>
            <OpplastedeFiler
                filliste={dokumentasjon.opplastedeVedlegg}
                slettVedlegg={slettVedlegg}
            />
        </>
    );
};

export default Filopplaster;
