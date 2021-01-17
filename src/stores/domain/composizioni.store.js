
import {observable, extendObservable, action, runInAction, autorun, computed, toJS  } from 'mobx';


class Store {
    
    constructor(appstore) {

        this.appstore = appstore;

        
        extendObservable(this, {
            

            itemToEdit: null

            
        });


    }


    resetStore() {
        runInAction("customItemStore.resetStore", () => {
            this.itemToEdit = null;
        });
    }


    setItemToEdit(itemToEdit) {
        runInAction("setItemToEdit", () => {
            this.itemToEdit = itemToEdit;
        });
    }


    async handleInsertCustomItem() {
        const { appstore: { api, uiStore } } = this;
        try {
            
            uiStore.alert("NOT IMPLEMENTED YET!");

        } catch (error) {
            throw error;
        }
    }


    async handleUpdateCustomItem() {
        const { appstore: { api, uiStore, languageStore } } = this;
        const _this = this;
        try {
            
            const confirmText = languageStore.translate("composizioniStore.updateComposition_confirmText", "Sei sicuro di voler aggiornare la composizione ?");
            const successText = languageStore.translate("composizioniStore.updateComposition_successText", "Composizione aggiornata");
            
            uiStore.confirm(confirmText, async function() {
                try {

                    await _this.updateCustomItem();

                    setTimeout(function() {
                        uiStore.alert(successText);
                    }, 0);

                } catch (error) {
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


    async handleDeleteCustomItem() {
        const { appstore: { api, uiStore, languageStore } } = this;
        const _this = this;
        try {
            
            const confirmText = languageStore.translate("composizioniStore.deleteComposition_confirmText", "Sei sicuro di voler eliminare la composizione ?");
            const successText = languageStore.translate("composizioniStore.deleteComposition_successText", "Composizione eliminata");
            
            uiStore.confirm(confirmText, async function() {
                try {

                    await _this.deleteCustomItem();
                    
                    setTimeout(function() {
                        uiStore.alert(successText);
                    }, 0);

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
    

    async insertCustomItem() {
        const { gruppoStanza, appstore: { api, uiStore } } = this;
        try {
            
            
            // await api.insertCustomItem(c_item, ds_item, testo, configurazione);

        } catch (error) {
            throw error;
        }
    }


    // ##TODO!! va eseguito l'upload dell'immmagine ???
    async updateCustomItem() {

        const { itemToEdit, gruppoStanza, appstore } = this;
        const { api, engineStore, stanzaStore, uiStore } = appstore;

        const appViewer = engineStore.appViewer;

        try {
            
            if (!itemToEdit) { return; }
            
            const { c_articolo, ds_articolo, testo } = itemToEdit;

            // ##OLD
            // const righeArticoli = appViewer.articoli.map( (a, index) => {
            //     let geometry = null;
            //     if (a.fg_oggettoGrafico) {
            //         geometry = {
            //             movePlaneId: a.model3d.movePlane && a.model3d.movePlane.id || "",
            //             movePlaneTypes: a.model3d.movePlaneTypes,
            //             posizione: a.model3d.getPosition(),
            //             rotazioni: a.model3d.getRotations(),
            //             bounding3dInfo: a.model3d.getBounding3dInfo()
            //         };
            //     }
            //     return {
            //         id: a.id,
            //         order: index,
            //         elemento: a.elemento,
            //         geometry: geometry
            //     };
            // });
            var elementsSerialized = appViewer.serializeElements();

            const configData = JSON.stringify({
                // ##OLD
                // rows: righeArticoli
                rows: elementsSerialized
            });
            
            const response = await api.updateCustomItem(c_articolo, ds_articolo, testo, configData);

            if (response.status === "ERROR") { throw response; }

        } catch (error) {
            throw error;
        }
    }



    // ##TODO!! va modificata la api per sganciare l'item dai nodi catalogo a cui è collegato ??
    async deleteCustomItem() {
        const { itemToEdit, appstore: { api, uiStore } } = this;
        try {
            
            if (!itemToEdit) { return; }

            const c_item = itemToEdit.c_articolo;
            
            await api.deleteCustomItems([c_item]);

        } catch (error) {
            throw error;
        }
    }


    // ##TODO!! da implementare ? 
    async takeCustomItemScreenShot() {
        const { appstore: { api, uiStore, stanzaStore: { appViewer } } } = this;
        try {

            const engine3d = appViewer.engine3d;
            
            const base64data = await engine3d.getScreenShotData({
                width: 400,
                height: 400,
                // alpha: 90 * (Math.PI/180),
                // beta: 90 * (Math.PI/180),
                // radius: 6,

                // ##OLD
                // #TODO serve ancora la gestione delle lines ?
                // afterStopFn: function() {
                //     stanza.toggleAmbient(false);
                // },
                // beforeStartFn: function() {
                //     stanza.toggleAmbient(true);
                // },
            });

            var contentType = 'image/png';

            var blob = GUTILS.b64toBlob(base64data, contentType);

            var filename = "comp.png";

            GUTILS.saveBlob(blob, filename);

        } catch (error) {
            throw error;
        }
    }



    
}


export default Store;