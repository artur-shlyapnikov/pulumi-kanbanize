"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthMethods = exports.ApikeyAuthentication = void 0;
/**
 * Applies apiKey authentication to the request context.
 */
class ApikeyAuthentication {
    /**
     * Configures this api key authentication with the necessary properties
     *
     * @param apiKey: The api key to be used for every request
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    getName() {
        return "apikey";
    }
    applySecurityAuthentication(context) {
        context.setHeaderParam("apikey", this.apiKey);
    }
}
exports.ApikeyAuthentication = ApikeyAuthentication;
/**
 * Creates the authentication methods from a swagger description.
 *
 */
function configureAuthMethods(config) {
    let authMethods = {};
    if (!config) {
        return authMethods;
    }
    if (config["apikey"]) {
        authMethods["apikey"] = new ApikeyAuthentication(config["apikey"]);
    }
    return authMethods;
}
exports.configureAuthMethods = configureAuthMethods;
