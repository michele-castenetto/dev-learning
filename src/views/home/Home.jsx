import React from 'react';
import {inject, observer} from 'mobx-react';


import './Home.scss';


let HomeSlider = ({images}) => {

    const sliderImages = images.map( (image, index) => {
        return (
            <div 
                key={index} 
                className="ts_slider__image"
                // style={{
                //     backgroundImage: `url(${image.url})`,
                //     backgroundRepeat: "no-repeat",
                //     backgroundPosition: "center center",
                //     backgroundSize: "cover"
                // }}
            >
                <div className="overlay"></div>
                <img src={image.url} />
                {image.label ? <p className="legend">Legend 1</p> : null}
            </div>
        );
    })

    return (
        <Slider
            showArrows={false}
            showThumbs={false}
            useKeyboardArrows={true}
            showStatus={false}
            dynamicHeight
            infiniteLoop={true}
            // autoPlay={true}
            // interval={4000}
        >

            {sliderImages}    

        </Slider>
    );
};




let DesignThinkingSection = () => {
    return (
        <section className="section" id="design_thinking">

            <div className="section_left">

                <div className="cards">

                    <div className="box_card">
                        <div className="card">
                            <span className="icon-dt_research"></span>
                        </div>
                    </div>

                    <div className="box_card">
                        <div className="card">
                            <span className="icon-dt_ideate"></span>
                        </div>
                    </div>

                    <div className="box_card">
                        <div className="card">
                            <span className="icon-dt_prototype"></span>
                        </div>
                    </div>

                    <div className="box_card">
                        <div className="card">
                            <span className="icon-dt_test"></span>
                        </div>
                    </div>

                </div>
                
            </div>


            <div className="section_right">

                <div className="box_description">

                    <h2>Design Thinking</h2>

                    <p> Per lo sviluppo dei moduli e degli applicativi utilizziamo il Design Thinking. Una metodologia di design snella ed efficiente che valorizza e massimizza i contributi del team.</p>

                    <p> La ricerca attraverso le interazioni del team conduce all'idea. Attorno a questa poi si sviluppa il lavoro di prototipazione e dei successivi test per valutare la bontà del lavoro svolto.</p>

                    <p> Il processo viene poi iterato per un continuo miglioramento delle funzionalità e del design degli applicativi.</p>

                    <button className="button_action"> See More </button>

                </div>

            </div>

        </section>

    );
};
DesignThinkingSection = inject("appstore")(observer(DesignThinkingSection));




let CollaborationSection = () => {
    return (
        <section className="section dark" id="collaboration">

            <div className="section_left">

                <div className="box_description">

                    <h2>Collaborazione</h2>
                    
                    <p> Algorithms and data structures go hand in hand; the solution to virtually any coding interview problem will require the implementation of some kind of abstract data type in order to access and manipulate information. </p>
                    <p> Our video series on data structures is the ultimate crash course on this important topic. We cover fundamental concepts pertaining to memory, complexity analysis, and Big O notation, and then break down popular data structures to give you a detailed look at how these concepts are applied under the hood. Linked Lists and Binary Trees will never instill fear in your heart again. </p>
                    
                    <button className="button_action"> See More </button>

                </div>

            </div>

            <div className="section_right">


                <div className="box_icons">
                    <div className="">
                        <span className="icon-collaboration_world"></span>
                    </div>
                    <div className="">
                        <span className="icon-collaboration_hands"></span>
                    </div>
                </div>


            </div>

        </section>
    );
};
CollaborationSection = inject("appstore")(observer(CollaborationSection));




let OpensourceSection = () => {
    return (
        <section className="section" id="opensource">

            <div className="section_left">


                <div className="box_icons">
                    <div className="">
                        <span className="icon-opensource_noeuro"></span>
                    </div>
                    <div className="">
                        <span className="icon-opensource_nolock"></span>
                    </div>
                </div>



            </div>

            <div className="section_right">

                <div className="box_description">

                    <h2>Open Source</h2>
                    
                    <p> Sposiamo la filosofia del software libero e del codice (ri)utilizzabile da tutti.</p>

                    <p> Crediamo che le migliori idee debbano essere diffuse e rese patrimonio di tutti, sopratutto in un ambito fondamentale come quello dell'istruzione.</p>

                    <button className="button_action"> See More </button>

                </div>
                
            </div>

        </section>
    );
};
OpensourceSection = inject("appstore")(observer(OpensourceSection));




let PlatformSection = () => {
    return (
        <section className="section dark" id="platform">

            <div className="section_left">

                
                <div className="box_description">

                    <h2>L'applicazione</h2>
                    
                    <p> Lo sviluppo dei prototipi contribuisce al miglioramento continuo dell'applicativo per la gestione di un ambiente completo di E-learning. </p>

                    <p> Un software libero e gratuito a disposizione di istituzioni, scuole e università per contribuira ad una migliore accessibilità e diritto allo studio per tutti. </p>

                    <button className="button_action"> See More </button>

                </div>

            </div>

            <div className="section_right">

                <div className="box_image">
                    <img src="./images/devices_white.png" alt="devices" />
                </div>
                
            </div>

        </section>
    );
};
PlatformSection = inject("appstore")(observer(PlatformSection));




let View = ({ Base, appstore }) => {


    return(
        <Base className="ts_view ts_view__home">
            

            <DesignThinkingSection />

            <CollaborationSection />

            <OpensourceSection />

            <PlatformSection />


        </Base>
    )
};
View = inject("appstore")(observer(View));




export default View;

