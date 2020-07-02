import React from 'react';
import './Informasjonsbolk.less';

export interface IInformasjonsbolkProps {
    tittel: React.ReactNode;
}

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({ tittel, children }) => {
    return (
        <div className={'informasjonsbolk'}>
            {tittel}
            <div className={'informasjonsbolk__barn'}>{children}</div>
        </div>
    );
};

export default Informasjonsbolk;
