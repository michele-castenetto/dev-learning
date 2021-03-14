import {observable, extendObservable, action, runInAction, autorun  } from 'mobx';


import React from 'react';
import AlertContent from '__src/components/alert/alert.jsx';
import ConfirmContent from '__src/components/alert/confirm.jsx';

import Loadable from 'react-loadable';
import Loading from '__src/components/loading/Loading.jsx';


const LoadingBase = () => <div>Loading ...</div>;
const LoadingCustom = ({type}) => <Loading type={type} isLoading={true}/>;


import { GUID } from "__src/libs/gutils.js";
import { HttpRequest } from "__src/libs/HttpRequest";




// ##TODO da config ???
export const ENUMScreenType = {
    MOBILE: { value: "MOBILE", limit_down: "", limit_up: "767" },
    SMALL: { value: "SMALL", limit_down: "768", limit_up: "1023" },
    MEDIUM: { value: "MEDIUM", limit_down: "1024", limit_up: "1439" },
    LARGE: { value: "LARGE", limit_down: "1440", limit_up: "" }
};


class Store {
    
    constructor(appstore) {
        const _this = this;

        this.appstore = appstore;

        
        extendObservable(this, {
            
            views: {},

            isLoading: false,
            loadingUIType: 4,

            screen_type: null,

            isMainMenuOpen: true,

            
            isFullScreen: true,

            
            // ##TODO capire come gestire
            modal: {
                isOpen: false,
                content: "",
                className: ""
            },

            // dialog: new Dialog()
            dialog: {
                isOpen: false,
                params:{}
            }

        });
        

        // document.addEventListener('keyup', function(event) {
        //     if (event.key == "l") {
        //         _this.toggleLoading();
        //     }
        // });

        window.addEventListener("resize", function() {
            _this.setScreenType(window.innerWidth, window.innerHeigth);

        });

        this.setScreenType(window.innerWidth, window.innerHeigth);

    }



    /**
     * Tabs
     */
    //#region tabs


    // ##OLD ##TODO lavora su un indice per rimanere generica
    // toggleSidebarItem(index, visible) {
    //     const itemVisible = this.sidebarItemsOpen[index] !== undefined ? this.sidebarItemsOpen[index] : true;
    //     if (visible === true || visible === false) {} else { visible = !itemVisible; }
    //     runInAction(() => {
    //         this.sidebarItemsOpen[index] = visible;
    //     });
    // }

    
    //#endregion tabs




    async loadViews() {
        const {appstore: { config, api } } = this;
        try {
            const _this = this;
            const isDebugMode = config.settings.debug;

            let viewList = [];
            const viewsFilePath = `${appstore.datapath}/views.json?${GUID.get()}`;
            
            try {
                viewList = await HttpRequest.getjson(viewsFilePath);
            } catch (error) {
                console.warn(`No views file at ${viewsFilePath}`);
            }

            if (isDebugMode) { console.log("viewList", viewList); }

            viewList = viewList.filter( view => {
                return view.active !== false;
            });

            const LoadingComp = (props) => {
                if (props.error) {
                    console.log(props.error);
                    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
                } else {
                    return <div>Loading ...</div>;
                }
            }

            const views = viewList.reduce( (acc, view) => {
                
                acc[view.name] = Loadable({
                    loader: () => import(/* webpackChunkName: "[request]" */ `${view.path}`),
                    // loading: () => <LoadingCustom type={_this.loadingUIType}/>
                    // loading: () => <div>Loading ...</div>
                    loading: LoadingComp
                });

                return acc;

            }, {});

            if (isDebugMode) { console.log("views", views); }

            return views;

        } catch (error) {
            throw error;
        }
    }


    setViews(views) {
        runInAction( () => {
            this.views = views;
        });
    }
    


    toggleDialog(isOpen, params) {
        runInAction( () => {
            if (params) {
                this.dialog.params = params;
            }
            if (isOpen) {
                this.dialog.isOpen = isOpen;
            } else {
                this.dialog.isOpen = !this.dialog.isOpen;
            }
        });
    }


    setLoadingUIType(loadingUIType) {
        runInAction( () => {
            this.loadingUIType = loadingUIType;
        });
    }
    

    setScreenType(width, height) {
        if ( width <= ENUMScreenType.MOBILE.limit_up ) {
            this.screen_type = ENUMScreenType.MOBILE;
        } else if( width <= ENUMScreenType.SMALL.limit_up ) {
            this.screen_type = ENUMScreenType.SMALL;
        } else if( width <= ENUMScreenType.MEDIUM.limit_up ) {
            this.screen_type = ENUMScreenType.MEDIUM;
        } else {
            this.screen_type = ENUMScreenType.LARGE;
        }
    }


    toggleLoading(visible) {
        if (visible === true || visible === false) {} 
        else { visible = !this.isLoading; }
        runInAction( () => {
            this.isLoading = visible;
        });
    }


    toggleMenu(isOpen) {
        if (isOpen === true || isOpen === false) {} 
        else { isOpen = !this.isMainMenuOpen; }
        runInAction( () => {
            this.isMainMenuOpen = isOpen;
        });
    }


    showModal(content, className) {
        runInAction("UiStore.showModal", ()=> {
            this.modal.content = content;
            this.modal.className = className;
            this.modal.isOpen = true;
        });
    }
    

    hideModal() {
        runInAction("UiStore.hideModal", ()=> {
            this.modal.isOpen = false;
        });
    }
    

    // ##OLD
    // alert(text) {
    //     const modal = this.modal;
    //     modal.setContent(<AlertContent />, { text: text });
    //     modal.open();
    // }
    // confirm(text, callback) {
    //     const modal = this.modal;
    //     modal.setContent(<ConfirmContent />, { text: text , callback: callback});
    //     modal.open();
    //     return modal;
    // }

    
    alert(text) {
        const {appstore: { languageStore } } = this;
        text = (text || "").toString();
        this.showModal(<AlertContent 
            text={text} 
            closeText={"Chiudi"}
            handleClose={() => this.hideModal()}
        />, 'ts_modal_alert')
    };


    warning(text) {
        const {appstore: { languageStore } } = this;
        text = (text || '').toString();
        this.showModal(<AlertContent
            icon="report_problem"
            text={text} 
            closeText={"Chiudi"}
            handleClose={() => this.hideModal()}
        />, 'ts_modal_warning')
    };

    
    confirm(text, handleConfirm, handleCancel) {
        const {appstore: { languageStore } } = this;
        text = (text || '').toString();
        this.showModal(<ConfirmContent 
            text={text} 
            confirmText={"Conferma"}
            cancelText={"Annulla"}
            handleConfirm={() => { 
                this.hideModal(); 
                if (handleConfirm) { handleConfirm(); }
            }}
            handleCancel={() => {  
                this.hideModal();
                if (handleCancel) { handleCancel(); }
            }}
        />, 'ts_modal_confirm')
    };


}


export default Store;
