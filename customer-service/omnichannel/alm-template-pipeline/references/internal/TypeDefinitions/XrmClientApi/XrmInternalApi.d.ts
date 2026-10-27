declare namespace XrmClientApi {
    export interface XrmStatic {
        /**
         * Provides a namespace container for the current page's form.
         */

        Page: Form;
        ClientState: any;
        Internal: XrmInternalApi.XrmInternalApi;
        LookupObject: any;
        LookupOptions: any;
        LookupStyle: any;
        DialogOptions: any;
        SaveOptions: any;
        Objects: any;
        ClientName: any;
        Gen: any;
        SaveMode: any;
        Dialog: any;
        AlertDialogStrings: any;
        ConfirmDialogStrings: any;
        FormType: any;
        RequiredLevel: any;
        SubmitMode: any;
        OptionSetItem: any;
    }

    export module Controls {

        export interface Control {
            addCustomFilter(fetchXmlFilter: string, entityType?: string): void;
            getAttribute(): Attributes.Attribute;
            allowUserToDisableRelationshipFilter(param: boolean): any
            setDefaultView(viewId: string): void;
            clearNotifications(): void;
            addOnLoad(handler: any): void;
            setDisabled(disabled: boolean): void;
            setParameter(name: string, value: string): void;

            /**
			 * Removes the option matching the value.
			 *
			 * @param   {number} value   The value.
			 */
            removeOption(value: number): void;


            /**
			 * Sets weather or not to allow user to disable relationshipfilter
			 * @param {boolean}   allow true to allow, false to not allow.
			 */
            allowUserToDisableRelationshipFilter(allow: boolean): void;
        }
    }

    export interface FormData {
        getIsValid(): boolean;
        setFormDirty(set: boolean): void;
    }

    export module Attributes {
        /**
         * Interface for an Entity attribute.
         */
        export interface Attribute {
            getMin(): number;
            getMax(): number;
            setCurrencySymbol(symbol: any): void;

            /**
			 * Gets selected option.
			 *
			 * @return  The selected option.
			 */
            getSelectedOption(): OptionSetItem;

            /**
			 * Gets all of the options.
			 *
			 * @return  An array of options.
			 */
            getOptions(): OptionSetItem[];
        }
    }

    /**
* Interface for a grid.  Use Grid methods to access information about data in the grid. Grid is returned by the
* GridControl.getGrid method.
*/
    export module Grid {
		/**
		 * Interface for a grid row.  Use the GridRow.getData method to access the GridRowData. A collection of GridRow is
		 * returned by Grid.getRows and Grid.getSelectedRows methods.
		 */
        export interface GridRow {
			/**
			 * Returns the GridRowData for the GridRow.
			 *
			 * @return  The data.
			 */
            getData(): GridRowData;
        }

		/**
		 * Interface for grid row data.  Use the GridRowData.getEntity method to access the GridEntity. GridRowData is
		 * returned by the GridRow.getData method.
		 */
        export interface GridRowData {
			/**
			 * Returns the GridEntity for the GridRowData.
			 *
			 * @return  The entity.
			 */
            getEntity(): GridEntity;
        }
    }

	/**
	 * Interface for the xRM application context.
	 */
    interface GlobalContext {
        /**
		 * Gets user's unique identifier.
		 *
		 * @return  The user's identifier in Guid format.
		 *
		 * @remarks Example: "{B05EC7CE-5D51-DF11-97E0-00155DB232D0}"
		 */
        getUserId(): string;

		/**
		 * Gets query string parameters.
		 *
		 * @return  The query string parameters, in a dictionary object representing name and value pairs.
		 */
        getQueryStringParameters(): { [key: string]: string };

        getTimeZoneOffsetMinutes(): number;

        getOrgLcid(): string;

        saveMode: any;
    }

	/**
	 * Interface for Xrm.Utility.
	 */
    export interface Utility {
		/**
		 * Displays an alert dialog, with an "OK" button.
		 *
		 * @param   {string}  message   The message.
		 * @param   {function()} onCloseCallback The "OK" callback.
		 */
        alertDialog(message: string, onCloseCallback?: () => void): void;

		/**
		 * Displays a confirmation dialog, with "OK" and "Cancel" buttons.
		 *
		 * @param   {string}  message The message.
		 * @param   {function()} yesCloseCallback The "OK" callback.
		 * @param   {function()} noCloseCallback  The "Cancel" callback.
		 */
        confirmDialog(message: string, yesCloseCallback?: () => void, noCloseCallback?: () => void): void;

        isEntityOfflineSyncEnabled(entityName: any): boolean;

        isMocaOffline(): boolean;

        retrieveEntityRecord(reference: any, columnNames: any, successCallback: any, failedCallback: any): any;

        executeNonCudCommand(commandName: any, entityName: any, request: any, successDeferredCallback: any, failedCallback: any): any;

        create(entityName: string, entityReference: any, param: any, param1: any, callback: any, param2: any): void;

        retrieveDefaultStatusForState(entityName: string, state: number): any;

        /**
        * Tells us if state transitions are enforced or not
        * @param entityName name of the entity
        * @returns true if it is enforced, false otherwise
        */
        areStateTransitionsEnforced(entityName: any): boolean;

        getDefaultTransactionCurrency(): any;
    }

	/**
	 * Interface for a Form (Xrm.Page).
	 */
    export interface Form {
		/**
		 * Provides methods to retrieve information specific to an organization, a user, or parameters passed to a page.
		 */
        context: GlobalContext;
    }

	/**
	 * Interface for the form's record context, Xrm.Page.data.entity
	 */
    export interface Entity {
		/**
		 * Saves the record.
		 * @param action or saveOptions only one of the parameter will be present Form save action: null, "saveandclose", or "saveandnew".saveOptions specifies the save mode 
		 */
        save(action?: string): void;

        setFormDirty(set: boolean): any;
    }

	/**
	 * Interface for commanding 
	 */
    export module Commanding {
		/**
		 *  Entity Reference definition 
		 */
        export interface EntityReference {
			/**
			*A number representing the unique type of entity for the record.Commented as it is to be deprecated .
			*/
            TypeCode: string;
        }
    }
}

declare namespace XrmInternalApi {
    export interface XrmInternalApi {
        isEnabledForInteractionCentric(): boolean;
        getStateCodeFromStatusOption(entityName: string, statusCode: number): any;
        parseDate(dateRaw: string): any;
        getStatusOptionsFromStateCode(entityLogicalName: string, stateCode: number): any;
        setComposeAddress(label: string, line1: string, line2: string, line3: string, City: string, StateOrProvince: string, PostalCode: string, Country: string): any;
        getResourceString(id: string): string;
        setFormEntityName(title: string): any;
        messages: any;
        lookupObjects(lookupOptions: any, p: (lookupItems: any) => void): any;
        getEntityCode(typeName: string): any;
        getEntityName(iType: any): any;
        getEntityDisplayName(entityLogicalName: string): string;
        getEntityLocalizedSetName(entityLogicalName: string): string;
        getStringKeyList(dialogKeys: string[]): { [key: string]: string };
        openDialog(dialogName: string, dialogOptions: XrmClientApi.DialogOptions, dialogParameters: any, initFunction: any, returnFunction: any): any;
        refreshParentGrid(type: any, entityName: any, string: string): any;
        doAction(subGrid: any, objectType: any, action: any, objectId: any): void;
        openErrorDialog(errorCode: any, errorMessage: any, serializedException?: any): any;
        getErrorMessage(errorCode: any): any;
        associateObjects(string: any, string1: any, type: any, dataTransferItemList: any, string2: any, sub: any, associationName: string, _false: boolean): any;
        progress(resourceString: string, number: number, p: number, number1: number): any;
        reportToWatson(message: string, href: string, number: number, _true: boolean, _null: any, p: number, _false: boolean): any;
        getLocatorServiceSetting(message: string): any;
        getAllowedStatusTransitions(entityNames: any, statusCodes: any): any;
        isEnabledForInteractionCentric(): boolean
        isCurrentKMParature(): boolean
        getStatusOptionsFromStateCode(entityName: any, stateCode: any): any;
    }
}

declare module Mscrm {

    export module OpportunityQOIControl {
        export function setDefaultPricelistForUser(entityName: any, field: any): any;
    }

    // ToDo: remove when QOIDetail is converted to TypeScript
    export module QoiDetail {
        export function setAdditionalParametersForUom(parm1: any, parm2: any): any;
        export function setAdditionalParametersForProduct(parm1: any, parm2: any, parm3: any): any;
        export function initializeFields(parm1: any, parm2: any, parm3: any, parm4: any, parm5: any): any;
        export function updateFieldsWhenProductChanges(): any;
        export function updateFieldsWhenUomChanges(parm1: any, parm2: any): any;
    }

    export module CommandBarActions {
        
        export function createCallbackFunctionFactory(copyDynamicListToStaticCallback: any, array: any[]): any;

        export function changeState(deactivate: string, entityId: any, campaign: string): any;

        export function _executeStandardCommandAction$p(entityCode: any, activate: string, entityId: any, _false: boolean): any;

        export function setState(entityId: any, entityName: any, stateCode: number): any;

        export function handleStateChangeAction(deactivate: string, entityId: any, entityName: any): any;

        export function filterOptionSetValuesFromControl(entityName: any, state: any, id: any): any;

        export function checkForSuggestions(): any;

        export function enableDisableShippingAddress(): any;

        export function addTransactionCurrencyFilter(lookup: any): any;

        export function PerformResolveCase(returnValue: any, caseId: any, successCallback: any): any;

        export function isMobileCompanionApp(): boolean;

        export function performPageRefresh(perform: boolean): void;

        export function CommonForResolve(): void;

        export function isStartDateLessThanEndDate(oBeginDate: any, oEndDate: any, oSourceCtrl: any, oBeginDateValue: any, oEndDateValue: any): boolean;

        export function CloneDate(date: any): any;

        export function resolve(): any;

        export function reactivate(): any;

        export function cancel(): any;

        export function closeSetStateDialogCallback(dialogParams: any, callbackParams: any): any;

        export function deletePrimaryRecord(id: any, entityName: any): any;

        export function onLoadSetState(): any;
    }

    export module InternalUtilities {
        export var DialogName: any;

        export module EntityNames {
            export var Opportunity: any;
            export var Quote: any;
            export var Invoice: any;
            export var TransactionCurrency: any;
            export var Competitor: any;
            export var OpportunityClose: any;
            export var SalesOrder: any;
            export var Product: any;
            export var UoMSchedule: any;
            export var PriceLevel: any;
            export var DiscountType: any;
            export var QuoteDetail: any;
            export var SalesOrderDetail: any;
            export var InvoiceDetail: any;
            export var QuoteClose: any;
            export var OrderClose: any;
        }

        export module EntityTypeCode {
            export var Opportunity: any;
            export var PhoneCall: any;
            export var Email: any;
            export var WebWizard: any;
            export var Quote: any;
            export var SalesOrder: any;
            export var Invoice: any;
        }

        export module Utilities {
            export function isTurboForm(): boolean;
            export function isRefreshForm(): boolean;
            export function isIOSDevice(): boolean;
            export function enforceStateTransitions(entityName: any): any;
            export function createAndFilterXmlString(attributeName: string, fetchOperator: string, attributeValue: string): string;
        }

        export module JSTypes {
            export function isNull(object: any): boolean;
            export function isNullOrEmptyString(object: any): boolean;
        }

        export module ClientApiUtility {
            export function actionFailedCallback(): any;
            export function actionFailedCallback(err: any): any;
            export function actionFailedCallback(err?: any): any;
            export function operationFailedCallback(err?: any): any;
        }

        export module _Script {
            export function isNullOrUndefined(object: any): boolean;
            export function alert(alertString: any): void;
        }

        export module GridUtilities {
            export function generateStandardActionUri(entityName: string, entityTypeCode: number, o: any): any;
            export function executeStandardAction(actionUri: any, records: any, windowWidth: number, windowHeight: number, _null: any): any;
            export function createCallbackFunctionFactory(performActionAfterListAssociate: any, parameters: any[]): any;
        }

        export module _String {
            export var Empty: string;
            export function isNullOrEmpty(status: any): any;
        }

        export module DialogUtility {
            export function closeDialog(): any;

            export function setLastButtonClicked(id: any): any;

            export function isMDDEnabled(): boolean;

            export function isMocaOffline(): boolean;

            export function showMoCAOfflineError(): any;

            export function showProgressMessage(): any;

            export var actionFailedCallbackForMoca: any;

            export function hideProgressMessage(): any;

            export function closeDialogFromGridCallback(): any;

            export function closeDialogCallback(): any;

            export function setAttributeValue(id: any, value: any): any;

            export function getAttributeValue(id: any): any;

            export function isStateTransitionEnforced(entityName: any): any;

            export function defaultConfirmDialog(resourceString: any, param: any): any;

            export function getDialogArguments(): any;
        }

        export module DialogConfirmStrings {
            export var Id: any;

            export function tryGetDialogStringsForEnabledMetadataDialogs(dialogName: any, confirmDialogString: any, param1: any): boolean;
        }

        export module LegacyUtils {
            export function formatDurationValue(totalTimeValue: any): any;
        }

        export var EntityReference: any;
        export var MetadataDrivenDialogConstants: any;
    }

    export module GlobalImported {
        export var CrmUri: any;
    }

    export module Utilities {
        export function isModalDialogSupported(): boolean;
        export function createCallbackFunctionObject(callbackFunction: string, gridCommandActions: any, parameters: any[], _false: boolean): any;
        export function setResponseTypeToMSXml(xmlHttpRequest: XMLHttpRequest): any;
        export function setReturnValue(returnValue: boolean): any;
    }

    export module NumberUtility {
        export function locStringToFloat(locString: string): number;
    }

    export module GridCommandActions {
        export function createRefreshGridCallback(gridControl: any): any;
    }

    export module FormControlInputBehavior {
        export function GetBehavior(behavior: string): any;

        export function GetBehaviorForForm(crmFormSubmitObjectType: string): any;
    }

    export module ReadFormUtilities {
        export function execute(inlineCommands: any, e: any): any;
        export function forceReload(Incident: any, id: any, formId: any): any;
    }

    export module InlineCommands {
        export var CreateChild: any;
        export var Reactivate: any;
        export var IncidentCancel: any;
    }

    export module InlineEditDataService {
        export function get_formId(): any;
    }

    export module RefreshPageCommandHandler {
        export function executeCommand(inlineCommand: any, activeCase: any): any;
    }

    export var CrmUri: any;
    export var FormAction: any;
    export var GridRibbonActions: any;
}

declare module CrmEncodeDecode {
    export function CrmXmlAttributeEncode(id: any): any;
    export function CrmUrlDecode(encodedUrl: any): any;
    export function CrmUrlEncode(string: string): any;
    export function CrmXmlEncode(id: any): any;
}

declare module XUI {
    export module Html {
        export function DispatchDomEvent(o: any, x: any): any;

        export function CreateDomEvent(mousedown: string): any;

        export module DomUtils {
            export function GetFirstChild(oGridItems: any): any;
        }
    }

    export var Xml: any;
}

declare module Microsoft {
    export module Crm {
        export module Client {
            export module Core {

                export module ViewModels {
                    export class ApplicationShellViewModel {
                        static get_instance(): any;
                    }
                }

                export module Storage {
                    export module Common {
                        export class AllColumns {
                            static get_instance(): any;
                        }

                        export class ColumnSet {
                            constructor(columnNames: string[])
                        }

                        export module ObjectModel {
                            export class RelatedEntityCollection {
                                constructor(collection: any);
                            }
                            export class EntityRecord {
                                constructor(entityReference: any, attributeValues: any, attributeTypes: any, objet: any, object: any, relatedEntities: any);
                                get_changedFieldNames(): any;
                            }
                        }
                    }
                }
                export module Framework {
                    export var Guid: any;
                }
            }
        }
    }
}

declare var RemoteCommand: any;
declare var openObj: any;
declare var createHiddenInput: any;
declare var deleteInput: any;
declare var boolToStr: any;
declare var isOutlookHostedWindow: any;
declare var closeWindow: any;
declare var SetTokenInHeader: any;
declare var handleXMLErr: any;
declare var openStdDlgWithCallback: any;
declare var openStdDlg: any;
declare var refreshGridIfModal: any;
declare var LookupObjectsWithCallback: any;

interface String {
    /**
     * Checks whether a string starts with another string.
     * @param subStr The sub-string to search for.
     * @param position The position to start searching at.
     * @returns {boolean} Whether the string starts with the passed sub-string.
     */
    startsWith(subStr: string, position?: number): boolean;
}
