import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarn } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { BarnetsIdent } from './HvilkeBarnCheckboxGruppe';
import { OmBarnaDineSpørsmålId } from './spørsmål';

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | undefined;
    oppholderBarnSegIInstitusjon: ESvar | undefined;
    erBarnAdoptertFraUtland: ESvar | undefined;
    oppholderBarnSegIUtland: ESvar | undefined;
    søktAsylForBarn: ESvar | undefined;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | undefined;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | undefined;
    hvemErFosterbarn: BarnetsIdent[];
    hvemOppholderSegIInstitusjon: BarnetsIdent[];
    hvemErAdoptertFraUtland: BarnetsIdent[];
    hvemOppholderSegIUtland: BarnetsIdent[];
    hvemBarnetrygdFraAnnetEøsland: BarnetsIdent[];
    hvemTolvMndSammenhengendeINorge: BarnetsIdent[];
    hvemErSøktAsylFor: BarnetsIdent[];
}

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const barn: IBarn[] = søknad.barnInkludertISøknaden;

    const erNoenAvBarnaFosterbarn = useFelt<ESvar | undefined>({
        feltId: søknad.erNoenAvBarnaFosterbarn.id,
        verdi: søknad.erNoenAvBarnaFosterbarn.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemErFosterbarn = useFelt<BarnetsIdent[]>({
        feltId: barn.length > 0 ? barn[0].erFosterbarn.id : OmBarnaDineSpørsmålId.hvemErFosterbarn,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.erFosterbarn.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const oppholderBarnSegIInstitusjon = useFelt<ESvar | undefined>({
        feltId: søknad.oppholderBarnSegIInstitusjon.id,
        verdi: søknad.oppholderBarnSegIInstitusjon.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemOppholderSegIInstitusjon = useFelt<BarnetsIdent[]>({
        feltId:
            barn.length > 0
                ? barn[0].oppholderSegIInstitusjon.id
                : OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.oppholderSegIInstitusjon.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const erBarnAdoptertFraUtland = useFelt<ESvar | undefined>({
        feltId: søknad.erBarnAdoptertFraUtland.id,
        verdi: søknad.erBarnAdoptertFraUtland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemErAdoptertFraUtland = useFelt<BarnetsIdent[]>({
        feltId:
            barn.length > 0
                ? barn[0].erAdoptertFraUtland.id
                : OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.erAdoptertFraUtland.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const oppholderBarnSegIUtland = useFelt<ESvar | undefined>({
        feltId: søknad.oppholderBarnSegIUtland.id,
        verdi: søknad.oppholderBarnSegIUtland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemOppholderSegIUtland = useFelt<BarnetsIdent[]>({
        feltId:
            barn.length > 0
                ? barn[0].oppholderSegIUtland.id
                : OmBarnaDineSpørsmålId.hvemOppholderSegIUtland,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.oppholderSegIUtland.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const søktAsylForBarn = useFelt<ESvar | undefined>({
        feltId: søknad.søktAsylForBarn.id,
        verdi: søknad.søktAsylForBarn.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemErSøktAsylFor = useFelt<BarnetsIdent[]>({
        feltId: barn.length > 0 ? barn[0].erAsylsøker.id : OmBarnaDineSpørsmålId.hvemErSøktAsylFor,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.erAsylsøker.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const barnOppholdtSegTolvMndSammenhengendeINorge = useFelt<ESvar | undefined>({
        feltId: søknad.barnOppholdtSegTolvMndSammenhengendeINorge.id,
        verdi: søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemTolvMndSammenhengendeINorge = useFelt<BarnetsIdent[]>({
        feltId:
            barn.length > 0
                ? barn[0].oppholdtSegINorgeSammenhengendeTolvMnd.id
                : OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.oppholdtSegINorgeSammenhengendeTolvMnd.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const mottarBarnetrygdForBarnFraAnnetEøsland = useFelt<ESvar | undefined>({
        feltId: søknad.mottarBarnetrygdForBarnFraAnnetEøsland.id,
        verdi: søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemBarnetrygdFraAnnetEøsland = useFelt<BarnetsIdent[]>({
        feltId:
            barn.length > 0
                ? barn[0].barnetrygdFraAnnetEøsland.id
                : OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn.barnetrygdFraAnnetEøsland.svar === ESvar.JA)
            .map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<BarnetsIdent[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const hentSvarForSpørsmålBarn = (barn: IBarn, felt: Felt<string[]>): ESvar =>
        felt.verdi.includes(barn.ident) ? ESvar.JA : ESvar.NEI;

    const genererOppdaterteBarn = (): IBarn[] => {
        return søknad.barnInkludertISøknaden.map(barn => {
            return {
                ...barn,
                erFosterbarn: {
                    ...barn.erFosterbarn,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
                },
                erAsylsøker: {
                    ...barn.erAsylsøker,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErSøktAsylFor),
                },
                erAdoptertFraUtland: {
                    ...barn.erAdoptertFraUtland,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErAdoptertFraUtland),
                },
                oppholderSegIInstitusjon: {
                    ...barn.oppholderSegIInstitusjon,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIInstitusjon),
                },
                oppholdtSegINorgeSammenhengendeTolvMnd: {
                    ...barn.oppholdtSegINorgeSammenhengendeTolvMnd,
                    svar: hentSvarForSpørsmålBarn(
                        barn,
                        skjema.felter.hvemTolvMndSammenhengendeINorge
                    ),
                },
                oppholderSegIUtland: {
                    ...barn.oppholderSegIUtland,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIUtland),
                },
                barnetrygdFraAnnetEøsland: {
                    ...barn.barnetrygdFraAnnetEøsland,
                    svar: hentSvarForSpørsmålBarn(
                        barn,
                        skjema.felter.hvemBarnetrygdFraAnnetEøsland
                    ),
                },
            };
        });
    };

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            erNoenAvBarnaFosterbarn: {
                ...søknad.erNoenAvBarnaFosterbarn,
                svar: skjema.felter.erNoenAvBarnaFosterbarn.verdi,
            },
            oppholderBarnSegIInstitusjon: {
                ...søknad.oppholderBarnSegIInstitusjon,
                svar: skjema.felter.oppholderBarnSegIInstitusjon.verdi,
            },
            erBarnAdoptertFraUtland: {
                ...søknad.erBarnAdoptertFraUtland,
                svar: skjema.felter.erBarnAdoptertFraUtland.verdi,
            },
            oppholderBarnSegIUtland: {
                ...søknad.oppholderBarnSegIUtland,
                svar: skjema.felter.oppholderBarnSegIUtland.verdi,
            },
            søktAsylForBarn: {
                ...søknad.søktAsylForBarn,
                svar: skjema.felter.søktAsylForBarn.verdi,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
                svar: skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi,
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
                svar: skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.verdi,
            },
            barnInkludertISøknaden: genererOppdaterteBarn(),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IOmBarnaDineFeltTyper, string>({
        felter: {
            erNoenAvBarnaFosterbarn,
            oppholderBarnSegIInstitusjon,
            erBarnAdoptertFraUtland,
            oppholderBarnSegIUtland,
            søktAsylForBarn,
            barnOppholdtSegTolvMndSammenhengendeINorge,
            mottarBarnetrygdForBarnFraAnnetEøsland,
            hvemErFosterbarn,
            hvemErAdoptertFraUtland,
            hvemOppholderSegIInstitusjon,
            hvemOppholderSegIUtland,
            hvemBarnetrygdFraAnnetEøsland,
            hvemTolvMndSammenhengendeINorge,
            hvemErSøktAsylFor,
        },
        skjemanavn: 'ombarnadine',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
    };
};
