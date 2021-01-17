
;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.GUTILS = factory();
    }
}(this, function() {



    var ENUM_StorageType = {
        LOCAL_STORAGE: "LOCAL_STORAGE",
        SESSION_STORAGE: "SESSION_STORAGE"
    };


    var Storage = (function() {
        
        function Storage(params) {
            params = params || {};
            var type = params.type;
            var namespace = params.namespace;

            this.type = type || Storage.TYPES.LOCAL_STORAGE;

            var storage = null;
            if (this.type === Storage.TYPES.LOCAL_STORAGE) {
                storage = window.localStorage;
            } else if(this.type === Storage.TYPES.SESSION_STORAGE) {
                storage = window.sessionStorage;
            }

            var prefix = window.location.host + "__";
            if (namespace) { prefix += namespace + "__"; }
            this.prefix = prefix;
            
            this.storage = storage;
        }
        
        Storage.TYPES = ENUM_StorageType;

        Storage.prototype.getkey = function(key) {
            return this.prefix + key;
        };

        Storage.prototype.get = function(key) {
            try {
                key = this.getkey(key);
                var content = this.storage.getItem(key) || null;
                return JSON.parse(content);
            } catch (error) {
                console.log(error);
                return null;
            }
        };
        
        Storage.prototype.set = function(key, data) {
            key = this.getkey(key);
            var content = JSON.stringify(data);
            this.storage.setItem(key, content);
        };
        
        Storage.prototype.del = function(key) {
            key = this.getkey(key);
            this.storage.removeItem(key);
        };
        
        Storage.prototype.reset = function() {
            this.storage.clear();
        };

        return Storage;
    })();


    return Storage;


}));