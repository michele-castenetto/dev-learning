import Storage from '__src/libs/storage.js';
// import Api from '__src/modules/api.js';


import { GUID } from "__src/libs/gutils.js";
import { HttpRequest } from "__src/libs/HttpRequest";


// views applicazione
import getViews from '__src/views.js';



// store applicazione
import appstore from '__src/stores.js';
const {
    languageStore, routerStore, authStore, uiStore,
} = appstore;

// ##DEBUG
window.appstore = appstore;



const init = async function() {
    try {
        
        // # Read config
        let configPath = "./config/";
        let config = await HttpRequest.getjson(`${configPath}config.json?${GUID.get()}`);
        if (config.configPath) {
            configPath = config.configPath;
            config = await HttpRequest.getjson(`${configPath}config.json?${GUID.get()}`);
        }
        appstore.config = config;
        appstore.configPath = configPath;

        const isDebugMode = config.settings.debug;
        console.log("isDebugMode", isDebugMode);
        
        if (isDebugMode) { console.log("config", config); }
        
        // # Set data path
        const datapath = config.settings.datapath || "./data/";
        appstore.datapath = datapath;


        const views = getViews();

        if (isDebugMode) { console.log("views", views); }

        
        // # Menu

        const menuItems = await appstore.loadMenuItems();
        appstore.setMenuItems(menuItems);
        
        // # Init api
        // const api = new Api(config.services.api);
        // appstore.api = api;


        // # Init storages

        const namespace = `${config.info.appname}`;  

        const localStorage = new Storage({
            type: Storage.TYPES.LOCAL_STORAGE,
            namespace: namespace
        });
        appstore.localStorage = localStorage;

        const sessionStorage = new Storage({
            type: Storage.TYPES.SESSION_STORAGE,
            namespace: namespace
        });
        appstore.sessionStorage = sessionStorage;

        
        // # Init auth store
        
        // authStore.onLoginAction = async function() {

        //     routerStore.changePath('/home');
            
        //     // change language 
        //     // const language = authStore.sessioninfo.language;
        //     // languageStore.changeLanguage(language);
            
        // };

        // authStore.onLogoutAction = async function() {

        //     routerStore.changePath('/login');

        //     // const language = authStore.sessioninfo.language;
        //     // languageStore.changeLanguage(language);
                                    
        // };

        // await authStore.init();



        // # Init language store

        // const language = authStore.sessioninfo.language;
        // await languageStore.init(language);        
        // languageStore.changeLanguage(language);

        // languageStore.onChangeLanguageAction = function() {
        //     catalogoStanzaStore.load(config.catalogo && config.catalogo.navigatoreStanzaId || "");
        // };


        // # Init router store
        const routes = await routerStore.loadRoutes();
        const { historyType, routebasepath } = config.settings;
        routerStore.init(routes, views, historyType, routebasepath);
        

        
        // if (!authStore.logged) { 
            
        //     const route = routerStore.route;

        //     if (!route || !route.allowNotLogged ) {
        //         routerStore.execChangePath("login"); 
                
        //     }

        // } 



        // # Init menu 
        // ##TODO reperire il menu dinamicamente ?
        // const menuItems = await appstore.loadMenuItems();
        // appstore.setMenuItems(menuItems);
        // appstore.buildMenu();


        appstore.init();
        
        
        return appstore;
        
    } catch (error) {
        throw error;
    }

}


export default init;
