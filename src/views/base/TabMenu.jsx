import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';


import './TabMenu.scss';


let MenuItem = ({ onClick, label }) => {
    return (
        <li>
            <a
                onClick={onClick}
            >
                {label}
            </a>
        </li>
    );
};


let TabMenu = ({ appstore }) => {

    const { firebaseStore, routerStore } = appstore;


    var menuItems = appstore.menuItems
    .filter((item) => {
        return firebaseStore.logged || item.needLogged !== true;
    })
    .map((item) => {
        return <MenuItem 
            key={item.id}
            label={item.label}
            onClick={() => {
                routerStore.execChangePath(item.route);
                appstore.toggleTabMenu(false);
            }}
        />  
    });

    return (
        <react.Fragment>

            <div 
                className={`tab_menu_overlay ${appstore.isTabMenuOpen ? "active" : "" }`} 
            ></div>
            
            <div 
                className={`tab_menu ${appstore.isTabMenuOpen ? "active" : "" }`} 
            >   


                <div 
                    id="action_close_menu" 
                    className="close_button"
                    onClick={() => {
                        appstore.toggleTabMenu(false);
                    }}
                >
                    ×
                </div>


                <a
                    onClick={() => {
                        routerStore.execChangePath("/home");
                        appstore.toggleTabMenu(false);
                    }}
                >

                    <div className="box_title">
                        <img 
                            className="logo"
                            src="./images/logo.svg"
                        />

                        <h1 className="title"> Dev-Learning </h1>
                    </div>

                </a>

                <ul className="list">
                    {menuItems}
                </ul>
                
            </div>
        </react.Fragment>
    );
};
TabMenu = inject("appstore")(observer(TabMenu));


export { TabMenu };

