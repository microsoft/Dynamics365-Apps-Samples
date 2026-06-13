/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */

declare module DynamicsSrc {
	interface DeferredCallback<T> {
		(arg: T): void;
	}

	interface IDeferred<TData, TError> {
		always(callback: DeferredCallback<any>): IDeferred<TData, TError>;
		done(callback: DeferredCallback<TData>): IDeferred<TData, TError>;
		fail(callback: DeferredCallback<TError>): IDeferred<TData, TError>;
		then(success: DeferredCallback<TData>, failure?: DeferredCallback<TError>): IDeferred<TData, TError>;
		then<TUpdatedData>(success: DeferredCallback<TData>, failure?: DeferredCallback<TError>): IDeferred<TUpdatedData, TError>;
		isRejected(): boolean;
		isResolved(): boolean;
	}

	interface IActiveDeferred<TData, TError> {
		promise(): IDeferred<TData, TError>;
		reject(error: TError): IActiveDeferred<TData, TError>;
		resolve(result: TData): IActiveDeferred<TData, TError>;
	}
	
	interface Scheduler {
		injectImplementation(implementation: any): void;
	}
}

declare module Microsoft {
	module Crm {
		module Client {
			module Application.App.Features.FeatureName {
				var guidedHelp: string;
			}

			module Core {
				module Framework {
					module Common {
						var ResourceManager: CrmFramework.ResourceManager;
					}

					module PAL
					{
						module Core {
							class NativeBridge extends NotifyPropertyChanged {
								static get_Instance(): NativeBridge;

								// Dispatchers
								get_account(): Dispatchers.AccountDispatcher;
								get_application(): Dispatchers.ApplicationDispatcher;
								get_device(): Dispatchers.DeviceDispatcher;

								// Events
								add_onReadyOrNow(callback: () => void): void;
								remove_onReadyOrNow(callback: () => void): void;
								//add_onInactive(callback: () => void): void;
								//remove_onInactive(callback: () => void): void;
								//add_onPause(callback: () => void): void;
								//remove_onPause(callback: () => void): void;
								//add_onResume(callback: () => void): void;
								//remove_onResume(callback: () => void): void;
								//add_onSearch(callback: () => void): void;
								//remove_onSearch(callback: () => void): void;
								//add_onVoiceCommand(callback: () => void): void;
								//remove_onVoiceCommand(callback: () => void): void;
								//add_onTileActivation(callback: () => void): void;
								//remove_onTileActivation(callback: () => void): void;
								//add_onAppLink(callback: () => void): void;
								//remove_onAppLinkremove_onAppLink(callback: () => void): void;

							}
						}
						module Dispatchers {
							class DeviceDispatcher {
								get_DeviceState(): DeviceState;
							}
							class AccountDispatcher {
								authenticate(onSuccess: () => void, onFailure: (error: CrmFramework.AuthenticationErrorEnum) => void): void;
							}
							class ApplicationDispatcher {
								clientReady(clientState: ClientState): void;
								clientInitialized(): void;
								clientBootError(deviceErrorAction: number, errorDetails: any): void;
							}
							class ClientState {
								get_Version(): string;
								set_Version(version: string): void;
							}
						}
					}

					class NotifyPropertyChanged {
						AddCustomEventHandler(eventName: string, callback: (...param: any[]) => any): void;
						RemoveCustomEventHandler(eventName: string, callback: (...param: any[]) => any): void;
					}
					class DeviceState extends NotifyPropertyChanged {
						AddPropertyChangedListener(propertyName: string, callback: (deviceState: DeviceState, eventName: string) => void): void;
						RemovePropertyChangedListener(propertyName: string, callback: (deviceState: DeviceState, eventName: string) => void): void;
						AppBarVisible: boolean;
					}
					class SortingInfo implements CrmFramework.SortingInfo {
						constructor(sortByField: string, sortDescending: boolean);

						get_SortByField(): string;
						set_SortByField(value: string): void;
						get_SortDescending(): boolean;
						set_SortDescending(value: boolean): void;
						get_SecondarySortByField(): string;
						set_SecondarySortByField(value: string): void;
						get_SecondarySortDescending(): boolean;
						set_SecondarySortDescending(value: boolean): void;
					}

					var AuthenticationManager: CrmFramework.AuthenticationManager;
					var UserAgent: CrmFramework.UserAgent;
					var Scheduler: DynamicsSrc.Scheduler;
					var SchedulerPriorities: CrmFramework.SchedulerPriorities;
					var Guid: CrmFramework.Guid;
					var ErrorStatus: CrmFramework.ErrorStatus; 
					var PerformanceMarker: CrmFramework.PerformanceMarker;
					var PerformanceStopwatch: CrmFramework.PerformanceStopwatch;
					var Trace: CrmFramework.Trace;
				}

				module Storage {
					module Cache {
						class MetadataCache implements CrmStorage.IMetadataCache {
							static injectImplementation(implementation: CrmStorage.IMetadataCache): void;

							getApplicationMetadata(applicationMetadataQuery: CrmStorage.ApplicationMetadataQuery): CrmFramework.CallbackSafeArray<CrmStorage.ApplicationMetadata>;
							cacheApplicationMetadata(applicationMetadataQuery: CrmStorage.ApplicationMetadataQuery, applicationMetadata: CrmFramework.CallbackSafeArray<CrmStorage.ApplicationMetadata>): void;
							cacheApplicationMetadataPackage(query: CrmStorage.ApplicationMetadataQuery, applicationMetadata: CrmFramework.CallbackSafeArray<CrmStorage.ApplicationMetadata>): void;
							flushApplicationMetadata(): void;
							getAttributeTypes(entityLogicalName: string, attributeNames: string[]): DynamicsSrc.IDeferred<System.Dictionary, CrmFramework.ErrorStatus>;
							getMultipleAttributeMetadata(entityLogicalName: string, attributeNames: string[]): CrmStorage.AttributeMetadata[];
							getAttributeMetadata(entityLogicalName: string, attributeName: string): CrmStorage.AttributeMetadata;
							validateMetadata(record: CrmStorage.EntityRecord, attributeNames: string[]): DynamicsSrc.IDeferred<CrmStorage.EntityRecord, CrmFramework.ErrorStatus>;
							getEntityMetadata(entityLogicalName: string): CrmStorage.EntityMetadata;
							getMultipleEntityMetadata(): CrmStorage.EntityMetadata[];
							getEntityMetadataByTypeCode(entityCode: number): CrmStorage.EntityMetadata;
							cacheEntityMetadata(entityMetadata: CrmStorage.IEntityMetadata): void;
							cacheAttributeMetadata(entityLogicalName: string, allAttributes: boolean, attributeMetadata: CrmFramework.CallbackSafeArray<CrmStorage.IAttributeMetadata>): void;
							cacheMultipleEntityMetadata(entityMetadata: CrmFramework.CallbackSafeArray<CrmStorage.IEntityMetadata>): void;
						}
					}

					module DataApi {
						class DataSource {
							static getInstance(serverUri: string): CrmStorage.DataSource;
							static get_DefaultInstance(): CrmStorage.DataSource;
							static set_DefaultInstance(dataSource: CrmStorage.DataSource): void;
							static retrieveUserContext(): DynamicsSrc.IDeferred<CrmStorage.UserContext, CrmFramework.ErrorStatus>;
							setMetadataCache(metadataCache: CrmStorage.IMetadataCache): void;
							set_WebAPIService(webAPIService: CrmStorage.ICrmSoapService): void;
							get_WebAPIService(): CrmStorage.ICrmSoapService;
							get_ServerUri(): string;
						}
						class Response implements CrmStorage.Response
						{
							constructor(name: string);

							get_name(): string;
							set_name(value: string): void;
						}
						class ListQuery {
							constructor(fetchXml: string, source: string);
						}
						module Requests {
							class InitializeFromRequest implements CrmStorage.InitializeFromRequest {
								constructor(entityMoniker: Common.ObjectModel.EntityReference, targetEntityName: string, targetFieldType: CrmStorage.TargetFieldType);

								EntityMoniker: Common.ObjectModel.EntityReference;
								TargetFieldType: CrmStorage.TargetFieldType;
								TargetEntityName: string;

								get_entityMoniker(): Common.ObjectModel.EntityReference;
								set_entityMoniker(entityRef: Common.ObjectModel.EntityReference): void;
								get_targetEntityName(): string;
								set_targetEntityName(entityName: string): void;
								get_targetFieldType(): CrmStorage.TargetFieldType;
								set_targetFieldType(fieldType: CrmStorage.TargetFieldType): void;
								get_name(): string;
								get_xmlNamespace(): string;
							}

							class ExecuteQuickFindRequest implements CrmStorage.ExecuteQuickFindRequest
							{
								constructor(searchText: string, entityGroupName: string, entityNames: string[]);

								get_name(): string;
								get_xmlNamespace(): string;
								get_searchText(): string;
								set_searchText(): string;
								get_entityGroupName(): string;
								set_entityGroupName(): string;
								get_entityNames(): string[];
								set_entityNames(): string[];
							}

							class RetrieveRequest implements CrmStorage.Request, CrmStorage.RetrieveRequest
							{
								constructor(target: CrmStorage.EntityReference, columnSet: CrmStorage.IColumnSet,
									relatedEntitiesQuery: CrmFramework.KeyValuePair<CrmStorage.Relationship, string>[],
									returnNotifications: boolean,
									clientRetrieveOptions: CrmStorage.ClientRetrieveOptions);

								/* Request members */
								get_name(): string;
								get_xmlNamespace(): string;

								/* RetrieveRequest members */
								get_target(): CrmStorage.EntityReference;
								set_target(value: CrmStorage.EntityReference): void;
								get_columnSet(): CrmStorage.IColumnSet;
								set_columnSet(value: CrmStorage.IColumnSet): void;
								get_relatedEntitiesQuery(): CrmFramework.KeyValuePair<CrmStorage.Relationship, string>[];
								set_relatedEntitiesQuery(value: CrmFramework.KeyValuePair<CrmStorage.Relationship, string>[]): void;
								get_returnNotifications(): boolean;
								set_returnNotifications(value: boolean): void;
								get_clientRetrieveOptions(): CrmStorage.ClientRetrieveOptions;
								set_clientRetrieveOptions(value: CrmStorage.ClientRetrieveOptions): void;
							}

							class UpdateRequest implements CrmStorage.UpdateRequest
							{
								constructor(target: CrmStorage.EntityRecord, suppressDuplicateDetection: boolean);

								/* Request members */
								get_name(): string;
								get_xmlNamespace(): string;

								/* UpdateRequest members */
								get_target(): CrmStorage.EntityRecord;
								set_target(value: CrmStorage.EntityRecord): void;
								get_suppressDuplicateDetection(): boolean;
								set_suppressDuplicateDetection(value: boolean): void;
								get_calculateMatchCodeSynchronously(): boolean;
								set_calculateMatchCodeSynchronously(value: boolean): void;
								get_solutionUniqueName(): string;
								set_solutionUniqueName(value: string): void;
								get_maintainLegacyAppServerBehavior(): boolean;
								set_maintainLegacyAppServerBehavior(value: boolean): void;
								get_concurrencyBehavior(): CrmStorage.ConcurrencyBehavior;
								set_concurrencyBehavior(value: CrmStorage.ConcurrencyBehavior): void;
								get_returnRowVersion(): boolean;
								set_returnRowVersion(value: boolean): void;	
							}

							class NavigateToNextEntityRequest implements CrmStorage.NavigateToNextEntityRequest
							{
								/* Request members */
								get_name(): string;
								get_xmlNamespace(): string;

								/**
								 * The CurrentEntityId of the request
								 */
								get_currentEntityId(): CrmFramework.Guid;
								set_currentEntityId(value: CrmFramework.Guid): void;

								/**
								 * The CurrentEntityLogicalName of the request
								 */
								get_currentEntityLogicalName(): string;
								set_currentEntityLogicalName(value: string): void;

								/**
								 * The NextEntityId of the request
								 */
								get_nextEntityId(): CrmFramework.Guid;
								set_nextEntityId(value: CrmFramework.Guid): void;

								/**
								 * The NextEntityLogicalName of the request
								 */
								get_nextEntityLogicalName(): string;
								set_nextEntityLogicalName(value: string): void;

								/**
								 * The id of the next process that we are navigating to
								 */
								get_newActiveStageId(): CrmFramework.Guid;
								set_newActiveStageId(value: CrmFramework.Guid): void;

								/**
								 * The combined new traversal path
								 */
								get_newTraversedPath(): string;
								set_newTraversedPath(value: string): void;

								/**
								 * The ProcessId of the request
								 */
								get_processId(): CrmFramework.Guid;
								set_processId(value: CrmFramework.Guid): void;

								/**
								 * The ProcessInstanceId of the request
								 */
								get_processInstanceId(): CrmFramework.Guid;
								set_processInstanceId(value: CrmFramework.Guid): void;

								constructor(currentEntityId: CrmFramework.Guid, currentEntityLogicalName: string, nextEntityId: CrmFramework.Guid,
											nextEntityLogicalName: string, newActiveStageId: CrmFramework.Guid, newTraversedPath: string,
											processId: CrmFramework.Guid,
											processInstanceId: CrmFramework.Guid);
							}
							
							class CreateRequest implements CrmStorage.CreateRequest
							{
								constructor(target: CrmStorage.EntityRecord, suppressDuplicateDetection?: boolean,
									calculateMatchCodeSynchronously?: boolean, solutionUniqueName?: string,
									maintainLegacyAppServerBehavior?: boolean, returnRowVersion?: boolean);

								/* Request members */
								get_name(): string;
								get_xmlNamespace(): string;

								/* CrmStorage.CreateRequest members */
								get_target(): CrmStorage.EntityRecord;
								set_target(value: CrmStorage.EntityRecord): void;
								get_suppressDuplicateDetection(): boolean;
								set_suppressDuplicateDetection(value: boolean): void;
								get_calculateMatchCodeSynchronously(): boolean;
								set_calculateMatchCodeSynchronously(value: boolean): void;
								get_solutionUniqueName(): string;
								set_solutionUniqueName(value: string): void;
								get_maintainLegacyAppServerBehavior(): boolean;
								set_maintainLegacyAppServerBehavior(value: boolean): void;
								get_returnRowVersion(): boolean;
								set_returnRowVersion(value: boolean): void;
							}

							class DeleteRequest implements CrmStorage.DeleteRequest
							{
								constructor(target: CrmStorage.EntityReference, solutionUniqueName?: string,
									concurrencyBehavior?: CrmStorage.ConcurrencyBehavior);

								/* Request members */
								get_name(): string;
								get_xmlNamespace(): string;

								/* CrmStorage.DeleteRequest members */
								get_target(): CrmStorage.EntityReference;
								set_target(value: CrmStorage.EntityReference): void;
								get_solutionUniqueName(): string;
								set_solutionUniqueName(value: string): void;
								get_concurrencyBehavior(): CrmStorage.ConcurrencyBehavior;
								set_concurrencyBehavior(value: CrmStorage.ConcurrencyBehavior): void;
							}

							class RetrieveProcessControlDataRequest implements CrmStorage.RetrieveProcessControlDataRequest
							{
								constructor(target: CrmStorage.EntityReference, processId: CrmStorage.EntityReference, processInstanceId: CrmStorage.EntityReference);

								/* Request members */
								get_name(): string;
								get_xmlNamespace(): string;

								/* CrmStorage.RetrieveProcessControlDataRequest members */
								get_target(): CrmStorage.EntityReference;
								set_target(value: CrmStorage.EntityReference): void;
								get_processId(): CrmStorage.EntityReference;
								set_processId(value: CrmStorage.EntityReference): void;
								get_processInstanceId(): CrmStorage.EntityReference;
								set_processInstanceId(value: CrmStorage.EntityReference): void;
							}
						}

						module Responses
						{
							class RetrieveResponse implements CrmStorage.Response, CrmStorage.RetrieveResponse
							{
								constructor(record: CrmStorage.EntityRecord, notifications: CrmStorage.BusinessNotification[]);

								/* RetrieveResponse members */
								get_entity(): CrmStorage.EntityRecord;
								set_entity(value: CrmStorage.EntityRecord): void;
								get_notifications(): CrmStorage.BusinessNotification[];
								set_notifications(value: CrmStorage.BusinessNotification[]): void;

								/* CrmStorage.Response members */
								get_name(): string;
							}

							class RetrieveMultipleResponse implements CrmStorage.RetrieveMultipleResponse
							{
								constructor(entityCollection: CrmStorage.EntityCollection);

								/* CrmStorage.RetrieveMultipleResponse members */
								get_entityCollection(): CrmStorage.EntityCollection;
								set_entityCollection(value: CrmStorage.EntityCollection): void;

								/* CrmStorage.Response members */
								get_name(): string;
							}

							class ExecuteMultipleResponse implements CrmStorage.Response, CrmStorage.ExecuteMultipleResponse {
								constructor(isFaulted: boolean, responses: CrmStorage.ExecuteMultipleResponseItem[]);

								/* CrmStorage.ExecuteMultipleResponse members */
								get_isFaulted(): boolean;
								set_isFaulted(value: boolean): void;
								get_responses(): CrmStorage.ExecuteMultipleResponseItem[];
								set_responses(value: CrmStorage.ExecuteMultipleResponseItem[]): void;

								/* CrmStorage.Response members */
								get_name(): string;
							}

							class RetrievePrincipalAccessResponse implements CrmStorage.Response, CrmStorage.RetrievePrincipalAccessResponse
							{
								constructor(accessRights: CrmStorage.AccessRights);

								/* CrmStorage.RetrievePrincipalAccessResponse members */
								get_accessRights(): CrmStorage.AccessRights;
								set_accessRights(value: CrmStorage.AccessRights): void;

								/* CrmStorage.Response members */
								get_name(): string;
							}

							class CreateResponse implements CrmStorage.CreateResponse
							{
								constructor(id: CrmFramework.Guid, entityReference: CrmStorage.EntityReference);

								/* CrmStorage.CreateResponse members */
								get_id(): CrmFramework.Guid;
								set_id(value: CrmFramework.Guid): void; 

								get_entityReference(): CrmStorage.EntityReference; 
								set_entityReference(value: CrmStorage.EntityReference): void;

								/* CrmStorage.Response members */
								get_name(): string;
							}

							class UpdateResponse implements CrmStorage.UpdateResponse
							{
								constructor(entityReference: CrmStorage.EntityReference);

								/* CrmStorage.UpdateResponse members */
								get_entityReference(): CrmStorage.EntityReference;
								set_entityReference(value: CrmStorage.EntityReference): void;

								/* CrmStorage.Response members */
								get_name(): string;
							}
						}
					}

					module Common {
						module FetchExpression
						{
							class FilterExpression implements CrmStorage.IFilterExpression, CrmStorage.FilterExpression
							{
								constructor(filterOperator: CrmStorage.LogicalOperator, filterExpressionId: string);

								/* CrmStorage.IFilterExpression members */
								toFetchXml(): string;

								/* CrmStorage.FilterExpression members */
								get_filterOperator(): CrmStorage.LogicalOperator;
								set_filterOperator(value: CrmStorage.LogicalOperator): void;
								addCondition(attribute: string, operatorName: string, value?: any): CrmStorage.IFilterExpression;
								addFilterExpression(passedFilterExpression: CrmStorage.IFilterExpression): CrmStorage.IFilterExpression;
							}
						}

						module ObjectModel {
							class EntityMetadata implements CrmStorage.EntityMetadata {
								constructor(id: CrmFramework.Guid,
									logicalName: string,
									displayName: string,
									pluralName: string,
									objectTypeCode: number,
									primaryIdAttribute: string,
									primaryNameAttribute: string,
									privileges: CrmStorage.SecurityPrivilegeMetadata[],
									isReadOnlyForMobileClient: boolean,
									isVisibleInMobileClient: boolean,
									isOfflineInMobileClient: boolean,
									isOptimisticConcurrencyEnabled: boolean,
									hasChanged: boolean,
									isActivity: boolean,
									isChildEntity: boolean,
									parentEntityLogicalName: string,
									parentEntityReferencingAttribute: string,
									isValidForAdvancedFind: boolean,
									isMailMergeEnabled: boolean,
									isConnectionsEnabled: boolean,
									isCustomizable: boolean,
									isActivityParty: boolean,
									isImportable: boolean,
									isEnabledForCharts: boolean,
									isCustomEntity: boolean,
									isStateModelAware: boolean,
									enforceStateTransitions: boolean,
									isCollaboration: boolean,
									activityTypeMask: CrmStorage.ActivityTypeMasks,
									ownershipType: CrmStorage.OwnershipTypes,
									hasSecuredAttributes: boolean,
									hasStateCode: boolean,
									isBusinessProcessEnabled: boolean,
									isDocumentManagementEnabled: boolean,
									hasActivities: boolean,
									entityColor: string,
									isInteractionCentricEnabled: boolean,
									isQuickCreateEnabled: boolean,
									isKnowledgeManagementEnabled: boolean);

								createFromObjectData(data: System.Dictionary): CrmStorage.EntityMetadata;

								idPath: string;
								logicalNamePath: string;

								get_id(): CrmFramework.Guid;
								get_logicalName(): string;
								get_displayName(): string;
								get_pluralName(): string;
								get_objectTypeCode(): number;
								get_primaryIdAttribute(): string;
								get_primaryNameAttribute(): string;
								get_entityColor(): string;
								get_isReadOnlyForMobileClient(): boolean;
								get_isVisibleInMobileClient(): boolean;
								get_isInteractionCentricEnabled(): boolean;
								get_isQuickCreateEnabled(): boolean;
								get_isKnowledgeManagementEnabled(): boolean;
								get_isOfflineInMobileClient(): boolean;
								get_isOptimisticConcurrencyEnabled(): boolean;
								get_hasChanged(): boolean;
								get_isActivity(): boolean;
								get_isChildEntity(): boolean;
								get_parentEntityLogicalName(): string;
								get_parentEntityReferencingAttribute(): string;
								get_isValidForAdvancedFind(): boolean;
								get_isMailMergeEnabled(): boolean;
								get_isConnectionsEnabled(): boolean;
								get_isCustomizable(): boolean;
								get_isActivityParty(): boolean;
								get_isImportable(): boolean;
								get_isEnabledForCharts(): boolean;
								get_isCustomEntity(): boolean;
								get_isStateModelAware(): boolean;
								get_enforceStateTransitions(): boolean;
								get_isCollaboration(): boolean;
								get_hasSecuredAttributes(): boolean;
								get_hasStateCode(): boolean;
								get_isBusinessProcessEnabled(): boolean;
								get_isDocumentManagementEnabled(): boolean;
								get_hasActivities(): boolean;
								usesRelatedEntityPrivileges(logicalName: string): boolean;
								hasAccessRights(logicalName: string, metadataCache: CrmStorage.IMetadataCache): boolean;
								extractKey(data: any): string;
								createFromObjectData(data: System.Dictionary): CrmStorage.EntityMetadata;
								populateFromCache(cachedEntityMetadata: CrmStorage.EntityMetadata): void;
							}

							class AttributeMetadata implements CrmStorage.AttributeMetadata
							{
								constructor(logicalName: string,
									id: CrmFramework.Guid,
									entityLogicalName: string,
									type: CrmStorage.AttributeType,
									displayName: string,
									isSecured: boolean,
									isValidForCreate: boolean,
									isValidForRead: boolean,
									isValidForUpdate: boolean,
									requiredLevel: CrmStorage.RequiredLevel,
									maxLength: number,
									minValue: number,
									maxValue: number,
									precision: number,
									precisionSource: CrmStorage.MoneyPrecisionSource,
									format: string,
									behavior: CrmFramework.DateTimeFieldBehavior,
									defaultFormValue: number,
									defaultValue: boolean,
									optionSet: CrmStorage.OptionSetMetadata,
									isBaseCurrency: boolean,
									targets: string[],
									attributeOf: string,
									hasChanged: boolean,
									imeMode: CrmFramework.ImeMode,
									isSortableEnabled: boolean,
									inheritsFrom: string,
									sourceType: CrmStorage.AttributeSourceType);

								/* CrmStorage.IAttributeMetadata members */
								get_id(): CrmFramework.Guid;
								get_logicalName(): string;
								get_entityLogicalName(): string;
								get_type(): CrmStorage.AttributeType;
								get_sourceType(): CrmStorage.AttributeSourceType;
								get_displayName(): string;
								get_requiredLevel(): CrmStorage.RequiredLevel;
								get_isSecured(): boolean;
								get_isValidForCreate(): boolean;
								get_isValidForUpdate(): boolean;
								get_isValidForRead(): boolean;
								get_optionSet(): CrmStorage.OptionSetMetadata;
								get_targets(): string[];
								get_defaultFormValue(): number;
								get_defaultValue(): boolean;
								get_maxLength(): number;
								get_minValue(): number;
								get_maxValue(): number;
								get_precision(): number;
								get_precisionSource(): CrmStorage.MoneyPrecisionSource;
								get_format(): string;
								get_behavior(): CrmFramework.DateTimeFieldBehavior;
								get_isBaseCurrency(): boolean;
								get_attributeOf(): string;
								get_hasChanged(): boolean;
								get_isSortableEnabled(): boolean;
								get_imeMode(): CrmFramework.ImeMode;
								get_inheritsFrom(): string;
							}

							class SecurityPrivilegeMetadata implements CrmStorage.SecurityPrivilegeMetadata
							{
								constructor(name: string, privilegeId: CrmFramework.Guid, privilegeType: number, canBeBasic: boolean, canBeLocal: boolean, canBeDeep: boolean, canBeGlobal: boolean);
							}

							class AliasedValue implements CrmStorage.AliasedValue
							{
								constructor(entityLogicalName: string, attributeLogicalName: string, attributeType: CrmStorage.AttributeType);

								createFromObjectData(data: System.Dictionary): CrmStorage.AliasedValue;

								get_value(): any;
								set_value(value: any): void;
								get_attributeType(): CrmStorage.AttributeType;
								get_attributeLogicalName(): string;
								get_entityLogicalName(): string;
							}

							class EntityReference implements CrmStorage.EntityReference {
								constructor(logicalName: string, id: CrmFramework.Guid, name?: string);

								Id: CrmFramework.Guid;
								LogicalName: string;
								Name: string;
								TypeCode: number;
								TypeDisplayName: string;
								TypeName: string;

								get_empty(): CrmStorage.EntityReference;
								get_key(): string;
								get_identifier(): string;
								get_modelType(): string;
								get_displayName(): string;
								createFromObjectData(data: System.Dictionary): CrmStorage.EntityReference;
								getObjectData(): System.Dictionary;
								equals(other: any): boolean;
								getHashCode(): number;
								getValue(fieldName: string): any;
								setValue(fieldName: string, value: any): void;
							}

							class ClientRetrieveOptions {
								constructor(cachePriority: CrmStorage.CachePriority, retrievalStrategy: CrmStorage.RetrievalStrategy);
							}

							class RelatedEntityCollection {
								constructor(entityCollections: any[]); // KeyValuePair<Relationship, EntityCollection>[]
							}

							class EntityRecord implements CrmStorage.EntityRecord {
								constructor(identifier: EntityReference, fields: System.Dictionary, fieldTypes: System.Dictionary, formattedValues: System.Dictionary, numericFormattedValues: System.Dictionary, relatedEntities: RelatedEntityCollection, clientRetrieveOptions?: CrmStorage.ClientRetrieveOptions);

								static createFieldsFromObjectData(fieldData: System.Dictionary, fieldTypes: System.Dictionary): System.Dictionary;

								get_identifier(): CrmStorage.EntityReference;
								get_actionableIdentifier(): CrmStorage.EntityReference;
								get_fieldTypes(): System.Dictionary;
								get_formattedValues(): System.Dictionary;
								get_numericFormattedValues(): System.Dictionary;
								get_fieldNames(): string[];
								get_changedFieldNames(): CrmFramework.List<string>;
								get_cleanFields(): System.Dictionary;
								get_columnSet(): CrmStorage.IColumnSet;
								get_directColumnSet(): CrmStorage.IColumnSet;
								get_key(): string;
								get_clientRetrieveOptions(): CrmStorage.ClientRetrieveOptions;
								set_clientRetrieveOptions(value: CrmStorage.ClientRetrieveOptions): void;
								get_accessRights(): CrmStorage.AccessRights;
								set_accessRights(value: CrmStorage.AccessRights): void;
								get_userSharedAttributePrivileges(): CrmFramework.TypedDictionary<CrmStorage.AttributePrivilege>;
								set_userSharedAttributePrivileges(value: CrmFramework.TypedDictionary<CrmStorage.AttributePrivilege>): void;
								get_globalNavigationData(): CrmStorage.EntityRecord;
								set_globalNavigationData(value: CrmStorage.EntityRecord): void;
								createFromObjectData(data: System.Dictionary): CrmStorage.EntityRecord;
								createFieldsFromObjectData(fieldData: System.Dictionary, fieldTypes: System.Dictionary): System.Dictionary;
								clone(): CrmStorage.EntityRecord;
								getObjectData(): System.Dictionary;
								hasValue(fieldName: string): boolean;
								hasField(fieldName: string): boolean;
								getValue(fieldName: string): any;
								getFormattedValue(fieldName: string): any;
								getNumericFormattedValue(fieldName: string): any;
								setValue(fieldName: string, value: any): void;
								markFieldChanged(fieldName: string): void;
								resetChanges(): void;
								mergeChanges(changes: CrmStorage.EntityRecord): void;
								initializeValue(fieldName: string, value: any, attributeType: CrmStorage.AttributeType): void;
								updateColumnSet(arg: any, relatedEntityQueries?: CrmStorage.RelatedEntityQuery[]): void;
							}

							class OptionMetadata implements CrmStorage.OptionMetadata, CrmFramework.IPicklistItem
							{
								constructor(label: string, value: number, state: number, defaultStatus: number, allowedStatusTransition: number[], color: string, invariantName: string);

								/* CrmFramework.IPicklistItem members */
								get_ValueString(): string;
								set_ValueString(value: string): void;
								get_Label(): string;
								set_Label(value: string): void;

								/* CrmStorage.OptionMetadata members */
								getValue(fieldName: string): any;
							}

							class EntityCollection implements CrmStorage.EntityCollection
							{
								constructor(entities: CrmStorage.EntityRecord[], moreRecords: boolean, totalRecordCount: number, totalRecordCountLimitExceeded: boolean, query: CrmStorage.Query, clientRetrieveOptions: CrmStorage.ClientRetrieveOptions);

								get_entities(): CrmStorage.EntityRecord[];
								get_moreRecords(): boolean;
								get_totalRecordCountLimitExceeded(): boolean;
								get_isLastPage(): boolean;
								get_totalRecordCount(): number;
								get_currentPageIndex(): number;
								get_currentPageNumber(): number; 
								get_count(): number;
								get_query(): CrmStorage.Query;
								set_query(value: CrmStorage.Query): void;
								get_key(): string;
								get_clientRetrieveOptions(): CrmStorage.ClientRetrieveOptions;
								set_clientRetrieveOptions(value: CrmStorage.ClientRetrieveOptions): void;
								createEmpty(): CrmStorage.EntityCollection;
								createFromEntities(entities: CrmStorage.EntityRecord[]): CrmStorage.EntityCollection;
								createFromObjectData(data: System.Dictionary): CrmStorage.EntityCollection;
								getObjectData(): System.Dictionary;
								add(record: CrmStorage.EntityRecord): void;
								remove(record: CrmStorage.EntityRecord): void;
							}

							class ExecuteMultipleResponseItem implements CrmStorage.ExecuteMultipleResponseItem {
								constructor(fault: CrmStorage.OrganizationServiceFault, requestIndex: number, response: CrmStorage.Response);

								/* CrmStorage.ExecuteMultipleResponseItem members */
								get_fault(): CrmStorage.OrganizationServiceFault;
								set_fault(value: CrmStorage.OrganizationServiceFault): void;
								get_requestIndex(): number;
								set_requestIndex(value: number): void;
								get_response(): CrmStorage.Response;
								set_response(value: CrmStorage.Response): void;
							}
						}

						class ColumnSet implements CrmStorage.IColumnSet
						{
							constructor(columnNames: string[]);
						}
					}

					module CrmSoapServiceProxy
					{
						module Responses
						{
							class CrmErrorResponse implements CrmStorage.CrmErrorResponse
							{
								constructor(request: XMLHttpRequest, textStatus: string, error: string);

								/* CrmStorage.CrmErrorResponse members */
								get_localizedMessage(): string;
								get_organizationServiceFault(): CrmStorage.OrganizationServiceFault;
								set_organizationServiceFault(value: CrmStorage.OrganizationServiceFault): void;
							}

							class OrganizationResponse implements CrmStorage.OrganizationResponse
							{
								constructor(soapResponse: CrmFramework.XmlNode);

								/* CrmStorage.OrganizationResponse members */
								get_name(): string;
							}
						}

						module JsonResponses
						{
							class JsonResponse implements CrmStorage.JsonResponse
							{
								constructor(success: boolean, errorMessage: string, errorCode: number, response: System.Dictionary);
							}
						}
					}
				}
			}
		}
	}
}

interface Window {
	VERSION_NUMERIC_VALUE: string;
}

declare module CrmEncodeDecode {
	/**
		* Encodes string for a Url.
		* 
		* @param s String to encode.
		* @returns {string} Encoded string.
		*/
	function CrmUrlEncode(s: string): string;
	function CrmHtmlEncode(s: string): string;
	function CrmXmlEncode(s: string): string;
	function CrmXmlAttributeEncode(s: string): string;
}

declare module XrmUI {
	module ControlId {
		var homeButton: string;
		var moreCommands: string;
		var navDetailFlyout: string;
		var navigationBar: string;
		var searchButton: string;
		var siteMapButton: string;
		var listItem: string;
		var panoramaItem: string;
		var gridHeaderItem: string;
		var processHeaderStage: string;
		var processHeaderContainer: string;
	}

	module UIControlType {
		var button: string;
		var commandButton: string;
		var commandBarContainer: string;
		var navigationButton: string;
		var navigationContainer: string;
		var staticNavigationButton: string;
		var panoramaContainer: string;
		var listItem: string;
		var panoramaItem: string;
		var grid: string;
		var gridHeader: string;
		var gridHeaderItem: string;
		var processHeaderStage: string;
		var processHeaderContainer: string;
	}
}