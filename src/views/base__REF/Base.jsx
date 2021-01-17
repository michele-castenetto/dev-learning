import React from 'react';
import { inject, observer } from 'mobx-react';


// ##WORK
// import './general.scss';


import './Base.scss';



// import { OPERAZIONI_MAP } from '__src/modules/costanti';



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


let Header = ({appstore}) => {
    return (
        <header className="app_header">
            <HeaderLogo />
            <HeaderMenu />
        </header>
    );
}; 
// Header = inject("appstore")(observer(Header));


let Main = ({children}) => {
    return (
        <main className="app_main">
            {children}
        </main>
    );
}; 


// ##TODO
let Footer = () => {
    return (
        <footer className="app_footer">
        <div className="container">
            
            <div className="row">

                <div className="col-md-6 box_logo">
                    <img 
                        onClick={ () => routerStore.changePath("/home") }
                        className="box_logo" 
                        src="./images/logo.png" 
                        alt="logo stocco" 
                    />
                </div>

                <div className="col-md-6">

                        <div className="box_social">
                            <div className="box_social_item">
                                <i className="notranslate material-icons-outlined">twitter</i>
                            </div>
                            <div className="box_social_item">
                                <i className="icon-facebook" />
                            </div>
                            <div className="box_social_item">
                                <i className="icon-instagram" />
                            </div>
                            <div className="box_social_item">
                                <i className="icon-youtube" />
                            </div>
                        </div>
                </div>

            </div>


            <div className="row no-gutters">
                <div className="col-md-12 box_copyright">
                    <span> Copyright ©2018 All rights reserved </span>
                </div>
            </div>

        </div>
        </footer>
    );
    
};


let View = ({ className, children }) => {
    return(
        <div className={`ts_view ${className}`}>

            <Header />

            <Main>
                {children}
            </Main>
                                    
        </div>
    )
};


export default View;
export {View as BaseView};
export {Header};
export {Main};
export {Footer};