import i18n from 'i18next';
import i18n_xhr from 'i18next-xhr-backend';
import {observable, extendObservable, action, runInAction, toJS  } from 'mobx';


// ##NOTA options example
// const options = {
//     debug: false,
//     lng: 'en',
//     // per fare in modo che che i18n non carichi le risorse dev
//     // ##TODO capire cosa sono, in teoria i18next ci salva le chiavi mancanti (capire come fare)
//     fallbackLng: 'en',
//     // per caricare en anche quando viene chiesto en-US ?
//     // load: 'languageOnly',
//     // per caricare le risorse direttamente sull'oggetto i18n
//     // resources: {
//     //     "it": {
//     //         "translation": {
//     //             "welcome": "Benvenuti in"
//     //         }
//     //     },
//     //     "en":{
//     //         "translation": {
//     //             "welcome": "Welcome to"
//     //         }
//     //     }
//     // },
//     backend: {
//         // loadPath: 'locales/i18n/{{lng}}/{{ns}}.json'
//         // ##TODO considerare la possibilità di scaricarle da un web service
//         loadPath: 'locales/i18n/{{lng}}/translation.json'
//     },
//     // opzioni react
//     react: {
//         // wait: true,
//         // bindI18n: 'languageChanged loaded',
//         // bindStore: 'added removed',
//         // nsMode: 'default'
//     }
// };


const options = {
    debug: false,
    lng: 'en',
    fallbackLng: 'en',
    backend: {
        loadPath: 'locales/i18n/{{lng}}/translation.json'
    }
};


class Store {
    
    constructor(appstore) {

        this.appstore = appstore;
        this.i18n = i18n;

        this.onChangeLanguageAction = null;
        

        extendObservable(this, {

            translationsLocal: false,
            initialized: false,

            translate: i18n.t,

            languages: [],
            language_selected: "",
            
        });

    }


    resetStore() {
        runInAction("languageStore.resetStore", () => {
            this.language_selected = "";
        });
    }


    setLanguages(languages) {
        runInAction(() => {
            this.languages = languages;
        });
    }
    async getLanguages() {
        const {appstore: { config, api } } = this;
        try {

            const response = await api.getLanguages(); 
            const languages = response.data.languages;
            this.setLanguages(languages);

        } catch (error) {
            throw error;
        }
    }
    

    

    async init(lng) {
        const {appstore: { config, api } } = this;
        try {
            
            const isDebugMode = config.settings.debug;

            await this.getLanguages();
            if (isDebugMode) { console.log("languages", toJS(this.languages) ); }


            // flag per usare le risorse delle lingue locali (cartella locales)
            const translationsLocal = config.settings.translationsLocal === true ? true : false;
            this.translationsLocal = translationsLocal;
            
            options.lng = lng;
            options.fallbackLng = lng;
            
            // ##NOTA se presenti troppe chiavi mancanti troppi log
            // options.debug = isDebugMode;


            // ##NOTA flag usato quando le risorse hanno una struttura "flat"
            // (come nel caso di quelle che arrivano da database)
            options.keySeparator = false;
            
            runInAction(() => {
                this.language_selected = lng;
            });

            if (this.translationsLocal) {
                await this.i18n.use(i18n_xhr).init(options);
            } else {
                await this.i18n.init(options);
                await this.getTraduzioniLingua(lng);
            }

        } catch (error) {
            throw error;
        }
    }


    async changeLanguage(lng) {
        try {
            this.i18n.changeLanguage(lng);
            const { api } = this.appstore;
    
            await api.setLanguage(lng);
            
            if (!this.translationsLocal) {
                await this.getTraduzioniLingua(lng);
            }

            runInAction(() => {
                this.translate = this.i18n.getFixedT(lng);
                this.language_selected = lng;
            });

            if (this.onChangeLanguageAction) { this.onChangeLanguageAction(); }


        } catch (error) {
            throw error;
        }
    }


    async getTraduzioniLingua(lng){
        try {
            const {appstore: { api } } = this;

            const response = await api.getTraduzioniLingua(lng);
            
            if (response.status === "ERROR") { return console.log(response.message); }

            const traduzioni = response.data.traduzioni[lng];
    
            this.i18n.addResourceBundle(lng, "translation", traduzioni, true, true);

        } catch (error) {
            throw error;
        }
    }

    
}


export default Store;

