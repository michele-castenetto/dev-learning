
import {observable, extendObservable, action, runInAction, autorun, computed, toJS  } from 'mobx';


class Store {
    
    constructor(appstore) {

        this.appstore = appstore;

        extendObservable(this, {
            
            data: []
            
        });

    }
    

    // computed

    get numData() {

        return this.data.length;

    }


    // actions

    loadData(categorie) {
        runInAction(() => {
            this.data = [1, 2, 3];
        });
    }



}


export default Store;