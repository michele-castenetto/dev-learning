import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';


let Main = ({children}) => {
    return (
        <main className="app_main">
            {children}
        </main>
    );
}; 


export { Main };

