import React from 'react';
import { inject, observer } from 'mobx-react';

import ScrollToTop from "__src/components/ScrollToTop/ScrollToTop.jsx";

import './Workwithus.scss';


let SectionTeacher = () => {
    return (
        <section className="section">

            <div className="section_left">


                <div className="box_description">

                    <h2> Insegnanti </h2>

                    <p> 
                        Se sei un insegnante, un istruttore, un formatore, se conosci o hai passione per il mondo dell'insegnamento 
                        iscriviti e partecipa allo sviluppo dei nostri moduli.
                    </p>

                    <p> Contribuisci alla ricerca in ambito educativo per avviare progetti utili allo sviluppo dell'educazione a distanza</p>

                    <p> Aiutaci nella valutazione dei prototipi per migliorare continuamente la nostra piattaforma.</p>

                    {/* <button className="button_action"> See More </button> */}

                </div>

            </div>

            <div className="section_right">

                <div className="box_image">

                    {/* <div className="circle"></div> */}

                    <img src="./images/teacher.png" alt="teacher" />
                </div>

            </div>

        </section>
    );
};


let SectionDesigner = () => {
    return (
        <section className="section">

            <div className="section_left">

                <div className="box_image">
                    <img src="./images/designer.png" alt="designer" />
                </div>

            </div>

            <div className="section_right">

                <div className="box_description">

                    <h2> Designers </h2>

                    <p> Se lavori o studi nell'ambito del design, abbiamo bisogno di te.</p>

                    <p> Aiutaci a creare interfacce gradevoli, interazioni efficaci per l'utente</p>

                    <p> Contribuisci ai meccanismi di sviluppo del progetto, dirigendo le fasi piu importanti di creazione dei moduli.</p>

                    <p> Aiutaci nel diffondere in modo efficace il nostro messaggio per un'istruzione libera e gratuita accessibile a tutti.</p>

                    {/* <button className="button_action"> See More </button> */}

                </div>

            </div>


        </section>
    );
};


let SectionDeveloper = () => {
    return (
        <section className="section">

            <div className="section_left">

                <div className="box_description">

                    <h2> Sviluppatori </h2>

                    <p> Sei uno sviluppatore web frontend o backend ?</p>

                    <p> Contribuisci allo sviluppo di un'infrastruttura solida e affidabile.</p>

                    <p> Aiutaci nello sviluppo della piattaforma e degli applcativi opensource.</p>

                </div>

            </div>


            <div className="section_right">

                <div className="box_image">
                    <img src="./images/developer.png" alt="developer" />
                </div>

            </div>

        </section>
    );
};


let HeaderContent = ({ appstore }) => {
    
    const { routerStore } = appstore;

    return (
        <section className="content">

            <div className="column_left">

                <div className="disclaimer">

                    <h2> Progetta con noi </h2>
                    
                    <p> Collabora assieme ad altri insegnanti, designer e sviluppatori per progettare la scuola del futuro</p>
                    
                    <button 
                        className="button_action"
                        onClick={() => routerStore.execChangePath("/platform")}
                    > See More </button>

                </div>

            </div>


            <div className="column_right">

                <div className="box_panel">

                    <div className="panel">

                        <div className="panel_transformed rotating">
                            
                            <div className="box_icon">
                                <span className="icon-collaboration_hands"></span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};
HeaderContent = inject("appstore")(observer(HeaderContent));


let View = ({ BaseView, BaseHeader, Main, Footer, appstore }) => {
    return (
        <div className={`ts_view ts_view__workwithus`}>

            <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />
            
            <BaseHeader>
                <HeaderContent />
            </BaseHeader>

            <Main>
                
                <SectionTeacher />

                <SectionDesigner />

                <SectionDeveloper />
                
            </Main>

            <Footer />

        </div>
    )
};
View = inject("appstore")(observer(View));


export default View;

