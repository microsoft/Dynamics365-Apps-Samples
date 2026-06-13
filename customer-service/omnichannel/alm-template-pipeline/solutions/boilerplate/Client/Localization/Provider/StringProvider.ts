/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

/// <reference path="../ResourceStringProvider.d.ts" />

/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration 
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
module boilerplate {
    export class StringProvider {
        public static getResourceString(key: string): string {
            return ResourceStringProvider ? ResourceStringProvider.getResourceString(key) : `*${key}*`;
        }
    }
}