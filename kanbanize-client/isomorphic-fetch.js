"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsomorphicFetchHttpLibrary = void 0;
const http_1 = require("./http");
const rxjsStub_1 = require("./rxjsStub");
const fetch_ponyfill_1 = __importDefault(require("fetch-ponyfill"));
const { fetch } = (0, fetch_ponyfill_1.default)();
class IsomorphicFetchHttpLibrary {
    send(request) {
        let method = request.getHttpMethod().toString();
        let body = request.getBody();
        const resultPromise = fetch(request.getUrl(), {
            method: method,
            body: body,
            headers: request.getHeaders(),
            credentials: "same-origin"
        }).then((resp) => {
            const headers = {};
            resp.headers.forEach((value, name) => {
                headers[name] = value;
            });
            const body = {
                text: () => resp.text(),
                binary: () => resp.blob()
            };
            return new http_1.ResponseContext(resp.status, headers, body);
        });
        return (0, rxjsStub_1.from)(resultPromise);
    }
}
exports.IsomorphicFetchHttpLibrary = IsomorphicFetchHttpLibrary;
