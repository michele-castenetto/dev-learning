import { observable, toJS, autorun, extendObservable, computed, action, decorate, runInAction } from 'mobx';


import { GUID } from "__src/libs/gutils.js";
import { HttpRequest } from "__src/libs/HttpRequest";


// const menu = require("__src/modules/menu.js");


class Store {
    
    constructor() {

        var _this = this;

        // config 
        this.config = {};
        this.configPath = "";
        
        // storage
        this.localStorage = null;
        this.sessionStorage = null;
        
        // api 
        this.api = null;

        // core stores
        this.languageStore = null;
        this.routerStore = null;
        this.authStore = null;
        this.uiStore = null;
        
        // domain stores
        this.ideasStore = null;

        
        extendObservable(this, {

            initialized: false,

            // menuItems: [],
            // nodes: [],
            // menuNodes: [],
            
            // node_selected: null,

            menuItems: [],

            isTabMenuOpen: false,

        });


    }


    /**
     * Tabs
     */


    toggleTabMenu(visible) {
        if (visible === true || visible === false) {} 
        else { visible = !this.isTabMenuOpen; }
        runInAction("AppStore.toggleTabMenu", () => { 
            this.isTabMenuOpen = visible; 
        });
    }

    
    /**
     * Cache
     */    
    //#region cache


    async getCachedData(id, modified) {
        const { config } = this;
        try {

            if ("caches" in window === false) { return false; }

            const appname = config.info.appname;
            let nameSpace = `${appname}_cache`;
            let cache = await caches.open(nameSpace);

            let cachedData = await cache.match(id);

            if (!cachedData) {
                return false;
            }
            
            cachedData = await cachedData.json();

            if (cachedData.modified < modified) {
                return false;
            }
            
            return cachedData.data;

        } catch (error) {
            throw error;
        }
    }


    async setCachedData(id, data, modified) {
        const { config } = this;
        try {

            if ("caches" in window === false) { return; }
            
            const appname = config.info.appname;
            let nameSpace = `${appname}_cache`;
            let cache = await caches.open(nameSpace);
            
            var cacheObj = {
                data: data,
                modified: modified
            };
            var cacheData = new Response(JSON.stringify(cacheObj), {
                headers: {
                    'content-type': 'application/json'
                }
            });
            cache.put(id, cacheData);

        } catch (error) {
            throw error;
        }
    }
    

    //#endregion cache




    /**
     * Menu
     */    
    //#region menu


    async loadMenuItems() {
        const { config, api } = this;
        try {
            const isDebugMode = config.settings.debug;

            let menuItems = [];
            const menuFilePath = `${appstore.datapath}/menu.json?${GUID.get()}`;

            try {
                menuItems = await HttpRequest.getjson(menuFilePath);
            } catch (error) {
                console.warn(`No manu file at ${menuFilePath}`);
            }

            if (isDebugMode) { console.log("menuItems", menuItems); }

            return menuItems;

        } catch (error) {
            throw error;
        }
    }
    
    setMenuItems(menuItems) {
        runInAction(() => {
            this.menuItems = menuItems;
        });
    }

    // buildMenu() {

    //     const nodes = menu.parseNodes(this.menuItems);
    //     this.nodes = nodes;

    //     const menuNodes = menu.buildTreeNodes(nodes);
    //     this.menuNodes = menuNodes;
        
    // }

    // selectMenuNode(id) {
        
    //     if (this.node_selected) { this.node_selected.toggleSelect(false); }

    //     const node = this.nodes.findOne(n => n.id === id);
    //     if (!node) { return; }
        
    //     node.toggleSelect(true);
    //     runInAction(() => {
    //         this.node_selected = node;
    //     });
        
    // }


    // expandMenuNode(id) {
    //     let node = this.nodes.findOne({ id: id });
    //     if (!node) { return; }
    //     node.toggleExpand();
    // }


    //#endregion menu

    

    /**
     * Version
     */


    init() {
        runInAction(() => {
            this.initialized = true;
        });
    }
    

    resetStores() {
        this.languageStore.resetStore();
        this.authStore.resetStore();
        
        this.ideasStore.resetStore();
            
    }

    
    setConfig(config) { this.config = config; }
    getConfig() { return this.config; }
    
}


export default Store;