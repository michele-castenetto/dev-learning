import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'mobx-react';
import BBPromise from 'bluebird';

import App from "__src/App.jsx";



// ## configurazione mobx
import { configure } from "mobx";
// configure({ enforceActions: 'observed' });


// componenti base
import base from '__src/base.js';


// foglio di stile principale
import "__src/styles/index.scss";


import init from "__src/init.js";


(async function() {
    try {
        
        const appstore = await init();

        const isDebugMode = appstore.config.settings.debug;
        if (!isDebugMode) {
            configure({ enforceActions: 'observed' });
        }
        
        ReactDOM.render(
            <Provider appstore={appstore}>
                <App 
                    {...base}
                />
            </Provider>,
            document.getElementById("app")
        );

    } catch (error) {
        // ##TODO testare errore
        // appstore.uiStore.alert(error.message || "Error" );
        console.log(error);
    }
})();



