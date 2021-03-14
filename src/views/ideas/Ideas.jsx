import React from 'react';
import { inject, observer } from 'mobx-react';


import ScrollToTop from "__src/components/ScrollToTop/ScrollToTop.jsx";


import './Ideas.scss';

import Button from "../../components/button/Button.jsx";
import { IconButton } from "../../components/button/Button.jsx";


import Search from "./components/Search.jsx";




class InsertIdeaForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
        };
    }


    handleInputTextChange(event) {
        const key = event.target.name;
        const value = event.target.value;
        this.setState({
            [key]: value
        });
    }


    handleInsertClick() {

        const { appstore } = this.props;
        const { ideasStore } = appstore;

        ideasStore.handleInsertIdea(this.state);

    }


    componentDidMount() {
        this.input_title.focus();
    }


    handleKeyDown(event) {
        const ENTER_KEY = 13;

        if (event.which === ENTER_KEY) {
            if (event.target === this.input_title) {
                this.input_description.focus();
            }
            if (event.target === this.input_description) {
                this.handleInsertClick();
            }
            
		}
    }
    

    render() {
        
        const {appstore} = this.props;
        const { languageStore, routerStore, uiStore } = appstore;

        return (
            <div className="insert_idea_form">

                <h2> {"Crea un'idea"} </h2>

                <div className="box_input">
                    <input 
                        className="ts_inputtext" 
                        ref={el => this.input_title = el}
                        type="text" 
                        name="title"
                        placeholder="Titolo"
                        value={this.state.title} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        onKeyDown={ (e) => this.handleKeyDown(e)}
                        required
                    />
                </div>


                <div className="box_input">
                    <input 
                        className="ts_inputtext"
                        // className="ts_inputtext2"
                        ref={el => this.input_description = el}
                        type="text" 
                        name="description"
                        placeholder="Descrizione"
                        value={this.state.description} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        onKeyDown={ (e) => this.handleKeyDown(e)}
                        required                        
                    />
                </div>


                <div className="box_buttons">

                    <Button 
                        className="big"
                        handleClick={ () => this.handleInsertClick()}
                    >
                        Crea
                    </Button>


                    <Button 
                        className="big"
                        handleClick={()=> uiStore.hideModal()}
                    >
                        Annulla
                    </Button>
            
                </div>



            </div>
        );
    }

}
InsertIdeaForm = inject("appstore")(observer(InsertIdeaForm));



let TopSection = ({ appstore }) => {

    const { uiStore } = appstore;

    return (
        <section className="section top-section">


            <div className="section_col">
                <Button 
                    className="big"
                    handleClick={() => {
                        uiStore.showModal(<InsertIdeaForm />, "modal_idea_insert");
                    }}    
                >
                    {"Crea un 'idea"}
                </Button>
            </div>


            <div className="section_col">
                <Search 
                    placeholder={"Search"}
                />
            </div>





        </section>
    );
};
TopSection = inject("appstore")(observer(TopSection));



class OutsideClick extends React.Component {
    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        // this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            if (this.props.handleClick) {
                this.props.handleClick();
            }
        }
    }

    render() {
        return <div ref={this.wrapperRef}>{this.props.children}</div>;
    }
}


let IdeaMenu = ({ handleDelete, handleEdit }) => {
    return (
        <div className="idea_menu">
            <div className="idea_menu_button" onClick={handleEdit}> 
                <span className="icon-pencil"></span>
                Edit
            </div>
            <div className="idea_menu_button" onClick={handleDelete}> 
                <span className="icon-bin2"></span>
                Delete
            </div>
        </div>
    );
};







let Idea = ({ idea, handleDelete, handleIdeaMenu, handleEdit, handleClickOutside }) => {

    var dt_update = "-";
    if (idea.dt_update) {
        var d = new Date(idea.dt_update);
        dt_update = `${d.getDay() < 10 ? "0" + d.getDay() : d.getDay()}-${d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1 }-${d.getFullYear()}`
    }


    return (
        <div className="box_idea">

            <div className="idea">

                <div 
                    className="idea_header" 
                    // onClick={() => handleEdit(idea.id)}
                >

                    <div className="icon">
                        <span className="icon_off icon-lightbulb_off"></span>
                        <span className="icon_on icon-lightbulb_on"></span>
                    </div>

                    <h4> {idea.title} </h4>

                    <div className="box_menu">
                        <div 
                            className="icon_menu"
                            onClick={() => handleIdeaMenu(idea)}
                        >
                            <span className="icon-ellipsis-v"></span>
                        </div>
                    </div>

                    {idea._menuEnabled ? (
                        <OutsideClick
                            handleClick={handleClickOutside}
                        >
                            <IdeaMenu 
                                handleDelete={() => handleDelete(idea.id)}
                                handleEdit={() => handleEdit(idea.id)}
                            />
                        </OutsideClick>
                    ) : null}


                </div>
                <div className="idea_main">

                    <div className="idea_description">
                        {/* <p> {"Sviluppo di filtri software per migliorare la comunicazione tra molte persone online in contempornea"} </p> */}
                        <p> {idea.description || ""} </p>
                    </div>


                    <div className="idea_info">
                        <div className="box_label">
                            <span className="icon icon-user"></span>
                            <span>Creator</span>
                        </div>
                        <div className="box_value">
                            {/* {"michele.castenetto"} */}
                            {idea.creator || "-"}
                        </div>
                    </div>

                    <div className="idea_info">
                        <div className="box_label">
                            <span className="icon icon-users"></span>
                            <span>Contributors</span>
                        </div>
                        <div className="box_value">
                            {/* {"15"} */}
                            {(idea.contributors || []).length || "-"}
                        </div>
                    </div>

                    <div className="idea_info">
                        <div className="box_label">
                            <span className="icon icon-calendar"></span>
                            <span>Last Update</span>
                        </div>
                        <div className="box_value">
                            {/* {"02-01-2021"} */}
                            {dt_update}
                        </div>
                    </div>

                    <div className="idea_tags">
                        <div className="box_label">
                            <span className="icon icon-bookmark"></span>
                            <span>Tags</span>
                        </div>

                        <div className="box_tags">
                            {/* <div className="tag">TEST</div>
                            <div className="tag">METHOD</div>
                            <div className="tag">HARDWARE</div> */}
                            {
                                (idea.tags || []).map( (tag, index) => {
                                    return <div key={index }className="tag">{tag.toUpperCase()}</div>
                                })
                            }


                        </div>

                    </div>


                
                    {/* <div className="idea_controls">

                        <IconButton
                            iconClassName="icon-pencil"
                            handleClick={() => handleEdit(idea.id)}
                        />

                        <IconButton
                            iconClassName="icon-bin2"
                            handleClick={() => handleDelete(idea.id)}
                        />

                    </div> */}





                    {/* <Button 
                        className="small"
                        handleClick={() => handleEdit(idea.id)}    
                    >
                        {"Edit"}
                    </Button>
                    <Button 
                        className="small"
                        handleClick={() => handleDelete(idea.id)}    
                    >
                        {"Delete"}
                    </Button> */}


                </div>

            </div>

            
        </div>
    );
};
Idea = inject("appstore")(observer(Idea));


let IdeasSection = ({ appstore }) => {

    const { ideasStore, routerStore } = appstore;

    const ideas = ideasStore.ideas
    .map( idea => {
        return <Idea 
            key={idea.id}
            idea={idea}
            handleEdit={id => routerStore.execChangePath("/idea?id=" + id)}
            handleDelete={id => ideasStore.handleDeleteIdea(id)}
            handleIdeaMenu={() => {
                ideasStore.toggleIdeaMenu(idea, true);
            }} 
            handleClickOutside={() => {
                ideasStore.toggleIdeaMenu(idea, false)
            }}
        />
    });
    
    return (
        <section className="section ideas-section">
            {ideas}
        </section>
    );
};
IdeasSection = inject("appstore")(observer(IdeasSection));



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
                                <span className="icon_off icon-lightbulb_off"></span>
                                <span className="icon_on icon-lightbulb_on"></span>
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
//         <BaseView className="ts_view ts_view__ideas">
//             <TopSection />
//             <IdeasSection />         
//         </BaseView>
//     )
// };
// View = inject("appstore")(observer(View));
let View = ({ BaseView, BaseHeader, Main, Footer, appstore }) => {
    return (
        <div className={`ts_view ts_view__ideas`}>
            
            <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />

            <BaseHeader>
                <HeaderContent />
            </BaseHeader>

            <Main>
                
                <TopSection />
                
                <IdeasSection />  
                
            </Main>

            <Footer />

        </div>
    )
};
View = inject("appstore")(observer(View));


export default View;

