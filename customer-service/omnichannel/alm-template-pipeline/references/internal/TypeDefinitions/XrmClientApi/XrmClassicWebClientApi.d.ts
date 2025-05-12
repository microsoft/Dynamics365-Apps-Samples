declare var boolToStr: any;
declare var closeWindow: any;
declare var createHiddenInput: any;

declare module CrmEncodeDecode {
    export function CrmUrlDecode(encodedUrl: any): any;
    export function CrmUrlEncode(str: any): any;
    export function CrmXmlAttributeEncode(str: string): any;
    export function CrmXmlEncode(id: any): any;
}

declare var deleteInput: any;
declare function GetGlobalContext(): any;
declare var handleXMLErr: any;
declare var isOutlookHostedWindow: any;
declare var LookupObjectsWithCallback: any;

declare module Microsoft {
    export module Crm {
        export module Client {
            export module Core {

                export module Framework {
                    export var Guid: any;
                    export var _String: any;
                }

                export module Storage {
                    export var CrmSoapServiceProxy: any;

                    export module Common {
                        export class AllColumns {
                            static get_instance(): any;
                        }

                        export class ColumnSet {
                            constructor(columnNames: string[])
                        }

                        export module ObjectModel {
                            export var EntityCollection: any;
                            export class EntityRecord {
                                constructor(entityReference: any, attributeValues: any, attributeTypes: any, objet: any, object: any, relatedEntities: any);
                                get_changedFieldNames(): any;
                            }

                            export class RelatedEntityCollection {
                                constructor(collection: any);
                            }
                        }
                    }
                }

                export module ViewModels {
                    export class ApplicationShellViewModel {
                        static get_instance(): any;
                    }
                }
            }
        }
    }
}

declare module Mscrm {
    export class CrmDialog {
        constructor(oUrl: any, object: any, number: number, p: number, maximizeYesMinimizeYes: string);
        setCallbackInfo(dorequiredentityformrefresh: string, campaignActivityDistribution: any, parameters: (number | string)[]);
        show(): any;
    }

    export var CommandBarActions: any;

    export module CrmDebug {
        export function assert(b: boolean, str: string, id: any): void;
    }

    export var CrmUri: any;

    export var FormAction: any;   

    export module FormControlInputBehavior {
        export function GetBehavior(behavior: string): any;
        export function GetBehaviorForForm(formId: string): any;
        export function GetElementBehavior(control: any): any;
    }

    export module GlobalImported {
        export var CrmUri: any;
    }
    
    export module GridCommandActions {
        export function createRefreshGridCallback(gridControl: any): any;
        export function openAlertDialogForSetStateMultipleError(gridControl: any): void;
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
    
    export var GridRibbonActions: any;

    export module InlineEditUtilities {
        export function tryResetFocusOnActiveControl(): any;
    }

    export module InternalUtilities {
        export module _Script {
            export function isNullOrUndefined(object: any): boolean;
            export function alert(alertString: any): void;
        }

        export module _String {
            export var Empty: string;
            export function format(...parameters: any[]);
            export function isNullOrEmpty(status: any): any;
        }

        export module ClientApiUtility {
            export function actionFailedCallback(err?: any): any;
            export function operationFailedCallback(err?: any): any;
        }

        export module DialogConfirmStrings {
            export var DeactivateGridDialogHeight: number;
            export var DeactivateGridDialogWidth: number;
        }

        export var DialogName: any;

        export module DialogUtility {
            export var actionFailedCallbackForMoca: any;
            export function closeDialog(): any;
            export function closeDialogAsOk(): any;
            export function closeDialogCallback(): any;
            export function closeDialogFromGridCallback(): any;
            export function defaultConfirmDialog(resourceString: any, param: any): any;
            export function deserializeSdkEntityReferences(stringifiedRecord: string): any[];
            export function getAttributeValue(attributeName: any): any;
            export function getDialogArguments(): any;
            export function hideProgressMessage(): any;
            export function isMDDConverted(action: any, entityName: any): boolean;
            export function isMDDEnabled(): boolean;
            export function isMocaOffline(): boolean;
            export function isStateTransitionEnforced(entityName: any): any;
            export function serializeSdkEntityReferences(records: any[]): string
            export function setAttributeValue(id: any, value: any): any;
            export function setLastButtonClicked(id: any): any;
            export function showMoCAOfflineError(): any;
            export function showProgressMessage(): any;
        }
        
        export var EntityReference: any;

        export module GridUtilities {
            export function generateStandardActionUri(entityName: string, entityTypeCode: number, o: any): any;
            export function executeStandardAction(actionUri: any, records: any, windowWidth: number, windowHeight: number, callback: any, selection?: any): any;
            export function createCallbackFunctionFactory(performActionAfterListAssociate: any, parameters: any[]): any;
        }

        export module MetricsReportingHelper {
            export function addTelemetryLog(reportingContext: any, name: string, entityTypeCode: any);
        }

        export module MetricsReportingContext {
            export var grid: any;
        }

        export module JSTypes {
            export function isNull(object: any): boolean;
            export function isNullOrEmptyString(object: any): boolean;
        }
    
        export var MetadataDrivenDialogConstants: any;

        export module Utilities {
            export function enforceStateTransitions(entityName: any): any;
            export function isIOSDevice(): boolean;
            export function isRefreshForm(): boolean;
            export function isTurboForm(): boolean;
            export function createAndFilterXmlString(attributeName: string, fetchOperator: string, attributeValue: string): string;
        }

        export module Sdk {
            export function convertToCase(successCallBack: any, failedCallBack: any, entityVal: any, activityId: any, objectTypeCode: any, customerid: any, customerTypeCode: any, param1: any, param2: any, subjectId: any, subjectTypeCode: any): any
        }

        export module ProductStructureType {
            export var Product: any;
            export var ProductBundle: any;
        }

        export module ProductStructureType {
            export var Product: any;
            export var ProductBundle: any;
        }
    }

    export module NumberUtility {
        export function locStringToFloat(locString: string): number;
        export function addFormatting(value: number, precision: number): string;
    }
    
    export module OpportunityQOIControl {
        export function setDefaultPricelistForUser(entityName: any, field: any): any;
    }

    export module QoiDetail {
        export function initializeFields(parm1: any, parm2: any, parm3: any, parm4: any, parm5: any): any;
        export function setAdditionalParametersForProduct(parm1: any, parm2: any, parm3: any): any;
        export function setAdditionalParametersForUom(parm1: any, parm2: any): any;
        export function updateFieldsWhenProductChanges(): any;
        export function updateFieldsWhenUomChanges(parm1: any, parm2: any): any;
    }

    export module Utilities {
        export function isModalDialogSupported(): boolean;
        export function createCallbackFunctionObject(callbackFunction: string, gridCommandActions: any, parameters: any[], _false: boolean): any;
        export function setResponseTypeToMSXml(xmlHttpRequest: XMLHttpRequest): any;
        export function setReturnValue(returnValue: boolean): any;
    }

    export module SdkSerializationHelper {
        export function getEntityObject(name: string, id: string, overrideTypes: any);
    }
}

declare var openObj: any;
declare var openStdDlg: any;
declare var openStdDlgWithCallback: any;
declare var refreshGridIfModal: any;
declare var RemoteCommand: any;
declare var SetTokenInHeader: any;
declare var Xrm: XrmClientApi.XrmStatic;

declare namespace XrmClientApi {
    export interface XrmStatic {
        FormNotificationOptions: any;
        AlertDialogStrings: any;
        AttributeSubmitModes: AttributeSubmitModeStatic;
        AttributeType: any;
        ClientName: any;
        ClientState: any;
        ConfirmDialogStrings: any;
        Constants: any
        Dialog: any;
        DialogOptions: any;
        FormType: any;
        Gen: any;
        Internal: any;
        LookupObject: any;
        LookupOptions: any;
        LookupStyle: any;
        Navigation: any;
        NotificationLevel: any;
        Objects: any;
        OptionSetItem: any;
        Page: any;
        RequiredLevel: any;
        SaveOptions: any;
        SaveMode: any;
        SubmitMode: any;
        Utility: any;
        WebApi: any;
    }

    export module Attributes {
        export interface Attribute {
            addOption(item: any): void;
            clearOptions(): void;
            getMax(): number;
            getMin(): number;            
            getOptions(): any;
            getPrecision(): any;
            getSelectedOption(): any;            
            getValue(): any;            
            setCurrencySymbol(symbol: any): void;
            setPrecision(accuracy: any): void;
            setValue(value: any): void;
        }
    }

    export interface AttributeSubmitModeStatic {
        dirty: "dirty";
        always: "always";
        never: "never";
    }

    export module Controls {
        export interface Control {
            addCustomFilter(fetchXmlFilter: string, entityType?: string): void;
            addCustomView(viewGuid: any, fileName: string, viewName: string, fetchXml: string, layoutXml: string, isDefault: boolean): void;
            addOnLoad(handler: any): void;
            addPreSearch(field: any): void;
            addOption(item: any): void;
            allowUserToDisableRelationshipFilter(param: boolean): any;
            clearNotifications(): void;
            clearOptions(): void;
            getAttribute(): Attributes.Attribute;
            getGrid(): any;
            removeOption(value: number): void;
            setParameter(name: string, value: string): void;
            setDefaultView(viewId: string): void;
            setDisabled(disabled: boolean): void;
            setVisible(visible: boolean): void;
        }
    }  
    export interface Form {
        context: GlobalContext;
    }

    export interface FormData {
        getIsValid(): boolean;
        removeOnLoad(parm: any): void;
        setFormDirty(setForm: boolean): any;
    } 

    interface GlobalContext {
        saveMode: any;
    }

    export module Grid {
        export interface GridRow {
            getData(): any;
        }
    }

    export interface Utility {
        areStateTransitionsEnforced(entityName: any): boolean;
        create(entityName: string, entityReference: any, param: any, param1: any, callback: any, param2: any): void;
        executeNonCudCommand(commandName: any, entityName: any, request: any, successDeferredCallback: any, failedCallback: any): any;
        getDefaultTransactionCurrency(): any;
        getValidStatusTransition(entityName: string, recordId: string, currentStatus: number, currentState: number, toState: number): any;
        isEntityOfflineSyncEnabled(entityName: any): boolean;
        isMocaOffline(): boolean;
        retrieveDefaultStatusForState(entityName: string, state: number): any;
        retrieveEntityRecord(reference: any, columnNames: any, successCallback: any, failedCallback: any): any;
    }

    export interface Form {
        context: GlobalContext;
    }

    interface GlobalContext {

        getUserId(): string;
        getQueryStringParameters(): { [key: string]: string };
        getTimeZoneOffsetMinutes(): number;
        getOrgLcid(): string;
        isCrmOnline(): boolean;

        saveMode: any;
    }
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
