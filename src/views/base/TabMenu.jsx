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

    var menuItems = appstore.menuItems.map((item) => {
        return <MenuItem 
            key={item.id}
            label={item.label}
            onClick={() => {
                appstore.routerStore.execChangePath(item.route);
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
                    // href="./home.html"
                    onClick={() => {
                        appstore.routerStore.execChangePath("/home");
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


                {/* <ul className="list">
                    <li>
                        <a href="./team.html">
                            The team
                        </a>
                    </li>
                    <li>
                        <a href="./projects.html">
                            Projects
                        </a>
                    </li>
                    <li>
                        <a href="./Ideas.html">
                            Ideas
                        </a>
                    </li>
                    <li>
                        <a href="./forum.html">
                            Forum
                        </a>
                    </li>
                    <li>
                        <a href="./workwithus.html">
                            Work with us
                        </a>
                    </li>
                    <li>
                        <a href="./contacts.html">
                            Contact
                        </a>
                    </li>

                </ul> */}

            </div>
        </react.Fragment>
    );
};
TabMenu = inject("appstore")(observer(TabMenu));


export { TabMenu };

