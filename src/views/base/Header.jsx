import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';


import './Header.scss';



let MenuItem = ({ onClick, label }) => {
    return (
        <div className="menu_item">
            <a onClick={onClick} >
                {label}
            </a>
        </div>
    );
};
let HeaderMenu = ({ menuItems, menuItemHandler }) => {
    return (
        <nav className="menu">
            {
                menuItems.map((item) => {
                    return <MenuItem 
                        key={item.id}
                        label={item.label}
                        onClick={() => menuItemHandler(item.route)}
                    /> 
                })
            }
        </nav>
    );
};
HeaderMenu = inject("appstore")(observer(HeaderMenu));




let TopHeader = (props) => {

    const { logged } = props;
    const { menuButtonHandler, logoButtonHandler, loginButtonHandler, logoutButtonHandler } = props;
    const { menuItems, menuItemHandler } = props;


    return (
        <section className="header">

            <div className="menu_button">
                <span
                    id="action_toggle_menu"
                    className="icon-menu"
                    onClick={menuButtonHandler}
                ></span>
            </div>
                
            

            <div 
                className="box_title"
                onClick={logoButtonHandler}
            >
                <img
                    className="logo"
                    src="./images/logo.svg"
                />

                <h1 className="title"> Dev-Learning </h1>
            </div>


            <HeaderMenu 
                menuItems={menuItems}
                menuItemHandler={menuItemHandler}
            />
                        

            <div className="box_login">
                {
                    logged ?
                        <button 
                            className="button"
                            onClick={logoutButtonHandler}
                        >
                            Logout
                        </button>
                        :
                        <button  
                            className="button"
                            onClick={loginButtonHandler}
                        >
                            Log In
                        </button>
                }

            </div>

            
        </section>
    );
};
TopHeader = inject("appstore")(observer(TopHeader));





let BaseHeaderContent = () => {

    return (
        <section className="content">

            <div className="column_left">

                <div className="disclaimer">

                    <h2> Progetta con noi </h2>
                    <p>Registrati gratuitamente alla piattaforma ed aiutaci a costruire l'istruzione di domani</p>
                    <button className="button_action">Unisciti a noi</button>

                </div>

            </div>


            <div className="column_right">

                

                <div className="box_panel">

                    <div className="panel">

                        <div className="panel_transformed">
                            
                            {/* <div className="box_icon">
                                <span className="icon-user"></span>
                            </div> */}

                            <div className="box_icon">
                                <span className="icon-collaboration_hands"></span>
                            </div>

                            {/* <div className="box_profiles">

                                <div className="profile">
                                    <div className="profile_icon">
                                        <span className="icon-user"></span>
                                        <div className="text">
                                            <div className="line"></div>
                                            <div className="line"></div>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                </div>

                            </div> */}


                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};


let BaseHeader = ({ appstore, children }) => {

    const { firebaseStore, routerStore } = appstore;

    var menuItems = appstore.menuItems
    .filter((item) => {
        return firebaseStore.logged || item.needLogged !== true;
    });

    return (
        <header className="base_header">

            <TopHeader 
                logged={firebaseStore.logged}
                menuButtonHandler={() => appstore.toggleTabMenu()}
                logoButtonHandler={() => routerStore.execChangePath("/home")}
                loginButtonHandler={() => routerStore.execChangePath("/login")}
                logoutButtonHandler={() => firebaseStore.logout()}
                menuItemHandler={route => routerStore.execChangePath(route)}
                menuItems={menuItems}
            />

            {/* <BaseHeaderContent /> */}

            {children}

        </header>
    );
};
BaseHeader = inject("appstore")(observer(BaseHeader));



let HomeHeaderContent = ({ appstore }) => {

    const { routerStore } = appstore;

    return (
        <section className="content">

            <div className="content_left">

                <div className="disclaimer">

                    <h1>Dev-Learning</h1>
                    <p>Registrati gratuitamente alla piattaforma ed aiutaci a costruire l'istruzione di domani</p>
                    <button 
                        className="button_action"
                        onClick={() => routerStore.execChangePath("/register")}
                    >
                        Unisciti a noi
                    </button>

                </div>

            </div>


            <div className="content_right">

                <div className="box_panel">

                    <div className="outer_panel">

                        <div className="panel">

                            <div className="cell cell_arrow">
                                <img src="./images/arrow.png" alt="" />
                            </div>

                            <div className="cell cell_window">
                                <div className="window_header">
                                    <span>Research</span>
                                </div>
                                <div className="window_main">

                                    <div className="postit" style={{ top: "1rem", left: "0.5rem", backgroundColor: "#78c078" }}>
                                        <div className="post_text anim_write1" style={{ width: "2.5rem" }}></div>
                                        <div className="post_text anim_write2" style={{ width: "1rem" }}></div>
                                        <div className="post_text anim_write3" style={{ width: "2rem" }}></div>
                                    </div>

                                    <div className="postit postit" style={{ top: "2rem", left: "4rem", backgroundColor: "#f6b439" }}>
                                    <div className="post_text anim_write1" style={{ width: "2.5rem" }}></div>
                                        <div className="post_text anim_write2" style={{ width: "1rem" }}></div>
                                        <div className="post_text anim_write3" style={{ width: "2rem" }}></div>
                                    </div>

                                    <div className="postit postit3" style={{ top: "1rem", left: "6rem", backgroundColor: "#eceb9d" }}>
                                    <div className="post_text anim_write1" style={{ width: "2.5rem" }}></div>
                                        <div className="post_text anim_write2" style={{ width: "1rem" }}></div>
                                        <div className="post_text anim_write3" style={{ width: "2rem" }}></div>
                                    </div>

                                </div>
                            </div>

                            <div className="cell cell_arrow">
                                <img className="rotate90" src="./images/arrow.png" alt="" />
                            </div>

                            <div className="cell cell_window">
                                <div className="window_header">
                                    <span>Test</span>
                                </div>
                                <div className="window_main">

                                    <div className="face_sad anim_rotate" style={{ top: "1rem", left: "1rem" }}>
                                        <span className="icon-sad"></span>
                                    </div>
                                    <div className="face_smile anim_rotate" style={{ top: "1rem", left: "4rem" }}>
                                        <span className="icon-smile"></span>
                                    </div>
                                    <div className="face_smile anim_rotate" style={{ top: "1rem", left: "7rem" }}>
                                        <span className="icon-smile"></span>
                                    </div>
                                    <div className="face_sad anim_rotate" style={{ top: "4rem", left: "1rem" }}>
                                        <span className="icon-sad"></span>
                                    </div>
                                    <div className="face_smile anim_rotate" style={{ top: "4rem", left: "4rem" }}>
                                        <span className="icon-smile"></span>
                                    </div>
                                    <div className="face_sad anim_rotate" style={{ top: "4rem", left: "7rem" }}>
                                        <span className="icon-sad"></span>
                                    </div>

                                </div>
                            </div>

                            <div className="cell empty"></div>

                            <div className="cell cell_window ideate">
                                <div className="window_header">
                                    <span>Ideate</span>
                                </div>
                                <div className="window_main">
                                    <div className="box_light">
                                        <span className="icon_on lighton icon-lightbulb_on"></span>
                                        {/* <span className="icon_off lightoff icon-lightbulb_off"></span> */}
                                    </div>
                                </div>
                            </div>

                            <div className="cell cell_arrow">
                                <img className="rotate270" src="./images/arrow.png" alt="" />
                            </div>

                            <div className="cell cell_window prototype">
                                <div className="window_header">
                                    <span>Prototype</span>
                                </div>
                                <div className="window_main">
                                    <div className="box_wheel rotating1" style={{ top: "2.5rem", left: "2rem" }}>
                                        <span className="icon-cog"></span>
                                    </div>
                                    <div className="box_wheel rotating2" style={{ top: "0.5rem", left: "5rem" }}>
                                        <span className="icon-cog"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="cell cell_arrow">
                                <img className="rotate180" src="./images/arrow.png" alt="" />
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};
HomeHeaderContent = inject("appstore")(observer(HomeHeaderContent));


let HomeHeader = ({ appstore }) => {

    const { firebaseStore, routerStore } = appstore;

    var menuItems = appstore.menuItems
    .filter((item) => {
        return firebaseStore.logged || item.needLogged !== true;
    });

    return (
        <header className="home_header">

            <TopHeader 
                logged={firebaseStore.logged}
                menuButtonHandler={() => appstore.toggleTabMenu()}
                logoButtonHandler={() => routerStore.execChangePath("/home")}
                loginButtonHandler={() => routerStore.execChangePath("/login")}
                logoutButtonHandler={() => firebaseStore.logout()}
                menuItemHandler={route => routerStore.execChangePath(route)}
                menuItems={menuItems}
            />

            <HomeHeaderContent />

        </header>
    );
};
HomeHeader = inject("appstore")(observer(HomeHeader));




export { HomeHeader };
export { BaseHeader };


