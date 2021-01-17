import {observable, extendObservable, action, runInAction, autorun, computed, toJS  } from 'mobx';


import { GUID } from "__src/libs/gutils.js";
import { HttpRequest } from "__src/libs/HttpRequest";


import catalogoStanzaModule from "__src/modules/catalogoStanza.js";
const  { parseNodes, buildTreeNodes, CatalogoNode, CatalogoItem } = catalogoStanzaModule;


const _encodeUrl = function(url) {
    var fileStart = url.lastIndexOf('/') + 1;
    var fileName = url.substring(fileStart);
    fileName = encodeURIComponent(fileName);
    var filePath = url.substring(0, fileStart);
    return filePath + fileName;
};



class Store {
    
    constructor(appstore) {

        this.appstore = appstore;

        this.appViewer = null;
        
        // map with additional items local data
        this.itemsDataMap = {};

        // Local Catalog fields (catalog from local json)
        this.nodesLocal = [];
        this.itemsLocal = [];
        this.itemsLocalMap = {};


        extendObservable(this, {
            

            // catalogo stanza json locale
            catalogoStanzaLocal: {
                articoli: []
            },
            
            
            // catalogo
            navigatori: [],
            navigatore_selected: null,
            albero_navigatore: [],
            nodes: [],
            treenodes: [],
            node_selected: null,
            items: [],
            item_selected: null,


            // ##OLD
            // Gestione catalogo local, aggiunge al catalogo remoto nodi impostati da json locale 
            // catalogoNodesLocal: null,







        });


        /**
         * Autoruns
         */
        //#region catalogo_autoruns


        // sync tra la scelta del navigatore e l'albero relativo
        autorun(async () => {
        
            if (!appstore.initialized ) { return; }
            
            const navigatore_selected = this.navigatore_selected;

            // console.log("navigatore_selected", navigatore_selected);

            if (!navigatore_selected) { return; }

            await this.getAlberoNavigatore(navigatore_selected.c_navigatore);

        });


        // sync tra albero navigatore e la costruzione della treeview
        autorun(async () => {
            
            // console.log("Sync this.alberoNavigatore <--> this.treenodes");

            if (!appstore.initialized ) { return; }
            
            if (!this.navigatore_selected) { return; }

            let albero_navigatore = this.albero_navigatore || [];

            let nodes = parseNodes(albero_navigatore);

            let nodesLocal = this.parseNodesLocal();

            nodes = nodesLocal.concat(nodes);

            // if (this.catalogoNodesLocal) {
            //     // console.log("nodes", nodes);
            //     // console.log("this.catalogoNodesLocal", this.catalogoNodesLocal.slice());
            //     nodes = this.catalogoNodesLocal.concat(nodes);
            // }

            runInAction(() => {

                // ##OLD
                // this.nodes = parseNodes(albero_navigatore);
                this.nodes = nodes;
                
                // this.nodes.forEach(n => {
                //     if (n.id_father === null) {
                //         n.isExpanded = true;
                //     }
                // });

                this.treenodes = buildTreeNodes(this.nodes);


                if (!this.nodes.length) { return; }
                // this.node_selected = this.nodes[0];

                // ##OLD è sbagliato perchè seleziona il primo nodo dell'array piatto e non della struttura ad albero
                // se si vuole la selezione sull'albero bisognerebbe aprire il primo ramo ed selezionare l'ultimo suo pronipote
                // this.node_selected = this.nodes[0];
                
            });


            // ##TODO capire perche non funziona        
            // let node = nodes.findOne({ id: this.node_selected });
            // if (node) { node.select(); }

        });


        // sync tra il nodo selezionato ed i suoi items
        autorun(async () => {
        
            if (!appstore.initialized ) { return; }
            
            if (!this.navigatore_selected) { return; }

            const node_selected = this.node_selected;

            if (!node_selected) { return; }

            if (node_selected.local) {
                runInAction(() => {
                    this.items = node_selected.items;
                    this.itemsVisible = this.items;
                });
            } else {
                await this.getNodeItems(node_selected.id);
            }


        });


        //#endregion catalogo_autoruns



    }


    resetStore() {
        runInAction("catalogoStanzaStore.resetStore", () => {
            this.navigatori = [];
            this.navigatore_selected = null;
            this.albero_navigatore = [];
            this.nodes = [];
            this.treenodes = [];
            this.node_selected = null;
            this.items = [];
            this.item_selected = null;
            // this.catalogoNodesLocal = null;


            this.itemsDataMap = {};

            // Catalogo local fields
            this.nodesLocal = [];
            this.itemsLocal = [];
            this.itemsLocalMap = {};
        });
    }



    /**
     * Api Methods
     */
    //#region api


    async getNavigatori() {
        const {appstore: { api, uiStore, routerStore } } = this;
        try {
            
            let response = await api.getNavigatori();

            if (response.status === "ERROR") { return uiStore.alert(response.message);}

            const navigatori = response.data.navigators;

            runInAction(() => {
                this.navigatori = navigatori;
            });

        } catch (error) {
            uiStore.alert(error);
            console.log(error);
            throw error;
        }
    }


    async getAlberoNavigatore(c_navigatore) {
        const {appstore: { api, uiStore, routerStore } } = this;
        try {
            
            let response = await api.getAlberoNavigatore(c_navigatore);

            if (response.status === "ERROR") { return uiStore.alert(response.message);}

            const albero_navigatore = response.data.navigatorTree;

            runInAction(() => {
                this.albero_navigatore = albero_navigatore;
            });
            
        } catch (error) {
            uiStore.alert(error);
            console.log(error);
            throw error;
        }
    }


    async getNodeItems(id_nodo) {
        const {appstore: { api, uiStore, routerStore } } = this;
        try {
            
            let response = await api.getNodeItems(id_nodo);

            if (response.status === "ERROR") { return uiStore.alert(response.message);}
            
            const items = response.data.items;

            runInAction(() => {
                this.items = items;
                this.itemsVisible = this.items;
            });

        } catch (error) {
            uiStore.alert(error);
            console.log(error);
            throw error;
        }
    }


    async getNodeMedia(c_classificazione) {

        const {appstore: { config, api, uiStore, routerStore } } = this;

        try {
            
            const { catalogo } = config;
            const { tipologieDati } = catalogo;

            const mediaMap = ( (tipologieDati || {}).catalogo || {} ).media || {};

            const filtroTipologiaMedia = Object.keys(mediaMap).map(key => mediaMap[key]);

            let response = await api.getNodeMedia(c_classificazione, filtroTipologiaMedia);

            if (response.status === "ERROR") { return uiStore.alert(response.message);}

            const nodeMedia = response.data.media;

            return nodeMedia;

        } catch (error) {
            console.log(error);
            uiStore.alert(error);
            throw error;
        }
    }


    //#endregion api

    


    /**
     * Computed
     */
    //#region computed


    get itemsList() {

        const { items, articlesData } = this;
        
        const itemsList = items.map( item => {

            const itemData = this.itemsDataMap[item.c_item] || {};
            
            // Eventualmente sovrascrive le informazioni del nodo con quelle contenute nell'itemData
            const c_articolo = itemData.c_articolo || item.c_item; 
            const ds_articolo = itemData.ds_articolo || item.ds_descrizione_lingua || item.ds_item || item.c_item;
            const ds_articolo2 = itemData.ds_item2 || "";
            const c_famiglia = itemData.c_famiglia || item.c_famiglia || null;
            const c_modello = itemData.c_modello || item.c_modello || null;
            const variantiScelte = itemData.variantiScelte || [];
            const imageUrl = _encodeUrl(itemData.imageUrl || item.imageUrl || "");
            const fg_manuale = itemData.fg_manuale !== undefined ? itemData.fg_manuale : item.fg_manuale;
            const configData = itemData.configData || item.configData;


            return {
                
                c_articolo: c_articolo,
                ds_articolo: ds_articolo,
                ds_articolo2: ds_articolo2,
                c_famiglia: c_famiglia,
                c_modello: c_modello,

                imageUrl: imageUrl,

                variantiScelte: variantiScelte,
                
                // Flag per identidicare articoli gemo(=0) 0 composizione(=1)
                fg_manuale: fg_manuale,
                // Configurazione delle composizioni
                configData: configData,
                // Configurazione delle composizioni ? (a cosa serve questo campo ?)
                configurazione: item.configurazione, 
                
                sigla_dim_1: item.ds_dim1 || item.sigla_dim_1,
                n_dim_1: item.n_dim_1,
                sigla_dim_2: item.ds_dim2 || item.sigla_dim_2,
                n_dim_2: item.n_dim_2,
                sigla_dim_3: item.ds_dim3 || item.sigla_dim_3,
                n_dim_3: item.n_dim_3

            }

        });

        return itemsList;

    }



    //#endregion computed




    /**
     * Catalogo actions
     */
    //#region actions
    

    selectNavigatore(navigatore) {
        runInAction(() => { this.navigatore_selected = navigatore; });
    }
    selectNavigatoreById(c_navigatore) {
        const navigatore = this.navigatori.findOne(n => n.c_navigatore === c_navigatore);
        if (!navigatore) { 
            return console.warn(`No navigator with c_navigator: ${c_navigatore}`); 
        }

        this.selectNavigatore(navigatore);

    }


    selectCatalogoNode(id) {
        
        if (this.node_selected) { this.node_selected.toggleSelect(false); }

        const node = this.nodes.findOne(n => n.id === id);
        if (!node) { return; }
        
        node.toggleSelect(true);
        runInAction(() => {
            this.node_selected = node;
        });
        
    }


    expandCatalogoNode(id) {
        let node = this.nodes.findOne({ id: id });
        if (!node) { return; }
        node.toggleExpand();
    }


    //#endregion actions
    




    /**
     * Catalogo load
     */
    //#region load


    // ##OLD
    async loadLocal__OLD() {
        const { appstore } = this;
        const { config, api, uiStore, routerStore } = appstore;
        try {
            
            // console.log("################ loadLocal #############");

            const datapath = config.settings.datapath;
            
            let catalogoFilePath = `${datapath}/catalogo.json?${GUID.get()}`;
            let catalogoNodes = [];
            try {
                catalogoNodes = await HttpRequest.getjson(catalogoFilePath);
            } catch (error) {
                console.error(`No catalogo local file at ${catalogoFilePath}`);
            }

            let itemsFilePath = `${datapath}/items.json?${GUID.get()}`;
            let items = [];
            let itemsMap = {};
            try {
                items = await HttpRequest.getjson(itemsFilePath);
                // console.log("items", items);
                itemsMap = items.reduce( (acc, item) => {
                    acc[item.c_item] = item;
                    return acc;
                }, {});
                // console.log("itemsMap", itemsMap);
            } catch (error) {
                console.error(`No articoli local file at ${itemsFilePath}`);
            }


            catalogoNodes = catalogoNodes.map(n => {

                const node = new CatalogoNode(n);
                node.items = n.items || [];
                node.local = true;

                node.items = node.items
                .map( id => itemsMap[id] )
                .filter( item => !!item)
                .map(item => {
                    return new CatalogoItem({
                        c_item: item.c_item,
                        ds_descrizione_lingua: item.ds_descrizione_lingua,
                        ds_item: item.ds_item,
                        img: item.img,
                        imageUrl: item.img,
                        c_famiglia: item.c_famiglia,
                        c_modello: item.c_modello,
                        n_ordinamento: item.n_ordinamento,
                        fg_manuale: item.fg_manuale,
                        configData: item.configData,
                    });
                })


                return node;

            });

            runInAction(() => {
                this.catalogoNodesLocal = catalogoNodes;
            });

        } catch (error) {
            uiStore.alert(error);
            throw error;   
        }
    }
    parseNodesLocal() {

        var itemsLocalMap = this.itemsLocalMap

        return this.nodesLocal.map(n => {

            const node = new CatalogoNode(n);
            node.items = n.items || [];
            node.local = true;

            node.items = node.items
            .map( id => itemsLocalMap[id] )
            .filter( item => !!item)
            .map(item => {
                return new CatalogoItem({
                    c_item: item.c_item,
                    ds_descrizione_lingua: item.ds_descrizione_lingua,
                    ds_item: item.ds_item,
                    img: item.img,
                    imageUrl: item.img,
                    c_famiglia: item.c_famiglia,
                    c_modello: item.c_modello,
                    n_ordinamento: item.n_ordinamento,
                    fg_manuale: item.fg_manuale,
                    configData: item.configData,
                });
            })


            return node;

        });

    }
    async loadLocal() {
        const { appstore } = this;
        const { config, api, uiStore, routerStore } = appstore;
        try {
            
            const datapath = config.settings.datapath;
            
            let catalogoFilePath = `${datapath}/catalogo.json?${GUID.get()}`;
            let catalogoNodes = [];
            try {
                catalogoNodes = await HttpRequest.getjson(catalogoFilePath);
            } catch (error) {
                console.error(`No catalogo local file at ${catalogoFilePath}`);
            }
            catalogoNodes = catalogoNodes.filter(n => n.active !== false);
            


            let itemsFilePath = `${datapath}/items.json?${GUID.get()}`;
            let items = [];
            let itemsMap = {};
            try {
                items = await HttpRequest.getjson(itemsFilePath);
                // console.log("items", items);
                itemsMap = items.reduce( (acc, item) => {
                    acc[item.c_item] = item;
                    return acc;
                }, {});
                // console.log("itemsMap", itemsMap);
            } catch (error) {
                console.error(`No articoli local file at ${itemsFilePath}`);
            }

            // runInAction(() => {
            //     this.nodesLocal = catalogoNodes;
            //     this.itemsLocal = items;
            //     this.itemsLocalMap = itemsMap;
            // });
            this.nodesLocal = catalogoNodes;
            this.itemsLocal = items;
            this.itemsLocalMap = itemsMap;


        } catch (error) {
            uiStore.alert(error);
            throw error;   
        }
    }



    async load(id_navigatore) {
        const {appstore: { api, uiStore, routerStore } } = this;
        try {
            
            await this.getNavigatori();

            if (!this.navigatori || !this.navigatori.length) { return; }
            
            id_navigatore = id_navigatore || this.navigatori[0].id_navigatore;

            this.selectNavigatoreById(id_navigatore);

        } catch (error) {
            uiStore.alert(error);
            console.log(error);
            throw error;   
        }
    }


    // Load additional items infos from local json files
    async loadItemsLocalData() {
        const catalogoStanzaStore = this;
        const { appstore: { datapath } } = this;
        try {
            
            const itemsFilePath = `${datapath}/items_data.json?${GUID.get()}`;
            let itemsData = [];
            try {
                itemsData = await HttpRequest.getjson(itemsFilePath);
            } catch (error) {
                console.warn(`No items local data file at ${itemsFilePath}`);
                console.log(error);
            }
            
            const itemsDataMap = itemsData.reduce( (acc, item) => {
                acc[item.c_item] = item;
                return acc;
            }, {});

            runInAction(() => {
                this.itemsDataMap = itemsDataMap;
            });

        } catch (error) {
            throw error;
        }
    }


    //#endregion load











    /**
     * Reperimento famiglia e modello articolo da catalogo
     */

    
    getFamigliaModelloFromNodeBranch(node, allParents) {

        const { c_famiglia, c_modello } = node; 
        
        if (c_modello) {
            return {
                c_famiglia,
                c_modello
            };
        }

        // se ha un nodo padre e il flag allParents per la ricerca su tutti i progenitori è attivato
        if (node.id_father && allParents) {
            const fatherNode = this.nodes.findOne(n => n.id === node.id_father);
            return this.getFamigliaModelloFromNodeBranch(fatherNode, allParents);
        }
        
        return {
            c_famiglia: null,
            c_modello: null
        };

    }
    
    // parametro allParents = true effettua la ricerca su tutti i nodi progenitori altrimenti solo sul padre diretto
    getFamigliaModelloItemFromNodeSelected(allParents) {
        const { appstore } = this;
        return this.getFamigliaModelloFromNodeBranch(this.node_selected, allParents);
    }


}


export default Store;
