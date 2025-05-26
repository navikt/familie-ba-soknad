import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpmForSanity from '../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';

import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { tekster, plainTekst } = useAppContext();

    const {
        erÅpen: utenlandsoppholdmodalErÅpen,
        lukkModal: lukkUtenlandsoppholdmodal,
        åpneModal: åpneUtenlandsoppholdmodal,
    } = useModal();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    } = useOmdeg();

    const teksterForModal: IUtenlandsoppholdTekstinnhold =
        tekster().FELLES.modaler.utenlandsopphold.søker;
    const { flerePerioder, leggTilPeriodeForklaring, leggTilKnapp, leggTilFeilmelding } =
        teksterForModal;

    const stegTekster = tekster()[ESanitySteg.OM_DEG];
    const {
        omDegTittel,
        omDegGuide,
        borPaaRegistrertAdresse,
        vaertINorgeITolvMaaneder,
        planleggerAaBoINorgeTolvMnd,
    } = stegTekster;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <Steg
            tittel={<TekstBlock block={omDegTittel} />}
            guide={omDegGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <Personopplysninger />
            <JaNeiSpmForSanity
                skjema={skjema}
                felt={skjema.felter.borPåRegistrertAdresse}
                spørsmålDokument={borPaaRegistrertAdresse}
            />
            <KomponentGruppe>
                <JaNeiSpmForSanity
                    skjema={skjema}
                    felt={skjema.felter.værtINorgeITolvMåneder}
                    spørsmålDokument={vaertINorgeITolvMaaneder}
                    tilleggsinfo={
                        <TekstBlock
                            block={vaertINorgeITolvMaaneder.beskrivelse}
                            typografi={Typografi.BodyShort}
                        />
                    }
                />
                {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                    <PerioderContainer
                        tittel={uppercaseFørsteBokstav(
                            plainTekst(frittståendeOrdTekster.utenlandsopphold)
                        )}
                    >
                        {utenlandsperioder.map((periode, index) => (
                            <UtenlandsperiodeOppsummering
                                key={index}
                                periode={periode}
                                nummer={index + 1}
                                fjernPeriodeCallback={fjernUtenlandsperiode}
                                personType={PersonType.Søker}
                            />
                        ))}
                        <LeggTilKnapp
                            onClick={åpneUtenlandsoppholdmodal}
                            leggTilFlereTekst={
                                utenlandsperioder.length > 0 && plainTekst(flerePerioder)
                            }
                            id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                            feilmelding={
                                skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                                skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                                skjema.visFeilmeldinger && <TekstBlock block={leggTilFeilmelding} />
                            }
                        >
                            {<TekstBlock block={leggTilKnapp} />}
                        </LeggTilKnapp>
                    </PerioderContainer>
                )}
            </KomponentGruppe>
            {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                <JaNeiSpmForSanity
                    skjema={skjema}
                    felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                    spørsmålDokument={planleggerAaBoINorgeTolvMnd}
                />
            )}
            {utenlandsoppholdmodalErÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={utenlandsoppholdmodalErÅpen}
                    lukkModal={lukkUtenlandsoppholdmodal}
                    personType={PersonType.Søker}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                    forklaring={plainTekst(leggTilPeriodeForklaring)}
                />
            )}
        </Steg>
    );
};

export default OmDeg;
