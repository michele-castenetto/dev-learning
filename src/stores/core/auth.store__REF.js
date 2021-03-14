import { observable, extendObservable, action, runInAction, autorun, toJS } from 'mobx';




class Store {

    constructor(appstore) {

        this.appstore = appstore;
        this.api = null;

        this.onLoginAction = null;
        this.onLogoutAction = null;

        extendObservable(this, {

            token: null,
            logged: false,
            sessioninfo: null,
            autorizzazioni: null
            
        });

    }


    resetStore() {
        runInAction("authStore.resetStore", () => {
            this.token = null;
            this.logged = false;
            this.sessioninfo = null;
            this.autorizzazioni = {};
        });
    }



    setToken(token) {
        runInAction(() => {
            this.token = token;
        });
    }
    setLogged(logged) {
        runInAction(() => {
            this.logged = logged;
        });
    }
    setSessionInfo(sessioninfo) {
        runInAction(() => {
            this.sessioninfo = sessioninfo;
        });
    }
    setAutorizzazioni(autorizzazioni) {
        runInAction(() => {
            this.autorizzazioni = autorizzazioni;
        });
    }


    
    async checkLogged() {
        const { uiStore, languageStore, appstore : { api, config } } = this;
        try {

            let response = await api.checkLogged();
            const logged = response.data.logged;
            this.setLogged(logged);

        } catch (error) {
            throw error;
        }
    }
    async getSessionInfo() {
        const { uiStore, languageStore, appstore : { api, config } } = this;
        try {

            const response = await api.getSessionInfo();
            const sessioninfo = response.data.sessioninfo;
            this.setSessionInfo(sessioninfo);

        } catch (error) {
            throw error;
        }
    }
    async getAuthorizations() {
        const { uiStore, languageStore, appstore : { api, config } } = this;
        try {

            const response = await api.getAutorizzazioni();
            const autorizzazioni = response.data.autorizzazioni;
            this.setAutorizzazioni(autorizzazioni);

        } catch (error) {
            throw error;
        }
    }


    async init() {
        const { uiStore, languageStore, appstore : { api, localStorage, config } } = this;
        try {
            
            const isDebugMode = config.settings.debug;
            
            // search for user token in localStorage and check if still valid 
            let token = localStorage.get("token");   
            token = token || "";
            api.setToken(token);
            const response = await api.getToken();
            if (response.status === "OK") {
                token = response.data.token;
                api.setToken(token);
            }
            if (isDebugMode) { console.log("token", token); }
            this.setToken(token);
            localStorage.set("token", token);
            
            // check if user is logged and set user session info and authorizations
            await this.checkLogged();
            if (isDebugMode) { console.log("logged", this.logged); }
            await this.getSessionInfo();
            if (isDebugMode) { console.log("sessioninfo", toJS(this.sessioninfo) ); }
            await this.getAuthorizations();
            if (isDebugMode) { console.log("autorizzazioni", toJS(this.autorizzazioni) ); }

        } catch (error) {
            throw error;
        }
    }


    async login(username, password, remember) {
        
        const { appstore } = this;
        const { api, localStorage, sessionStorage, routerStore, uiStore, languageStore, catalogoStore, carrelloStore, carrelloStanzaStore } = appstore;
        
        try {

            const response = await api.login(username, password);
            
            if (response.status === "ERROR") { return uiStore.alert(response.message);}

            this.setLogged(true);

            await this.getSessionInfo();
            await this.getAuthorizations();

            // ##TODO da spostare in onLoginAction ???
            // impostazione lingua 
            const language = this.sessioninfo.language;
            languageStore.changeLanguage(language);

            if (this.onLoginAction) { this.onLoginAction(); }

        } catch (error) {
            uiStore.alert(error);
            throw error;
        }
    }


    async logout() {
        try {

            const { appstore } = this;
            const { api, localStorage, sessionStorage, languageStore, routerStore, catalogoStore, carrelloStore, carrelloStanzaStore } = appstore;

            let response = await api.logout();

            routerStore.changePath("/");

            appstore.resetStores();

            this.setLogged(false);

            await this.getSessionInfo();
            await this.getAuthorizations();
            // impostazione lingua 
            const language = this.sessioninfo.language;
            languageStore.changeLanguage(language);

            if (this.onLogoutAction) { this.onLogoutAction(); }

        } catch (error) {
            throw error;
        }
    }




}


export default Store;