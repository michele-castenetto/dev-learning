
import {observable, extendObservable, action, runInAction, autorun, computed, toJS } from 'mobx';
import BBPromise from "bluebird";


import React from 'react';





// ##WORK provare a gestirle come le views in fase di caricamento
// ##OLD
// import SceltaValore from '__src/views/stanza/components/SceltaValore.jsx';
import ModalSceltaModello from "__src/views/stanza/components/SceltaModello.jsx";



import { Delayer, getUrlVars } from "__src/libs/gutils.js";
const dealyer = new Delayer();




class Store {

    constructor(appstore) {

        this.appstore = appstore;

        this.appViewer = null;

        extendObservable(this, {
            
            isMenuControlsVisible: true,

            // tabs
            isTabArticoliOpen: false,
            isTabDettaglioArticoloOpen: false,
            isTabArticoliStanzaOpen: false,
            isTabUpdateGruppoOpen: false,
            isTabVestizioneValoriOpen: false,

            // categoria 
            categoria: null,
            // valore non significativo selezionato
            gruppoValori: null,
            // ricerca testo modal valori
            ricercaTesto: "",

            // ##WORK forse piu corretto che questo campo sia inizializzato a null
            gruppoStanza: {},



            // Engine info Messages
            engineInfoActive: false,
            engineInfoData: {},

        });

    }


    resetStore() {
        runInAction("stanzaStore.resetStore", () => {

            this.isMenuControlsVisible = true;

            this.isTabArticoliOpen = false;
            this.isTabDettaglioArticoloOpen = false;
            this.isTabArticoliStanzaOpen = false;
            this.isTabUpdateGruppoOpen = false;
            this.isTabVestizioneValoriOpen = false;

            this.categoria = null;
            this.gruppoValori = null;
            this.ricercaTesto = "";

            this.gruppoStanza = {};

            this.engineInfoActive = false;
            this.engineInfoData = {};

        });
    }




    /**
     * Interactions
     */
    //#region interactions


    toggleEngineInfo(active, message) {
        if (active === true || active === false) { } else {
            active = !this.engineInfoActive;
        }
        runInAction("StanzaStore.toggleEngineInfo", () => {
            this.engineInfoActive = active;
        });
    }
    setEngineInfoData(engineInfoData) {
        runInAction("StanzaStore.setEngineInfoData", () => {
            this.engineInfoData = engineInfoData;
        });
    }
    addInsertInteractions() {
        const stanzaStore = this;
        const { appstore } = this;
        const { engineStore, languageStore } = appstore;

        const interactor = ENGINE3D.InsertStesoInteractor.getInstance(engineStore.appViewer);



        engineStore.appViewer.insertInteractionObservable.add(function(articoloGemo) {
            
            // ##WORK questa informazione potrebbe non essere piu in futuro sull'articolo ma frutto di una scelta utente
            // ##TODO Da capire come gestire anche in relazione a quanto verrà fatto per la gestione degli Element per la gestione dei flussi
            // gestionali e geometrici
            var insertType = articoloGemo.engineParams.insertType;
            insertType = insertType || 1;

            // insertType=1: insert positioned article
            if (insertType === ENGINE3D.AppViewer3d.INSERTTYPES.POSITIONED) {
                stanzaStore.setEngineInfoData({
                    title: languageStore.translate("StanzaStore.posInsert.set_position", "Posiziona elemento"),
                    image: "https://apps.tesysoftware.com/public/static/demoweb/ui_images/position.png",
                    // message: languageStore.translate("StanzaStore.stretchInsert_firstmodel", "Seleziona posizione elemento"),
                    handleCancelClick: () => {
                        ENGINE3D.InsertPosizionatoInteractor.getInstance().deactivate();
                        stanzaStore.toggleEngineInfo(false);
                    }
                });
                stanzaStore.toggleEngineInfo(true);
            }
            // insertType=2: insert stretched article
            else if (insertType === ENGINE3D.AppViewer3d.INSERTTYPES.STRETCHED) {


            }
            // insertType=3: insert child article
            else if (insertType === ENGINE3D.AppViewer3d.INSERTTYPES.CHILD) {
                stanzaStore.setEngineInfoData({
                    title: languageStore.translate("StanzaStore.posInsert.set_position", "Posiziona elemento"),
                    image: "https://apps.tesysoftware.com/public/static/demoweb/ui_images/position_child.png",
                    // message: languageStore.translate("StanzaStore.stretchInsert_firstmodel", "Seleziona posizione elemento"),
                    handleCancelClick: () => {
                        ENGINE3D.InsertChildInteractor.getInstance().deactivate();
                        stanzaStore.toggleEngineInfo(false);
                    }
                });
                stanzaStore.toggleEngineInfo(true);
            }


        });


        engineStore.appViewer.onArticoloInsertObservable.add(function(articoloGemo) {
            stanzaStore.toggleEngineInfo(false);
            // console.log("articoloGemo", articoloGemo);
        });


        interactor.onStepObservable.add(function(eventData) {

            let message = "";

            if (eventData.step === 1) {
                stanzaStore.setEngineInfoData({
                    title: languageStore.translate("StanzaStore.stretchInsert.top_stretch", "Stesura Top"),
                    image: "https://apps.tesysoftware.com/public/static/demoweb/ui_images/base_1.png",
                    message: languageStore.translate("StanzaStore.stretchInsert.select_startElement", "Seleziona elemento inizio stesura"),
                    handleCancelClick: () => {
                        ENGINE3D.InsertStesoInteractor.getInstance().deactivate();
                        stanzaStore.toggleEngineInfo(false);
                    }
                });
                stanzaStore.toggleEngineInfo(true);
            }

            if (eventData.step === 2) {
                message = 
                stanzaStore.toggleEngineInfo(false);
                setTimeout(function() {
                    stanzaStore.setEngineInfoData({
                        title: languageStore.translate("StanzaStore.stretchInsert.top_stretch", "Stesura Top"),
                        image: "https://apps.tesysoftware.com/public/static/demoweb/ui_images/base_2.png",
                        message: languageStore.translate("StanzaStore.stretchInsert.select_endElement", "Seleziona elemento fine stasura"),
                        handleCancelClick: () => {
                            ENGINE3D.InsertStesoInteractor.getInstance().deactivate();
                            stanzaStore.toggleEngineInfo(false);
                        }
                    });
                    stanzaStore.toggleEngineInfo(true);
                }, 500);
            }

            if (eventData.step === 3) {
                stanzaStore.toggleEngineInfo(false);
                // setTimeout(function() {
                //     stanzaStore.setEngineInfoData({});
                // }, 500);
            }

        });


    }


    //#endregion interactions




    /**
     * Route actions
     */
    //#region route_actions


    // ##EXAMPLE http://localhost:8082/#/stanza?c=#46_COMP01_L60
    async _initCustomItem(c_item) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, engineStore } = appstore;
        try {
            
            const response = await api.getCustomItem(c_item);
            if (response.status === "ERROR") { throw response; }

            const item = response.data.item;
            if (!item) { return; }

            engineStore.insertComposizioneStanza(item);

        } catch (error) {
            throw error;
        }
    }

    async _initProject(id_project) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, engineStore } = appstore;
        try {

            const response = await api.getProgetto(id_project);   
            if (response.status === "ERROR") { throw response; }

            const progetto = response.data.progetto;

            if (!progetto) { return; }

            stanzaStore.setGruppoStanza(progetto);


            // ##OLD
            // const righeStanza = progetto.righeItem;
            // const articoli = await BBPromise.all(righeStanza.map(r => engineStore.insertArticoloFromRiga(r)));
            // engineStore.setArticoli(articoli);


            // ##WORK migliorare serializzazione/deserializzazione
            // valorizza i campi prendendoli da quelli all'interno del contenitore geometry (per salvataggio in db)
            progetto.righeItem.forEach(rigaItem => {

                if (rigaItem.geometry) {
                    rigaItem.guid = rigaItem.geometry.guid;
                    rigaItem.id = rigaItem.geometry.id;
                    rigaItem.parent_guid = rigaItem.geometry.parent_guid;
                    rigaItem.engineParams = rigaItem.geometry.engineParams;
                    rigaItem.configurationParams = rigaItem.geometry.configurationParams;

                    // Per retrocompatibilità con progetti vetusti
                    if (rigaItem.geometry.posizione) {
                        rigaItem.geometry.position = rigaItem.geometry.posizione;
                        rigaItem.geometry.position.x += 2;
                        rigaItem.geometry.position.z += 3;
                    }
                    if (rigaItem.geometry.rotazioni) {
                        rigaItem.geometry.rotations = rigaItem.geometry.rotazioni;
                    }

                    // ##TODO ? (Non servono dopo il primo posizionamente a meno che non si attivi la funzionalità di spostamento tra piani)
                    // if(geometry.movePlaneTypes && geometry.movePlaneTypes.length >=1 && ["ORIZONTAL", "VERTICAL"].indexOf(geometry.movePlaneTypes[0]) !== -1 ) {
                    //     geometry.movePlaneTypes = geometry.movePlaneTypes.map(m => {
                    //         if (m === "VERTICAL") {
                    //             return 2;
                    //         } else if (m === "ORIZONTAL") {
                    //             return 1;
                    //         } else {
                    //             return 2;
                    //         }
                    //     });
                    // }
                    
                }

                // Nel caso in cui righe di progetti vecchi non sia presente l'id
                if (!rigaItem.id) {
                    rigaItem.id = rigaItem.id_item;
                }


            });


            await engineStore.appViewer.deserializeStanza({
                serialization: {
                    ambient: progetto.ambient,
                    articoli: progetto.righeItem,
                }
            });


            engineStore.setArticoli(engineStore.appViewer.articoli);



        } catch (error) {
            throw error;
        }
    }


    /**
     * Metodo di init per la vista stanza
     */
    async stanzaRouteInit() {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, engineStore, uiStore } = appstore;
        try {

            stanzaStore.toggleTabUpdateGruppo(false);
            stanzaStore.setGruppoStanza(null);
            engineStore.deleteArticoli();

            engineStore.setRoomState(0);

            
            const queryParams = getUrlVars();
            const { p : id_project = "", c : c_item = "" } = queryParams;

            uiStore.toggleLoading(true);

            if (id_project) {
                this._initProject(id_project);
            } else if (c_item) {
                this._initCustomItem(c_item);
            }

            uiStore.toggleLoading(false);


        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    /**
     * Metodo applicato prima del cambio vista dalla vista stanza
     */
    async beforeChangeRoute(path, route) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, engineStore, uiStore, languageStore, routerStore } = appstore;
        try {

            if(engineStore.roomState === 0) {
                routerStore.execChangePath(path);
                return;
            }

            const confirmText = languageStore.translate("StanzaStore.changeStanzaRoute_confirmText", "Uscire dalla stanza senza salvare il progetto ?");

            uiStore.confirm(confirmText, function() {
                try {
                    routerStore.execChangePath(path);
                } catch (error) {
                    uiStore.alert(error.message || "Error");
                    console.log(error);
                }
            });

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion route_actions




    /**
     * Tabs
     */
    //#region tabs


    toggleTabArticoli(visible) {
        if (visible === true || visible === false) {} else { visible = !this.isTabArticoliOpen; }
        runInAction(() => { this.isTabArticoliOpen = visible; });
    }

    toggleTabDettaglioArticolo(visible) {
        if (visible === true || visible === false) {} else { visible = !this.isTabDettaglioArticoloOpen; }
        runInAction(() => { this.isTabDettaglioArticoloOpen = visible; });
    }

    toggleTabArticoliStanza(visible) {
        if (visible === true || visible === false) {} else { visible = !this.isTabArticoliStanzaOpen; }
        runInAction(() => { this.isTabArticoliStanzaOpen = visible; });
    }

    toggleTabUpdateGruppo(visible) {
        if (visible === true || visible === false) {} else { visible = !this.isTabUpdateGruppoOpen; }
        runInAction(() => { this.isTabUpdateGruppoOpen = visible; });
    }

    toggleTabVestizioneValori(visible) {
        if (visible === true || visible === false) {} else { visible = !this.isTabVestizioneValoriOpen; }
        runInAction(() => { this.isTabVestizioneValoriOpen = visible; });
    }


    toggleTabs(isOpen = false) {
        this.isTabArticoliOpen = isOpen;
        this.isTabDettaglioArticoloOpen = isOpen;
        this.isTabArticoliStanzaOpen = isOpen;
        this.isTabUpdateGruppoOpen = isOpen;
        this.isTabVestizioneValoriOpen = isOpen;
    }


    //#endregion tabs


    

    /**
     * Articolo
     */
    //#region articolo


    async getModelloArticolo(c_articolo, famiglia, modello) {
        const { appstore } = this;
        const { api, catalogoStanzaStore } = appstore;
        try {
            
            if (famiglia && modello) {
                return {
                    famiglieModelli: [],
                    famigliaModello: {
                        c_famiglia: famiglia,
                        c_modello: modello
                    }
                };
            }

            const response = await api.getModelliArticolo(c_articolo);
            if(response.status === "ERROR") { throw response; }

            const famiglieModelli = response.data.famigliemodelli;

            if (famiglieModelli.length === 0) {
                throw `No model for article ${articoloData.c_articolo}`;
            }

            // se ha un unica possibilità di famiglia e modello è quella corretta
            if (famiglieModelli.length === 1) {
                return {
                    famiglieModelli: famiglieModelli,
                    famigliaModello: {
                        c_famiglia: famiglieModelli[0].c_famiglia,
                        c_modello: famiglieModelli[0].c_modello
                    }
                };
            } 

            // altrimenti cerca nel nodo padre dell'articolo le informazioni sulla famiglia e il modello
            const { c_famiglia, c_modello } = catalogoStanzaStore.getFamigliaModelloItemFromNodeSelected();
            // console.log("c_modello", c_modello); console.log("c_famiglia", c_famiglia);


            const famigliaModelloFromNode = famiglieModelli.findOne(function(fm) {
                // return fm.c_famiglia === c_famiglia && fm.c_modello === c_modello;
                return fm.c_modello === c_modello;
            });
            // se è presente tra i possibili modelli dell'articolo è quello corretto
            if (famigliaModelloFromNode) {
                return {
                    famiglieModelli: famiglieModelli,
                    famigliaModello: famigliaModelloFromNode
                };
            }

            return {
                famiglieModelli: famiglieModelli,
                famigliaModello: null
            };

        } catch (error) {
            throw error;
        }
    }

    
    async handleAddItemToStanza(params) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, uiStore, engineStore, languageStore, catalogoStanzaStore, routerStore, composizioniStore } = appstore;
        try {

            // console.log("params", params);

            // if composition
            if (params.fg_manuale === 1) {

                uiStore.toggleLoading(true);
                
                await engineStore.insertComposizioneStanza(params);
            
                // ##WORK da eliminare quando ci sarà nuova vista per edit composizioni
                // composizioniStore.setItemToEdit(params);
                uiStore.toggleLoading(false);

                stanzaStore.toggleTabArticoli(false);

                return;
            }


            const result = await this.getModelloArticolo(params.c_articolo, params.c_famiglia, params.c_modello);
            // console.log("result", result);

            if (!result.famigliaModello) {
                uiStore.showModal(<ModalSceltaModello 
                    famiglieModelli={result.famiglieModelli}
                    c_articolo={params.c_articolo}
                />,"modal_sceltamodello");
                return;
            }

            const articoloParams = Object.assign({}, params, {
                c_famiglia: result.famigliaModello.c_famiglia,
                c_modello: result.famigliaModello.c_modello,
            });


            // uiStore.toggleLoading(true);

            stanzaStore.toggleTabArticoli(false);


            const articoloGemo = await engineStore.insertArticoloStanza(articoloParams);

            // ##WORK capire come gestire il loading con i nuovi flussi di inserimento
            // uiStore.toggleLoading(false);

            if(articoloGemo && articoloGemo.fg_oggettoGrafico === false) {
                const successText = languageStore.translate("stanzaStore.updateProgettoStanza_nongraficato","Creato oggetto non graficato");
                uiStore.alert(successText);
            }
            
            // ##WORK capire come gestire il toggle della tab articoli con i nuovi flussi di inserimento
            stanzaStore.toggleTabArticoli(false);
            

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }

    
    async deleteArticoloUI(articoloGemo) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, uiStore, engineStore, languageStore, routerStore } = appstore;
        try {

            const confirmText = languageStore.translate("StanzaStore.deleteArticoloStanza_confirmText", "Sei sicuro di voler eliminare l'articolo dalla stanza ?");
            const successText = languageStore.translate("StanzaStore.deleteArticoloStanza_successText", "Articolo eliminato");

            uiStore.confirm(confirmText, async function() {
                try {
                    await engineStore.deleteArticolo(articoloGemo);
                    // uiStore.alert(successText);
                } catch (error) {
                    uiStore.alert(error);
                    console.log(error);
                }
            });

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion articolo




    /**
     * Vestizione
     */
    //#region vestizione


    // ##OLD per aprire la modal invece che la tab vestizione valori
    // openModalSceltaValore(categoria, valore) {
    //     const { appstore } = this;
    //     const { uiStore, languageStore } = appstore;
    //     const stanzaStore = this;
    //     uiStore.showModal(
    //         <SceltaValore
    //             categoria={categoria}
    //             valoreScelto={valore}
    //             ricercaTesto={stanzaStore.ricercaTesto}
    //             handleRicercaChange={(e) => stanzaStore.setTestoRicercaValori(e.target.value)}
    //             handleValoreClick={(valore, categoria) => stanzaStore.handleValoreClick(categoria, valore)}
    //         />,
    //         'ts_modal_sceltavalore'
    //     );
    // };


    setCategoria(categoria = null) {
        runInAction("StanzaStore.setCategoria", () => {
            this.categoria = categoria;
        });
    }
    setGruppoValori(gruppoValori = null) {
        runInAction("StanzaStore.setGruppoValori", () => {
            this.gruppoValori = gruppoValori;
        });
    }
    setTestoRicercaValori(valore = "") {
        runInAction("StanzaStore.setTestoRicercaValori", () => {
            this.ricercaTesto = valore.replace(/[^a-z0-9]/gi, '');
        });
    }
    openVestizioneTab(categoria = null) {
        runInAction("StanzaStore.openVestizioneTab", () => {
            this.categoria = categoria;
            this.gruppoValori = null;
            this.toggleTabVestizioneValori(true);
        });
    }


    async handleValoreClick(categoria, valore) {
        const stanzaStore = this;
        const { appstore } = this;
        const { uiStore, engineStore, languageStore } = appstore;
        try {

            runInAction(()=>{
                stanzaStore.setTestoRicercaValori("");
                this.toggleTabVestizioneValori(false);              
            });

            await engineStore.configuraVariante(categoria, valore);

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    };


    async handleValoreCategoriaChange(categoria, valore) {
        const { appstore } = this;
        const { uiStore, engineStore } = appstore;
        try {

            await engineStore.configuraVariante(categoria, valore);

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async handleQuantitaChange(quantita) {
        const { appstore } = this;
        const { uiStore, engineStore } = appstore;
        try {

            await engineStore.configuraQuantita(quantita);

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }
    handleQuantitaChangeDelayed(value) {
        const stanzaStore = this;
        dealyer.delay(function() {
            stanzaStore.handleQuantitaChange(value);
        }, 500);
    }


    //#endregion vestizione




    /**
     * Projects Methods
     */
    //#region project


    setGruppoStanza(gruppo) {
        if (!gruppo) {
            runInAction("setGruppoStanza", () => {
                this.gruppoStanza = {
                    id_carrello: "",
                    id_gruppo_righe: "",
                    ds_gruppo_righe: "",
                    nota: "",
                    fg_stanza: 1,
                    dt_create: "",
                    dt_update: ""
                };
            });
        } else {
            runInAction("setGruppoStanza", () => {
                this.gruppoStanza = gruppo;
            });
        }
    }

    
    async handleUpdateGruppoStanza(id_gruppo_righe, ds_gruppo_righe, nota, fg_preferito) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, engineStore, uiStore, languageStore, routerStore } = appstore;

        stanzaStore.toggleTabUpdateGruppo(false);
        const loadingText = languageStore.translate("StanzaStore.updateProgettoStanza_saving", "Salvataggio in corso..");
        uiStore.showModal(loadingText);
            
        let successText = languageStore.translate("StanzaStore.updateProgettoStanza_saving_successText", "Progetto stanza salvato");

        try {

            let response;

            if (id_gruppo_righe) {

                // ##OLD
                // response = await api.updateGruppoCarrello({
                //     id_gruppo_righe,
                //     ds_gruppo_righe,
                //     nota,
                //     fg_preferito
                // });
                // ##WORK testare che con questo metodo tutto funzioni
                response = await api.updateProgettoTestata(id_gruppo_righe, {
                    ds_gruppo_righe: ds_gruppo_righe,
                    nota: nota,
                    fg_preferito: fg_preferito,
                });

                if (response.status === "ERROR") { throw response; }

            } else {

                response = await api.insertProgetto({
                    ds_gruppo_righe,
                    nota,
                    fg_preferito
                });
                if (response.status === "ERROR") { throw response; }

                id_gruppo_righe = response.data.result.insertGruppoId;
                

                response = await api.getProgetto(id_gruppo_righe);
                if (response.status === "ERROR") { throw response; }

                const progetto = response.data.progetto;
                const id = progetto.n_anno_progetto + "-" + progetto.c_numeratore_progetto + "-" + progetto.n_numero_progetto;

                successText = languageStore.translate("StanzaStore.updateProgettoStanza_created_successText", "Creato progetto") + " " + id + ", " + progetto.ds_gruppo_righe;
                
            }

            response = await api.getProgetto(id_gruppo_righe);
            if (response.status === "ERROR") { throw response; }
            const progetto = response.data.progetto;

            
            if (progetto) { stanzaStore.setGruppoStanza(progetto); }
            await stanzaStore.updateRigheProgettoStanza();
            
            uiStore.hideModal();

            uiStore.alert(successText);
            

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    // ##WORK riattivare il toggle per la visibilita delle linee di livello
    async _updateProgettoImages() {
        const _this = this;
        const { appstore, gruppoStanza } = this;
        const { config, api, engineStore, carrelloStanzaStore } = appstore;
        try {
            
            const { id_gruppo_righe } = gruppoStanza;
            const { appViewer } = engineStore;

            // # impostazioni

            const { screenshots = {} } = config;
            const { progetto_low = {}, progetto_high  = {} } = screenshots;

            const ambientStanza = engineStore.getRoomAmbient();
            // var lines = ambientStanza.structure.lines;
            // var isLinesVisible = lines[0].isVisible;
            var viewer3d = appViewer.viewer3d;
            var modelRef = viewer3d.model_selected;

            var afterStopFn = function() { 
                // engineStore.toggleLines(false);
                viewer3d.selectModelUI(null);
            };
            var beforeStartFn = function() {
                // engineStore.toggleLines(isLinesVisible);
                viewer3d.selectModelUI(modelRef);
            };

            // # generazione immagine progetto low

            const base64data = await appViewer.takeRoomScreenShot({
                afterStopFn: afterStopFn,
                beforeStartFn: beforeStartFn,
                // precision: 0.3,
                width: progetto_low.width || 128,
                height: progetto_low.height || 128,
                alpha: (progetto_low.alpha || 70) * (Math.PI/180),
                beta: (progetto_low.beta || 70) * (Math.PI/180),
                opentab: progetto_low.opentab !== undefined ? progetto_low.opentab : false,
                // download: true,
                // radiusScale: 2.5,
            });
            // console.log("base64data", base64data);

            // # generazione immagine progetto high

            const base64data_hd = await appViewer.takeRoomScreenShot({
                afterStopFn: afterStopFn,
                beforeStartFn: beforeStartFn,
                // precision: 1,
                width: progetto_high.width || 800,
                height: progetto_high.height || 600,
                alpha: (progetto_high.alpha || 70) * (Math.PI/180),
                beta: (progetto_high.beta || 70) * (Math.PI/180),
                opentab: progetto_high.opentab !== undefined ? progetto_high.opentab : false,
                // download: true,
                // radiusScale: 2.5,
            });


            let response = null;

            // # invio immmagine progetto low

            if (carrelloStanzaStore) {
                // carrelloStanzaStore.img_sending_map[`${id_gruppo_righe}_${"img_progetto"}`] = {};
                carrelloStanzaStore.updateImageSendingMap(id_gruppo_righe, "img_progetto", true);
            }
            response = api.updateProgettoTestata(id_gruppo_righe, {
                img_progetto: base64data
            })
            .then(()=>{
                setTimeout(() => {
                    if (carrelloStanzaStore) {
                        // ##WORK questo metodo è asincrono, andrebbe fatto l'await per avere una visualizzazione corretta
                        carrelloStanzaStore.updateGruppoImageOnSent(id_gruppo_righe, "img_progetto", base64data);
                        carrelloStanzaStore.updateImageSendingMap(id_gruppo_righe, "img_progetto", false);
                    }
                }, 5000);
            })
            .catch(err => {
                const msg = `Error: project image send error ${err}`;
                console.error(msg);
            });

            // # invio immmagine progetto high
            
            if (carrelloStanzaStore) {
                // carrelloStanzaStore.img_sending_map[`${id_gruppo_righe}_${"img_progetto_hd"}`] = {};
                carrelloStanzaStore.updateImageSendingMap(id_gruppo_righe, "img_progetto_hd", true);
            }
            response = api.updateProgettoTestata(id_gruppo_righe, {
                img_progetto_hd: base64data_hd
            })
            .then(()=>{
                if (carrelloStanzaStore) {
                    carrelloStanzaStore.updateGruppoImageOnSent(id_gruppo_righe, "img_progetto_hd", base64data);
                    carrelloStanzaStore.updateImageSendingMap(id_gruppo_righe, "img_progetto_hd", false);
                }
            })
            .catch(err => {
                const msg = `App Error: project image hd send error ${err}`;
                console.error(msg);
            });



        } catch (error) {
            throw error;
        }
    }


    async _updateRigheProgetto() {
        const { appstore, gruppoStanza } = this;
        const { api, engineStore } = appstore;
        try {

            const { id_gruppo_righe } = gruppoStanza;
            const { appViewer } = engineStore;

            // ##OLD
            // const righeArticoli = engineStore.articoli.map(articolo => {
            //     return articolo.serialize();
            // });
            // ##WORK migliorare serializzazione/deserializzazione da database
            // ora è necessario "spostare" alcuni campi dentro geometry per poterli salvare a db
            const righeArticoli = appViewer.articoli.map(articolo => {
                const serialization = articolo.serialize();
                if (serialization.geometry) {
                    serialization.geometry.guid = serialization.guid;
                    serialization.geometry.id = serialization.id;
                    serialization.geometry.parent_guid = serialization.parent_guid;
                    serialization.geometry.engineParams = serialization.engineParams;
                    serialization.geometry.configurationParams = serialization.configurationParams;
                }
                return serialization;
            });
            // console.log("righeArticoli", righeArticoli);


            let response = await api.updateProgettoRighe(id_gruppo_righe, {
                righe: righeArticoli
            });
            if (response.status === "ERROR") { throw response; }



            // Update ambient

            var ambient = engineStore.getRoomAmbient().serialize();
            // console.log("ambient", ambient);

            response = await api.updateProgettoTestata(id_gruppo_righe, {
                json_stanza: ambient
            })
            if (response.status === "ERROR") { throw response; }


        } catch (error) {
            throw error;
        }
    }


    async updateRigheProgettoStanza() {
        const { appstore } = this;
        const { engineStore } = appstore;
        try {

            await this._updateRigheProgetto();

            this._updateProgettoImages();

            engineStore.setRoomState(0);

        } catch (error) {
            throw error;
        }
    }

    
    async updateRigheProgettoStanzaUI() {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, engineStore, uiStore, languageStore, routerStore } = appstore;
        try {

            // # check if all articles have configuration complete
            let articoliNonCompleti = engineStore.articoli.reduce((total, a)=>{
                if(a.elemento && a.elemento.fg_vestizione_completa !== 1){
                    total.push(a);
                }
                return total;
            }, []);
            if(articoliNonCompleti.length >= 1){

                let message = languageStore.translate("StanzaStore.updateProgettoStanza_vestizioneincompleta", "La vestizione non è completa per alcuni prodotti: ");

                let incompleti = articoliNonCompleti.map((p)=>{
                    return p.c_articolo;
                }).join(", ");

                uiStore.warning(message + incompleti);

                return;

            }


            // # if project not already created open project info save tab
            const { gruppoStanza } = stanzaStore;
            const id_gruppo_righe = gruppoStanza.id_gruppo_righe;
            if (!id_gruppo_righe) { 
                stanzaStore.toggleTabUpdateGruppo(true); 
                return;
            }


            const confirmText = languageStore.translate("StanzaStore.updateProgettoStanza_confirmText","Sei sicuro di voler salvare il progetto stanza ?");
            const successText = languageStore.translate("StanzaStore.updateProgettoStanza_successText","Progetto stanza salvato");

            uiStore.confirm(confirmText, async function () {
                try {
                    await stanzaStore.updateRigheProgettoStanza();
                    uiStore.alert(successText);
                } catch (error) {
                    uiStore.alert(error.message || "Error");
                    console.log(error);
                }
            });

            
        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    // ##TODO da migliorare, evitare il reload della pagina
    async downloadGLB() {
        const { appstore } = this;
        const { config, localStorage, stanzaStore, uiStore, engineStore, engineStore: { appViewer } } = appstore;
        try {
            
            const engine3d = appViewer.engine3d;
            const camera = engine3d.scene.activeCamera;
                
            uiStore.toggleLoading(true);
            
            const roomData = JSON.stringify(engineStore.serializeStanza());
            
            localStorage.set("stanza", roomData);
    
            await appViewer.engine3d.exportGLB();
            
            window.location.reload();
            
        } catch (error) {
            uiStore.alert(error.message);
            console.log(error);
        }
    };


    // ##TODO controllare che il progetto sia stato salvato prima di esportarlo
    async exportProgettoStanza(progettoStanza) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const { id_gruppo_righe } = progettoStanza;
            await api.exportProgetto(id_gruppo_righe);
            
        } catch (error) {
            throw error;
        }
    }
    async exportProgettoStanzaUI(progettoStanza) {
        const stanzaStore = this;
        const { appstore } = this;
        const { api, uiStore, engineStore, languageStore, routerStore } = appstore;
        try {

            if (!progettoStanza) { return; }

            const confirmText = languageStore.translate("StanzaStore.exportProgettoStanza_confirmText", "Sei sicuro di voler esportare il progetto stanza ?");
            const successText = languageStore.translate("StanzaStore.exportProgettoStanza_successText", "Progetto stanza exportato");

            uiStore.confirm(confirmText, async function() {
                try {
                    await stanzaStore.exportProgettoStanza(progettoStanza);
                    // uiStore.alert(successText);
                } catch (error) {
                    uiStore.alert(error.message || "Error");
                    console.log(error);
                }
            });

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion project




}


export default Store;