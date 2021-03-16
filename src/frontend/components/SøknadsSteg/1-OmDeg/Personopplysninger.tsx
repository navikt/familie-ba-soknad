import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Input } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { hentAdressefelterSortert } from '../../../utils/person';
import { FeltGruppe, KomponentGruppe, StyledAlertStripe } from './layoutKomponenter';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { IStegEnFeltTyper } from './useOmdeg';
import { hentSivilstatus, landkodeTilSpråk } from './utils';

const StyledInput = styled(Input)`
    label {
        font-size: 1.125rem;
    }
`;

const PersonopplysningerSection = styled.section`
    text-align: left;

    p {
        font-size: 1.125rem;
    }
`;

const StyledSøkerBorIkkePåAdresse = styled(SøkerBorIkkePåAdresse)`
    margin-top: -3rem;
`;

export const Personopplysninger: React.FC<{ skjema: ISkjema<IStegEnFeltTyper, string> }> = ({
    skjema,
}) => {
    const intl = useIntl();

    const { søknad } = useApp();
    const søker = søknad.søker;

    return (
        <PersonopplysningerSection aria-live={'polite'}>
            <KomponentGruppe>
                <FeltGruppe>
                    <StyledAlertStripe type={'info'} form={'inline'}>
                        <p>
                            <FormattedMessage id={'personopplysninger.alert.infohentet'} />
                        </p>
                    </StyledAlertStripe>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.ident.visning'} />
                    </Element>
                    <Normaltekst>{søker.ident}</Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.statsborgerskap'} />
                    </Element>
                    <Normaltekst>
                        {søker.statsborgerskap
                            .map((statsborgerskap: { landkode: Alpha3Code }) =>
                                landkodeTilSpråk(statsborgerskap.landkode, intl.locale)
                            )
                            .join(', ')}
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'sivilstatus.tittel'} />
                    </Element>
                    <Normaltekst>
                        <FormattedMessage id={hentSivilstatus(søker.sivilstand?.type)} />
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'personopplysninger.adresse'} />
                    </Element>
                    {søker.adresse ? (
                        hentAdressefelterSortert(søker.adresse).map(adresseFelt => (
                            <Normaltekst>{adresseFelt}</Normaltekst>
                        ))
                    ) : (
                        <Normaltekst>
                            <FormattedMessage
                                id={'personopplysninger.har-ikke-registrert-adresse'}
                            />
                        </Normaltekst>
                    )}
                </FeltGruppe>
            </KomponentGruppe>

            {søker.adresse && (
                <KomponentGruppe aria-live="polite">
                    <JaNeiSpørsmål
                        {...skjema.felter.borPåRegistrertAdresse.hentNavInputProps(
                            skjema.visFeilmeldinger
                        )}
                        name={'søker.borpåregistrertadresse'}
                        legend={
                            <>
                                <Element>
                                    <FormattedMessage id={'personopplysninger.spm.riktigAdresse'} />
                                </Element>
                                <Normaltekst>
                                    <FormattedMessage
                                        id={'personopplysninger.lesmer-innhold.riktigAdresse'}
                                    />
                                </Normaltekst>
                            </>
                        }
                        labelTekstForJaNei={{
                            ja: <FormattedMessage id={'ja'} />,
                            nei: <FormattedMessage id={'nei'} />,
                        }}
                    />

                    {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                        <SøkerBorIkkePåAdresse
                            advarselTekstId={'personopplysninger.alert.riktigAdresse'}
                            utfyllendeAdvarselInfoId={'personopplysninger.info.endreAdresse'}
                        />
                    )}
                </KomponentGruppe>
            )}
            {!søker.adresse && (
                <StyledSøkerBorIkkePåAdresse
                    advarselTekstId={'personopplysninger.info.ukjentadresse'}
                    utfyllendeAdvarselInfoId={'personopplysninger.info.vi-trenger-din-adresse'}
                />
            )}
            <KomponentGruppe>
                {skjema.felter.telefonnummer.erSynlig && (
                    <StyledInput
                        {...skjema.felter.telefonnummer.hentNavInputProps(skjema.visFeilmeldinger)}
                        name={'Telefonnummer'}
                        label={<FormattedMessage id={'personopplysninger.telefonnr'} />}
                        bredde={'M'}
                        type="tel"
                    />
                )}
            </KomponentGruppe>
        </PersonopplysningerSection>
    );
};
