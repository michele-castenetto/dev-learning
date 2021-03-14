import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';



import { TabMenu } from "./TabMenu.jsx";


import { BaseHeader, HomeHeader } from "./Header.jsx";

import { Main } from "./Main.jsx";

import { Footer } from "./Footer.jsx";






let BaseView = ({ className, children }) => {
    return(
        <div className={`ts_view ${className}`}>

            <BaseHeader />

            <Main>
                {children}
            </Main>

            <Footer />

        </div>
    )
};



let HomeView = ({ className, children }) => {
    return(
        <div className={`ts_view ${className}`}>

            <HomeHeader />

            <Main>
                {children}
            </Main>

            <Footer />

        </div>
    )
};


export { BaseView };
export { HomeView };
export { BaseHeader };
export { HomeHeader };
export { Main };
export { Footer };
export { TabMenu };

