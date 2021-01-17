import { observable, extendObservable, action, runInAction, autorun, computed, toJS } from 'mobx';


class Store {

    constructor(appstore) {

        this.appstore = appstore;

        extendObservable(this, {

            info: {},
            sconti: [],
            servizi: []

        });

    }

    resetStore() {
        runInAction("DealerStore.resetStore", () => {
            this.info = {};
            this.sconti = [];
            this.servizi = [];
        });
    }


    /**
     * Init
     */
    //#region init


    async dealerRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getInfo();
            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async scontiRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getSconti();
            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async serviziRouteInit() {
        const { appstore } = this;
        const { uiStore } = appstore;
        try {

            uiStore.toggleLoading(true);
            await this.getServizi();
            uiStore.toggleLoading(false);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion init



    
    /**
     * Dealer
     */
    //#region dealer


    async getInfo() {
        const { appstore } = this;
        const { api, authStore, uiStore } = appstore;
        try {

            // ##OLD
            // const response = await api.getRivenditoreData({});
            // if (response.status === "ERROR") { throw response }
            // this.info = response.data.rivenditore.rivenditore;

            await authStore.getSessionInfo({});

            const dealerInfo = authStore.sessioninfo.dealer;

            runInAction("DealerStore.getInfo", () => {

                this.info = {
                    logo_rivenditore: dealerInfo.logo,
                    c_cliente: dealerInfo.c_cliente,
                    ds_cliente: dealerInfo.ds_cliente,
                    c_cliente_gruppo: dealerInfo.c_cliente_gruppo,
                    c_nazione: dealerInfo.c_nazione,
                    decimali_arrotondamento: dealerInfo.decimali_rivenditore,
                    pc_iva_rivenditore: dealerInfo.pc_iva_rivenditore,
                };

            });

        } catch (error) {
            throw error;
        }

    }


    async updateInfo(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {
            
            uiStore.hideModal();

            const response = await api.setDealerData({
                pc_iva: params.pc_iva_rivenditore,
                decimali: params.decimali_arrotondamento,
            });
            if (response.status === "ERROR") { throw response; }

            await this.getInfo();

            uiStore.alert(languageStore.translate("DealerStore.modal_alert_dealer_info_updated", "Aggiornamento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }

    }


    async handleImageUpload(files) {
        var _this = this;
        const { appstore: { api, uiStore, formStore, languageStore } } = this;
        try {

            var reader = new FileReader();
            var file = files[0];

            reader.onload = async function (e) {
                try {

                    let r = e.target.result;
                    r = r.split(',')[1];
                    const response = await api.setDealerData({
                        logo: r
                    });
                    if (response.status === "ERROR") { throw response; }

                    _this.getInfo();

                    uiStore.alert(languageStore.translate("DealerStore.modal_alert_dealer_info_updated", "Aggiornamento riuscito"));

                } catch (error) {
                    uiStore.toggleLoading(false);
                    uiStore.alert(error.message || "Error");
                    console.log(error);
                }
            };

            reader.readAsDataURL(file);

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion dealer




    /**
     * Sconti
     */
    //#region sconti


    getScontoFormSchema() {
        const { appstore } = this;
        const { api, formStoreCore, languageStore } = appstore;
        return [
            {
                key: "id_sconto",
                type: "",
                hidden: true,
            },
            {
                key: "ds_sconto",
                type: "FormText",
                title: languageStore.translate("ScontiView.title_ds_sconto", "Descrizione"),
                placeholder: languageStore.translate("ScontiView.placeholder_ds_sconto", "Descrizione")
            },
            {
                key: "fg_a_valore",
                type: "FormSelect",
                options: [
                    { value: 0, label: "Percentuale" },
                    { value: 1, label: "Importo" }
                ],
                value: 0,
                title: languageStore.translate("ScontiView.title_fg_a_valore", "Tipo sconto"),
                placeholder: languageStore.translate("ScontiView.placeholder_fg_a_valore", "Tipo sconto"),
                onLoad: async (fieldLoaded) => {
                    try {

                        const value = parseInt(fieldLoaded.value);

                        const formData = formStoreCore.formData.map((field) => {

                            if (field.key === "im_sconto") {
                                field.hidden = (value !== 1);
                            }
                            if (field.key === "pc_sconto") {
                                field.hidden = (value === 1);
                            }

                            return field;
                        });

                        formStoreCore.setFormData(formData);

                    } catch (error) {
                        throw error;
                    }
                },
                onChange: async (formData, fieldChanged) => {
                    try {

                        if (!fieldChanged) {
                            fieldChanged = formStoreCore.formData.findOne(field => field.key === "fg_a_valore");
                        }

                        if (!fieldChanged) { return; }

                        const value = parseInt(fieldChanged.value);

                        const formData = formStoreCore.formData.map((field) => {

                            if (field.key === "im_sconto") {
                                field.hidden = (value !== 1);
                            }
                            if (field.key === "pc_sconto") {
                                field.hidden = (value === 1);
                            }

                            return field;
                        });

                        formStoreCore.setFormData(formData);

                    } catch (error) {
                        throw error;
                    }
                }
            },
            {
                key: "pc_sconto",
                type: "FormText",
                title: languageStore.translate("ScontiView.title_pc_sconto", "Valore percentuale"),
                placeholder: languageStore.translate("ScontiView.placeholder_pc_sconto", "Valore percentuale")
            },
            {
                key: "im_sconto",
                type: "FormText",
                title: languageStore.translate("ScontiView.title_im_sconto", "Valore importo"),
                placeholder: languageStore.translate("ScontiView.placeholder_im_sconto", "Valore importo")
            },
            {
                key: "fg_add_to_gruppo",
                type: "FormToggle",
                title: languageStore.translate("ScontiView.title_fg_add_to_gruppo", "Rendi comune al gruppo"),
                placeholder: languageStore.translate("ScontiView.placeholder_fg_add_to_gruppo", "Rendi comune al gruppo")
            }
        ];
    }


    async getSconti() {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const response = await api.getSconti();

            if (response.status === "ERROR") { throw response; }

            runInAction("DealerStore.getSconti", () => {
                this.sconti = response.data.sconti;
            });

        } catch (error) {
            throw error;
        }
    }


    async insertSconto(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {

            //##OLD
            // const params = formStore.getFormData(data);
            // delete params['id_sconto'];

            uiStore.hideModal();

            const response = await api.insertSconto(params);

            if (response.status === "ERROR") { throw response; }

            this.getSconti();

            uiStore.alert(languageStore.translate("dealerStore.modal_alert_dealer_sconto_insert", "Inserimento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async updateSconto(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {

            // ##OLD
            // const params = formStore.getFormData(data);
            const id_sconto = params.id_sconto;
            // delete params['id_sconto'];

            uiStore.hideModal();

            const response = await api.updateSconto(id_sconto, params);
            if (response.status === "ERROR") { throw response; }

            this.getSconti();

            uiStore.alert(languageStore.translate("DealerStore.modal_alert_dealer_sconto_updated", "Aggiornamento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async deleteSconto(sconto) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {

            let id_sconti = [];
            if (sconto && sconto.id_sconto) {
                id_sconti = [sconto.id_sconto];
            }

            uiStore.hideModal();

            uiStore.confirm(languageStore.translate("DealerStore.modal_alert_dealer_sconto_delete_confirm", "Conferma eliminazione?"), async () => {

                const response = await api.deleteSconti(id_sconti);
                if (response.status === "ERROR") { throw response; }

                this.getSconti();

                uiStore.alert(languageStore.translate("DealerStore.modal_alert_dealer_sconto_deleted", "Sconto eliminato"));

            });

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion sconti




    /**
     * Servizi
     */
    //#region servizi


    getServizioFormSchema() {
        const { appstore } = this;
        const { api, formStoreCore, languageStore } = appstore;
        return [
            {
                key: "id_articolo",
                type: "",
                hidden: true,
            },
            {
                key: "fg_tipo_servizio",
                type: "",
                value: 2,
                hidden: true,
            },
            {
                key: "fg_servizio_a_valore",
                type: "FormSelect",
                options: [
                    { value: 0, label: languageStore.translate("ServiziView.percentuale", "Percentuale") },
                    { value: 1, label: languageStore.translate("ServiziView.importo", "Importo") }
                ],
                title: languageStore.translate("ServiziView.title_fg_servizio_a_valore", "Tipo"),
                placeholder: languageStore.translate("ServiziView.placeholder_fg_servizio_a_valore", "Tipo"),
                value: 1,
                onLoad: async (fieldLoaded) => {
                    try {

                        const value = parseInt(fieldLoaded.value);

                        const formData = formStoreCore.formData.map((field) => {

                            if (field.key === "im_prezzo") {
                                field.hidden = (value !== 1);
                            }
                            if (field.key === "pc_servizio") {
                                field.hidden = (value === 1);
                            }

                            return field;
                        });

                        formStoreCore.setFormData(formData);

                    } catch (error) {
                        throw error;
                    }
                },
                onChange: async (formData, fieldChanged) => {
                    try {

                        if (!fieldChanged) {
                            fieldChanged = formStoreCore.formData.findOne(field => field.key === "fg_servizio_a_valore");
                        }

                        if (!fieldChanged) { return; }

                        const value = parseInt(fieldChanged.value);

                        const formData = formStoreCore.formData.map((field) => {

                            if (field.key === "im_prezzo") {
                                field.hidden = (value !== 1);
                            }
                            if (field.key === "pc_servizio") {
                                field.hidden = (value === 1);
                            }

                            return field;
                        });

                        formStoreCore.setFormData(formData);

                    } catch (error) {
                        throw error;
                    }
                }
            },
            {
                key: "c_articolo",
                type: "FormText",
                title: languageStore.translate("ServiziView.title_c_articolo", "Codice"),
                placeholder: languageStore.translate("ServiziView.placeholder_c_articolo", "Codice"),
                validation: "notempty"
            },
            {
                key: "ds_articolo1",
                type: "FormText",
                title: languageStore.translate("ServiziView.title_ds_articolo1", "Descrizione 1"),
                placeholder: languageStore.translate("ServiziView.placeholder_ds_articolo1", "Descrizione 1"),
                validation: "notempty"
            },
            {
                key: "ds_articolo2",
                type: "FormText",
                title: languageStore.translate("ServiziView.title_ds_articolo2", "Descrizione 2"),
                placeholder: languageStore.translate("ServiziView.placeholder_ds_articolo2", "Descrizione 2"),
                validation: "notempty"
            },
            {
                key: "im_prezzo",
                type: "FormText",
                title: languageStore.translate("ServiziView.title_im_prezzo", "Importo"),
                placeholder: languageStore.translate("ServiziView.placeholder_im_prezzo", "Importo")
            },
            {
                key: "pc_servizio",
                type: "FormNumber",
                title: languageStore.translate("ServiziView.title_pc_servizio", "Percentuale"),
                placeholder: languageStore.translate("ServiziView.placeholder_pc_servizio", "Percentuale")
            },
            {
                key: "fg_add_to_gruppo",
                type: "FormToggle",
                title: languageStore.translate("ServiziView.title_fg_add_to_gruppo", "Rendi comune al gruppo"),
                placeholder: languageStore.translate("ServiziView.placeholder_fg_add_to_gruppo", "Rendi comune al gruppo")
            }
        ];
    }


    async getServizi() {
        const { appstore } = this;
        const { api } = appstore;
        try {

            const response = await api.getArticoliServizio();
            if (response.status === "ERROR") { throw response; }

            runInAction("DealerStore.getServizi", () => {
                this.servizi = response.data.articoli;
            });

        } catch (error) {
            throw error
        }
    }


    async insertServizio(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {

            // ##OLD(1)
            // const params = formStore.getFormData(data);
            // delete params['id_servizio'];

            uiStore.hideModal();

            const response = await api.insertArticoloServizio(params);
            if (response.status === "ERROR") { throw response; }

            this.getServizi();

            uiStore.alert(languageStore.translate("DealerStore.modal_alert_servizio_insert", "Inserimento riuscito"));

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    async updateServizio(params) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {

            // ##OLD
            // const params = formStore.getFormData(data);
            const id_articolo = params.id_articolo;
            // delete params['id_articolo'];

            // if(params.fg_servizio_a_valore === 1) {
            //     delete params['pc_servizio'];
            // } else {
            //     delete params['im_prezzo'];
            // }

            uiStore.hideModal();

            const response = await api.updateArticoloServizio(id_articolo, params);
            if (response.status === "ERROR") { throw response; }

            this.getServizi();

            uiStore.alert(languageStore.translate("DealerStore.modal_alert_dealer_articolo_updated", "Aggiornamento riuscito"));

        } catch (error) {
            console.log(error);
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
        }
    }


    async deleteServizio(articolo) {
        const { appstore } = this;
        const { api, formStore, uiStore, languageStore } = appstore;
        try {

            let id_articoli = [];
            if (articolo && articolo.id_articolo) {
                id_articoli = [articolo.id_articolo];
            }

            uiStore.hideModal();

            uiStore.confirm(languageStore.translate("DealerStore.modal_alert_dealer_articolo_delete_confirm", "Conferma eliminazione?"), async () => {

                const response = await api.deleteArticoliServizio(id_articoli);
                if (response.status === "ERROR") { throw response; }

                this.getServizi();

                uiStore.alert(languageStore.translate("DealerStore.modal_alert_dealer_articolo_deleted", "Sconto eliminato"));

            });

        } catch (error) {
            uiStore.toggleLoading(false);
            uiStore.alert(error.message || "Error");
            console.log(error);
        }
    }


    //#endregion servizi





    
    // ##OLD
    //#region form_old

    // ##OLD
    async updateIVA(data, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore } = appstore;
        try {

            const defaultNazione = authStore.sessioninfo.dealer && authStore.sessioninfo.dealer.c_nazione_iso3 ? authStore.sessioninfo.dealer.c_nazione_iso3 : "";

            let response = await api.getTipiIva(defaultNazione);
            if (response.status === "ERROR") { throw response; }

            let tipi_iva = response.data.tipi_iva;

            formStore.formData.map((f) => {
                if (f.name === "pc_iva_rivenditore") {
                    let options = tipi_iva.map((ti) => {
                        return {
                            value: ti.pc_iva,
                            label: ti.ds_iva
                        };
                    });
                    f.options = options;
                }
                return f;
            });

        } catch (error) {
            throw error;
        }
    }


    // ##OLD
    updateCampiSconto(data, _field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore } = appstore;
        try {

            let field = _field;

            if (!_field) {
                field = formStore.formData.find((f) => {
                    return f.name === "fg_a_valore";
                })
            }

            if (field.name === "fg_a_valore") {
                let value = parseInt(field.value);

                formStore.formData.map((f) => {

                    if (f.name === "im_sconto") {
                        f.type = value === 1 ? "FormText" : "FormPrivate"
                    }
                    if (f.name === "pc_sconto") {
                        f.type = value !== 1 ? "FormText" : "FormPrivate"
                    }

                    return f;
                });

            }

        } catch (error) {
            throw error;
        }
    }


    // ##OLD
    updateCampiScontoServizio(data, _field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore } = appstore;
        try {

            let field = _field;

            if (!_field) {
                field = formStore.formData.find((f) => {
                    return f.name === "fg_servizio_a_valore";
                })
            }

            if (field.name === "fg_servizio_a_valore") {
                let value = parseInt(field.value);

                formStore.formData.map((f) => {

                    if (f.name === "im_prezzo") {
                        f.type = value === 1 ? "FormText" : "FormPrivate"
                    }
                    if (f.name === "pc_servizio") {
                        f.type = value !== 1 ? "FormText" : "FormPrivate"
                    }

                    return f;
                });

            }

        } catch (error) {
            throw error;
        }
    }


    // ##OLD
    async updateServizi(data, field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore } = appstore;
        try {

            const response = await api.getArticoliServizio();
            if (response.status === "ERROR") { throw response; }

            formStore.formData.map((f) => {

                if (f.name === "id_articolo") {
                    f.options = response.data.articoli.map((r) => {
                        return {
                            value: r.id_articolo,
                            label: r.ds_articolo1
                        };
                    });
                }

                return f;
            });

        } catch (error) {
            throw error;
        }
    }


    // ##OLD
    async updateScontoTestata(data, _field) {
        const { appstore } = this;
        const { api, authStore, formStore, uiStore, languageStore } = appstore;
        try {

            let field = _field;

            let sconti = await api.getSconti();

            if (sconti.status === "ERROR") { throw sconti }

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

                if (f.name === "id_sconto_testata1") {
                    f.options = scontiValues;
                }
                else if (f.name === "id_sconto_testata2") {
                    f.options = scontiValues;
                }
                else if (f.name === "id_sconto_testata3") {
                    f.options = scontiValues;
                }

                return f;
            });

        } catch (error) {
            throw error;
        }
    }

    //#endregion form_old




}


export default Store;
