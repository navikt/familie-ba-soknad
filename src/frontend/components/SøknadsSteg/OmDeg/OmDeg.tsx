import React from 'react';

import { Alert, Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { hentLeggTilPeriodeTekster } from '../../../utils/modaler';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';

import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { tekster } = useApp();

    const { toggles } = useFeatureToggles();

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

    const antallPerioder = utenlandsperioder.length;
    const leggTilPeriodeTekster = hentLeggTilPeriodeTekster(
        'utenlandsopphold',
        PersonType.Søker,
        antallPerioder
    );

    const stegTekster = tekster()[ESanitySteg.OM_DEG];
    const { omDegGuide } = stegTekster;

    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.sidetittel'} />}
            guide={omDegGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borPåRegistrertAdresse}
                    spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
                />

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <Alert variant={'warning'} inline data-testid={'alertstripe-adresse'}>
                        <SpråkTekst
                            id={'omdeg.borpådenneadressen.kontakt-folkeregister-ukjent.alert'}
                        />
                    </Alert>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.værtINorgeITolvMåneder}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]
                        }
                        tilleggsinfoTekstId={'felles.korteopphold.info'}
                    />
                    {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                        <PerioderContainer>
                            {utenlandsperioder.map((periode, index) => (
                                <UtenlandsperiodeOppsummering
                                    key={index}
                                    periode={periode}
                                    nummer={index + 1}
                                    fjernPeriodeCallback={fjernUtenlandsperiode}
                                />
                            ))}
                            {!toggles.NYE_MODAL_TEKSTER && utenlandsperioder.length > 0 && (
                                <Label as="p" spacing>
                                    <SpråkTekst id={'omdeg.flereopphold.spm'} />
                                </Label>
                            )}
                            <LeggTilKnapp
                                onClick={åpneUtenlandsoppholdmodal}
                                språkTekst={'felles.leggtilutenlands.knapp'}
                                forklaring={leggTilPeriodeTekster?.tekstForKnapp}
                                id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                                feilmelding={
                                    skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                                    skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                                    skjema.visFeilmeldinger && (
                                        <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />
                                    )
                                }
                            />
                        </PerioderContainer>
                    )}
                </>
                {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                    <KomponentGruppe inline dynamisk>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                            spørsmålTekstId={
                                omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                            }
                        />
                        {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig &&
                            skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                                <Alert
                                    variant={'warning'}
                                    inline
                                    aria-live={'polite'}
                                    data-testid={'alertstripe'}
                                >
                                    <SpråkTekst
                                        id={'omdeg.planlagt-opphold-sammenhengende.alert'}
                                    />
                                </Alert>
                            )}
                    </KomponentGruppe>
                )}
            </KomponentGruppe>
            {utenlandsoppholdmodalErÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={utenlandsoppholdmodalErÅpen}
                    lukkModal={lukkUtenlandsoppholdmodal}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                    forklaring={leggTilPeriodeTekster?.tekstForModal}
                />
            )}
        </Steg>
    );
};

export default OmDeg;
