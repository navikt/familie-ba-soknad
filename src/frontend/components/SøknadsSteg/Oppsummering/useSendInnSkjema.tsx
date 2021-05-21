import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import * as bokmålSpråktekster from '../../../assets/lang/nb.json';
import { useApp } from '../../../context/AppContext';
import {
    Dokumentasjonsbehov,
    IDokumentasjon,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktVedlegg,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import {
    ISøknad,
    ISøknadKontrakt,
    ISøknadKontraktBarn,
    ISøknadSpørsmål,
} from '../../../typer/søknad';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { omBarnaDineSpørsmålSpråkId, OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../OmBarnet/spørsmål';
import { omDegSpørsmålSpråkId, OmDegSpørsmålId } from '../OmDeg/spørsmål';

type SpørsmålId = OmDegSpørsmålId | OmBarnaDineSpørsmålId | OmBarnetSpørsmålsId;

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpørsmålMap = Record<string, ISøknadSpørsmål<any>>;

export const useSendInnSkjema = (): { sendInnSkjema: () => Promise<boolean> } => {
    const { axiosRequest, søknad } = useApp();
    const intl = useIntl();

    const språktekstFraSpørsmålId = (spørsmålId: SpørsmålId): string => {
        for (const språkIndex of [
            omDegSpørsmålSpråkId,
            omBarnaDineSpørsmålSpråkId,
            omBarnetSpørsmålSpråkId,
        ]) {
            if (spørsmålId in språkIndex) {
                return intl.formatMessage({ id: språkIndex[spørsmålId] });
            }
        }
        return 'ukjent-spørsmål';
    };

    const søknadsfelt = (label, value) => {
        return { label: label, verdi: value };
    };

    const spørmålISøknadsFormat = (spørsmålMap: SpørsmålMap) => {
        return Object.fromEntries(
            Object.entries(spørsmålMap)
                .map((entry: [string, ISøknadSpørsmål<any>]): [
                    string,
                    { label: string; verdi: any }
                ] => {
                    return [
                        entry[0],
                        søknadsfelt(språktekstFraSpørsmålId(entry[1].id), entry[1].svar),
                    ];
                })
                .filter(entry => entry[1].verdi)
        );
    };

    const barnISøknadsFormat = (barn: IBarnMedISøknad): ISøknadKontraktBarn => {
        const { ident, navn, borMedSøker, alder, ...barnSpørsmål } = barn;
        const typetBarnSpørsmål = (barnSpørsmål as unknown) as SpørsmålMap;

        return {
            navn: søknadsfelt('Navn', navn),
            ident: søknadsfelt('Ident', ident),
            borMedSøker: søknadsfelt('Bor med søker', borMedSøker),
            alder: søknadsfelt('Alder', alder),
            spørsmål: spørmålISøknadsFormat(typetBarnSpørsmål),
        };
    };

    const dokumentasjonISøknadFormat = (
        dokumentasjon: IDokumentasjon
    ): ISøknadKontraktDokumentasjon => ({
        dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
        harSendtInn: dokumentasjon.harSendtInn,
        opplastedeVedlegg: dokumentasjon.opplastedeVedlegg.map(vedlegg =>
            vedleggISøknadFormat(vedlegg, dokumentasjon.dokumentasjonsbehov)
        ),
    });

    const vedleggISøknadFormat = (
        vedlegg: IVedlegg,
        dokumentasjonsbehov: Dokumentasjonsbehov
    ): ISøknadKontraktVedlegg => ({
        navn: vedlegg.navn,
        dokumentId: vedlegg.dokumentId,
        tittel: dokumentasjonsbehov,
    });

    const oppsamlingsfelt = (
        spørsmålId: OmBarnaDineSpørsmålId,
        barnDataKey: barnDataKeySpørsmål,
        oppfølgingCondition = ESvar.JA
    ) => {
        const { barnInkludertISøknaden } = søknad;
        return søknadsfelt(
            språktekstFraSpørsmålId(spørsmålId),
            barnInkludertISøknaden.reduce(
                (accumulator, current) =>
                    accumulator || current[barnDataKey].svar === oppfølgingCondition,
                false
            )
        );
    };

    const dataISøknadKontraktFormat = (søknad: ISøknad): ISøknadKontrakt => {
        const { søker } = søknad;
        // Raskeste måte å få tak i alle spørsmål minus de andre feltene på søker
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const {
            navn,
            ident,
            sivilstand,
            statsborgerskap,
            telefonnummer,
            adresse,
            barn,
            ...søkerSpørsmål
        } = søker;
        const { barnInkludertISøknaden } = søknad;
        const typetSøkerSpørsmål: SpørsmålMap = (søkerSpørsmål as unknown) as SpørsmålMap;

        return {
            søknadstype: søknad.søknadstype,
            søker: {
                navn: søknadsfelt('Navn', søker.navn),
                ident: søknadsfelt('Ident', søknad.søker.ident),
                sivilstand: søknadsfelt('Sivilstand', søker.sivilstand.type),
                statsborgerskap: søknadsfelt(
                    'Statsborgerskap',
                    søker.statsborgerskap.map(objekt => objekt.landkode)
                ),
                telefonnummer: søknadsfelt('Telefonnummer', søker.telefonnummer.svar),
                adresse: søknadsfelt('Adresse', søker.adresse),
                spørsmål: spørmålISøknadsFormat(typetSøkerSpørsmål),
            },
            barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn)),
            spørsmål: {
                erNoenAvBarnaFosterbarn: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
                    barnDataKeySpørsmål.erFosterbarn
                ),
                erSøktAsylForBarn: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.søktAsylForBarn,
                    barnDataKeySpørsmål.erAsylsøker
                ),
                oppholderBarnSegIInstitusjon: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
                    barnDataKeySpørsmål.oppholderSegIInstitusjon
                ),
                barnOppholdtSegTolvMndSammenhengendeINorge: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
                    barnDataKeySpørsmål.boddMindreEnn12MndINorge,
                    ESvar.NEI
                ),
                erBarnAdoptertFraUtland: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
                    barnDataKeySpørsmål.erAdoptertFraUtland
                ),
                mottarBarnetrygdForBarnFraAnnetEøsland: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
                    barnDataKeySpørsmål.barnetrygdFraAnnetEøsland
                ),
                oppholderBarnSegIUtland: oppsamlingsfelt(
                    OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
                    barnDataKeySpørsmål.oppholderSegIUtland
                ),
                oppfølgingsspørsmåltekster: {
                    label:
                        'Tekster som ellers trengs til pdf-gen, typ "Du har opplyst at {navn} oppholder seg i institusjon"',
                    verdi: {
                        ...Object.fromEntries(
                            [
                                'ombarnet.fosterbarn',
                                'ombarnet.institusjon',
                                'ombarnet.oppholdutland',
                                'ombarnet.sammenhengende-opphold',
                            ].map(tekstId => [tekstId, bokmålSpråktekster[tekstId]])
                        ),
                    },
                },
            },
            dokumentasjon: søknad.dokumentasjon
                .filter(dok => erDokumentasjonRelevant(dok))
                .map(dok => dokumentasjonISøknadFormat(dok)),
        };
    };

    const sendInnSkjema = async () => {
        const formatert = dataISøknadKontraktFormat(søknad);

        return await axiosRequest({
            url: '/api/soknad',
            method: 'POST',
            withCredentials: true,
            data: formatert,
        }).then(
            () => true,
            () => false
        );
    };

    return {
        sendInnSkjema,
    };
};
