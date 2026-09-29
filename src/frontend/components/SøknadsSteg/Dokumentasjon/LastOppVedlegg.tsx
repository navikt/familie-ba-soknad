import { Checkbox, FormSummary, VStack } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { ChangeEvent, FC } from 'react';

import { type LocaleRecordBlock, Typografi } from '../../../../common/sanity';
import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { useAppContext } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import {
    BeskrivelseSanityApiNavn,
    dokumentasjonsbehovTilBeskrivelseSanityApiNavn,
    dokumentasjonsbehovTilTittelSanityApiNavn,
    type IDokumentasjon,
    type IVedlegg,
} from '../../../typer/dokumentasjon';
import { slåSammen } from '../../../utils/slåSammen';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import Filopplaster from './filopplaster/Filopplaster';
import { useFilopplaster } from './filopplaster/useFilopplaster';

interface Props {
    dokumentasjon: IDokumentasjon;
    oppdaterDokumentasjon: (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const LastOppVedlegg: FC<Props> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
    const { søknad, tekster, plainTekst } = useAppContext();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const { fjernAlleAvvisteFiler } = useFilopplaster(
        dokumentasjon,
        oppdaterDokumentasjon,
        dokumentasjonTekster,
        plainTekst
    );

    const settHarSendtInnTidligere = (event: ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
        if (huketAv) {
            fjernAlleAvvisteFiler();
        }
    };

    const tittel: LocaleRecordBlock =
        dokumentasjonTekster[dokumentasjonsbehovTilTittelSanityApiNavn(dokumentasjon.dokumentasjonsbehov)];

    const barnDokumentasjonenGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
        dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
    );
    const gjelderBeredskapshjem =
        dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN &&
        barnDokumentasjonenGjelderFor.some(barn => barn[barnDataKeySpørsmål.erIBeredskapshjem].svar === ESvar.JA);

    const barnasNavn = slåSammen(
        barnDokumentasjonenGjelderFor.map(barn => barn.navn),
        plainTekst,
        frittståendeOrdTekster
    );

    const dokumentasjonsbeskrivelse = gjelderBeredskapshjem
        ? BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBeredskapshjemBarnetrygd
        : dokumentasjonsbehovTilBeskrivelseSanityApiNavn(dokumentasjon.dokumentasjonsbehov);

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">{plainTekst(tittel, { barnetsNavn: barnasNavn })}</FormSummary.Heading>
            </FormSummary.Header>
            <VStack gap="space-24" paddingInline="space-24" paddingBlock="space-20 space-24">
                {dokumentasjonsbeskrivelse && (
                    <div>
                        <TekstBlock
                            data-testid={'dokumentasjonsbeskrivelse'}
                            block={dokumentasjonTekster[dokumentasjonsbeskrivelse]}
                            flettefelter={{ barnetsNavn: barnasNavn }}
                            typografi={Typografi.BodyLong}
                        />
                    </div>
                )}

                {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                    <Checkbox
                        data-testid={'dokumentasjon-er-sendt-inn-checkboks'}
                        aria-label={`${plainTekst(
                            dokumentasjonTekster.sendtInnTidligere
                        )} (${plainTekst(tittel, { barnetsNavn: barnasNavn })})`}
                        checked={dokumentasjon.harSendtInn}
                        onChange={settHarSendtInnTidligere}
                    >
                        {plainTekst(dokumentasjonTekster.sendtInnTidligere)}
                    </Checkbox>
                )}

                {!dokumentasjon.harSendtInn && (
                    <div data-testid={'dokumentopplaster'}>
                        <Filopplaster dokumentasjon={dokumentasjon} oppdaterDokumentasjon={oppdaterDokumentasjon} />
                    </div>
                )}
            </VStack>
        </FormSummary>
    );
};

export default LastOppVedlegg;
