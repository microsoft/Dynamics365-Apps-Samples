/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/boilerplate/Localization/ResourceStringProvider.d.ts.
 * 2. add boilerplate/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
module boilerplate {
    export class ResourceStringProvider {
        public static WebResourceName: string = "boilerplate/Localization/Languages/boilerplate";
        public static getResourceString(key: string): string {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            
            if (value === undefined || value === null) {
                value = key;
            }

            return value;
        }
    }
}