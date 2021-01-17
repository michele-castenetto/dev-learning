import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';



import { TabMenu } from "./TabMenu.jsx";


import { AppHeader, Header, HeaderContent } from "./Header.jsx";

import { Main } from "./Main.jsx";

import { Footer } from "./Footer.jsx";







let HeaderMenu = ({ appstore }) => {

    const { authStore, routerStore, languageStore } = appstore;
    

    // const { autorizzazioni } = authStore;

    // const authVisibilitaPrezzi = autorizzazioni[OPERAZIONI_MAP.VISIBILITA_PREZZI] || { abilitato: false, route: ""};
    

    let classNames = {};
    const currentRoute = appstore.routerStore.route;
    if(currentRoute){
        appstore.routerStore.routes.forEach((route)=>{
            classNames[route.id] = route.id === currentRoute.id ? "active" : "inactive";
        });
    }


    return (

        <nav className="app_header__menu">

            <ul className="app_header__menu__list">

                { authStore.logged &&
                    <li 
                        onClick={ () => routerStore.changePath("/home") } 
                        className={classNames["home"] + " " + classNames["root"]}
                    > 
                        <i className="icon-home" />
                        <span>{languageStore.translate('BaseView.home', 'Home')}</span>
                    </li>
                }

                { authStore.logged &&
                    <li 
                        onClick={ () => routerStore.changePath("/stanza") } 
                        className={classNames["stanza"]}
                    > 
                        <i className="icon-cube" />
                        <span>{languageStore.translate('BaseView.room', 'Stanza')}</span>
                    </li>
                }

                { authStore.logged &&
                     <li 
                        onClick={ () => routerStore.changePath("/progetti") } 
                        className={classNames["progetti"]}
                    > 
                        <i className="icon-shopping-cart" />
                        <span>{languageStore.translate('BaseView.projects', 'Progetti')}</span>
                    </li>
                }

                {/* { authStore.logged &&
                     <li 
                        onClick={ () => appstore.routerStore.changePath("/documentazione") } 
                        className={classNames["documentazione"]}
                    > 
                        <i className="icon-shopping-cart" />
                        <span>{languageStore.translate('BaseView.documentazione', 'Documentazione')}</span>
                    </li>
                } */}

                { authStore.logged && (authStore.sessioninfo || {}).isAdmin &&
                    <li 
                        onClick={ () => routerStore.changePath("/admin") } 
                        className={classNames["admin"]}
                    > 
                        <i className="icon-person" />
                        <span>{languageStore.translate('BaseView.admin', 'Admin')}</span>
                    </li> 
                }


                { authStore.logged &&
                    <li 
                        onClick={ () => routerStore.changePath("/dealer") } 
                        className={classNames['administration']}
                    >
                        <i className="icon-settings" />
                        <span>{languageStore.translate('common.impostazioni', 'Impostazioni')}</span>
                    </li>
                }

                { authStore.logged &&
                    <li 
                        onClick={ () => routerStore.changePath("/profilo") } 
                        className={classNames["profilo"]
                    }>
                        {/* <span className="notranslate material-icons-outlined">account_circle</span> */}
                        <i className="icon-person" />
                        <span>{languageStore.translate('BaseView.profile', 'Profilo')}</span>
                    </li>
                }

                { !authStore.logged && 
                    <li 
                        onClick={ () => routerStore.changePath("/login") } 
                        className={classNames["login"]}
                    > 
                        <i className="icon-person" />
                        <span>{languageStore.translate('BaseView.Login', 'Login')}</span>
                    </li> 
                }

            </ul>      
        </nav>
    );
};
HeaderMenu = inject("appstore")(observer(HeaderMenu));


let HeaderLogo = ({ appstore }) => {

    const { routerStore, homeConfig = {} } = appstore;

    var logoUrl = "https://apps.tesysoftware.com/public/demoweb/images/logos/logo_tesy.png";
    logoUrl = homeConfig.logo || logoUrl;
    
    return (
        <div className="box_logo">
            <img 
                onClick={ () => routerStore.changePath("/home") }
                className="logo" 
                // src="./assets/images/logo_tesy.png" 
                src={logoUrl}
                alt="logo azienda" 
            />
        </div>
    );

}
HeaderLogo = inject("appstore")(observer(HeaderLogo));





let View = ({ className, children }) => {
    return(
        <div className={`ts_view ${className}`}>

            <AppHeader />

            <Main>
                {children}
            </Main>

            <Footer />

        </div>
    )
};


export default View;
export { View as BaseView };
export { AppHeader as Header };
export { Main };
export { Footer };
export { TabMenu };

