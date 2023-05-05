import { HttpLibrary } from "./http";
import { Middleware, PromiseMiddleware } from "./middleware";
import { BaseServerConfiguration } from "./servers";
import { AuthMethods, AuthMethodsConfiguration } from "./auth";
export interface Configuration {
    readonly baseServer: BaseServerConfiguration;
    readonly httpApi: HttpLibrary;
    readonly middleware: Middleware[];
    readonly authMethods: AuthMethods;
}
/**
 * Interface with which a configuration object can be configured.
 */
export interface ConfigurationParameters {
    /**
     * Default server to use
     */
    baseServer?: BaseServerConfiguration;
    /**
     * HTTP library to use e.g. IsomorphicFetch
     */
    httpApi?: HttpLibrary;
    /**
     * The middlewares which will be applied to requests and responses
     */
    middleware?: Middleware[];
    /**
     * Configures all middlewares using the promise api instead of observables (which Middleware uses)
     */
    promiseMiddleware?: PromiseMiddleware[];
    /**
     * Configuration for the available authentication methods
     */
    authMethods?: AuthMethodsConfiguration;
}
/**
 * Configuration factory function
 *
 * If a property is not included in conf, a default is used:
 *    - baseServer: server1
 *    - httpApi: IsomorphicFetchHttpLibrary
 *    - middleware: []
 *    - promiseMiddleware: []
 *    - authMethods: {}
 *
 * @param conf partial configuration
 */
export declare function createConfiguration(conf?: ConfigurationParameters): Configuration;
//# sourceMappingURL=configuration.d.ts.map