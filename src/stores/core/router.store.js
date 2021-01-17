import {observable, extendObservable, action, runInAction, autorun  } from 'mobx';


const createBrowserHistory = require("history").createBrowserHistory;
const createHashHistory = require("history").createHashHistory;


import { GUID } from "__src/libs/gutils.js";
import { HttpRequest } from "__src/libs/HttpRequest";


import Route from 'route-parser';


import signals from "signals";




//custom object that dispatch a `started` signal
// var myObject = {
// started : new signals.Signal()
// };
// function onStarted(param1, param2){
// alert(param1 + param2);
// }
// myObject.started.add(onStarted); //add listener
// myObject.started.dispatch('foo', 'bar'); //dispatch signal passing custom parameters
// myObject.started.remove(onStarted); //remove a single listener



class Store {
    
    constructor(appstore) {

        const _this = this;

        this.appstore = appstore;
        this.routes = [];
        this.views = {};

        this.changeRequestSignal = new signals.Signal();

        
        this.changeRequestSignal.add(this.onChangeRequestSignal.bind(this));


        extendObservable(this, {

            route: null,
            path: '/',
            previousPath: "",
            historyType: "",

        }); 

    }


    getPreviousPath() { return this.previousPath; } 

    setPreviousPath(path) { 
        this.previousPath = path || this.path; 
    } 


    setRoutes(routes) {
        runInAction(() => {
            this.routes = routes;
        });
    }


    async loadRoutes() {
        const { appstore, appstore: { config, api } } = this;
        try {
            const isDebugMode = config.settings.debug;

            let routes = [];
            const routesFilePath = `${appstore.datapath}/routes.json?${GUID.get()}`;
            
            try {
                routes = await HttpRequest.getjson(routesFilePath);
            } catch (error) {
                console.warn(`No routes file at ${routesFilePath}`);
            }

            if (isDebugMode) { console.log("routes", routes); }

            return routes;

        } catch (error) {
            throw error;
        }
    }

    
    init(routesList, views, historyType, appbasepath) {
        const _this = this;

        this.historyType = historyType || "";
        // ##TODO serve ancora ora che venga calcolato il basepath all'init ??? eseguire test
        this.appbasepath = appbasepath || "";
        this.views = views;

        this.basepath = this.getAppBasePath();

        const routesMap = routesList.reduce( (acc, r) => {
            acc[r.id] = r;
            return acc;
        }, {}); 
        runInAction(() => {
            this.routesMap = routesMap;
        });

        // aggiunge allo store le rotte
        this.routes = routesList
        .map( r => {

            return  {
                id: r.id,
                menuId: r.menuId || null,
                active: r.active === false ? false : true, 
                route: new Route(r.path),
                component: r.component,
                action: r.action,
                initAction: r.initAction,
                beforeChangeAction: r.beforeChangeAction,
                allowNotLogged: r.allowNotLogged || false,
            };

        })
        .filter( r => r.active );
        
        
        if (historyType === "browser") {
            this.history = createBrowserHistory({
                // basename: appbasepath
                basename: this.basepath
            });
        } else {
            this.history = createHashHistory();
        }
        // console.log("this.history.location.pathname", this.history.location.pathname);
        // console.log("this.path", this.path);


        // imposta il path sulla url corrente
        const path = this.history.location.pathname;
        this.execChangePath(path);

        // sync della history con il campo path dello store
        this.history.listen((location) => {
            // console.log("location", location);
            const path = location.pathname + location.search || "/";

            // console.log("history listen: location", location);
            // console.log("history listen: _this.path", _this.path);

            if (path === _this.path) { return; }

            // console.log("history listen: changePath to " + path);

            _this.changePath(path);
        });

        autorun(() => {
            const path = this.path;

            // console.log("router autorun: this.path", this.path);
            // console.log("router autorun: this.history.location.pathname", this.history.location.pathname);

            if (path === this.history.location.pathname) { return; }

            // console.log("router autorun: history push " + path);
            
            this.history.push(path);
        });

    }


    onChangeRequestSignal(path, route) {

        const { appstore } = this;

        // console.log("route", route);
        
        const currentRoute = this.route;

        if (currentRoute && currentRoute.beforeChangeAction) {

            const params = currentRoute.beforeChangeAction.split(".");
            if (params.length === 1) {
                if (!appstore[params[0]]) { return console.warn(`The action ${params[0]} does not exist on appstore!`); }

                params[0].apply(appstore);
            }
            if (params.length === 2) {
                
                if (!appstore[params[0]]) { return console.warn(`The store ${params[0]} does not exist!`); }
                if (!appstore[params[0]][params[1]]) { return console.warn(`The action ${params[1]} does not exist on store ${params[0]}!`); }
                
                // console.log(params[0]);
                // console.log(params[1]);
                // console.log(appstore[params[0]]);
                appstore[params[0]][params[1]].apply(appstore[params[0]], [path, route]);
            }

            return;
            
        }

        runInAction(() => {
            this.lastPath = this.path;
            this.path = path;
            this.route = route;
        });

        this._execRouteInitAction(route);

    }



    // changeRoute(route, params) {
    //     route.reverse(params)
    // }

    

    _findRoute(path) {

        let route = null;

        // ##OLD
        for (var i = 0; i < this.routes.length; i++) {
            let r = this.routes[i];
            const matches = r.route.match(path);
            if(matches){
                // route = {};
                // route.id = r.id;
                // route.menuId = r.menuId || null;
                // route.component = r.component;
                // route.params = matches;
                // route.path = path;
                // route.initAction = r.initAction;
                // route.beforeChangeAction = r.beforeChangeAction;
                // route.allowNotLogged = r.allowNotLogged;
                route = Object.assign({ path: path, params: matches }, r, { route: undefined });
                break;
            }        
        } 
        // ##NEW
        // const routes = this.routes.map( r => {
        //     return {
        //         route: r,
        //         match: r.route.match(path)
        //     };
        // })
        // .filter( r => r.match)
        // .map( r => {
        //     return {
        //         id: r.route.id,
        //         component: r.route.component,
        //         params: r.match,
        //         path: path,
        //         action: r.route.action
        //     };
        // })
        // .sort( (a, b) => a.matches.length - b.matches.length > 0 );
        // console.log("routes", routes);
        // route = routes.length >= 1 ? routes[0] : null;
        // console.log("route", route);


        return route;

    }


    _execRouteInitAction(route) {

        const { appstore } = this;

        if (!route) return;

        if (route.initAction) {
            const params = route.initAction.split(".");
            if (params.length === 1) {
                if (!appstore[params[0]]) { return console.warn(`The action ${params[0]} does not exist on appstore!`); }


                params[0].apply(appstore);
            }
            if (params.length === 2) {
                
                if (!appstore[params[0]]) { return console.warn(`The store ${params[0]} does not exist!`); }
                if (!appstore[params[0]][params[1]]) { return console.warn(`The action ${params[1]} does not exist on store ${params[0]}!`); }
                
                // console.log(params[0]);
                // console.log(params[1]);
                // console.log(appstore[params[0]]);
                appstore[params[0]][params[1]].apply(appstore[params[0]]);
            }
        }

    }


    execChangePath(path) {

        console.log("path", path);

        const route = this._findRoute(path);

        console.log("route", route);

        runInAction(() => {
            this.lastPath = this.path;
            this.path = path;
            this.route = route;
        });

        this._execRouteInitAction(route);

    }


    changePath(path) {

        // console.log("path", path);

        const route = this._findRoute(path);

        this.changeRequestSignal.dispatch(path, route);

    }



    get currentViewComponent() { 
        const idComponent = this.route && this.route.component || "";
        const idNotFound = "NotFound";
        const component = this.views[idComponent] || this.views[idNotFound];
        return component;
    }


    getAppBasePath() {

        const { origin, pathname } = window.location;
        let path = "";

        if (this.historyType === "browser") { 
            path = pathname.split("/").filter( o => !!o).slice(0, -1).join("/");
        } else {
            path = pathname.split("/").filter( o => !!o).join("/");
        }

        return `${origin}/${path}`;

    }

    getViewFullPath(view) {
        
        // const basepath = this.getAppBasePath();
        const basepath = this.basepath;
        
        let viewpath = "";

        if (this.historyType === "browser") { 
            viewpath = view;
        } else {
            viewpath = "/#" + view;
        }

        return basepath + viewpath;

    }



}


export default Store;