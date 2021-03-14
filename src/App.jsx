import React from "react";
import { observer, inject } from 'mobx-react';

import DevTools from 'mobx-react-devtools';

import ReactTooltip from "react-tooltip";

import Loading from '__src/components/loading/Loading.jsx';
import Modal from '__src/components/modal/modal.jsx';


class App extends React.Component {

    constructor(props) {
        super(props);
    }

    
    render() {
        
        const { appstore, appstore: {languageStore, routerStore, uiStore} } = this.props;

        const ViewComponent = routerStore.currentViewComponent;

        const {BaseView, HomeView, BaseHeader, HomeHeader, Main, Footer, TabMenu} = this.props;
        
        const loadingUIType = uiStore.loadingUIType;

        if (!appstore.initialized) {
            return <Loading type={loadingUIType} isLoading={true} />
        }

        return (
            <React.Fragment>
                
                <TabMenu />

                <ReactTooltip />

                {
                    appstore.initialized && appstore.config.settings.debug ? <DevTools /> : null 
                }

                <Modal 
                    handleCloseModal={ () => uiStore.hideModal()}
                    isOpen={uiStore.modal.isOpen}
                    content={uiStore.modal.content}
                    className={uiStore.modal.className}
                />

                <Loading type={loadingUIType} isLoading={appstore.uiStore.isLoading} />
                
                {ViewComponent ? <ViewComponent 
                    BaseView={BaseView}
                    HomeView={HomeView}
                    BaseHeader={BaseHeader}
                    HomeHeader={HomeHeader}
                    Main={Main}
                    Footer={Footer}
                /> : null} 


            </React.Fragment>
        );
    }

}


App = inject("appstore")(observer(App));


export default App;


