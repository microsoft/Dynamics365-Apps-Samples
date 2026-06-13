/**
 * Implementation depends on 
 * name="Main_system_library.js" displayName="Command_main"
 * Please use webresource dependency feature before referencing methods in this file.
 */
declare namespace XrmCore {
    export namespace Commands {
        export class Common {
            /**
             * Set State Internal.
             * @param entityId guid to update the record
             * @param entityName the entity name of the record
             * @param state Status (statecode)
             * @param status Associated Status Reason (statuscode)
             * @param closeWindow
             * @param entityToOpen the entity name of the record
             * @param entityIdToOpen the entity name of the record
             */
            // Mscrm.CommandBarActions.setState
            public static setState(entityId: string, entityName: string, stateCode: number, statusCode?: number, closeWindow?: boolean, entityToOpen?: string, entityIdToOpen?: string): void;
            
            /**
             * Set State Update.
             * @param entityId guid to update the record
             * @param entityName the entity name of the record
             * @param state Status (statecode)
             * @param status Associated Status Reason (statuscode)
             * @param closeWindow
             * @param entityToOpen the entity name of the record
             * @param entityIdToOpen the entity name of the record
             */
            // Mscrm.CommandBarActions.setStateUpdate
            public static setStateUpdate(entityId: string, entityName: string, stateCode: number, statusCode: number, closeWindow, entityToOpen: string, entityIdToOpen: string): void

            /**
             * Changes the state of an entity to a desired state.
             * @param entityType The entity logical name.
             * @param id The identifier of the entity.
             * @param activate False for deactivate, true for activate.
             */
            public static changeState(entityType: string, id: string, activate: boolean): void;

            /**
             * To handle the state change action
             * @param entityName the entity name of the record
             * @param id the id of the record
             * @param activate True to acrivate, False to deactivate
             * @param gridControl An optional parameter to specify the grid control. If passed, then we do not attempt saving the page. Instead we update the grid
             */
            // Mscrm.CommandBarActions.handleStateChangeAction
            public static handleStateChangeAction(entityName: string, id: string, activate: boolean, gridControl?: XrmClientApi.Controls.GridControl): void

            /**
             * close Set State Dialog From Grid Callback
             * @param dialogParams a dictionary of strings.
             * @param callbackParams
             * @param callback
             */
            // Mscrm.GridCommandActions.closeSetStateDialogFromGridCallback
            public static closeSetStateDialogFromGridCallback(dialogParams: XrmClientApi.Parameters, callbackParams: XrmClientApi.Parameters , gridControl: XrmClientApi.Controls.GridControl, callback?: any): void

        }
    }
}