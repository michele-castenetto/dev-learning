import { observable, extendObservable, action, runInAction, autorun, toJS } from 'mobx';


const validations = {

    // # Campo non deve essere vuoto

    // notempty: function (field, formData) {
    //     field.valid = true;
    //     field.validationMessage = null;
    //     return field;
    // },
    // ##OLD
    notempty: function (field, formData) {
        if (!field.value || field.value === "") {
            field.valid = false;
            field.validationMessage = "Field can not be empty";
        }
        else {
            field.valid = true;
            field.validationMessage = null;
        }
        return field;
    },


    // # Almeno uno dei due campi non deve essere vuoto
    // alternative: function (field, formData) {
    //     let altFieldName = field.validationParams.name;
    //     let altField = formData.find((f) => {
    //         return (f.name === altFieldName);
    //     });
    //     let altFieldEmpty = (altField && (!altField.value || altField.value === ""));
    //     let fieldEmpty = (!field.value || field.value === "");

    //     console.log("values", altField, formData, altFieldName);

    //     if (fieldEmpty && altFieldEmpty) {
    //         field.invalid = true;
    //         field.validationMessage = languageStore.translate("formStore.validation_alternative", `Almeno uno tra ${field.title} e ${altField.title} non può essere vuoto`);
    //     }
    //     else {
    //         field.invalid = false;
    //         field.validationMessage = null;
    //     }
    //     return field;
    // }


};


class Store {

    constructor(appstore) {

        this.appstore = appstore;

        extendObservable(this, {

            formData: [],

        });

    }


    resetStore() {
        runInAction("FormStore.resetStore", () => {
            this.formData = [];
        });
    }


    setFormData(formData) {
        runInAction("formStore.setFormData", () => {
            this.formData = formData;
        });
    }


    async loadData(params = {}) {

        let schema = params.schema || [];
        let data = params.data || {};


        const formData = schema.map((field) => {
            if (data.hasOwnProperty(field.key)) {
                field.value = data[field.key] || field.value || "";
            }
            else {
                field.value = field.value;
            }
            return field;
        });
        
        runInAction("formStore.loadData", () => {
            this.formData = formData;
        });

        // ##TODO gestire eventuali async ?
        formData.forEach((field) => {
            if (field.onLoad) {
                field.onLoad(field);
            }
        });

        if (params.onLoaded) {
            params.onLoaded(formData);
        }

    }

    
    async updateData(key, val, property = "value") {

        let fieldChanged = null;

        let formData = this.formData.map((field) => {
            if (field.key === key) {
                fieldChanged = field;
                field[property] = val;
            }
            return field;
        });
        // console.log("formData", formData);

        runInAction("formStore.updateData", () => {
            this.formData = formData;
        });

        if (fieldChanged.onChange) {
            fieldChanged.onChange(formData, fieldChanged);
        }

    }


    updateField(fieldUpdated) {
        const formData = this.formData.map(field => {
            if (field.key === fieldUpdated.key) {
                return fieldUpdated;
            }
            return field;
        });
        runInAction("formStore.updateField", () => {
            this.formData = formData;
        });
    }


    getData() {
        return this.formData.reduce(function (acc, field) {
            if (field.nodata !== true) {
                acc[field.key] = field.value;
            }
            return acc;
        }, {});
    }


    validateData(callbackValid, callbackInvalid, resetOnSuccess = true) {
        const _this = this;

        let formData = this.formData.map((field) => {

            field.valid = true;
            field.validationMessage = null;

            let validationFn = validations[field.validation || ""];
            if (validationFn) {
                field = validationFn(field, _this.formData);
            }

            return field;
        });


        let valid = formData.reduce(function (acc, field) {
            return acc && field.valid;
        }, true);

        return { valid, formData };


        // if (valid === false) {
        //     this.formData = result;
        //     if (callbackInvalid) {
        //         callbackInvalid(result);
        //     }
        //     return result;
        // }

        // ##TODO gestire reset ?
        // if (resetOnSuccess === true) {
        //     this.formData = [];
        // }

        // ##TODO gestire funzione success qui ?
        // if (callbackValid) {
        //     callbackValid(result);
        // }
        // return result;

    }


}


export default Store;
