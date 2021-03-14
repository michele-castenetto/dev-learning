import { observable, extendObservable, action, runInAction, autorun, computed, toJS } from 'mobx';


import uuid from "react-uuid";


var _getUrlVars = function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};


class Store {

    constructor(appstore) {

        this.appstore = appstore;

        extendObservable(this, {

            ideas: [],
            ideaDetail: null,
            
        });

    }

    resetStore() {
        runInAction("IdeasStore.resetStore", () => {
            this.ideas = [];
            this.ideaDetail = null;
        });
    }




    


    async routeInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getIdeas();
            uiStore.toggleLoading(false);


        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async routeIdeaDetailInit() {
        try {
            
            var queryparams = _getUrlVars();
            console.log("queryparams", queryparams);
            
            let id = queryparams.id || "";
            if (!id) {
                return;
            }

            const idea = await this.getIdea(id);
            console.log("idea", idea);
            runInAction("IdeasStore.routeIdeaDetailInit", () => {
                this.ideaDetail = idea;
            });

        } catch (error) {
            throw error;
        }
    }

    
    async getIdeas() {
        const { appstore } = this;
        const { wsInterface } = appstore;
        try {

            let ideas = await wsInterface.getIdeas();
            ideas = ideas.map(idea => {
                idea._menuEnabled = false;
                return idea;
            });


            runInAction("IdeasStore.getIdeas", () => {
                this.ideas = ideas;
            });

            return ideas;

        } catch (error) {
            throw error;
        }
    }

    async getIdea(id) {
        const { appstore } = this;
        const { wsInterface } = appstore;
        try {

            const response = await wsInterface.getIdea(id);
            
            return response;

        } catch (error) {
            throw error;
        }
    }

    async insertIdea(id, idea) {
        const { appstore } = this;
        const { wsInterface } = appstore;
        try {
            
            const response = await wsInterface.insertIdea(id, idea);

            console.log("response", response);

            return response;

        } catch (error) {
            throw error;
        }
    }

    async updateIdea(id, idea) {
        const { appstore } = this;
        const { wsInterface } = appstore;
        try {

            const response = await wsInterface.updateIdea(id, idea);

            return response;

        } catch (error) {
            throw error;
        }
    }

    async deleteIdea(id) {
        const { appstore } = this;
        const { wsInterface } = appstore;
        try {

            const response = await wsInterface.deleteIdea(id);

            return response;

        } catch (error) {
            throw error;
        }
    }



    async handleInsertIdea(idea) {
        const { appstore } = this;
        const { wsInterface, uiStore } = appstore;
        try {

            uiStore.hideModal();

            const id = uuid();

            await this.insertIdea(id, idea);

            this.getIdeas();

            uiStore.alert("Inserimento riuscito");

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }



    async handleUpdateIdea(id, idea) {
        const { appstore } = this;
        const { wsInterface, uiStore } = appstore;
        try {

            uiStore.hideModal();

            await this.updateIdea(id, idea);

            this.getIdeas();

            uiStore.alert("Aggiornamento riuscito");

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async handleDeleteIdea(id) {
        const { appstore } = this;
        const { wsInterface, uiStore, routerStore } = appstore;
        try {

            uiStore.hideModal();

            uiStore.confirm("Sei sicuro di voler eliminare questa idea ?", async () => {

                await this.deleteIdea(id);

                this.getIdeas();

                routerStore.execChangePath("/ideas");

                // uiStore.alert("Idea eliminata");

            });

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    

    toggleIdeaMenu(idea, enabled) {
        if (enabled === true || enabled === false) {} else {
            enabled = !idea._menuEnabled; 
        }
        runInAction(() => {
            idea._menuEnabled = enabled;
        });
    }



    async updateIdeaDesignStatus(idea, status) {
        const { appstore } = this;
        const { wsInterface, uiStore, routerStore } = appstore;
        try {

            const ideaUpdated = Object.assign({}, idea, {
                status: status
            });

            const response = await this.updateIdea(idea.id, ideaUpdated);

            // console.log("response", response);

            await this.routeIdeaDetailInit();
            // await this.getIdeas();

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    };


    async handleAddIdeaTag(idea, tag) {
        const { appstore } = this;
        const { wsInterface, uiStore, routerStore } = appstore;
        try {

            const ideaUpdated = Object.assign({}, idea, {
                tags: idea.tags.concat([tag])
            });

            const response = await this.updateIdea(idea.id, ideaUpdated);

            console.log("response", response);

            await this.routeIdeaDetailInit();
            // await this.getIdeas();
            
        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    };


    
}


export default Store;

