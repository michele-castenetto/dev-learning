
import { observable, extendObservable, action, runInAction, autorun, computed, toJS } from 'mobx';


import BBPromise from 'bluebird';

import { formatDate, formatPrezzo } from "__src/modules/common.js";

import React from 'react';

import { Delayer, getUrlVars } from "__src/libs/gutils.js";
const dealyer = new Delayer();


// ##WORK gestire queste modal in maniera diversa (ad esempio con un preload ?)
import ModalProgettoInvio from '__src/views/progettoDettaglio/components/ProgettoInvioModal.jsx';
import ModalLoading from '__src/views/progettoDettaglio/components/FormLoadingModal.jsx';


class Store {

    constructor(appstore) {

        this.appstore = appstore;

        this.img_sending_map = {};

        extendObservable(this, {

            progetti: [],
            archiviati: [],

            // ##TODO rinominare in progettoDettaglio o progettoCorrente ?
            gruppoStanza: {},

            statiProgetto: [],
            statiProgettoMap: {},
            autorizzazioniStatiProgetto: [],

            // ##OLD servono ancora ?
            idGruppiSelected: [],
            idGruppiRigheVisible: [],

        });

    }


    resetStore() {
        runInAction("CarrelloStanzaStore.resetStore", () => {

            this.progetti = [];
            this.archiviati = [];

            this.gruppoStanza = {};

            this.statiProgetto = [];
            this.statiProgettoMap = {};
            this.autorizzazioniStatiProgetto = [];

            this.idGruppiSelected = [];
            this.idGruppiRigheVisible = [];
            
        });
    }





    
    /**
     * Init
     */
    //#region init

    
    async init() {
        try {
            
            await this.getAutorizzazioniStatiProgetto();

        } catch (error) {
            throw error;
        }
    }


    async progettiRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getStatiProgetto();
            await this.getProgetti();
            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async archiviatiRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getStatiProgetto();
            await this.getProgettiArchiviati();
            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async progettoDettaglioRouteInit() {
        const { appstore } = this;
        const { api, uiStore, routerStore } = appstore;
        try {

            uiStore.toggleLoading(true);


            const queryParams = getUrlVars();
            const idGruppo = queryParams.p || "";

            await this.getStatiProgetto();

            const response = await api.getProgetto(idGruppo, {
                json_stanza: 0,
                img_progetto: 0,
                img_progetto_hd: 0
            });
            if (response.status === "ERROR") { throw response; }

            const progetto = response.data.progetto;

            if (!progetto) {
                uiStore.toggleLoading(false);
                return;
            }

            if (progetto.id_cf) {
                let response = await api.getClienteFinale(progetto.id_cf);
                if (response.status === "ERROR") { throw response; }
                progetto.cliente = response.data.cliente;
            }


            runInAction("CarrelloStanzaStore.progettoDettaglioRouteInit", () => {
                this.gruppoStanza = progetto;
            });
            

            uiStore.toggleLoading(false);


        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async progettoArchiviatoDettaglioRouteInit() {
        const { appstore } = this;
        const { api, uiStore, routerStore } = appstore;    
        try {

            uiStore.toggleLoading(true);

            
            const queryParams = getUrlVars();
            const idGruppo = queryParams.p || "";
            
            await this.getStatiProgetto();

            const response = await api.getProgetto_Archivio(idGruppo);
            if (response.status === "ERROR") { throw response; }

            const progetto = response.data.progetto;

            if (!progetto) {
                uiStore.toggleLoading(false);
                return;
            }

            if (progetto.id_cf) {
                let response = await api.getClienteFinale(progetto.id_cf);
                if (response.status === "ERROR") { throw response; }
                progetto.cliente = response.data.cliente;
            }


            this.gruppoStanza = progetto;

            uiStore.toggleLoading(false);


        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion init





    /**
     * Autorizzazioni
     */
    //#region autorizzazioni


    // lista azioni possibili
    azioniStatoProgettoList(c_stato_progetto_partenza){

        if(!c_stato_progetto_partenza){
            return [];
        }

        return this.autorizzazioniStatiProgetto.map((regola)=>{
            if(regola.c_stato_progetto_partenza === c_stato_progetto_partenza){
                return regola.c_stato_progetto_arrivo;
            }
        });

    }

    // verifica se singola azione possibile
    azioniStatoProgettoCheck(c_stato_progetto_partenza, c_stato_progetto_arrivo){

        if(!c_stato_progetto_arrivo || !c_stato_progetto_partenza){
            return false;
        }

        return this.autorizzazioniStatiProgetto.find((regola)=>{
            return (c_stato_progetto_arrivo === regola.c_stato_progetto_arrivo && c_stato_progetto_partenza === regola.c_stato_progetto_partenza);
        });
        
    }

    azioniProgettoEliminazioneCheck(c_stato_progetto_partenza){

        if(!c_stato_progetto_partenza){
            return false;
        }

        return c_stato_progetto_partenza !== "INVIATO";

    }
    


    //#endregion autorizzazioni






    /**
     * Progetti
     */
    //#region progetti


    // ##OLD per selezionare i progetti di cui mostrare/nascondere le righe
    setRigheGruppoVisible(gruppo, visible) {

        let idGruppiRigheVisible = [];

        if (visible) {
            idGruppiRigheVisible = this.idGruppiRigheVisible.concat([gruppo.id_gruppo_righe]);
        } else {
            idGruppiRigheVisible = this.idGruppiRigheVisible.filter(id => {
                return id !== gruppo.id_gruppo_righe.toString();
            });
        }
        runInAction(() => {
            this.idGruppiRigheVisible = idGruppiRigheVisible;
        });

    }
    // ##OLD per selezionare i progetti
    setGruppoSelection(gruppo, checked) {

        let idGruppiSelected = [];

        if (checked) {
            idGruppiSelected = this.idGruppiSelected.concat([gruppo.id_gruppo_righe]);
        } else {
            idGruppiSelected = this.idGruppiSelected.filter(id => {
                return id !== gruppo.id_gruppo_righe.toString();
            });
        }
        runInAction(() => {
            this.idGruppiSelected = idGruppiSelected;
        });

    }
    


    async updateGruppoImageOnSent(id_gruppo_righe, field, image) {
        const carrelloStanzaStore = this;
        const { appstore } = this;
        try {

            const progetto = carrelloStanzaStore.progetti.findOne(g => g.id_gruppo_righe === id_gruppo_righe);
            if (!progetto) { return; }

            // ##OLD
            // const time = (new Date()).getTime();
            const date = new Date(progetto.dt_update);
            const time = date.getTime();
            const key = `${id_gruppo_righe}_${field}`;
            await appstore.setCachedData(key, image, time);

            runInAction("CarrelloStanzaStore.updateGruppoImageOnSent", () => {
                progetto[field] = image;
                progetto.fg_img_progetto_loading = false;
            });

        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }
    updateImageSendingMap(id_gruppo_righe, field, isLoading) {
        const key = `${id_gruppo_righe}_${field}`;
        if (isLoading) {
            this.img_sending_map[key] = {};
        } else {
            delete this.img_sending_map[key];
        }
    }
    isImageSending(id_gruppo_righe, field) {
        const key = `${id_gruppo_righe}_${field}`;
        return this.img_sending_map[key] !== undefined;
    }
    

    async getProgettoImage(progetto, field) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const id_gruppo_righe = progetto.id_gruppo_righe;

            const key = `${id_gruppo_righe}_${field}`;

            progetto.fg_img_progetto_loading = false;
            const isImgSending = this.img_sending_map[key];
            if (isImgSending) {
                progetto.fg_img_progetto_loading = true;
                return null;
            }

            var date = new Date(progetto.dt_update);
            var time = date.getTime();

            let image = await appstore.getCachedData(key, time);

            if (image) { return image; }

            const response = await api.getProgettoImage(id_gruppo_righe);
            if (response.status === "ERROR") { throw response; }
            
            image = response.data.image;

            appstore.setCachedData(key, image, time);

            return image;

        } catch (error) {
            throw error;
        }
    }
    async getProgetti() {
        const { appstore } = this;
        const { api, stanzaStore } = appstore;
        try {

            runInAction("CarrelloStanzaStore.getProgetti", () => {
                this.progetti = [];
            });

            const response = await api.getProgetti({
                json_stanza: 0,
                img_progetto: 0,
                img_progetto_hd: 0
            });
            if (response.status === "ERROR") { throw response; }

            const progetti = response.data.progetti;
            progetti.forEach(g => { g.selected = false; });

            runInAction("CarrelloStanzaStore.getProgetti", () => {
                this.progetti = progetti;
            });

            // ##TODO eseguire il reperimento delle immagini in parallelo ?
            for (var i = 0; i < progetti.length; i++) {

                var progetto = progetti[i];

                progetto.img_progetto = await this.getProgettoImage(progetto, "img_progetto");

            }

            runInAction("CarrelloStanzaStore.getProgetti", () => {
                this.progetti = progetti;
            });

        } catch (error) {
            throw error;
        }
    }
    async getProgetto(id_gruppo_righe) {
        const { appstore } = this;
        const { api } = appstore;
        try {
            
            const response = await api.getProgetto(id_gruppo_righe, {
                json_stanza: 0,
                img_progetto: 0,
                img_progetto_hd: 0
            });
            if (response.status === "ERROR") { throw response; }

            const progetto = response.data.progetto;

            return progetto;

        } catch (error) {
            throw error;
        }
    }




    async getProgettoArchiviatoImage(progetto, field) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const id_gruppo_righe = progetto.id_gruppo_righe;

            const key = `${id_gruppo_righe}_${field}`;

            progetto.fg_img_progetto_loading = false;
            const isImgSending = this.img_sending_map[key];
            if (isImgSending) {
                progetto.fg_img_progetto_loading = true;
                return null;
            }

            var date = new Date(progetto.dt_update);
            var time = date.getTime();

            let image = await appstore.getCachedData(key, time);

            if (image) { return image; }

            const response = await api.getProgettoImage_Archivio(id_gruppo_righe);
            if (response.status === "ERROR") { throw response; }
            
            image = response.data.image;

            appstore.setCachedData(key, image, time);

            return image;

        } catch (error) {
            throw error;
        }
    }
    async getProgettiArchiviati() {
        const { appstore } = this;
        const { api } = appstore;
        try {

            runInAction("CarrelloStanzaStore.getProgettiArchiviati", () => {
                this.progetti = [];
            });

            const response = await api.getProgetti_Archivio({
                json_stanza: 0,
                img_progetto: 0,
                img_progetto_hd: 0
            });
            if (response.status === "ERROR") { throw response; }

            const progetti = response.data.progetti;
            progetti.forEach(g => { g.selected = false; });

            runInAction("CarrelloStanzaStore.getProgettiArchiviati", () => {
                this.archiviati = progetti;
            });

            for (var i = 0; i < progetti.length; i++) {

                var progetto = progetti[i];

                progetto.img_progetto = await this.getProgettoArchiviatoImage(progetto, "img_progetto");

            }

            runInAction("CarrelloStanzaStore.getProgettiArchiviati", () => {
                this.archiviati = progetti;
            });

        } catch (error) {
            throw error;
        }
    }

    
    async getStatiProgetto() {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const response = await api.getStatiProgetto();
            if (response.status === "ERROR") { throw response; }

            const statiProgetto = response.data.stati;
            const statiProgettoMap = statiProgetto.reduce((acc, d) => {
                acc[d.c_stato_progetto] = d;
                return acc;
            }, {});

            runInAction("CarrelloStanzaStore.getStatiProgetto", () => {
                this.statiProgetto = statiProgetto;
                this.statiProgettoMap = statiProgettoMap;
            });

        } catch (error) {
            throw error;
        }
    }


    async getAutorizzazioniStatiProgetto() {
        const { appstore } = this;
        const { api } = appstore;
        try {

            let response = await api.getAutorizzazioniStatiProgetto();
            if (response.status === "ERROR") { throw response; }

            const autorizzazioni = response.data.autorizzazioni;

            runInAction("CarrelloStanzaStore.getAutorizzazioniStatiProgetto", () => {
                this.autorizzazioniStatiProgetto = autorizzazioni;
            });

        } catch (error) {
            throw error;
        }
    }


    //#endregion progetti





    /**
     * Computed
     */
    //#region computed



    get progettiList() {

        const _this = this;
        
        const progetti = this.progetti.map(progetto => {

            // ##OLD
            // const righeProgetto = _this._getRigheProgetto(progetto.id_gruppo_righe);
            const righeProgetto = [];
            
            const selected = _this.idGruppiSelected.indexOf(progetto.id_gruppo_righe) !== -1;
            const isRigheVisible = _this.idGruppiRigheVisible.indexOf(progetto.id_gruppo_righe) !== -1;

            const ds_stato_progetto = (this.statiProgettoMap[(progetto.c_stato_progetto || "")] || {}).ds_stato_progetto || "---";

            const _codice_progetto = `${progetto.n_anno_progetto}-${progetto.c_numeratore_progetto}-${progetto.n_numero_progetto}`;
            const _cliente = `${progetto.nome} ${progetto.cognome}`;

            const prezzoProgetto = progetto.totale_lordo_gruppo;
            const prezzoProgettoFormatted = formatPrezzo(prezzoProgetto);

            const _dt_conferma_cliente_formatted = formatDate(progetto.dt_conferma_cliente);
            const _dt_create_formatted = formatDate(progetto.dt_create);
            const _dt_invio_azienda_formatted = formatDate(progetto.dt_invio_azienda);
            
            return Object.assign({}, progetto, {
                _codice_progetto: _codice_progetto,
                _cliente: _cliente,
                _dt_conferma_cliente_formatted: _dt_conferma_cliente_formatted,
                _dt_create_formatted: _dt_create_formatted,
                _dt_invio_azienda_formatted: _dt_invio_azienda_formatted,

                righe: righeProgetto,
                ds_stato_progetto: ds_stato_progetto,
                prezzoGruppo: prezzoProgetto,
                prezzoGruppoFormatted: prezzoProgettoFormatted,
                selected: selected,
                isRigheVisible: isRigheVisible,

            });

        });

        progetti.forEach(function() {
            
        });

        return progetti;

    }


    get archiviatiList() {

        const _this = this;
        
        const progetti = this.archiviati.map(progetto => {

            const righeProgetto = [];
            
            const selected = _this.idGruppiSelected.indexOf(progetto.id_gruppo_righe) !== -1;
            const isRigheVisible = _this.idGruppiRigheVisible.indexOf(progetto.id_gruppo_righe) !== -1;

            const ds_stato_progetto = (this.statiProgettoMap[(progetto.c_stato_progetto || "")] || {}).ds_stato_progetto || "---";

            const _codice_progetto = `${progetto.n_anno_progetto}-${progetto.c_numeratore_progetto}-${progetto.n_numero_progetto}`;
            const _cliente = `${progetto.nome} ${progetto.cognome}`;

            const prezzoProgetto = progetto.totale_lordo_gruppo;
            const prezzoProgettoFormatted = formatPrezzo(prezzoProgetto);

            const _dt_conferma_cliente_formatted = formatDate(progetto.dt_conferma_cliente);
            const _dt_create_formatted = formatDate(progetto.dt_create);
            const _dt_invio_azienda_formatted = formatDate(progetto.dt_invio_azienda);
            
            return Object.assign({}, progetto, {
                _codice_progetto: _codice_progetto,
                _cliente: _cliente,
                _dt_conferma_cliente_formatted: _dt_conferma_cliente_formatted,
                _dt_create_formatted: _dt_create_formatted,
                _dt_invio_azienda_formatted: _dt_invio_azienda_formatted,

                righe: righeProgetto,
                ds_stato_progetto: ds_stato_progetto,
                prezzoGruppo: prezzoProgetto,
                prezzoGruppoFormatted: prezzoProgettoFormatted,

                selected: selected,
                isRigheVisible: isRigheVisible,

            });

        });

        progetti.forEach(function() {
            
        });

        return progetti;

    }


    get prezzoTotale() {
        return this.progettiList.reduce((acc, p) => acc + p.prezzoGruppo, 0);
    }
    get prezzoTotaleFormatted() {
        return formatPrezzo(this.prezzoTotale);
    }


    //#endregion computed




    /**
     * Righe progetto
     */
    //#region righe_progetto



    async insertArticoloServizio(params = {}) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {
            
            let response = await api.insertRigaPrezzo(this.gruppoStanza.id_gruppo_righe, {
                articolo_servizio: {
                    id_articolo_servizio: params.id_articolo
                }
            });
            if (response.status === "ERROR") { throw response; }

            this.progettoDettaglioRouteInit();

            const successText = languageStore.translate("CarrelloStanzaStore.addRigaServizio_successText", "Inserimento riuscito");
            uiStore.alert(successText);

        } catch (error) {
            throw error;
        }
    }


    async updateRiga(params, rigaPrezzo) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            let id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;
            let id_riga = rigaPrezzo.id_riga;
            
            
            if (params.id_sconto1 == 0) {
                params.id_sconto1 = null;
            }
            if (params.id_sconto2 == 0) {
                params.id_sconto2 = null;
            }
            if (params.id_sconto3 == 0) {
                params.id_sconto3 = null;
            }

            const response = await api.updateRigaPrezzo(id_gruppo_righe, id_riga, params);
            if (response.status === "ERROR") { throw response; }


            this.progettoDettaglioRouteInit();

            const confirmText = languageStore.translate("CarrelloStanzaStore.updateRiga_confirmTextStato", "Modifica effettuata con successo");
            uiStore.alert(confirmText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }
    

    async updateRigaServizio(params, rigaPrezzo) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            let id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;
            let id_riga = rigaPrezzo.id_riga;

            let articoloData = {};
            if (params.c_articolo) { articoloData.c_articolo_servizio = params.c_articolo }
            if (params.ds_articolo1) { articoloData.ds_articolo_servizio1 = params.ds_articolo1 }
            if (params.ds_articolo2) { articoloData.ds_articolo2 = params.ds_articolo2 }
            if (params.im_servizio_valore) { articoloData.im_servizio_valore = params.im_servizio_valore }
            if (params.pc_iva) { articoloData.pc_iva = params.pc_iva }

            const response = await api.updateRigaPrezzo(id_gruppo_righe, id_riga, {
                articolo_servizio: articoloData
            });
            if (response.status === "ERROR") { throw response; }

            this.progettoDettaglioRouteInit();

            const successText = languageStore.translate("CarrelloStanzaStore.updateRigaServizio_successText", "Modifica effettuata");
            uiStore.alert(successText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }

    
    async deleteRigaServizioUI(id_riga) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            let id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;

            const response = await api.deleteRigaPrezzo(id_gruppo_righe, id_riga);
            if (response.status === "ERROR") { throw response; }

            this.progettoDettaglioRouteInit();

            const successText = languageStore.translate("stanzaStore.deleteRigaServizio_successText","Eliminazione effettuata");
            uiStore.alert(successText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }


    async updateRigaQta(id_riga, qta) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            let id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;

            const response = await api.updateRigaPrezzoQuantita(id_gruppo_righe, id_riga, qta);
            if (response.status === "ERROR") { throw response; }

        } catch (error) {
            throw error;
        }
    }
    async updateRigaQtaUI(id_riga, qta) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            await this.updateRigaQta(id_riga, qta);

            this.progettoDettaglioRouteInit();

            const successText = languageStore.translate("stanzaStore.updateRigaServizio_successText","Modifica effettuata");
            uiStore.alert(successText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }
    async updateRigaQtaIUIDelay(id_riga, qta) {
        const _this = this;
        dealyer.delay(function () {
            _this.updateRigaQtaUI(id_riga, qta);
        }, 500);
    }


    //#endregion righe_progetto





    // Azioni Progetti
    //#region azioni_progetti


    async updateProgettoDettaglio(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            // uiStore.showModal(<ModalLoading title="Attendere" />);

            if (params.id_sconto_testata1 == 0) {
                params.id_sconto_testata1 = null;
            }
            if (params.id_sconto_testata2 == 0) {
                params.id_sconto_testata2 = null;
            }
            if (params.id_sconto_testata3 == 0) {
                params.id_sconto_testata3 = null;
            }
            
            // params.id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;

            await api.updateProgettoTestata(this.gruppoStanza.id_gruppo_righe, params);
            this.progettoDettaglioRouteInit();

            const confirmText = languageStore.translate("CarrelloStanzaStore.deleteProgettoStanza_confirmTextStato", "Modifica effettuata con successo");

            uiStore.alert(confirmText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }


    async createAssingClienteProgetto(params) {
        const { appstore } = this;
        const { api, clientiStore, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            let response = await api.insertClienteFinale(params);
            if (response.status === "ERROR") { throw response; }

            let id_cf = response.data.result.insertId;

            response = await api.updateProgettoTestata(this.gruppoStanza.id_gruppo_righe, {
                id_cf: id_cf
            });
            if (response.status === "ERROR") { throw response; }

            this.progettoDettaglioRouteInit();

            uiStore.alert(languageStore.translate("CarrelloStanzaStore.insert_succesful", "Inserimento riuscito"));

        } catch (error) {
            throw error
        }
    }


    async setClienteProgetto(params) {
        const { appstore } = this;
        const { api, carrelloStanzaStore, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            const id_gruppo_righe = carrelloStanzaStore.gruppoStanza.id_gruppo_righe;
            
            const response = await api.updateProgettoTestata(id_gruppo_righe, params);
            if (response.status === "ERROR") { throw response; }

            carrelloStanzaStore.progettoDettaglioRouteInit();

            uiStore.alert(languageStore.translate("ClientiStore.modal_alert_dealer_info_updated", "Aggiornamento riuscito"));

        } catch (error) {
            throw error
        }
    }


    // Metodo per il componente UI select degli stati (GridStatusAction)
    async updateStatoProgettoUISelect(params, id_gruppo_righe) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            console.log("id_gruppo_righe", id_gruppo_righe);

            // uiStore.showModal(<ModalLoading title="Attendere" />);
            
            await api.updateProgettoTestata(id_gruppo_righe, params);

            this.progettiRouteInit();
            this.progettoDettaglioRouteInit();

            uiStore.alert("Modifica effettuata con successo");

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }
    async updateStatoProgetto(stato) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {
            
            const confirmText = languageStore.translate("CarrelloStanzaStore.cambiostatoProgettoStanza_confirmText", "Sei sicuro di voler modificare lo stato del progetto?");
            const successText = languageStore.translate("CarrelloStanzaStore.cambiostatoProgettoStanza_successText", "Progetto modificato con successo");
    
            uiStore.confirm(confirmText, async ()=> {
    
                uiStore.showModal(<ModalLoading title="Attendere" />);
    
                try {
                    await api.updateProgettoTestata(this.gruppoStanza.id_gruppo_righe, {
                        c_stato_progetto: stato
                    });
                    
                    this.progettoDettaglioRouteInit();
                    
                    uiStore.alert(successText);

                } catch (error) {
                    uiStore.toggleLoading(false);
                    uiStore.alert(error.message || "Error");
                    console.log(error);
                }
    
            });

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }

    
    async inviaProgettoToAzienda(params = {}) {
        const _this = this;
        const { appstore } = this;
        const { api, uiStore, formStore, languageStore, routerStore } = appstore;
        try {

            let response = null;

            uiStore.showModal(<ModalProgettoInvio 
                title={languageStore.translate("CarrelloStanzaStore.modalinvio_wait", "Attendere")}
                text={languageStore.translate("CarrelloStanzaStore.modalinvio_sending", "Invio in corso")}
            />);
            
            const id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;

            response = await api.updateProgettoTestata(id_gruppo_righe, params);

            if (response.status === "ERROR") {
                uiStore.showModal(<ModalProgettoInvio 
                    title={languageStore.translate("CarrelloStanzaStore.modalinvio_errore", "Errore")}
                    text={languageStore.translate("CarrelloStanzaStore.modalinvio_notupdated", "Ordine non inviato (azione update)")}
                />);
                this.progettoDettaglioRouteInit();
                return;
            }

            
            response = await api.inviaProgettoToAzienda(id_gruppo_righe);

            if (response.status === "ERROR") {
                uiStore.showModal(<ModalProgettoInvio 
                    title={languageStore.translate("CarrelloStanzaStore.modalinvio_errore", "Errore")} 
                    text={languageStore.translate("CarrelloStanzaStore.modalinvio_notsent", "Ordine non inviato (azione invio)")}
                />);
                this.progettoDettaglioRouteInit();
                return;
            }

            uiStore.showModal(<ModalProgettoInvio 
                title={languageStore.translate("CarrelloStanzaStore.modalinvio_success", "Successo")}
                text={languageStore.translate("CarrelloStanzaStore.modalinvio_sent", "Ordine Inviato")}
            />);

            this.progettoDettaglioRouteInit();

            return;

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async editProgetto(id_gruppo_righe) {
        const { appstore } = this;
        const { uiStore, routerStore } = appstore;
        try {

            routerStore.changePath(`stanza?p=${id_gruppo_righe}`);

        } catch (error) {
            throw error;
        }
    }


    // ##NOTA controlla se le righe prezzo di tipo gemo hanno iva o sconti impostati 
    // (diversi da quelli della testata progetto)
    _checkRighe(gruppoStanza, righePrezzo) {
        return righePrezzo
            .filter(function(rigaPrezzo) {
                return rigaPrezzo.fg_tipo_servizio === 0;
            })
            .reduce(function(acc, rigaPrezzo) {
                const checkIva = rigaPrezzo.pc_iva === gruppoStanza.pc_iva_testata;
                
                const checkSconto1 = rigaPrezzo.fg_sconto_a_valore1 === gruppoStanza.fg_sconto_testata_a_valore1
                && rigaPrezzo.id_sconto1 === gruppoStanza.id_sconto_testata1
                && rigaPrezzo.im_sconto_1 === gruppoStanza.im_sconto_testata1;
                
                const checkSconto2 = rigaPrezzo.fg_sconto_a_valore2 === gruppoStanza.fg_sconto_testata_a_valore2
                && rigaPrezzo.id_sconto2 === gruppoStanza.id_sconto_testata2
                && rigaPrezzo.im_sconto_2 === gruppoStanza.im_sconto_testata2;
                
                const checkSconto3 = rigaPrezzo.fg_sconto_a_valore3 === gruppoStanza.fg_sconto_testata_a_valore3
                && rigaPrezzo.id_sconto3 === gruppoStanza.id_sconto_testata3
                && rigaPrezzo.im_sconto_3 === gruppoStanza.im_sconto_testata3;

                return acc && checkIva && checkSconto1 && checkSconto2 && checkSconto3;

            }, true);
    }
    editProgettoSelectedUI(checkRighe = true, checkInviato = true) {
        const carrelloStanzaStore = this;
        const { appstore, gruppoStanza } = this;
        const { uiStore, languageStore, routerStore } = appstore;
        try {
            
            const { id_gruppo_righe, righePrezzo } = gruppoStanza;
            

            if(checkInviato && gruppoStanza.n_invio_azienda >= 1){
                
                const confirmText = languageStore.translate("CarrelloStanzaStore.modifyProject_confirmTextInviato", "Attenzione! L’ordine è già stato inviato in azienda. Vuoi modificare il progetto?");
                
                uiStore.confirm(confirmText, function() {
                    carrelloStanzaStore.editProgettoSelectedUI(true, false);
                });

                return;
            }

            if (checkRighe) {

                const isRigheUnchanged = this._checkRighe(gruppoStanza, righePrezzo);

                if (!isRigheUnchanged) {    
                    
                    const confirmText = languageStore.translate("CarrelloStanzaStore.modifyProject_confirmText", "Attenzione! Modificando il progetto verranno sovrascritti i dati su sconti e iva delle righe progetto con i valori presenti in testata");
                    uiStore.confirm(confirmText, function() {
                        carrelloStanzaStore.editProgetto(id_gruppo_righe);
                    });

                    return;

                }

            }
            
            this.editProgetto(id_gruppo_righe);

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }
    editProgettoUI(progetto, checkRighe = true, checkInviato = true) {
        const carrelloStanzaStore = this;
        const { appstore } = this;
        const { uiStore, languageStore, routerStore } = appstore;
        try {
            
            // const gruppoStanza = await carrelloStanzaStore.getProgetto(id_gruppo_righe);

            const { id_gruppo_righe, righePrezzo } = progetto;
            
            if(checkInviato && progetto.n_invio_azienda >= 1){

                const confirmText = languageStore.translate("CarrelloStanzaStore.modifyProject_confirmTextInviato", "Attenzione! L’ordine è già stato inviato in azienda. Vuoi modificare il progetto?");
                
                uiStore.confirm(confirmText, function() {
                    carrelloStanzaStore.editProgettoUI(progetto, true, false);
                });
                
                return;

            }

            

            if (checkRighe) {

                const isRigheUnchanged = this._checkRighe(progetto, righePrezzo);

                if (!isRigheUnchanged) {    
                
                    const confirmText = languageStore.translate("CarrelloStanzaStore.modifyProject_confirmText", "Attenzione! Modificando il progetto verranno sovrascritti i dati su sconti e iva delle righe progetto con i valori presenti in testata");
                    uiStore.confirm(confirmText, function() {
                        carrelloStanzaStore.editProgetto(id_gruppo_righe);
                    });

                    return;

                }

            }

            this.editProgetto(id_gruppo_righe);

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async deleteProgettoStanza(id_gruppo_righe) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            await api.deleteProgetto(id_gruppo_righe);

        } catch (error) {
            throw error;
        }
    }
    async deleteProgettoStanzaUI(id_gruppo_righe) {
        const _this = this;
        const { appstore } = this;
        const { uiStore, languageStore, routerStore } = appstore;
        try {

            const confirmText = languageStore.translate("CarrelloStanzaStore.deleteProgettoStanza_confirmText", "Sei sicuro di voler eliminare il progetto stanza ?");
            const successText = languageStore.translate("CarrelloStanzaStore.deleteProgettoStanza_successText", "Progetto stanza eliminato");

            uiStore.confirm(confirmText, async function () {
                try {
                    await _this.deleteProgettoStanza(id_gruppo_righe);
                    await _this.getProgetti();

                    // routerStore.changePath("/progetti");

                    uiStore.alert(successText);

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
    async deleteProgettiSelezionati() {
        const _this = this;
        try {

            const idGruppi = this.idGruppiSelected;

            const toRun = idGruppi.map(id => _this.deleteProgettoStanza(id));

            await BBPromise.all(toRun);

            runInAction(() => { this.idGruppiSelected = []; });

        } catch (error) {
            throw error;
        }
    }
    async deleteProgettiSelezionatiUI() {
        const _this = this;
        const { appstore } = this;
        const { uiStore, languageStore } = appstore;
        try {

            const confirmText = languageStore.translate("CarrelloStanzaStore.deleteProgettiStanza_confirmText", "Sei sicuro di voler eliminare i progetti selezionati ?");
            const successText = languageStore.translate("CarrelloStanzaStore.deleteProgettiStanza_successText", "Progetti eliminati");

            uiStore.confirm(confirmText, async function () {
                try {
                    await _this.deleteProgettiSelezionati();

                    await _this.getProgetti();

                    uiStore.alert(successText);

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


    async exportProgettoStanza(id_gruppo_righe) {
        const { appstore } = this;
        const { api } = appstore;
        try {
            await api.exportProgetto(id_gruppo_righe);
        } catch (error) {
            throw error;
        }
    }
    async esportaProgettiSelezionati() {
        const _this = this;
        try {

            const idGruppi = this.idGruppiSelected;

            const toRun = idGruppi.map(id => _this.exportProgettoStanza(id));

            await BBPromise.all(toRun);

        } catch (error) {
            throw error;
        }
    }
    async esportaProgettiSelezionatiUI() {
        const _this = this;
        const { appstore } = this;
        const { uiStore, languageStore } = appstore;
        try {

            const confirmText = languageStore.translate("CarrelloStanzaStore.esportaProgettiStanza_confirmText", "Sei sicuro di voler esportare i progetti selezionati ?");
            const successText = languageStore.translate("CarrelloStanzaStore.esportaProgettiStanza_successText", "Progetti esportati");

            uiStore.confirm(confirmText, async function () {
                try {
                    await _this.esportaProgettiSelezionati();
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


    async creaDaPreferito(id_gruppo_righe) {
        const { appstore } = this;
        const { api, uiStore, languageStore, routerStore } = appstore;
        try {

            let response = await api.duplicaProgetto(id_gruppo_righe);
            if (response.status === "ERROR") { throw response; }

            let idProgettoDuplicated = response.data.result.insertGruppoResult.insertId;

            response = await api.updateProgettoTestata(idProgettoDuplicated, {
                fg_preferito: 0
            });
            if (response.status === "ERROR") { throw response; }

            const confirmText = languageStore.translate("CarrelloStanzaStore.AddProgettoPreferito_confirmDaPreferitoText", "Il progetto è stato creato");

            routerStore.changePath("/carrellostanzadettaglio?p=" + idProgettoDuplicated);

            uiStore.alert(confirmText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }
    async creaPreferito(id_gruppo_righe) {
        const { appstore } = this;
        const { api, uiStore, languageStore } = appstore;
        try {

            let response = await api.duplicaProgetto(id_gruppo_righe);
            if (response.status === "ERROR") { throw response; }

            let idProgettoDuplicated = response.data.result.insertGruppoResult.insertId;

            response = await api.updateProgettoTestata(idProgettoDuplicated, {
                fg_preferito: 1
            });
            if (response.status === "ERROR") { throw response; }

            const confirmText = languageStore.translate("CarrelloStanzaStore.AddProgettoPreferito_confirmText", "Il progetto è stato copiato nei preferiti");

            uiStore.alert(confirmText);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }


    async duplicaProgettoStanza(id_gruppo_righe) {
        const { appstore } = this;
        const { api } = appstore;
        try {
            await api.duplicaProgetto(id_gruppo_righe);
        } catch (error) {
            throw error;
        }
    }
    async duplicaProgettiSelezionati() {
        const _this = this;
        try {

            const idGruppi = this.idGruppiSelected;

            const toRun = idGruppi.map(id => _this.duplicaProgettoStanza(id));

            await BBPromise.all(toRun);

        } catch (error) {
            throw error;
        }
    }
    async duplicaProgettiSelezionatiUI() {
        const _this = this;
        const { appstore } = this;
        const { uiStore, languageStore } = appstore;
        try {

            const confirmText = languageStore.translate("CarrelloStanzaStore.duplicaProgettiStanza_confirmText", "Sei sicuro di voler duplicare i progetti selezionati ?");
            const successText = languageStore.translate("CarrelloStanzaStore.duplicaProgettiStanza_successText", "Progetti duplicati");

            uiStore.confirm(confirmText, async function () {
                try {

                    await _this.duplicaProgettiSelezionati();

                    await _this.getProgetti();

                    uiStore.alert(successText);

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



    async creaPdfProgettoAzienda() {
        const { appstore } = this;
        const { api, uiStore } = appstore;
        try {

            let id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;
            const response = await api.creaPdfProgettoAzienda(id_gruppo_righe, true);
            if (response.status === "ERROR") { throw response; }

        } catch (error) {
            // uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async creaPdfProgettoConsumer() {
        const { appstore } = this;
        const { api, uiStore } = appstore;
        try {

            let id_gruppo_righe = this.gruppoStanza.id_gruppo_righe;
            const response = await api.creaPdfProgettoConsumer(id_gruppo_righe, true);
            if (response.status === "ERROR") { throw response; }

        } catch (error) {
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async archiviaProgetto(id_gruppo_righe) {
        const { appstore } = this;
        const { api, routerStore, formStore, uiStore, languageStore } = appstore;

        const confirmText = languageStore.translate("CarrelloStanzaStore.archivioProgettoStanza_confirmText", "Sei sicuro di voler archiviare il progetto?");

        uiStore.confirm(confirmText, async ()=> {
            try {
                const successText = languageStore.translate("CarrelloStanzaStore.archiviaProgetto_successText", "Progetto archiviato");
                const response = await api.archiviaProgetto(id_gruppo_righe);
                if (response.status === "ERROR") { throw response; }
                routerStore.changePath("/archiviati");
                uiStore.alert(successText);

            } catch (error) {
                uiStore.toggleLoading(false);
                uiStore.alert(error.message || "Error");
                console.log(error);
            }
        });

    }


    //#endregion azioni_progetti




}


export default Store;