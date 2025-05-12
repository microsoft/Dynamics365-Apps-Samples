// This file keeps track of identified UCI client API gaps.
// All definitions in this file must be marked with a //ToDo: resolve dependency (work item: {work item number})
// All gaps must be resolved and this file be empty before shipping.

declare namespace XrmClientApi {
    declare module Attributes {
        export interface NumberAttribute {
            //TODO: 409143 
            setPrecision(precision: any): void;
        }
    }
}