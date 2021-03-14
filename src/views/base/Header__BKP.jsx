import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';


import './Header.scss';


let HeaderContent = ({ appstore }) => {
    return (
        <section className="content">

            <div className="content_left">

                <div className="disclaimer">

                    <h1>Dev-Learning</h1>
                    <p>Registrati gratuitamente alla piattaforma ed aiutaci a costruire l'istruzione di domani</p>
                    <button className="button_action">Unisciti a noi</button>

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
                                        <div className="post_text" style={{ width: "2.5rem" }}></div>
                                        <div className="post_text" style={{ width: "1rem" }}></div>
                                        <div className="post_text" style={{ width: "2rem" }}></div>
                                    </div>

                                    <div className="postit postit" style={{ top: "2rem", left: "4rem", backgroundColor: "#f6b439" }}>
                                        <div className="post_text" style={{ width: "2.5rem" }}></div>
                                        <div className="post_text" style={{ width: "1rem" }}></div>
                                        <div className="post_text" style={{ width: "2rem" }}></div>
                                    </div>

                                    <div className="postit postit3" style={{ top: "1rem", left: "6rem", backgroundColor: "#eceb9d" }}>
                                        <div className="post_text" style={{ width: "2.5rem" }}></div>
                                        <div className="post_text" style={{ width: "1rem" }}></div>
                                        <div className="post_text" style={{ width: "2rem" }}></div>
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

                                    <div className="face_sad" style={{ top: "1rem", left: "1rem" }}>
                                        <span className="icon-sad"></span>
                                    </div>
                                    <div className="face_smile" style={{ top: "1rem", left: "4rem" }}>
                                        <span className="icon-smile"></span>
                                    </div>
                                    <div className="face_smile" style={{ top: "1rem", left: "7rem" }}>
                                        <span className="icon-smile"></span>
                                    </div>
                                    <div className="face_sad" style={{ top: "4rem", left: "1rem" }}>
                                        <span className="icon-sad"></span>
                                    </div>
                                    <div className="face_smile" style={{ top: "4rem", left: "4rem" }}>
                                        <span className="icon-smile"></span>
                                    </div>
                                    <div className="face_sad" style={{ top: "4rem", left: "7rem" }}>
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
                                        <span className="icon-lightbulb_on"></span>
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
                                    <div className="box_wheel rotating" style={{ top: "2.5rem", left: "2rem" }}>
                                        <span className="icon-cog"></span>
                                    </div>
                                    <div className="box_wheel rotating" style={{ top: "0.5rem", left: "5rem" }}>
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
HeaderContent = inject("appstore")(observer(HeaderContent));

let HeaderHomeContent = HeaderContent;


let MenuItem = ({ onClick, label }) => {
    return (
        <div className="menu_item">
            <a onClick={onClick} >
                {label}
            </a>
        </div>
    );
};
let HeaderMenu = ({ appstore }) => {

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
        <nav className="menu">

            {menuItems}

            {/* <div className="menu_item">
                <a href="./team.html">
                    The team
                </a>
            </div>
            <div className="menu_item">
                <a href="./projects.html">
                    Projects
            </a>
            </div>
            <div className="menu_item">
                <a href="./ideas.html">
                    Ideas
            </a>
            </div>
            <div className="menu_item">
                <a href="./forum">
                    Forum
            </a>
            </div>
            <div className="menu_item">
                <a href="./workwithus.html">
                    Work with us
            </a>
            </div>
            <div className="menu_item">
                <a href="./notfound.html">
                    Contact
            </a>
            </div> */}

        </nav>
    );
};
HeaderMenu = inject("appstore")(observer(HeaderMenu));




let Header = ({ appstore }) => {

    const { firebaseStore, routerStore } = appstore;

    return (
        <section className="header">

            <div className="menu_button">
                <span
                    id="action_toggle_menu"
                    className="icon-menu"
                    onClick={() => {
                        appstore.toggleTabMenu();
                    }}
                ></span>
            </div>




            <div 
                className="box_title"
                onClick={() => {
                    routerStore.execChangePath("/home");
                }}
            >
                <img
                    className="logo"
                    src="./images/logo.svg"
                />

                <h1 className="title"> Dev-Learning </h1>
            </div>

            

            
            <HeaderMenu />


            <div className="box_login">
                {
                    firebaseStore.logged ?
                        <button 
                            className="button"
                            onClick={async () => {
                                await firebaseStore.logout();
                            }}
                        >
                            Logout
                        </button>
                        :
                        <button 
                            className="button"
                            onClick={ () => routerStore.execChangePath("/login") }
                        >
                            Log In
                        </button>
                }

            </div>

            
        </section>
    );
};
Header = inject("appstore")(observer(Header));




let AppHeader = ({ appstore }) => {
    return (
        <header className="app_header">

            <Header />

            <HeaderContent />

        </header>
    );
};
AppHeader = inject("appstore")(observer(AppHeader));


let HomeHeader = ({ appstore }) => {
    return (
        <header className="app_header">

            <Header />

            <HeaderHomeContent />

        </header>
    );
};
HomeHeader = inject("appstore")(observer(HomeHeader));



export { HeaderContent };
export { Header };


export { AppHeader };
export { HomeHeader };

