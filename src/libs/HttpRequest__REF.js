

// HttpRequest
;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.HttpRequest = factory();
    }
}(this, function() {


    /**
     * HttpRequest
     */
    var HttpRequest = (function() {
        
        var _clearFinalSlash =function(path) {
            return path.toString().replace(/\/$/, "");
        };

        var _xhrBlobRequest = function(params, callback) {

            var xhr = new XMLHttpRequest();

            xhr.onload = function (e) {

                // console.log(e); ???

                // ##TODO check errore ?
                // console.log("xhr", xhr); console.log("xhr.response", xhr.response);
    
                var blob = xhr.response;
                // var fileName = "download.pdf";
                var fileName = "download";
                var contentDispositionHeader = xhr.getResponseHeader("Content-Disposition") || "";
                var match = contentDispositionHeader.match(/\sfilename="([^"]+)"(\s|$)/);
                if (match) { fileName = match[1]; }
                // console.log("fileName", fileName);
    
                var inline = params.body.inline;
                
                callback(null, { 
                    blob: blob, 
                    fileName: fileName, 
                    inline: inline
                });
    
            };

            var method = params.method || "GET";
            var url = params.url;
            
            var headers = params.headers || {};

            var body = null;
            if (params.body) {
                body = JSON.stringify(params.body);
            }

            xhr.open(method, url, true);
            
            xhr.responseType = "blob";

            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }

            xhr.send(body);
    
        };

        var _readBlobAsJson = function(blob, callback) {

            var reader = new FileReader();
            
            reader.onload = function(e) {
                
                var result = {
                    isJSON: false,
                    content: null 
                };
                try {
                    var content = JSON.parse(this.result);
                    result = {
                        isJSON: true,
                        content: content 
                    };
                    callback(null, result);
                } catch (error) {
                    callback(null, result);
                }
                
            };
    
            reader.readAsText(blob);
            
        };

        var _downloadFile = function(blob, fileName, inline) {
        
            // var fileURL = window.URL.createObjectURL(blob);
            var fileURL = null;
            
            if (inline) {
                
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                    return;
                }
                
                fileURL = window.URL.createObjectURL(blob);
                window.open(fileURL);
                setTimeout(function() {
                    window.URL.revokeObjectURL(fileURL);  
                }, 0); 
                
            } else {
        
                if (window.navigator && window.navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, fileName);
                    return;
                } 
        
                fileURL = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = fileURL;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(fileURL);  
                }, 0); 
                                    
            }
        };

        var _handleJsonResult = function (error, result) {
            var res;
    
            if (error) {
                // UNSENT: 0, OPENED: 0, LOADING: 200, DONE: 200
                if (error.status === 0) {                
                    res = { status: "ERROR", statusCode: "NO_RESPONSE", message: 'No response from server!' };
                } else {
                    res = {
                        status: "ERROR",
                        message: error.message,
                        data: error
                    };
                }
            } else {
                try {
                    res = JSON.parse(result);
                } catch (e) {
                    res = { status: Response.ERROR, message: 'Error parsing JSON xhr result!' };
                }
            }
            return res;
    
        };

        var _xhrRequest = function(params, callback) {
                        
            var xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    // ##TODO controllare che lo status sia tra 200 e 300 ?
                    if (xhr.status == "200") {
                        callback(null, xhr.responseText);
                    } else {
                        callback({status: xhr.status, message: xhr.statusText, response: xhr.responseText, xhr: xhr}, null);
                    }
                }
            };
            
            var method = params.method || "GET";
            var url = params.url;
            
            var headers = params.headers || {};

            var body = null;
            if (params.body) {
                body = JSON.stringify(params.body);
            }

            xhr.open(method, url, true);
            
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
                    
            xhr.send(body);
        };

        function HttpRequest(params) {
            params = params || {};
            
            this.handleError = params.handleError === false ? false : true;

            this.server = params.server;
            this.url = params.url;
            
            this.method = params.method || "GET";
            this.body = params.body || null;
            
            this.headers = Object.assign({
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            }, params.headers);

            if (params.token) {
                Object.assign(this.headers, {
                    "x-access-token": params.token
                });
            }

        }
        

        HttpRequest.getjson = function (url, callback) {
            if (callback === undefined) {
                return new Promise(function(resolve, reject) {
                    HttpRequest.getjson(url, function(err, result) {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });
            }
            _xhrRequest({
                url: url
            }, function (err, result) {
                if (err) { return callback(err); }
                try {
                    var json = JSON.parse(result);
                    callback(null, json);
                } catch (e) {
                    callback(e);
                }
            });
        };

        HttpRequest.prototype.send = function(callback) {
            var _this = this;
            if (callback === undefined) {
                return new Promise(function(resolve, reject) {
                    _this.send(function(err, result) {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });
            }

            var url = _clearFinalSlash(this.server) + "" + this.url;

            _xhrRequest({
                method: this.method,
                url: url,
                headers: this.headers,
                body: this.body
            }, function(err, result) {
                var res = _handleJsonResult(err, result);
                if (!_this.handleError) {
                    callback(null, res);    
                    return;
                }
                
                if (res.status === "ERROR") {
                    callback(res);
                } else {
                    callback(null, res);
                }
                
            });

        };

        HttpRequest.prototype.sendFileRequest = function(callback) {

            var url = _clearFinalSlash(this.server) + "" + this.url;

            _xhrBlobRequest({
                method: this.method,
                url: url,
                headers: this.headers,
                body: this.body
            }, function(err, result) {
                if (err) { return callback(err); }
                
                var blob = result.blob;
                var fileName = result.fileName;
                var inline = result.inline;
    
                _readBlobAsJson(blob, function(err, res) {
                    if (err) { return callback(err); }
                    
                    if (res.isJSON) {
                        if (res.status === "ERROR") {
                            callback(err);
                        } else {
                            callback(null, res);
                        }
                    }
                    
                    _downloadFile(blob, fileName, inline);
    
                    callback(null);
    
                });
                
            });

        };

        HttpRequest.prototype.sendTextRequest = function(callback) {
            
            var url = _clearFinalSlash(this.server) + "" + this.url;
                        
            _xhrRequest({
                method: this.method,
                url: url,
                headers: this.headers,
                body: this.body
            }, function(err, result) {
                if (err) { return callback(err); }
                callback(null, result);
            });
        };

        return HttpRequest;

    })();

    


    /**
     * HttpService
     */
    var HttpService = (function () {


        var _clearFinalSlash =function(path) {
            return path.toString().replace(/\/$/, "");
        };

        function HttpService(server, params) {
            this.server = server ? _clearFinalSlash(server) : "";
            this.token = null;
        }


        HttpService.prototype.setServer = function (server) {
            this.server = _clearFinalSlash(server);
        };


        HttpService.prototype.setToken = function (token) {
            this.token = token;
        };


        HttpService.prototype.sendRequest = function (params, callback) {
            var _this = this;
            if (callback === undefined) {
                return new Promise(function(resolve, reject) {
                    _this.sendRequest(params, function(err, result) {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });
            }

            params = Object.assign({
                server: this.server,
                token: this.token
            }, params);

            var httpRequest = new HttpRequest(params);
            return httpRequest.send(callback);

        };


        HttpService.prototype.sendFileRequest = function (params, callback) {
            var _this = this;
            if (callback === undefined) {
                return new Promise(function(resolve, reject) {
                    _this.sendFileRequest(params, function(err, result) {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });
            }

            params = Object.assign({
                server: this.server,
                token: this.token
            }, params);

            var httpRequest = new HttpRequest(params);
            return httpRequest.sendFileRequest(callback);
            
        };

        return HttpService;

    })();




    /**
     * TSRequest
     */
    var TSRequest = (function () {
        function Request(params) {
            params = params || {};
            this.time = params.time || (new Date()).toISOString();
            this.apiVersion = params.apiVersion || "";
            this.appVersion = params.appVersion || "";
            this.data = params.data || null;
        }

        return Request;

    })();
    /**
     * TSResponse
     */
    var TSResponse = (function () {
        function Response(params) {
            params = params || {};
            this.logout = params.logout !== undefined ? params.logout : undefined;
            this.time = params.time || new Date().toISOString();
            this.status = params.status || Response.OK;
            this.statusCode = params.statusCode || "";
            this.message = params.message || "";
            this.data = params.data || null;
        }

        Response.OK = 'OK';
        Response.ERROR = 'ERROR';
        Response.WARN = 'WARNING';

        return Response;
    })();




    /**
     * TSHttpService
     */
    var TSHttpService = (function() {
    
        function TSHttpService(server) {
            HttpService.call(this);
            this.server = server;
            return this;
        }

        TSHttpService.prototype = Object.create(HttpService.prototype);
        TSHttpService.prototype.constructor = TSHttpService;


        TSHttpService.prototype.sendRequest = function (params, callback) {

            var _this = this;
            if (callback === undefined) {
                return new Promise(function(resolve, reject) {
                    _this.sendRequest(params, function(err, result) {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });
            }

            if (params.body) {
                params.body = new TSRequest({ data: params.body.data });
            }

            params = Object.assign({
                server: this.server,
                token: this.token
            }, params);

            var httpRequest = new HttpRequest(params);
            return httpRequest.send(function(err, result) {
                if (err) { return callback(err); }
                var response = new TSResponse(result);
                callback(null, response);
            });

        };
        
        TSHttpService.prototype.sendFileRequest = function (params, callback) {
            var _this = this;
            if (callback === undefined) {
                return new Promise(function(resolve, reject) {
                    _this.sendFileRequest(params, function(err, result) {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });
            }

            if (params.body) {
                params.body = new TSRequest({ data: params.body.data });
            }

            params = Object.assign({
                server: this.server,
                token: this.token
            }, params);

            var httpRequest = new HttpRequest(params);
            return httpRequest.sendFileRequest(function(err, result) {
                if (err) { return callback(err); }
                var response = new TSResponse(result);
                callback(null, response);
            });
            
        };

        return TSHttpService;

    })();


    

    return {
        HttpRequest,
        HttpService,

        TSRequest,
        TSResponse,
        TSHttpService,

    };


}));











