

import { observable, extendObservable, action, runInAction, autorun, toJS } from 'mobx';


// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');


import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';



class Store {

    constructor(appstore) {

        this.appstore = appstore;
        this.api = null;

        this.onLoginAction = null;
        this.onLogoutAction = null;





        extendObservable(this, {

            app: null,
            auth: null,
            user: null,
            logged: false,



            sessioninfo: null,
            autorizzazioni: null
            
        });

    }


    resetStore() {
        runInAction("FirebaseStore.resetStore", () => {
            
            this.app = null;
            this.auth = null;
            this.user = null;
            this.logged = false;


            this.sessioninfo = null;
            this.autorizzazioni = {};
        });
    }


    init() {
        try {
            const _this = this;

            var firebaseConfig = {
                apiKey: "AIzaSyDwz24fxQ56SDXQSViQrYmaOKMhbH4hrwY",
                authDomain: "dev-learning-12502.firebaseapp.com",
                databaseURL: "https://dev-learning-12502-default-rtdb.europe-west1.firebasedatabase.app",
                projectId: "dev-learning-12502",
                storageBucket: "dev-learning-12502.appspot.com",
                messagingSenderId: "348237722637",
                appId: "1:348237722637:web:7cd5be2c5d53aa9dd49144",
                measurementId: "G-8WKLML219F"
              };
            

            var app = firebase.initializeApp(firebaseConfig);
            this.app = app;
            console.log("app", app);

            const auth = firebase.auth();
            this.auth = auth;
            
            auth.onAuthStateChanged( user => {
                console.log("user", user);

                if (user) {
                    runInAction("FirebaseStore.onAuthStateChanged", () => {
                        _this.logged = true;
                        _this.user = user;
                    });
                } else {
                    runInAction("FirebaseStore.onAuthStateChanged", () => {
                        _this.logged = false;
                        _this.user = null;
                    });
                }

            });


        } catch (error) {
            throw error;
        }
    }


    async login(username, password) {
        try {
            
            try {
                // await this.auth.signInWithEmailAndPassword("michele.castenetto@gmail.com", "test55");
                await this.auth.signInWithEmailAndPassword(username, password);
            } catch (error) {
                console.log("error", error);
                alert(error.message);

            }

            
        } catch (error) {
            throw error;
        }
    }


    async logout() {
        try {
            
            await this.auth.signOut();
            
        } catch (error) {
            throw error;
        }
    }

    


    async register(username, password) {
        try {
            
            const result = await this.auth.createUserWithEmailAndPassword(username, password);
            console.log("result", result);

        } catch (error) {
            throw error;
        }
    }


    



    // setToken(token) {
    //     runInAction(() => {
    //         this.token = token;
    //     });
    // }
    setUserId(userId) {
        runInAction(() => {
            this.userId = userId;
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
    // ##TODO
    // async getSessionInfo() {
    //     const { uiStore, languageStore, appstore : { api, config } } = this;
    //     try {

    //         const response = await api.getSessionInfo();
    //         const sessioninfo = response.data.sessioninfo;
    //         this.setSessionInfo(sessioninfo);

    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // ##TODO
    // async getAuthorizations() {
    //     const { uiStore, languageStore, appstore : { api, config } } = this;
    //     try {

    //         const response = await api.getAutorizzazioni();
    //         const autorizzazioni = response.data.autorizzazioni;
    //         this.setAutorizzazioni(autorizzazioni);

    //     } catch (error) {
    //         throw error;
    //     }
    // }


    // async init() {
    //     const { uiStore, languageStore, appstore : { api, localStorage, config } } = this;
    //     try {
            
    //         const isDebugMode = config.settings.debug;
            
    //         // search for user token in localStorage and check if still valid 
    //         let token = localStorage.get("token");   
    //         token = token || "";
    //         api.setToken(token);
    //         const response = await api.getToken();
    //         if (response.status === "OK") {
    //             token = response.data.token;
    //             api.setToken(token);
    //         }
    //         if (isDebugMode) { console.log("token", token); }
    //         this.setToken(token);
    //         localStorage.set("token", token);
            
    //         // check if user is logged and set user session info and authorizations
    //         await this.checkLogged();
    //         if (isDebugMode) { console.log("logged", this.logged); }
    //         await this.getSessionInfo();
    //         if (isDebugMode) { console.log("sessioninfo", toJS(this.sessioninfo) ); }
    //         await this.getAuthorizations();
    //         if (isDebugMode) { console.log("autorizzazioni", toJS(this.autorizzazioni) ); }

    //     } catch (error) {
    //         throw error;
    //     }
    // }





    async login__REF(username, password, remember) {
        
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








}


export default Store;