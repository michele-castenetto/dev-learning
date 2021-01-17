import { observable, extendObservable, action, runInAction, autorun, computed, toJS } from 'mobx';

import BBPromise from 'bluebird';
import { Delayer, getUrlVars } from "__src/libs/gutils.js";


class Store {

    constructor(appstore) {

        this.appstore = appstore;

        // ##WORK ?
        this._onChangeNazioniField = this._onChangeNazioniField.bind(this);

        extendObservable(this, {

            clienti: [],

            cliente: {},
            indirizzi: [],

            nazioni: [],
            province: [],
            tipi_iva: [],

        });

    }

    resetStore() {
        runInAction("ClientiStore.resetStore", () => {
            this.clienti = [];

            this.cliente = {};
            this.indirizzi = [];

            this.nazioni = [];
            this.province = [];
            this.tipi_iva = [];
        });
    }




    /**
     * Init
     */
    //#region init


    async clientiRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getClienti();
            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async clienteDettaglioRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);

            this.resetCliente();
            const queryParams = getUrlVars();
            const id_cf = queryParams.id_cf || "";

            await this.getNazioni();

            await this.getCliente(id_cf);

            await this.getIndirizziCliente(id_cf);

            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async resetCliente() {
        runInAction("ClientiStore.resetCliente", () => {
            this.cliente = {};
            this.indirizzi = [];
        });
    }


    async getNazioni() {
        const { appstore: { api } } = this;
        try {

            const response = await api.getNazioni();
            if (response.status === "ERROR") { throw response; }

            runInAction("ClientiStore.getNazioni", () => {
                this.nazioni = response.data.nazioni;
            });

        } catch (error) {
            throw error;
        }
    }


    async getTipiIva(c_nazione) {
        const { appstore: { api } } = this;
        try {

            const response = await api.getTipiIva(c_nazione);
            if (response.status === "ERROR") { throw response; }

            runInAction("ClientiStore.getTipiIva", () => {
                this.tipi_iva = response.data.tipi_iva;
            });

        } catch (error) {
            throw error;
        }
    }


    async getProvince(c_nazione) {
        const { appstore: { api } } = this;
        try {

            const response = await api.getProvince(c_nazione);
            if (response.status === "ERROR") { throw response; }

            runInAction("ClientiStore.getProvince", () => {
                this.province = response.data.province;
            });

        } catch (error) {
            throw error;
        }
    }


    //#endregion init




    /**
     * Helpers Form
     */
    //#region helpers_form

    async _updateProvinceFieldOptions(c_nazione) {
        const { appstore } = this;
        const { api, formStoreCore } = appstore;
        try {

            const field = formStoreCore.formData.findOne(field => field.key === "c_provincia");
            if (!field) { return; }
            
            field.loading = true;
            formStoreCore.updateField(field);

            let response = await api.getProvince(c_nazione);
            if (response.status === "ERROR") { throw response; }

            const province = response.data.province;

            field.options = province.map((p) => {
                return {
                    value: p.c_provincia,
                    label: p.ds_provincia
                };
            });

            field.loading = false;
            formStoreCore.updateField(field);

        } catch (error) {
            console.log(error);
        }
    }
    async _updateIvaFieldOptions(c_nazione) {
        const { appstore } = this;
        const { api, formStoreCore } = appstore;
        try {

            const field = formStoreCore.formData.findOne(field => field.key === "pc_iva");
            if (!field) { return; }

            field.loading = true;
            formStoreCore.updateField(field);

            let response = await api.getTipiIva(c_nazione);
            if (response.status === "ERROR") { throw response; }

            const tipi_iva = response.data.tipi_iva;

            field.options = tipi_iva.map((p) => {
                return {
                    value: p.pc_iva,
                    label: p.ds_iva
                };
            });

            field.loading = false;
            formStoreCore.updateField(field);

        } catch (error) {
            console.log(error);
        }
    }
    async _onChangeNazioniField(formData, field) {
        try {

            const c_nazione = field.value;

            BBPromise.all([
                this._updateProvinceFieldOptions(c_nazione),
                this._updateIvaFieldOptions(c_nazione)
            ]);

        } catch (error) {
            console.log(error);
        }
    }
    
    //#endregion helpers_form




    /**
     * Clienti
     */
    //#region cliente


    getClienteFormData() {
        const { appstore } = this;
        const { api, formStoreCore, languageStore } = appstore;
        return [
            {
                key: "id_cf",
                type: "",
                hidden: true,
            },
            {
                key: "ds_nome",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_ds_nome", "Nome"),
                placeholder: languageStore.translate("ClientiStore.placeholder_ds_nome", "Nome"),
                validation: "alternative",
                validationParams: {
                    name: "ds_cognome"
                }
            },
            {
                key: "ds_cognome",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_ds_cognome", "Cognome"),
                placeholder: languageStore.translate("ClientiStore.placeholder_ds_cognome", "Cognome"),
                validation: "alternative",
                validationParams: {
                    name: "ds_nome"
                }
            }
        ]
    }


    getClienteInfoFormSchema() {
        const { appstore } = this;
        const { api, formStoreCore, languageStore } = appstore;

        const nazioni = this.nazioni
        .map( n => { 
            return { 
                value: n.c_nazione, 
                label: n.ds_nazione
            }
        });

        return [
            {
                key: "ds_nome",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_ds_nome", "Nome"),
                placeholder: languageStore.translate("ClientiStore.placeholder_ds_nome", "Nome"),
                validation: "alternative",
                validationParams: {
                    name: "ds_cognome"
                }
            },
            {
                key: "ds_cognome",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_ds_cognome", "Cognome"),
                placeholder: languageStore.translate("ClientiStore.placeholder_ds_cognome", "Cognome"),
                validation: "alternative",
                validationParams: {
                    name: "ds_cognome"
                }
            },
            {
                key: "dt_nascita",
                type: "FormDate",
                title: languageStore.translate("ClientiStore.title_dt_nascita", "Data di nascita"),
                placeholder: languageStore.translate("ClientiStore.placeholder_dt_nascita", "Data di nascita")
            },
            {
                key: "comune_nascita",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_comune_nascita", "Comune di nascita"),
                placeholder: languageStore.translate("ClientiStore.placeholder_comune_nascita", "Comune di nascita")
            },
            // ##TODO da controllare che init sia sostituito dalle options ora valorizzate
            // ##TODO va capito quale valore assegnare a value
            // onInit: () => {
            //     clientiStore.addNazioniCliente()
            // },
            // onChange: (formData, field) => {
            //     clientiStore.updateProvinceCliente(formData, field);
            // }
            {
                key: "c_nazione_nascita",
                type: "FormSelect",
                // options: [],
                options: nazioni,
                // ##TODO ?
                // value: "",
                title: languageStore.translate("ClientiStore.title_c_nazione_nascita", "Nazione di nascita"),
                placeholder: languageStore.translate("ClientiStore.placeholder_c_nazione_nascita", "Nazione di nascita"),
                onChange: this._onChangeNazioniField,
            },
            {
                key: "c_provincia_nascita",
                type: "FormSelect",
                options: [],
                title: languageStore.translate("ClientiStore.title_c_provincia_nascita", "Provincia di nascita"),
                placeholder: languageStore.translate("ClientiStore.placeholder_c_provincia_nascita", "Provincia di nascita")
            },
            {
                key: "codice_fiscale",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_codice_fiscale", "Codice fiscale"),
                placeholder: languageStore.translate("ClientiStore.placeholder_codice_fiscale", "Codice fiscale")
            },
            {
                key: "partita_iva",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_partita_iva", "Partita IVA"),
                placeholder: languageStore.translate("ClientiStore.placeholder_partita_iva", "Partita IVA")
            }
        ];
    }



    async getClienti() {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const response = await api.getClientiFinali();
            if (response.status === "ERROR") { throw response; }

            runInAction("ClientiStore.getClienti", () => {
                this.clienti = response.data.clienti;
            });

        } catch (error) {
            throw error
        }
    }


    // ##TODO serve ? gli indirizzi dovrebbero gia arrivare con la rotta getCliente
    async getIndirizziCliente(id_cf) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const response = await api.getIndirizziClienteFinale(id_cf);
            if (response.status === "ERROR") { throw response; }

            runInAction("ClientiStore.getIndirizziCliente", () => {
                this.indirizzi = response.data.indirizzi;
            });

        } catch (error) {
            throw error
        }

    }

    
    async getCliente(id_cf) {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const response = await api.getClienteFinale(id_cf);
            if (response.status === "ERROR") { throw response; }

            runInAction("ClientiStore.getClienti", () => {
                this.cliente = response.data.cliente;
            });

        } catch (error) {
            throw error
        }
    }


    async insertCliente(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            const response = await api.insertClienteFinale(params);
            if (response.status === "ERROR") { throw response; }

            let id_cf = response.data.result.insertId;

            if (id_cf) {
                routerStore.changePath("/clientedettaglio?id_cf=" + id_cf);
            }

            uiStore.alert(languageStore.translate("ClientiStore.modal_alert_cliente_inserteded", "Inserimento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async updateCliente(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            let id_cf = null;
            if (this.cliente && this.cliente.id_cf) {
                id_cf = this.cliente.id_cf;
            }

            const response = await api.updateClienteFinale(id_cf, params);
            if (response.status === "ERROR") { throw response; }

            this.clienteDettaglioRouteInit();

            uiStore.alert(languageStore.translate("ClientiStore.modal_alert_cliente_updated", "Aggiornamento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async deleteClienteUI(id_cf) {
        const clientiStore = this;
        const { appstore } = this;
        const { api, uiStore, languageStore, routerStore } = appstore;
        try {

            uiStore.confirm(languageStore.translate("ClientiStore.modal_alert_cliente_delete_confirm", "Conferma eliminazione?"), async () => {
                try {
                    const response = await api.deleteClientiFinali([id_cf]);
                    if (response.status === "ERROR") { throw response; }

                    uiStore.alert(languageStore.translate("ClientiStore.modal_alert_cliente_deleted", "Cliente eliminato"));

                    await clientiStore.getClienti();

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


    async deleteClienteDettaglio() {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            let clienti_id = [];
            if (this.cliente && this.cliente.id_cf) {
                clienti_id = [this.cliente.id_cf];
            }

            uiStore.confirm(languageStore.translate("ClientiStore.modal_alert_cliente_delete_confirm", "Conferma eliminazione?"), async () => {
                try {
                    const response = await api.deleteClientiFinali(clienti_id);
                    if (response.status === "ERROR") { throw response; }

                    uiStore.alert(languageStore.translate("ClientiStore.modal_alert_cliente_deleted", "Cliente eliminato"));

                    routerStore.changePath("/anagrafica");

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


    //#endregion cliente




    /**
     * Indirizzi
     */
    //#region indirizzi


    getIndirizzoFormSchema() {
        const { appstore } = this;
        const { api, formStoreCore, languageStore } = appstore;

        const nazioni = this.nazioni
        .map( n => { 
            return { 
                value: n.c_nazione, 
                label: n.ds_nazione
            }
        });

        return [
            {
                key: "ds_indirizzo1",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_ds_indirizzo1", "Descrizione indirizzo 1"),
                placeholder: languageStore.translate("ClientiStore.placeholder_ds_indirizzo1", "Descrizione indirizzo 1"),
                validation: "notempty"
            },
            {
                key: "ds_indirizzo2",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_ds_indirizzo2", "Descrizione indirizzo 2"),
                placeholder: languageStore.translate("ClientiStore.placeholder_ds_indirizzo", "Descrizione indirizzo 2")
            },
            {
                key: "indirizzo1",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_indirizzo1", "Indirizzo riga 1"),
                placeholder: "Indirizzo riga 1",
                placeholder: languageStore.translate("ClientiStore.placeholder_indirizzo1", "Indirizzo riga 1"),
                validation: "notempty"
            },
            {
                key: "indirizzo2",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_indirizzo2", "Indirizzo riga 2"),
                placeholder: languageStore.translate("ClientiStore.placeholder_indirizzo2", "Indirizzo riga 2"),
            },
            {
                key: "citta",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_citta", "Città"),
                placeholder: languageStore.translate("ClientiStore.placeholder_citta", "Città"),
                validation: "notempty"
            },
            {
                key: "localita",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_localita", "Località"),
                placeholder: languageStore.translate("ClientiStore.placeholder_localita", "Località"),
                validation: "notempty"
            },
            // ##TODO controllare che l'assegnazione this.nazioni sostituisca tutta la logica della ex funzione di init
            // onInit: () => {
            //     clientiStore.addNazioni();
            // },
            {
                key: "c_nazione",
                type: "FormSelect",
                // options: [{
                //     value: "it",
                //     label: "Italia"
                // }],
                options: nazioni,
                // ##TODO valore inziale ?
                value: "it",
                title: languageStore.translate("ClientiStore.title_c_nazione", "Nazione"),
                placeholder: languageStore.translate("ClientiStore.placeholder_c_nazione", "Nazione"),
                validation: "notempty",
                onChange: this._onChangeNazioniField,
            },
            {
                key: "c_provincia",
                type: "FormSelect",
                options: [],
                title: languageStore.translate("ClientiStore.title_c_provincia", "Provincia"),
                placeholder: languageStore.translate("ClientiStore.placeholder_c_provincia", "Provincia"),
                validation: "notempty"
            },
            {
                key: "cap",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_cap", "CAP"),
                placeholder: languageStore.translate("ClientiStore.placeholder_cap", "CAP"),
                validation: "notempty"
            },
            {
                key: "separator1",
                type: "FormSeparator",
                nodata: true,
                className: "fullwidth"
            },
            {
                key: "n_latitudine",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_n_latitudine", "Latitudine"),
                placeholder: languageStore.translate("ClientiStore.placeholder_n_latitudine", "Latitudine")
            },
            {
                key: "n_longitudine",
                type: "FormText",
                title: languageStore.translate("ClientiStore.title_n_longitudine", "Longitudine"),
                placeholder: languageStore.translate("ClientiStore.placeholder_n_longitudine", "Longitudine")
            }
        ];
    }


    async insertIndirizzo(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            const response = await api.insertIndirizzoClienteFinale(this.cliente.id_cf, params);
            if (response.status === "ERROR") { throw response; }

            this.clienteDettaglioRouteInit();

            uiStore.alert(languageStore.translate("ClientiStore.modal_alert_indirizzo_inserted", "Inserimento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async updateIndirizzo(n_progressivo, params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            // ##OLD
            // const params = formStore.getFormData(data);
            // uiStore.hideModal();

            const response = await api.updateIndirizzoClienteFinale(this.cliente.id_cf, n_progressivo, params);
            if (response.status === "ERROR") { throw response; }

            this.clienteDettaglioRouteInit();

            uiStore.alert(languageStore.translate("ClientiStore.modal_alert_indirizzo_updated", "Salvataggio riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async deleteIndirizzo(n_progressivo) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore, routerStore } = appstore;
        try {

            uiStore.hideModal();

            uiStore.confirm(languageStore.translate("ClientiStore.modal_alert_indirizzo_delete_confirm", "Conferma eliminazione?"), async () => {
                try {

                    const response = await api.deleteIndirizziClienteFinale(this.cliente.id_cf, [n_progressivo]);
                    if (response.status === "ERROR") { throw response; }

                    this.clienteDettaglioRouteInit();

                    uiStore.alert(languageStore.translate("ClientiStore.modal_alert_indirizzo_deleted", "Indirizzo eliminato"));

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


    //#endregion indirizzi




    
    
    // ##OLD
    /**
     * Metodi per popolare opzioni delle form
     */
    //#region form_old


    // ##OLD
    async addNazioni() {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        const nazioni = this.nazioni || [];
        const defaultNazione = authStore.sessioninfo.dealer && authStore.sessioninfo.dealer.c_nazione_iso3 ? authStore.sessioninfo.dealer.c_nazione_iso3 : "";

        formStore.formData.map(async (field) => {
            if (field.name === "c_nazione") {
                // field.loading = true;
                let nazioni = await api.getNazioni();
                nazioni = nazioni.data.nazioni;
                field.options = nazioni.map((n) => {
                    return {
                        label: n.ds_nazione,
                        value: n.c_nazione
                    }
                });
                field.value = defaultNazione;
                this.updateProvince(null, {
                    name: "c_nazione",
                    value: defaultNazione
                })
            }
            return field;

        });

    }


    // ##OLD
    async addNazioniCliente() {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        const nazioni = this.nazioni || [];
        const defaultNazione = authStore.sessioninfo.dealer && authStore.sessioninfo.dealer.c_nazione_iso3 ? authStore.sessioninfo.dealer.c_nazione_iso3 : "";

        formStore.formData.map(async (field) => {
            if (field.name === "c_nazione_nascita") {
                // field.loading = true;
                let nazioni = await api.getNazioni();
                nazioni = nazioni.data.nazioni;
                field.options = nazioni.map((n) => {
                    return {
                        label: n.ds_nazione,
                        value: n.c_nazione
                    }
                });
                field.value = defaultNazione;
                this.updateProvinceCliente(null, {
                    name: "c_nazione_nascita",
                    value: defaultNazione
                })
            }
            return field;

        });

    }

    
    // ##OLD
    async updateProvince(formData, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        if (field.name === "c_nazione") {

            let province = await api.getProvince(field.value);
            let tipi_iva = await api.getTipiIva(field.value);
            province = province.data.province;
            tipi_iva = tipi_iva.data.tipi_iva;

            formStore.formData.map((f) => {
                if (f.name === "c_provincia") {
                    let options = province.map((pr) => {
                        return {
                            value: pr.c_provincia,
                            label: pr.ds_provincia
                        }
                    })
                    f.options = options;
                }
                else if (f.name === "pc_iva") {
                    let options = tipi_iva.map((ti) => {
                        return {
                            value: ti.pc_iva,
                            label: ti.ds_iva
                        }
                    })
                    f.options = options;
                }
                return f;
            });
        }
    }


    // ##OLD
    async updateProvinceCliente(formData, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        if (field.name === "c_nazione_nascita") {

            let province = await api.getProvince(field.value);
            province = province.data.province;

            formStore.formData.map((f) => {
                if (f.name === "c_provincia_nascita") {
                    let options = province.map((pr) => {
                        return {
                            value: pr.c_provincia,
                            label: pr.ds_provincia
                        }
                    })
                    f.options = options;
                }
                return f;
            });
        }
    }


    // ##OLD
    async updateIVA(data, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        const defaultNazione = authStore.sessioninfo.dealer && authStore.sessioninfo.dealer.c_nazione_iso3 ? authStore.sessioninfo.dealer.c_nazione_iso3 : "";

        let response = await api.getTipiIva(defaultNazione);
        if (response.status === "ERROR") { throw response; }

        let tipi_iva = response.data.tipi_iva;

        formStore.formData.map((f) => {
            if (f.name === "pc_iva") {
                let options = tipi_iva.map((ti) => {
                    return {
                        value: ti.pc_iva,
                        label: ti.ds_iva
                    }
                });
                // f.value = tipi_iva[0].pc_iva;
                f.options = options;
            }
            return f;
        });

    }


    // ##OLD
    async updateIVA_testata(data, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        const defaultNazione = authStore.sessioninfo.dealer && authStore.sessioninfo.dealer.c_nazione_iso3 ? authStore.sessioninfo.dealer.c_nazione_iso3 : "";

        let response = await api.getTipiIva(defaultNazione);

        if (response.status === "ERROR") { throw response }

        let tipi_iva = response.data.tipi_iva;

        formStore.formData.map((f) => {
            if (f.name === "pc_iva_testata") {
                let options = tipi_iva.map((ti) => {
                    return {
                        value: ti.pc_iva,
                        label: ti.ds_iva
                    }
                })
                f.options = options;
            }
            return f;
        });

    }


    // ##OLD
    async updateRiga(data, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore, routerStore } = appstore;

        const defaultNazione = authStore.sessioninfo.dealer && authStore.sessioninfo.dealer.c_nazione_iso3 ? authStore.sessioninfo.dealer.c_nazione_iso3 : "";

        let response = await api.getTipiIva(defaultNazione);
        if (response.status === "ERROR") { throw response }

        let sconti = await api.getSconti();
        if (sconti.status === "ERROR") { throw sconti }

        let tipi_iva = response.data.tipi_iva;

        let scontiValues = sconti.data.sconti.map((s) => {
            return {
                value: s.id_sconto,
                label: s.ds_sconto
            }
        });
        scontiValues.unshift({
            value: 0,
            label: "Nessuno sconto"
        });

        formStore.formData.map((f) => {

            if (f.name === "id_sconto1") {
                f.options = scontiValues;
            }
            else if (f.name === "id_sconto2") {
                f.options = scontiValues;
            }
            else if (f.name === "id_sconto3") {
                f.options = scontiValues;
            }

            else if (f.name === "pc_iva") {
                let options = tipi_iva.map((ti) => {
                    return {
                        value: ti.pc_iva,
                        label: ti.ds_iva
                    }
                });
                // f.value = tipi_iva[0].pc_iva;
                f.options = options;
            }
            return f;
        });


    }


    //#endregion form_old

    
}


export default Store;
