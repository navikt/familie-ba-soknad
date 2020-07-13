import React, { useState } from 'react';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import KnappBase, { Knapp, Fareknapp, Flatknapp } from 'nav-frontend-knapper';
import { EtikettSuksess } from 'nav-frontend-etiketter';
import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';

interface Props {
    navn: string;
    ident: string;
    fødselsdato: string;
    alder: string;
    harSammeAdresse: boolean;
    medISøknad: boolean;
    id: string;
}

const Barnekort: React.FC<Props> = ({
    id,
    navn,
    ident,
    alder,
    harSammeAdresse,
    medISøknad,
    fødselsdato,
}) => {
    //const { søknad, settSøknad } = useSøknad();
    const [åpenEndreModal, settÅpenEndreModal] = useState(false);

    const formatFnr = (fødselsnummer: string) => {
        return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
    };

    const ikoner = [barn1, barn2, barn3];
    const ikon = ikoner[Math.floor(Math.random() * ikoner.length)];

    let bosted: string = 'Temp-bosted';

    {
        /*const fjernFraSøknad = (id: string) => {
        const nyBarneListe = søknad.person.barn.filter(b => b.id !== id);

        settSøknad({ ...søknad, person: { ...søknad.person, barn: nyBarneListe } });
    };*/
    }

    return (
        <div className="barnekort">
            <div className="barnekort__header">
                <img alt="barn" className="barneikon" src={ikon} />
            </div>
            <div className="barnekort__informasjonsboks">
                <div className="informasjonsboks-innhold">
                    <Element>{navn}</Element>
                    <div className="informasjonselement">
                        <Normaltekst>{`FØDSELSNUMMER:`}</Normaltekst>
                        <Normaltekst>{ident}</Normaltekst>
                    </div>
                    <div className="informasjonselement">
                        <Normaltekst>{`Alder:`}</Normaltekst>
                        <Normaltekst>{alder}</Normaltekst>
                    </div>
                    <div className="informasjonselement">
                        <Normaltekst>{`Registrert på adresse:`}</Normaltekst>
                        <Normaltekst>{bosted}</Normaltekst>
                    </div>
                    <div>
                        {!medISøknad && <Knapp mini>Legg til søknad</Knapp>}
                        {medISøknad && (
                            <>
                                <EtikettSuksess className={'med-i-søknad'}>
                                    Med i søknad
                                </EtikettSuksess>
                                <Knapp mini className={'fjern-barn-knapp'}>
                                    Fjern fra søknad
                                </Knapp>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Barnekort;
