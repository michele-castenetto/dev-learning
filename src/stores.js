
// main app store
import AppStore from '__src/stores/core/app.store.js';
// store to manage language
import LanguageStore from '__src/stores/core/language.store.js';
// store for routing
import RouterStore from '__src/stores/core/router.store.js';
// auth store
import AuthStore from '__src/stores/core/auth.store.js';
// ui store
import UIStore from '__src/stores/core/ui.store.js';


const appStore = new AppStore();


const languageStore = new LanguageStore(appStore);
const routerStore = new RouterStore(appStore);
const authStore = new AuthStore(appStore);
const uiStore = new UIStore(appStore);

appStore.languageStore = languageStore;
appStore.routerStore = routerStore;
appStore.authStore = authStore;
appStore.uiStore = uiStore;



// Domain Stores 


// import EngineStore from '__src/stores/domain/engine/engine.store.js';
// const engineStore = new EngineStore(appStore);
// appStore.engineStore = engineStore;



import FormStoreCore from '__src/stores/core/form.store.js';
const formStoreCore = new FormStoreCore(appStore);
appStore.formStoreCore = formStoreCore;



export default appStore;





