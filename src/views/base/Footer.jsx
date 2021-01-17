import React from 'react';
import { inject, observer } from 'mobx-react';
import react from 'react';


import './Footer.scss';


let Social = () => {
    return (
        <div className="social">

            <div className="social_item">
                <a href="#">
                    <span className="icon-facebook2"></span>
                </a>
            </div>
            <div className="social_item">
                <a href="#">
                    <span className="icon-instagram"></span>
                </a>
            </div>
            <div className="social_item">
                <a href="#">
                    <span className="icon-telegram"></span>
                </a>
            </div>
            <div className="social_item">
                <a href="#">
                    <span className="icon-twitter"></span>
                </a>
            </div>
            <div className="social_item">
                <a href="#">
                    <span className="icon-github"></span>
                </a>
            </div>
            <div className="social_item">
                <a href="#">
                    <span className="icon-linkedin"></span>
                </a>
            </div>
            <div className="social_item">
                <a href="#">
                    <span className="icon-youtube2"></span>
                </a>
            </div>

        </div>
    );
};



let Footer = () => {
    return (

        <footer className="app_footer">



        <section className="section">



            <div className="section_left">

                <div className="box_title">

                    <h1 className="title"> Dev-Learning </h1>

                    <img 
                        className="logo"
                        src="./images/logo.svg"
                    />

                </div>

            </div>



            <div className="section_right">

                <ul className="list">

                    <li>
                        <h2 className="subtitle">Explore</h2>
                        <ul className="">

                            <li><a href="#">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Ideas</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Contacts</a></li>

                        </ul>
                    </li>

                    <li>
                        <h2 className="subtitle">Legal</h2>
                        <ul className="">

                            <li><a href="#">Terms of use</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                            <li><a href="#">Conditions</a></li>

                        </ul>
                    </li>

                </ul>



            </div>




        </section>


        <div className="line"></div>


        <Social />


        <div className="line"></div>

        <div className="copyright"> 
            Copyright © 2021 Dev-Learning, LLC. All rights reserved 
        </div>


    </footer>

    );
};
Footer = inject("appstore")(observer(Footer));


export { Footer };

