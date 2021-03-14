import React from 'react';
import { inject, observer } from 'mobx-react';


import ScrollToTop from "__src/components/ScrollToTop/ScrollToTop.jsx";

import './Team.scss';



const profilesData = [
    {
        name: "Michele Castenetto",
        role: "Co-founder, Developer",
        image: "./images/michele.jpg",
        biography: [
            "Michele si laurea in fisica presso l'università di Trieste. Dopo un'infruttuosa esperienza nella magistrale in matematica segue un corso biennale come Tecnico Programmatore Cloud e inizia a lavorare come sviluppatore web presso Tesy Software.",
            "Nel frattempo riprende gli studi in Comunicazione Multimediale presso l'università di Udine.",
            "Nel 2020 sulla spinta della pandemia globale e di un interessante progetto universitario co-fonda Dev-Learning per sostenere e promuovere un'istruzione più equa ed accessibile."
        ]
    },
    {
        name: "Patrizia Pegolo",
        role: "Co-founder, Designer",
        image: "./images/patty.jpg",
        biography: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus. Donec scelerisque sollicitudin enim eu venenatis. Duis tincidunt laoreet ex, in pretium orci vestibulum eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis pharetra luctus lacus ut vestibulum. Maecenas ipsum lacus, lacinia quis posuere ut, pulvinar vitae dolor. Integer eu nibh at nisi ullamcorper sagittis id vel leo. Integer feugiat faucibus libero, at maximus nisl suscipit posuere. Morbi nec enim nunc."
        ]
    },
    {
        name: "Ted Eveline Mosby",
        role: "Programmer",
        image: "./images/ted_mosby.jpg",
        biography: [
            "Ted is an Ex-Google Software Engineer. After a bachelor in IT at MIT in 2008, he dedicated to full stack web programming.",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna.",
            "Morbi a bibendum metus. Donec scelerisque sollicitudin enim eu venenatis. Duis tincidunt laoreet ex, in pretium orci vestibulum eget."
        ]
    },
    {
        name: "Robin Scherbatsky ",
        role: "Designer",
        image: "./images/robin-scherbatsky.jpg",
        biography: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus. Donec scelerisque sollicitudin enim eu venenatis. Duis tincidunt laoreet ex, in pretium orci vestibulum eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis pharetra luctus lacus ut vestibulum. Maecenas ipsum lacus, lacinia quis posuere ut, pulvinar vitae dolor. Integer eu nibh at nisi ullamcorper sagittis id vel leo. Integer feugiat faucibus libero, at maximus nisl suscipit posuere. Morbi nec enim nunc."
        ]
    },
];




let Profile = ({ profile }) => {
    return (
        <div className="box_profile">

            <div className="profile">
                
                <h2> {profile.name} </h2>
                <h4> {profile.role} </h4>

                <div className="box_media">

                    <div className="box_image">
                        <img src={profile.image} alt="profile_image" />
                    </div>

                    <div className="box_social"></div>

                </div>

                <div className="box_biography">
                    {
                        profile.biography.map((text, index) => {
                            return <p key={index}>
                                {text}
                            </p>
                        })
                    }
                </div>

            </div>

        </div>
    );
};


let ProfilesSection = ({ appstore }) => {

    const profiles = profilesData.map( (profile, index) => {
        return <Profile 
            key={index}
            profile={profile}
        /> 
    });

    return (
        <section className="section" id="">

            <div className="profiles">

                {profiles}

            </div>
            
        </section>
    );
};
ProfilesSection = inject("appstore")(observer(ProfilesSection));


let HeaderContent = () => {
    return (
        <section className="content">

            <div className="column_left">

                <div className="disclaimer">

                    <h2> Progetta con noi </h2>
                    
                    <p> Collabora assieme ad altri insegnanti, designer e sviluppatori per progettare la scuola del futuro</p>
                    
                    <button className="button_action">Unisciti a noi</button>

                </div>

            </div>


            <div className="column_right">

                <div className="box_panel">

                    <div className="panel">

                        <div className="panel_transformed rotating">
                            
                            <div className="box_icon">
                                <span className="icon-users"></span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};


// ##OLD
// let View = ({ BaseView, appstore }) => {
//     return (
//         <BaseView className="ts_view ts_view__team">
//             <ProfilesSection />
//         </BaseView>
//     )
// };
// View = inject("appstore")(observer(View));
let View = ({ BaseView, BaseHeader, Main, Footer, appstore }) => {
    return (
        <div className={`ts_view ts_view__team`}>

            <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />

            <BaseHeader>
                <HeaderContent />
            </BaseHeader>

            <Main>
                
                <ProfilesSection /> 
                
            </Main>

            <Footer />

        </div>
    )
};
View = inject("appstore")(observer(View));


export default View;

