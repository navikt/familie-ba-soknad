import { useIntl } from 'react-intl';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { RessursStatus } from '@navikt/familie-typer';

import * as bokmålSpråktekster from '../../../assets/lang/nb.json';
import { useApp } from '../../../context/AppContext';
import Miljø from '../../../Miljø';
import {
    Dokumentasjonsbehov,
    IDokumentasjon,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktVedlegg,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import { IKvittering } from '../../../typer/kvittering';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    barnDataKeySpørsmålUtvidet,
    IBarnMedISøknad,
    ISamboer,
    ITidligereSamboer,
} from '../../../typer/person';
import {
    ESøknadstype,
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknad,
    ISøknadKontrakt,
    ISøknadKontraktBarn,
    ISøknadsfelt,
    ISøknadSpørsmål,
    SpørsmålId,
} from '../../../typer/søknad';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { isAlpha3Code } from '../../../utils/hjelpefunksjoner';
import { erTidligereSamboer } from '../../../utils/person';
import { språkIndexListe } from '../../../utils/spørsmål';
import { formaterFnr, landkodeTilSpråk } from '../../../utils/visning';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../OmBarnet/spørsmål';
import {
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../Utvidet-DinLivssituasjon/spørsmål';
import { toÅrsakSpråkId, Årsak } from '../Utvidet-DinLivssituasjon/types-and-utilities';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpørsmålMap = Record<string, ISøknadSpørsmål<any>>;

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus } = useApp();
    const intl = useIntl();
    const { soknadApi } = Miljø();

    const språktekstFraSpørsmålId = (spørsmålId: SpørsmålId): string => {
        for (const språkIndex of språkIndexListe) {
            if (spørsmålId in språkIndex) {
                return intl.formatMessage({ id: språkIndex[spørsmålId] });
            }
        }
        return 'ukjent-spørsmål';
    };

    const søknadsfelt = <T extends any>(label: string, value: T): ISøknadsfelt<T> => {
        return { label: label, verdi: value };
    };

    const spørmålISøknadsFormat = (spørsmålMap: SpørsmålMap) => {
        return Object.fromEntries(
            Object.entries(spørsmålMap)
                .map((entry: [string, ISøknadSpørsmål<any>]): [
                    string,
                    { label: string; verdi: any }
                ] => {
                    const verdi = entry[1].svar;
                    let formatertVerdi: string;

                    if (isAlpha3Code(verdi)) {
                        formatertVerdi = landkodeTilSpråk(verdi, 'nb');
                    } else if (verdi === ESvar.VET_IKKE) {
                        formatertVerdi = ESvar.VET_IKKE.replace('_', ' ');
                    } else if (verdi in Årsak) {
                        formatertVerdi = intl.formatMessage({ id: toÅrsakSpråkId(verdi) });
                    } else {
                        formatertVerdi = verdi;
                    }

                    return [
                        entry[0],
                        søknadsfelt(språktekstFraSpørsmålId(entry[1].id), formatertVerdi),
                    ];
                })
                .filter(entry => entry[1].verdi)
        );
    };

    const barnISøknadsFormat = (barn: IBarnMedISøknad): ISøknadKontraktBarn => {
        const {
            ident,
            navn,
            borMedSøker,
            alder,
            adressebeskyttelse,
            utvidet,
            ...barnSpørsmål
        } = barn;
        const typetBarnSpørsmål = (barnSpørsmål as unknown) as SpørsmålMap;

        const søkerFraTilDatoVerdi = (svar: ISODateString | AlternativtSvarForInput) =>
            svar === AlternativtSvarForInput.UKJENT ? 'Ikke oppgitt' : svar;

        const søkerFlyttetFraAndreForelderDatoVerdi = (
            svar: ISODateString | AlternativtSvarForInput
        ) => (svar === AlternativtSvarForInput.UKJENT ? 'Vi bor sammen nå' : svar);

        return {
            navn: søknadsfelt('Navn', adressebeskyttelse ? `Barn ${formaterFnr(ident)}` : navn),
            ident: søknadsfelt('Ident', ident ?? 'Ikke oppgitt'),
            borMedSøker: søknadsfelt(
                'Bor med søker',
                borMedSøker ??
                    typetBarnSpørsmål[barnDataKeySpørsmål.borFastMedSøker].svar === ESvar.JA
            ),
            alder: søknadsfelt('Alder', alder ?? AlternativtSvarForInput.UKJENT),
            spørsmål: {
                ...spørmålISøknadsFormat(typetBarnSpørsmål),
                [barnDataKeySpørsmål.søkerForTidsromStartdato]: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnetSpørsmålsId.søkerForTidsromStartdato),
                    søkerFraTilDatoVerdi(barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar)
                ),
                [barnDataKeySpørsmål.søkerForTidsromSluttdato]: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnetSpørsmålsId.søkerForTidsromSluttdato),
                    søkerFraTilDatoVerdi(barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar)
                ),
            },
            utvidet: utvidet
                ? {
                      ...spørmålISøknadsFormat(utvidet),
                      [barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]: søknadsfelt(
                          språktekstFraSpørsmålId(
                              OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato
                          ),
                          søkerFlyttetFraAndreForelderDatoVerdi(
                              barn.utvidet[
                                  barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato
                              ].svar
                          )
                      ),
                  }
                : undefined,
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

    const samboerISøknadKontraktFormat = (
        samboer: ISamboer
    ): ISøknadsfelt<IKontraktNåværendeSamboer> => {
        const { ident, samboerFraDato, navn, fødselsdato } = samboer;
        const erTidligere = erTidligereSamboer(samboer);
        const språktekster = {
            navn: språktekstFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerNavn
                    : SamboerSpørsmålId.nåværendeSamboerNavn
            ),
            ident: språktekstFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerFnr
                    : SamboerSpørsmålId.nåværendeSamboerFnr
            ),
            fødselsdato: språktekstFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato
                    : SamboerSpørsmålId.nåværendeSamboerFødselsdato
            ),
            samboerFraDato: språktekstFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerFraDato
                    : SamboerSpørsmålId.nåværendeSamboerFraDato
            ),
        };
        return søknadsfelt('Samboer', {
            navn: søknadsfelt(språktekster.navn, navn.svar),
            ident: søknadsfelt(språktekster.ident, ident.svar),
            fødselsdato: søknadsfelt(språktekster.fødselsdato, fødselsdato.svar),
            samboerFraDato: søknadsfelt(språktekster.samboerFraDato, samboerFraDato.svar),
        });
    };

    const tidligereSamboerISøknadKontraktFormat = (
        samboer: ITidligereSamboer
    ): ISøknadsfelt<IKontraktTidligereSamboer> => {
        const { samboerTilDato, navn } = samboer;
        const { verdi: samboerIKontraktFormat } = samboerISøknadKontraktFormat(samboer);

        return søknadsfelt(`Tidligere samboer: ${navn.svar}`, {
            ...samboerIKontraktFormat,
            samboerTilDato: søknadsfelt(
                språktekstFraSpørsmålId(TidligereSamboerSpørsmålId.tidligereSamboerTilDato),
                samboerTilDato.svar
            ),
        });
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
            adresse,
            barn,
            utvidet,
            ...søkerSpørsmål
        } = søker;
        const { spørsmål: utvidaSpørsmål, nåværendeSamboer, tidligereSamboere } = utvidet;
        const { barnInkludertISøknaden } = søknad;
        const typetSøkerSpørsmål: SpørsmålMap = (søkerSpørsmål as unknown) as SpørsmålMap;
        const typetUtvidaSpørsmål: SpørsmålMap = (utvidaSpørsmål as unknown) as SpørsmålMap;

        return {
            søknadstype: søknad.søknadstype,
            søker: {
                navn: søknadsfelt('Navn', søker.navn),
                ident: søknadsfelt('Ident', søknad.søker.ident),
                sivilstand: søknadsfelt('Sivilstand', søker.sivilstand.type),
                statsborgerskap: søknadsfelt(
                    'Statsborgerskap',
                    søker.statsborgerskap.map(objekt => landkodeTilSpråk(objekt.landkode, 'nb'))
                ),
                adresse: søker.adresse
                    ? søknadsfelt('Adresse', søker.adresse)
                    : søknadsfelt('Adresse', {}),
                spørsmål: spørmålISøknadsFormat(typetSøkerSpørsmål),
                utvidet:
                    søknad.søknadstype === ESøknadstype.UTVIDET
                        ? søknadsfelt('Utvidet', {
                              spørsmål: spørmålISøknadsFormat(typetUtvidaSpørsmål),
                              tidligereSamboere: tidligereSamboere.map(
                                  tidligereSamboerISøknadKontraktFormat
                              ),
                              nåværendeSamboer: nåværendeSamboer
                                  ? samboerISøknadKontraktFormat(nåværendeSamboer)
                                  : null,
                          })
                        : undefined,
            },
            barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn)),
            spørsmål: {
                erNoenAvBarnaFosterbarn: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn),
                    søknad.erNoenAvBarnaFosterbarn.svar
                ),
                søktAsylForBarn: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.søktAsylForBarn),
                    søknad.søktAsylForBarn.svar
                ),
                oppholderBarnSegIInstitusjon: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon),
                    søknad.oppholderBarnSegIInstitusjon.svar
                ),
                barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfelt(
                    språktekstFraSpørsmålId(
                        OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                    ),
                    søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar
                ),
                erBarnAdoptertFraUtland: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland),
                    søknad.erBarnAdoptertFraUtland.svar
                ),
                mottarBarnetrygdForBarnFraAnnetEøsland: søknadsfelt(
                    språktekstFraSpørsmålId(
                        OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                    ),
                    søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar
                ),
                oppholderBarnSegIUtland: søknadsfelt(
                    språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIUtland),
                    søknad.oppholderBarnSegIUtland.svar
                ),
                lestOgForståttBekreftelse: søknadsfelt(
                    intl.formatMessage({ id: 'forside.bekreftelsesboks.brødtekst' }),
                    søknad.lestOgForståttBekreftelse
                        ? intl.formatMessage({ id: 'forside.bekreftelsesboks.erklæring.spm' })
                        : ESvar.NEI
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
                                'ombarnet.barnetrygd-eøs',
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

    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });
        const formatert = dataISøknadKontraktFormat(søknad);

        return await axiosRequest<IKvittering, ISøknadKontrakt>({
            url: `${soknadApi}/soknad/v3`,
            method: 'POST',
            withCredentials: true,
            data: formatert,
        }).then(
            res => {
                settInnsendingStatus(res);
                return [res.status === RessursStatus.SUKSESS, formatert];
            },
            () => {
                settInnsendingStatus({
                    status: RessursStatus.FEILET,
                    frontendFeilmelding: 'Kunne ikke sende inn søknaden',
                });
                return [false, formatert];
            }
        );
    };

    return {
        sendInnSkjema,
    };
};
