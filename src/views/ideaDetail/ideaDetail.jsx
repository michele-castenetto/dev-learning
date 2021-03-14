import React from 'react';
import { inject, observer } from 'mobx-react';


import './IdeaDetail.scss';


// import "./Menu.scss";


import { Button, IconButton } from "../../components/button/Button.jsx";

import htmlParse from "html-react-parser";



class InsertTagForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            value: "",
            // description: "",
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

        // ideasStore.handleInsertIdea(this.state);
        if (this.props.handleInsert) {
            this.props.handleInsert(this.state.value);
        }

    }


    componentDidMount() {
        this.input_title.focus();
    }


    // handleKeyDown(event) {
    //     const ENTER_KEY = 13;

    //     if (event.which === ENTER_KEY) {
    //         if (event.target === this.input_title) {
    //             this.input_description.focus();
    //         }
    //         if (event.target === this.input_description) {
    //             this.handleInsertClick();
    //         }
            
	// 	}
    // }
    

    render() {
        
        const {appstore} = this.props;
        const { languageStore, routerStore, uiStore } = appstore;

        return (
            <div className="insert_tag_form">

                <h2> {"Aggiungi un tag"} </h2>

                <div className="box_input">
                    <input 
                        className="ts_inputtext" 
                        ref={el => this.input_title = el}
                        type="text" 
                        name="value"
                        placeholder="Tag"
                        value={this.state.value} 
                        onChange={ (e) => this.handleInputTextChange(e)}
                        // onKeyDown={ (e) => this.handleKeyDown(e)}
                        required
                    />
                </div>


                {/* <div className="box_input">
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
                </div> */}


                <div className="box_buttons">

                    <Button 
                        className="big"
                        handleClick={ () => this.handleInsertClick()}
                    >
                        Aggiungi
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
InsertTagForm = inject("appstore")(observer(InsertTagForm));






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



let Idea = ({ idea, handleDelete, handleEdit }) => {
    return (
        <div className="box_idea">

            <div className="idea">

                <div className="idea_header">

                    <div className="icon">
                        <span className="icon_off icon-lightbulb_off"></span>
                        <span className="icon_on icon-lightbulb_on"></span>
                    </div>



                    <h4> {idea.title} </h4>

                </div>
                <div className="idea_main">

                    <Button
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
                    </Button>


                </div>

            </div>


        </div>
    );
};
let IdeasSection = ({ appstore }) => {

    const { ideasStore } = appstore;

    const ideas = ideasStore.ideas.map(idea => {
        return <Idea
            key={idea.id}
            idea={idea}
            handleEdit={id => ideasStore}
            handleDelete={id => ideasStore.handleDeleteIdea(id)}
        />
    });

    return (
        <section className="section ideas-section">
            {ideas}
        </section>
    );
};
IdeasSection = inject("appstore")(observer(IdeasSection));


// ----------------------------










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



// let HeaderSection = ({ children }) => {
//     return (
//         <section className="section header-section">
//             {children}
//         </section>
//     );
// };
// let StatusSection = ({ children }) => {
//     return (
//         <section className="section status-section">
//             {children}
//         </section>
//     );
// };
// let MainSection = ({ children }) => {
//     return (
//         <section className="section main-section">
//             {children}
//         </section>
//     );
// };


let SectionBase = ({ className, children }) => {
    return (
        <section className={`section ${className || ""}`}>
            {children}
        </section>
    );

};


let TabBase = ({ className, titleText, titleIcon, children }) => {
    return (
        <div className={`tab_base ${className || ""}`}>

            <div className="tab_header">

                <div className="icon">
                    <span className={titleIcon}></span>
                </div>

                <h4> {titleText} </h4>

            </div>

            <div className="tab_main">

                {children}

            </div>

        </div>
    );
};




let TabContributors = () => {
    return (
        <section className="tab tab-contributors">

            <div className="contributors_header">

                <div className="icon">
                    <span className="icon-users"></span>
                </div>

                <h4> {"Contributors"} </h4>

            </div>

            <div className="contributors_main">


            </div>

        </section>
    );
};


let TabDev = () => {
    return (
        <section className="tab tab-dev">

            <div className="tab_header dev_header">

                <div className="icon">
                    <span className=""></span>
                </div>

                <h4> {""} </h4>

            </div>

            <div className="tab_main dev_main">


            </div>

        </section>
    );
};


// ##WORK
var jsonFormat = function (str) {
    return str.replace(/"/g, "'");
};






let HeaderSection = ({ idea, ideasStore }) => {
    return (
        <SectionBase className="header-section">

            <div className="box_title">

                <div
                    className="icon"
                >
                    <span className="icon_off icon-lightbulb_off"></span>
                    {/* <span className="icon_on icon-lightbulb_on"></span> */}
                </div>

                <h4> {idea.title} </h4>

            </div>


            <div className="box_description">
                {idea.description}
            </div>


            {/* <div className="box_controls">
                <IconButton
                    className="big"
                    iconClassName="icon-bookmark"
                    handleClick={() => {
                        ideasStore.handleAddIdeaTag(idea.id, idea);
                    }}
                />
                <IconButton
                    className="big"
                    iconClassName="icon-bin2"
                    handleClick={() => {
                        ideasStore.handleDeleteIdea(idea.id);
                    }}
                />
            </div> */}


        </SectionBase>
    );
};



// ##WORK menu animato
let Menu = () => {
    return (
        <React.Fragment>
            <menu className="menu">

                <button className="menu__item active">
                    <svg className="icon" viewBox="0 0 24 24">
                        <path d="M3.8,6.6h16.4" />
                        <path d="M20.2,12.1H3.8" />
                        <path d="M3.8,17.5h16.4" />
                    </svg>
                </button>

                <button className="menu__item">
                    <svg className="icon" viewBox="0 0 24 24">
                        <path d="M6.7,4.8h10.7c0.3,0,0.6,0.2,0.7,0.5l2.8,7.3c0,0.1,0,0.2,0,0.3v5.6c0,0.4-0.4,0.8-0.8,0.8H3.8C3.4,19.3,3,19,3,18.5v-5.6c0-0.1,0-0.2,0.1-0.3L6,5.3C6.1,5,6.4,4.8,6.7,4.8z"/>
                        <path d="M3.4,12.9H8l1.6,2.8h4.9l1.5-2.8h4.6" />
                    </svg>
                </button>

                <button className="menu__item">
                    <svg className="icon" viewBox="0 0 24 24">
                        <path d="M3.4,11.9l8.8,4.4l8.4-4.4" />
                        <path d="M3.4,16.2l8.8,4.5l8.4-4.5" />
                        <path d="M3.7,7.8l8.6-4.5l8,4.5l-8,4.3L3.7,7.8z" />
                    </svg>
                </button>

                <button className="menu__item">
                    <svg className="icon" viewBox="0 0 24 24" >
                        <path d="M5.1,3.9h13.9c0.6,0,1.2,0.5,1.2,1.2v13.9c0,0.6-0.5,1.2-1.2,1.2H5.1c-0.6,0-1.2-0.5-1.2-1.2V5.1C3.9,4.4,4.4,3.9,5.1,3.9z"/>
                        <path d="M4.2,9.3h15.6" />
                        <path d="M9.1,9.5v10.3" />
                    </svg>
                </button>

                <button className="menu__item">
                    <svg className="icon" viewBox="0 0 24 24" >
                        <path d="M5.1,3.9h13.9c0.6,0,1.2,0.5,1.2,1.2v13.9c0,0.6-0.5,1.2-1.2,1.2H5.1c-0.6,0-1.2-0.5-1.2-1.2V5.1C3.9,4.4,4.4,3.9,5.1,3.9z"/>
                        <path d="M5.5,20l9.9-9.9l4.7,4.7" />
                        <path d="M10.4,8.8c0,0.9-0.7,1.6-1.6,1.6c-0.9,0-1.6-0.7-1.6-1.6C7.3,8,8,7.3,8.9,7.3C9.7,7.3,10.4,8,10.4,8.8z" />
                    </svg>
                </button>

                <div className="menu__border"></div>

            </menu>

            <div className="svg-container">
                <svg viewBox="0 0 202.9 45.5" >
                    <clipPath id="menu" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021978021978022)">
                        <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>
                    </clipPath>
                </svg>
            </div>
        </React.Fragment>
    );
};







// --------------------------------------------------------------



const designStatusList = [
    {
        code: "1",
        desc: "Ricerca",
        icon: "icon-search",
        icon_big: "icon-dt_research"
    },
    {
        code: "2",
        desc: "Ideazione",
        icon: "icon-lightbulb_off",
        icon_big: "icon-dt_ideate"
    },
    {
        code: "3",
        desc: "Prototipo",
        // icon: "icon-mobile",
        icon: "icon-rocket",
        icon_big: "icon-dt_prototype"
    },
    {
        code: "4",
        desc: "Test",
        icon: "icon-clipboard",
        icon_big: "icon-dt_test"
    }
];
const designStatusMap = designStatusList.reduce(function(acc, item) {
    acc[item.code] = item;
    return acc;   
}, {});




/**
 * Contributors
 */


const getRandomStatus = (index) => {
    
    var listStatus = [
        {
            code: 1,
            status: "online",
            statusClass: "status_online"
        },
        {
            code: 2,
            status: "pause",
            statusClass: "status_pause"
        },
        {
            code: 3,
            status: "offline",
            statusClass: "status_offline"
        }
    ];

    index = index !== undefined ? index : Math.floor(Math.random() * 3);

    return listStatus[index];
};
let Contributor = ({ contributor }) => {
    return (
        <div className="contributor">
            <div className="label">
                {contributor.username}
            </div>
            <div className={`status ${contributor.statusClass}`}>
                {contributor.status}
            </div>
        </div>
    );
};
let ListContributors = ({ contributors }) => {

    let list = contributors
    .map(contributor => {
        let status = getRandomStatus();
        // console.log("contributor", contributor);
        if (contributor === "michele.castenetto") {
            status = getRandomStatus(0);
        }
        // console.log("status", status);
        return {
            username: contributor,
            status: status.status,
            statusClass: status.statusClass,
        }
    })
    .map( (contributor, index) => {
        return <Contributor 
            key={index}
            contributor={contributor}
        />
    });

    return (
        <div className="contributors_list">
            {list}
        </div>
    );
};


/**
 * Idea Infos
 */

let IdeaInfos = ({ idea }) => {

    var dt_create = "-";
    if (idea.dt_create) {
        var d = new Date(idea.dt_create);
        dt_create = `${d.getDay() < 10 ? "0" + d.getDay() : d.getDay()}-${d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1 }-${d.getFullYear()}`
    }

    var dt_update = "-";
    if (idea.dt_update) {
        var d = new Date(idea.dt_update);
        dt_update = `${d.getDay() < 10 ? "0" + d.getDay() : d.getDay()}-${d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1 }-${d.getFullYear()}`
    }

    return (
        <div className="idea_infos">

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
                    <span className="icon icon-calendar"></span>
                    <span>Created at</span>
                </div>
                <div className="box_value">
                    {dt_create}
                </div>
            </div>

            <div className="idea_info">
                <div className="box_label">
                    <span className="icon icon-calendar"></span>
                    <span>Last Update</span>
                </div>
                <div className="box_value">
                    {dt_update}
                </div>
            </div>

        </div>
    );
};


let IdeaControls = ({ idea, ideasStore, uiStore }) => {
    return (
        <div className="idea_controls">

        
            {/* <Button 
                className="big"
                handleClick={() => {
                    uiStore.showModal(<InsertTagForm 
                        handleInsert={(tag) => {
                            uiStore.hideModal();
                            ideasStore.handleAddIdeaTag(idea, tag);
                        }}
                    />, "modal_tag_insert");
                }}    
            >
                {"Add Tag"}
            </Button>

            <Button 
                className="big"
                handleClick={() => {
                    uiStore.showModal(<InsertTagForm />, "modal_tag_insert");
                }}    
            >
                {"Add Contributor"}
            </Button> */}


            <IconButton
                className="big"
                iconClassName="icon-bookmark"
                handleClick={() => {
                    uiStore.showModal(<InsertTagForm 
                        handleInsert={(tag) => {
                            uiStore.hideModal();
                            ideasStore.handleAddIdeaTag(idea, tag);
                        }}
                    />, "modal_tag_insert");
                }}
            />

            <IconButton
                className="big"
                iconClassName="icon-user-plus"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            />

            <IconButton
                className="big"
                iconClassName="icon-user-minus"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            />

            <IconButton
                className="big"
                iconClassName="icon-bin2"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            />

            <IconButton
                className="big"
                iconClassName="icon-file-pdf"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            />

            <IconButton
                className="big"
                iconClassName="icon-file-excel"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            /> 

            <IconButton
                className="big"
                iconClassName="icon-pie-chart"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            />  

            <IconButton
                className="big"
                iconClassName="icon-terminal1"
                handleClick={() => {
                    // ideasStore.handleAddContributor(idea.id);
                }}
            />  






        </div>
    );
};



/**
 * Status Control 
 */

let DesignStatusControl = ({ idea, handleClick }) => {
    return (
        <div className="design_status_control">

            <div className="status_controls">

                <div className={`design_status ${idea.status === 1 ? "active" : ""}`}>
                    <div className="card"
                        onClick={() => handleClick(idea, 1)}
                    >
                        <span className="icon-dt_research"></span>
                    </div>
                    <div className="label">
                        {"Ricerca"}
                    </div>
                </div>

                <div className={`design_status ${idea.status === 2 ? "active" : ""}`}>
                    <div className="card"
                        onClick={() => handleClick(idea, 2)}
                    >
                        <span className="icon-dt_ideate"></span>
                    </div>
                    <div className="label">
                        {"Ideazione"}
                    </div>
                </div>

                <div className={`design_status ${idea.status === 3 ? "active" : ""}`}>
                    <div className="card"
                        onClick={() => handleClick(idea, 3)}
                    >
                        <span className="icon-dt_prototype"></span>
                    </div>
                    <div className="label">
                        {"Prototipo"}
                    </div>
                </div>

                <div className={`design_status ${idea.status === 4 ? "active" : ""}`}>
                    <div className="card"
                        onClick={() => handleClick(idea, 4)}
                    >
                        <span className="icon-dt_test"></span>
                    </div>
                    <div className="label">
                        {"Test"}
                    </div>
                </div>

            </div>

            <div className="line"></div>

        </div>
    );
};


const getMessages = (number = 10) => {
    const messages = Array.from(Array(number).keys())
    .map((item, index) => {
        return <IdeaMessage 
            key={index}
            w={Math.floor(Math.random() * 3) + 1}
            l={Math.floor(Math.random() * 2)}
        />
    });
    return messages;
};


let BoardContentResearch = () => {
    
    const miroIframeString = '<iframe width="100%" height="100%" src="https://miro.com/app/live-embed/o9J_lW4TqyI=/?moveToViewport=-5874,-1973,13053,6370" frameBorder="0" scrolling="no" allowFullScreen></iframe>';



    return (
        <div className="board_content content_research">

            <div className="box_messages">
                {getMessages()}
            </div>

            <div className="box_integration">
                {htmlParse(miroIframeString)}
            </div>
            
        </div>
    );
}


let BoardContentIdeate = () => {

    const figmaFrameString = '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2F0G19yzVuYcCdKaurj7OKez%2FDev-Learning%3Fnode-id%3D0%253A1" allowfullscreen></iframe>';

    return (
        <div className="board_content content_ideate">

            <div className="box_messages">
                {getMessages()}
            </div>

            <div className="box_integration">
                {htmlParse(figmaFrameString)}
            </div>
            
        </div>
    );
}


let BoardContentPrototype = () => {
    
    // const codeSandBoxIframeString = `
    // <iframe src="https://codesandbox.io/embed/stoic-roentgen-b2f2z?fontsize=14&hidenavigation=1&theme=dark"
    //     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    //     title="stoic-roentgen-b2f2z"
    //     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    //     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    // ></iframe>
    // `;
    const codeSandBoxIframeString = `
    <iframe src="https://codesandbox.io/embed/pedantic-germain-kvj1j?fontsize=14&hidenavigation=1&theme=dark"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="pedantic-germain-kvj1j"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
    `;




    return (
        <div className="board_content content_prototype">

            <div className="box_messages">
                {getMessages()}
            </div>

            <div className="box_integration">
                {htmlParse(codeSandBoxIframeString)}
            </div>
            
        </div>
    );
}


let BoardContentTest = () => {

    return (
        <div className="board_content content_prototype">

            <div className="box_messages">
                {getMessages()}
            </div>

            <div className="box_integration">
                
            </div>
            
        </div>
    );
}


let BoardContent = ({ idea }) => {

    if(idea.status === 1) {
        return <BoardContentResearch />
    }
    if(idea.status === 2) {
        return <BoardContentIdeate />
    }
    if(idea.status === 3) {
        return <BoardContentPrototype />
    }
    if(idea.status === 4) {
        return <BoardContentTest />
    }
    return null;
};



let IdeaMessage = ({ message, w, l }) => {

    var className = `idea_message w${w} ${l===1 ? "l1": "" }`;

    return (
        <div className={className}>
            {/* <div className="message">
                {message.text}
            </div>
            <div className="username">
                {message.username}
            </div> */}
            <div className="text_line"></div>
            <div className="text_line"></div>
            <div className="text_line"></div>
        </div>
    );
};

let IdeaPost = () => {
    return (
        <div className="idea_post">
        </div>
    );
};













let View = ({BaseView, BaseHeader, Main, Footer, appstore}) => {

    const {ideasStore, routerStore, uiStore} = appstore;

    const idea = ideasStore.ideaDetail || {};
    // console.log("idea", idea);

    
    const statusDesc = (designStatusMap[idea.status] || {}).desc || "";
    // console.log("statusDesc", statusDesc);
    const statusIcon = (designStatusMap[idea.status] || {}).icon || "";


    let tags = (idea.tags || []).map( (tag, index) => {
        return <div key={index} className="tag">{tag.toUpperCase()}</div>
    });

    let contributors = idea.contributors || [];


    return (
        <div className={`ts_view ts_view__idea_detail`}>

            <BaseHeader>
                <HeaderContent />
            </BaseHeader>

            <Main>


                <SectionBase className="idea-section">

                    <HeaderSection
                        idea={idea}
                        ideasStore={ideasStore}
                    />


                    <SectionBase className="status-section">



                        <div className="col1">
                            {/* <TabDev></TabDev> */}

                            <TabBase
                                className="tab_status"
                                // titleIcon={""}
                                titleIcon={"icon-file-text"}
                                // titleText={""}
                                titleText={"Status"}
                                
                            >


                                <DesignStatusControl 
                                    idea={idea}
                                    handleClick={(idea, status) => ideasStore.updateIdeaDesignStatus(idea, status)}
                                />

                                <IdeaInfos 
                                    idea={idea}
                                />
                                
                                <IdeaControls 
                                    idea={idea}
                                    ideasStore={ideasStore}
                                    uiStore={uiStore}
                                />


                            </TabBase>
                        </div>

                        <div className="col2">
                            {/* <TabContributors /> */}

                            <TabBase
                                className="tags"
                                titleIcon={"icon-bookmark"}
                                titleText={"Tags"}
                            >
                                <div className="idea_tags">
                                    {tags}
                                </div>
                            </TabBase>

                        </div>

                        {/* icon-cogs */}
                        {/* icon-search */}
                        {/* icon-lightbulb_off */}
                        {/* icon-rocket */}
                        {/* icon-clipboard */}

                    </SectionBase>



                    <SectionBase className="main-section">

                        <div className="col1">
                            {/* <TabDev></TabDev> */}

                            <TabBase
                                className="tab_board"
                                titleIcon={statusIcon}
                                // titleText={"Board"}
                                titleText={statusDesc}
                            >

                                <BoardContent 
                                    idea={idea}
                                />

                            </TabBase>
                        </div>

                        <div className="col2">

                            <TabBase
                                className="contributors"
                                titleIcon={"icon-user"}
                                titleText={"Contributors"}
                            >

                                <ListContributors 
                                    contributors={contributors}
                                />
                                    
                                
                            </TabBase>

                        </div>

                    </SectionBase>


                </SectionBase>


                {/* <div dangerouslySetInnerHTML={{__html: miroIframeString}}/> */}

                {/* {htmlParse('<div>text</div>')} */}
                {/* {htmlParse(miroIframeString)} */}

            </Main>
            
            <Footer />

        </div>
    )
};
View = inject("appstore")(observer(View));


export default View;

