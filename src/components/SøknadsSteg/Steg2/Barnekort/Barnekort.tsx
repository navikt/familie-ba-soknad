import React, { useState } from 'react';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import barn1 from '../../../assets/barn1.svg';
import barn2 from '../../../assets/barn2.svg';
import barn3 from '../../../assets/barn3.svg';
import ufødtIkon from '../../../assets/ufodt.svg';

interface Props {
    navn: string;
    ident: string;
    fødselsdato: string;
    alder: string;
    harSammeAdresse: boolean;
    lagtTil: boolean;
    født: boolean;
    id: string;
}

const Barnekort: React.FC<Props> = ({
    id,
    navn,
    ident,
    alder,
    harSammeAdresse,
    lagtTil,
    født,
    fødselsdato,
}) => {
    //const { søknad, settSøknad } = useSøknad();
    const [åpenEndreModal, settÅpenEndreModal] = useState(false);

    const formatFnr = (fødselsnummer: string) => {
        return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
    };

    const ikoner = [barn1, barn2, barn3];
    //const ikon = født.verdi ? ikoner[Math.floor(Math.random() * ikoner.length)] : ufødtIkon;

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
                    <Element>{`Barne Barnson`}</Element>
                    <div className="informasjonselement">
                        <Normaltekst>{`FØDSELSNUMMER:`}</Normaltekst>
                        <Normaltekst>{`12345678901`}</Normaltekst>
                        )}
                    </div>
                    <div className="informasjonselement">
                        <Normaltekst>{`Alder:`}</Normaltekst>
                        <Normaltekst>{`Temp-alder`}</Normaltekst>
                    </div>
                    <div className="informasjonselement">
                        <Normaltekst>{`Registrert på adresse:`}</Normaltekst>
                        <Normaltekst>{bosted}</Normaltekst>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Barnekort;
