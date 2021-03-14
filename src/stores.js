
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
// firebase store
import FirebaseStore from '__src/stores/core/firebase.store.js';
// ideas store
import IdeasStore from '__src/stores/core/ideas.store.js';





const appStore = new AppStore();


const languageStore = new LanguageStore(appStore);
const routerStore = new RouterStore(appStore);
const authStore = new AuthStore(appStore);
const uiStore = new UIStore(appStore);
const firebaseStore = new FirebaseStore(appStore);
const ideasStore = new IdeasStore(appStore);




appStore.languageStore = languageStore;
appStore.routerStore = routerStore;
appStore.authStore = authStore;
appStore.uiStore = uiStore;
appStore.firebaseStore = firebaseStore;

appStore.ideasStore = ideasStore;



// Domain Stores 


// import EngineStore from '__src/stores/domain/engine/engine.store.js';
// const engineStore = new EngineStore(appStore);
// appStore.engineStore = engineStore;



import FormStoreCore from '__src/stores/core/form.store.js';
const formStoreCore = new FormStoreCore(appStore);
appStore.formStoreCore = formStoreCore;



export default appStore;





