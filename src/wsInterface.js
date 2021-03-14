

var WSInterface = (function() {
        
    /**
     * @constructor WSEngine
     * @param {ENGINE3D.HttpRequest} httpService servizio utilizzato per interrogare gli endpoint 
     */
    function WSInterface(httpService) {
        this.httpService = httpService;
    }


    WSInterface.prototype.sendRequest = function(params, callback) {
        return this.httpService.sendRequest(params, callback);
    };
    WSInterface.prototype.sendFileRequest = function(params) {
        return this.httpService.sendFileRequest(params);
    };


    WSInterface.prototype.getIdeas = async function () {
        try {

            const response = await this.httpService.sendRequest({
                method: "GET",
                url: "/ideas"
            });
            return response;

        } catch (error) {
            throw error;
        }
    };


    WSInterface.prototype.getIdea = async function (id) {
        try {

            const response = await this.httpService.sendRequest({
                method: "GET",
                url: "/ideas/" + id
            });

            if (response.id === undefined) {
                return null;
            }

            return response;

        } catch (error) {
            throw error;
        }
    };


    WSInterface.prototype.insertIdea = async function (id, idea = {}) {
        try {

            if (!id) {
                throw new Error("WSInterface.insertIdea: id param must be defined.");
            }
            
            const body = Object.assign({}, idea, {id: id});
            // const body = Object.assign({}, idea);

            const response = await this.httpService.sendRequest({
                method: "POST",
                url: "/ideas",
                body: body
            });

            return response;

        } catch (error) {
            throw error;
        }
    };


    WSInterface.prototype.updateIdea = async function (id, idea) {
        try {

            if (!id) {
                throw new Error("WSInterface.updateIdea: id param must be defined.");
            }
            if (!idea) {
                throw new Error("WSInterface.updateIdea: idea param must be defined.");
            }

            const body = Object.assign({}, idea, {id: id});
            
            const response = await this.httpService.sendRequest({
                method: "PUT",
                url: "/ideas/" + id,
                body: body
            });

            return response;

        } catch (error) {
            throw error;
        }
    };


    WSInterface.prototype.deleteIdea = async function (id) {
        try {

            if (!id) {
                throw new Error("WSInterface.deleteIdea: id param must be defined.");
            }
    
            const response = await this.httpService.sendRequest({
                method: "DELETE",
                url: "/ideas/" + id
            });

            return response;

        } catch (error) {
            throw error;
        }
    };


    return WSInterface;

})();


module.exports = {
    WSInterface
};


