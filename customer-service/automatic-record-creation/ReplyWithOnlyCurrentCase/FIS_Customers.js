var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __assign = (this && this.__assign) || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var TelemetryLogger;
(function (TelemetryLogger) {
    var TelemetryConstants = (function () {
        function TelemetryConstants() {
        }
        return TelemetryConstants;
    }());
    TelemetryConstants.EventName = "EventName";
    TelemetryConstants.StartTime = "StartTime";
    TelemetryConstants.EndTime = "EndTime";
    TelemetryConstants.ExecutionTime = "ExecutionTime";
    TelemetryConstants.FeatureUsage = "Feature Usage";
    var TelemetryItem = (function () {
        function TelemetryItem(componentName, eventName) {
            this._componentName = componentName;
            this._eventName = eventName;
            this._traceInformation = ["Start"];
            this._traceWarning = [];
            this._traceError = [];
            this._traceCustom = {};
            this._event = this.createEvent();
        }
        TelemetryItem.prototype.traceEventInformation = function (message) {
            this._traceInformation.push(message);
        };
        TelemetryItem.prototype.traceEventWarning = function (message) {
            this._traceWarning.push(message);
        };
        TelemetryItem.prototype.traceEventError = function (name, exception) {
            this._traceError.push({ name: name, message: exception });
        };
        TelemetryItem.prototype.traceEventCustom = function (name, value) {
            if (this._traceCustom[name]) {
                this._traceCustom[name].push(value);
            }
            else {
                this._traceCustom[name] = [value];
            }
        };
        TelemetryItem.prototype.traceFeatureUsage = function (name, value) {
            this.traceEventCustom(TelemetryConstants.FeatureUsage, { name: name, value: value });
        };
        TelemetryItem.prototype.report = function () {
            if (!this._event) {
                return;
            }
            this.traceEventInformation("End");
            this.addEventParameter({ name: "Information", value: this._traceInformation });
            this.addEventParameter({ name: "Warnings", value: this._traceWarning });
            this.addEventParameter({ name: "Errors", value: this._traceError });
            for (var key in this._traceCustom) {
                this.addEventParameter({ name: key, value: this._traceCustom[key] });
            }
            this.updateEventExecutionTime();
            if (Xrm && Xrm.Reporting) {
                if (!this._traceError || this._traceError.length == 0) {
                    Xrm.Reporting.reportSuccess(this._componentName, this._event);
                }
                else {
                    Xrm.Reporting.reportFailure(this._componentName, Error(this._eventName), "Review the stacktrace and event context.", this._event);
                }
            }
        };
        TelemetryItem.prototype.createEvent = function () {
            var parameters = [];
            parameters.push({ name: TelemetryConstants.EventName, value: this._eventName });
            parameters.push({ name: TelemetryConstants.StartTime, value: new Date() });
            return parameters;
        };
        TelemetryItem.prototype.addEventParameter = function (parameter) {
            if (this._event != null && parameter.name != null && parameter.value != null) {
                this._event.push(parameter);
            }
        };
        TelemetryItem.prototype.updateEventExecutionTime = function () {
            if (!this._event || this._event.length < 2) {
                return;
            }
            var eventName = this._event[0].value;
            var start = this._event[1].value;
            if (!eventName || !start) {
                return;
            }
            var end = new Date();
            this.addEventParameter({ name: TelemetryConstants.EndTime, value: end });
            this.addEventParameter({ name: TelemetryConstants.ExecutionTime, value: end.valueOf() - start.valueOf() });
        };
        return TelemetryItem;
    }());
    TelemetryLogger.TelemetryItem = TelemetryItem;
})(TelemetryLogger || (TelemetryLogger = {}));
var Activities;
(function (Activities) {
    var ActivityPageHandler = (function () {
        function ActivityPageHandler() {
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="ActivityPageHandler"/> class.
        /// </summary>
        ActivityPageHandler.prototype.ActivityPageHandler = function () { };
        /// <summary>
        /// Sets the default value for a new communication activity
        /// </summary>
        /// <param name="form">Form context object</param>
        ActivityPageHandler.prototype.setDefaultValues = function (form, telemetryItem) {
            if (Activities.Common.Util.IsNewEntityForm(form)) {
                var ownerId = form.data.entity.attributes.get("ownerid");
                try {
                    if (!Activities.Common.Util.IsNull(ownerId) && Activities.Common.Util.IsNull(ownerId.getValue())) {
                        ownerId.setValue(this.getCurrentUser());
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting default value.", exception.message);
                }
            }
        };
        /// <summary>
        /// Gets the current user lookup value
        /// </summary>
        ActivityPageHandler.prototype.getCurrentUser = function () {
            var lookupItems = new Array();
            var userContext = Xrm.Utility.getGlobalContext();
            var item = {
                id: userContext.userSettings.userId,
                name: userContext.userSettings.userName,
                entityType: "systemuser",
            };
            lookupItems.push(item);
            return lookupItems;
        };
        /// <summary>
        /// Sets the organizer to current user
        /// </summary>
        /// <param name="form">Form context object</param>
        ActivityPageHandler.prototype.setOrganizer = function (form, telemetryItem) {
            try {
                var organizer = form.data.entity.attributes.get("organizer");
                if (!Activities.Common.Util.IsNull(organizer)) {
                    var ownerId = form.data.entity.attributes.get("ownerid");
                    if (!Activities.Common.Util.IsNull(ownerId) && !Activities.Common.Util.IsNull(ownerId.getValue())) {
                        organizer.setValue(ownerId.getValue());
                    }
                    else {
                        organizer.setValue(this.getCurrentUser());
                    }
                }
            }
            catch (exception) {
                telemetryItem.traceEventError("Error setting default value.", exception.message);
            }
        };
        /// <summary>
        /// Inserts Default Signature into email body.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="signature">Signature to be inserted.</param>
        /// <param name="description">The description attribute.</param>
        /// <param name="overwrite">If true overwrite the signature.</param>
        /// <returns></returns>
        ActivityPageHandler.insertSignature = function (form, signature, description, overwrite) {
            if (Activities.Common.Util.IsNullOrUndefined(description)) {
                return;
            }
            var descriptionValue = description.getValue() ? description.getValue() : "<div></div>";
            var doc = new DOMParser().parseFromString(descriptionValue, "text/html");
            var newsignatureElement = doc.getElementById("newsignature");
            if (!Activities.Common.Util.IsNullOrUndefined(newsignatureElement)) {
                overwrite = true;
                newsignatureElement.id = "signature";
            }
            var signatureElement = doc.getElementById("signature");
            if (Activities.Common.Util.IsNullOrUndefined(signatureElement)) {
                var signatureDiv = '<div id="signature">' + signature + "</div>";
                if (Activities.Common.Util.addDirection()) {
                    var dir = Activities.Common.Util.getDirection();
                    signatureDiv = "<div style=\"direction:" + dir + "\">" + signatureDiv + "</div>";
                }
                var emailBodyHtml = doc ? (doc.body ? doc.body.innerHTML : "") : "";
                descriptionValue = Activities.Common.Util.IsNullOrEmptyString(emailBodyHtml)
                    ? signatureDiv
                    : emailBodyHtml.concat(signatureDiv);
            }
            else if (overwrite || Activities.Common.Util.IsNullOrEmptyString(signatureElement.innerHTML)) {
                signatureElement.innerHTML = signature;
                signatureElement.style.display = "block";
                descriptionValue = doc ? (doc.body ? doc.body.innerHTML : "") : "";
            }
            description.setValue(descriptionValue);
        };
        ActivityPageHandler.isSystemAdmin = function () {
            var context = Xrm.Utility.getGlobalContext();
            var roles = context.userSettings.roles;
            if (!Activities.Common.Util.IsNullOrUndefined(roles) && roles.getLength() > 0) {
                var rolesList = roles.get();
                for (var i = 0; i < rolesList.length; i++) {
                    if (rolesList[i].name == "System Administrator") {
                        return true;
                    }
                }
            }
            return false;
        };
        return ActivityPageHandler;
    }());
    Activities.ActivityPageHandler = ActivityPageHandler;
})(Activities || (Activities = {}));
/* eslint-disable no-shadow */
var Activities;
(function (Activities) {
    var Constants;
    (function (Constants) {
        /// <summary>
        /// Empty Guid String
        /// </summary>
        Constants.EmptyGuid = "{00000000-0000-0000-0000-000000000000}";
        /// <summary>
        /// Empty Guid in String format
        /// </summary>
        Constants.EmptyGuidFormatted = "00000000-0000-0000-0000-000000000000";
        var ViewGuids;
        (function (ViewGuids) {
            //Guid reference values here : src/AppCommon/Data/Database/Metadata/Template/savedqueries.xml
            ViewGuids.MyEmailTemplateView = "{4C7BE207-CC89-4BB7-BB61-BBD5076D05C0}";
            ViewGuids.GlobalEmailTemplateView = "{4D5BE2E9-6828-482b-99AA-2387AFED7B37}";
            ViewGuids.AllLanguageEmailTemplateView = "{DAF88706-1DAD-4810-ADC4-1517ED39F575}";
        })(ViewGuids = Constants.ViewGuids || (Constants.ViewGuids = {}));
        var EntityNames;
        (function (EntityNames) {
            EntityNames.Appointment = "appointment";
            EntityNames.ServiceAppointment = "serviceappointment";
            EntityNames.RecurringAppointmentMaster = "recurringappointmentmaster";
            EntityNames.Email = "email";
            EntityNames.Fax = "fax";
            EntityNames.Letter = "letter";
            EntityNames.ActivityMimeAttachment = "activitymimeattachment";
            EntityNames.ActivityPointer = "activitypointer";
            EntityNames.PhoneCall = "phonecall";
            EntityNames.Task = "task";
            EntityNames.Template = "template";
            EntityNames.EmailSignature = "emailsignature";
            EntityNames.SystemUser = "systemuser";
            EntityNames.Contact = "contact";
            EntityNames.Annotation = "annotation";
            EntityNames.UnResolvedAddress = "unresolvedaddress";
            EntityNames.Chat = "chat";
        })(EntityNames = Constants.EntityNames || (Constants.EntityNames = {}));
        var AppSettingsConstant;
        (function (AppSettingsConstant) {
            AppSettingsConstant.FluentThemingPreview = "FluentThemingPreview";
        })(AppSettingsConstant = Constants.AppSettingsConstant || (Constants.AppSettingsConstant = {}));
        var OrgSettingsConstant;
        (function (OrgSettingsConstant) {
            OrgSettingsConstant.EnableInsertSignatureInUCI = "EnableInsertSignatureInUCI";
            OrgSettingsConstant.SaveAsDraftOrgSettingName = "AllowSaveAsDraftAppointment";
            // EnableActivitiesFeatures values for different features. the values are in the powers of 2 starting with 1 (2 power 0)
            OrgSettingsConstant.InsertSignatureFeatureBitValue = "1";
        })(OrgSettingsConstant = Constants.OrgSettingsConstant || (Constants.OrgSettingsConstant = {}));
        //PLEASE TAKE CARE TO FOLLOW THE CONVENTION ON NAMING FOR THE BELOW FCB CONSTANTS
        /*if the fcb string has "FCB." prefix, the constant should have FCB as its suffix
          if the fcb string does not have the FCB. prefix, the constant should have "FCB_" as its prefix
          Xrm.Internal.IsFeatureEnabled behaves differently between web and UCI
          For web it honors "FCB." prefix, In UCI it expects without "FCB." prefix.
          Xrm.Internal.isDisruptiveFeatureEnabled is only for UCI and works with "FCB." prefix*/
        var FCBConstant;
        (function (FCBConstant) {
            FCBConstant.EmailEngagementFCB = "FCB.EmailEngagement";
            FCBConstant.FCB_EmailEngagement = "EmailEngagement";
            FCBConstant.SharePointS2SFCB = "FCB.SharePointS2S";
            FCBConstant.FCB_SharePointS2S = "SharePointS2S";
            FCBConstant.OneDriveIntegrationFCB = "FCB.OneDriveIntegration";
            FCBConstant.FCB_OneDriveIntegration = "OneDriveIntegration";
            FCBConstant.EmailEngagementActionFCB = "FCB.EmailEngagementComposeForUCI";
            FCBConstant.FCB_EmailEngagementAction = "EmailEngagementComposeForUCI";
            FCBConstant.EditorToolbarApril2020UpdateFCB = "FCB.EditorToolbar2020Update";
            FCBConstant.TemplatePreviewApril2020UpdateFCB = "FCB.TemplatePreview2020Update";
            FCBConstant.InlineImagesData2020UpdateFCB = "FCB.InlineImagesData2020Update";
            FCBConstant.EmailUx2020UpdateFCB = "FCB.EmailUx2020Update";
            FCBConstant.AppointmentSchedulingInUCIFCB = "FCB.AppointmentSchedulingInUCI";
            FCBConstant.FCB_AllDayEventInUTCMidnight = "FCB.IgnoreTimeInAllDayEventStartAndEnd";
            FCBConstant.AllDayEventInUTCMidnight = "IgnoreTimeInAllDayEventStartAndEnd";
            FCBConstant.April2020UpdateFCB = "FCB.April2020Update";
            FCBConstant.FCB_April2020Update = "April2020Update";
            FCBConstant.FCB_EmailTemplatePreviewEnhancementsEnabled = "EmailTemplatePreviewEnhancementsEnabled";
            FCBConstant.UnresolvedEmailAddressFeatureFCB = "FCB.UnresolvedEmailAddressFeature";
            FCBConstant.SendBulkEmailInUci = "SendBulkEmailInUci";
            FCBConstant.FCB_ConvertDeletedPartiesToUnresolvedEmails = "ConvertDeletedPartiesToUnresolvedEmails";
            FCBConstant.October2020UpdateFCB = "FCB.October2020Update";
            FCBConstant.AttachmentPreviewFCB = "FCB.AttachmentPreviewOctober2020Update";
            FCBConstant.MultiAttachmentUploadOctober2020UpdateFCB = "FCB.MultiAttachmentUploadOctober2020Update";
            FCBConstant.SubGridThumbnailOctober2020UpdateFCB = "FCB.SubGridThumbnailOctober2020Update";
            FCBConstant.FCB_SubGridThumbnailOctober2020Update = "SubGridThumbnailOctober2020Update";
            FCBConstant.TemplateUCIDataOctober2020UpdateFCB = "FCB.TemplateUCIDataOctober2020Update";
            FCBConstant.MailboxEnabledDialogFCB = "FCB.MailboxEnabledDialog";
            FCBConstant.FCB_MailboxEnabledDialog = "MailboxEnabledDialog";
            FCBConstant.EnableEmailEditInMocaFCB = "FCB.EnableEmailEditInMoca";
            FCBConstant.AttachFileAutoSaveOctober2020UpdateFCB = "FCB.AttachFileAutoSaveOctober2020Update";
            FCBConstant.FCB_ActivityEditorConfig2020Update = "ActivityEditorConfig2020Update";
            FCBConstant.SafeDescriptionInEmailUCIFCB = "FCB.SafeDescriptionInEmailUCI";
            FCBConstant.FCB_SafeDescriptionInEmailUCI = "SafeDescriptionInEmailUCI";
            FCBConstant.InsertTemplateAutoSaveOctober2020UpdateFCB = "FCB.InsertTemplateAutoSaveOctober2020Update";
            FCBConstant.FCB_EmailRTLDirectionInUCI = "EmailRTLDirectionInUCI";
            FCBConstant.April2021UpdateFCB = "FCB.April2021Update";
            FCBConstant.AddEmailAddressOnReplyFCB = "FCB.AddEmailAddressOnReply";
            FCBConstant.FCB_RecurringAppointmentUci = "RecurringAppointmentOctober2020";
            FCBConstant.RecurringAppointmentUciFCB = "FCB.RecurringAppointmentOctober2020";
            FCBConstant.InsertTemplateAtCursorPositionFCB = "FCB.InsertTemplateAtCursorPosition";
            FCBConstant.UpdateDateValueParsing = "FCB.UpdateDateValueParsing";
            FCBConstant.October2021UpdateFCB = "FCB.October2021Update";
            FCBConstant.October2022UpdateFCB = "FCB.October2022Update";
            FCBConstant.OnlineMeetingFCB = "OnlineTeamsMeeting";
            FCBConstant.April2022UpdateFCB = "April2022Update";
            FCBConstant.FCB_EnableEnhanceEmailTemplateEditor = "EnableEnhanceEmailTemplateEditor";
            FCBConstant.SSSUseOfficeApiToFilterUnSafeContentFCB = "SSSUseOfficeApiToFilterUnSafeContent";
            FCBConstant.FCB_ApplyEditorSelectionStyle = "ApplyEditorSelectionStyle";
            FCBConstant.FCB_EnableDynamicTextForEmailSignature = "EnableDynamicTextForSignature";
            FCBConstant.FCB_October2022Update = "October2022Update";
            FCBConstant.FCB_RemoveUnresolvedInvalidAddressOnSendEmail = "RemoveUnresolvedInvalidAddressOnSendEmail";
            FCBConstant.EnhancedEmailTemplateDialog = "FCB.EnhancedEmailTemplateDialog";
            FCBConstant.EnhancedEmailApril23 = "FCB.EmailEnhancementApril23";
            FCBConstant.FCB_AddRelatedEntitiesForEmail = "AddRelatedEntitiesForEmail";
        })(FCBConstant = Constants.FCBConstant || (Constants.FCBConstant = {}));
        var PerfConstants;
        (function (PerfConstants) {
            PerfConstants.PerfOrgDbOrgSettings = "EnableActivitiesTimeLinePerfImprovement";
            var PerfImprovements;
            (function (PerfImprovements) {
                PerfImprovements[PerfImprovements["FirstStage"] = 1] = "FirstStage";
            })(PerfImprovements = PerfConstants.PerfImprovements || (PerfConstants.PerfImprovements = {}));
        })(PerfConstants = Constants.PerfConstants || (Constants.PerfConstants = {}));
        var EmailFields;
        (function (EmailFields) {
            EmailFields.Related = "related";
        })(EmailFields = Constants.EmailFields || (Constants.EmailFields = {}));
        var AnnotationFields;
        (function (AnnotationFields) {
            AnnotationFields.MimeType = "mimetype";
            AnnotationFields.FileName = "filename";
            AnnotationFields.IsDocument = "isdocument";
            AnnotationFields.DocumentBody = "documentbody";
        })(AnnotationFields = Constants.AnnotationFields || (Constants.AnnotationFields = {}));
        var TelemetryConstant;
        (function (TelemetryConstant) {
            TelemetryConstant.EventName = "EventName";
            TelemetryConstant.StartTime = "StartTime";
            TelemetryConstant.EndTime = "EndTime";
            TelemetryConstant.ExecutionTime = "ExecutionTime";
            TelemetryConstant.EventRefreshParentFromEmailPopup = "refreshParentFromEmailPopup";
            TelemetryConstant.BulkEmail = "bulkemail";
            TelemetryConstant.RecurrenceDialog = "RecurrenceDialog";
            TelemetryConstant.EndSeriesDialog = "EndSeriesDialog";
            TelemetryConstant.UpdateSeriesDialog = "UpdateSeriesDialog";
            TelemetryConstant.EventSend = "Send";
            TelemetryConstant.EventSetFormContextInContextualEmail = "SetFormContextInContextualEmail";
            TelemetryConstant.EventReply = "Reply";
            TelemetryConstant.EventReplyAll = "ReplyAll";
            TelemetryConstant.EventForward = "Forward";
            TelemetryConstant.EventAddAttachment = "AddAttachment";
            TelemetryConstant.EventOpenChatFromTimeline = "OpenChatFromTimeline";
            TelemetryConstant.EventAddAttachmentOctober2020 = "AddAttachmentOctober2020";
            TelemetryConstant.EventPreviewAttachmentOctober2020 = "PreviewAttachmentOctober2020";
            TelemetryConstant.EventDownloadAttachmentOctober2020 = "DownloadAttachmentOctober2020";
            TelemetryConstant.EventLoadAttachmentThumbnail = "LoadAttachmentThumbnailOctober2020";
            TelemetryConstant.EventInsertEmailTemplate = "InsertEmailTemplate";
            TelemetryConstant.EventInsertTemplate = "InsertTemplate";
            TelemetryConstant.EventPreviewTemplate = "PreviewTemplate";
            TelemetryConstant.EventTemplatePreviewInit = "TemplatePreviewInit";
            TelemetryConstant.EventTemplatePreviewUpdateView = "TemplatePreviewUpdateView";
            TelemetryConstant.EventTemplatePreviewDestroy = "TemplatePreviewDestroy";
            TelemetryConstant.EventAppointmentOnLoad = "AppointmentOnLoad";
            TelemetryConstant.EventAppointmentOnlineMeetingCommandChecker = "EventAppointmentOnlineMeetingCommandChecker";
            TelemetryConstant.EventAppointmentOnlineMeetingExceuted = "EventAppointmentOnlineMeetingExceuted";
            TelemetryConstant.EventAppointmentOnlineMeetingAdded = "EventAppointmentOnlineMeetingAdded";
            TelemetryConstant.EventAppointmentOnLoadBulkEdit = "AppointmentOnLoadBulkEdit";
            TelemetryConstant.EventRecurringAppointmentMasterOnLoad = "RecurringAppointmentMasterOnLoad";
            TelemetryConstant.EventRecurringAppointmentMasterOnEndSeriesClick = "RecurringAppointmentMasterOnEndSeriesClick";
            TelemetryConstant.EventEmailOnLoad = "EmailOnLoad";
            TelemetryConstant.EventFaxOnLoad = "FaxOnLoad";
            TelemetryConstant.EventLetterOnLoad = "LetterOnLoad";
            TelemetryConstant.EventPhoneCallOnLoad = "PhoneCallOnLoad";
            TelemetryConstant.EventTaskOnLoad = "TaskOnLoad";
            TelemetryConstant.EventErrorMessage = "ErrorMessage";
            TelemetryConstant.EventWarningMessage = "WarningMessage";
            TelemetryConstant.EventSeriesActionDialogOnLoad = "SeriesActionDialogOnLoad";
            TelemetryConstant.EventAppointmentDeletion = "AppointmentDeletion";
            TelemetryConstant.EventGridAppointmentDeletion = "GridAppointmentDeletion";
            TelemetryConstant.EventUploadFile = "UploadFile";
            TelemetryConstant.EventRemoveAttachment = "RemoveAttachment";
            TelemetryConstant.EventFollowAttachment = "FollowAttachment";
            TelemetryConstant.EventUnFollowAttachment = "UnFollowAttachment";
            TelemetryConstant.EventSelectTemplateRecipientDialogOnLoad = "SelectTemplateRecipientDialog";
            TelemetryConstant.EventApplyEmailTemplateDialogOnLoad = "ApplyEmailTemplateDialogOnLoad";
            TelemetryConstant.EventAttachmentDialogOnLoad = "AttachmentDialogOnLoad";
            TelemetryConstant.EventCommandExceuted = "CommandExceuted";
            TelemetryConstant.EventEntityType = "EntityType";
            TelemetryConstant.EventSourceEntityType = "SourceEntityType";
            TelemetryConstant.EventErrorCount = "ErrorCount";
            TelemetryConstant.EventBulkEmailDialogOnLoad = "BulkEmailDialogOnLoad";
            TelemetryConstant.EventSendBulkEmail = "SendBulkEmail";
            TelemetryConstant.EventBulkEmailLanguageChange = "BulkEmailOnLanguageChange";
            TelemetryConstant.EventBulkEmailTemplateChange = "BulkEmailOnTemplateChange";
            TelemetryConstant.EventBulkEmailSenderChange = "BulkEmailOnSenderChange";
            TelemetryConstant.EventInsertEmailSignatureDialogOnLoad = "InsertEmailSignatureDialogOnLoad";
            TelemetryConstant.EventInsertSignature = "InsertSignature";
            TelemetryConstant.EventIsAllDayOnChange = "IsAllDayEventOnChange";
            TelemetryConstant.EventDirectionCodeOnChange = "DirectionCodeOnChange";
            TelemetryConstant.EventQuickCreateOnChange = "QuickCreateOnSave";
            TelemetryConstant.EventUnresolveEmailAddressLookupDialogOnload = "UnresolveEmailAddressLookupDialogOnload";
            TelemetryConstant.EventRecurrenceDialogOnLoad = "RecurrenceDialogOnLoad";
            TelemetryConstant.EventRecurrenceDialogOnSet = "RecurrenceDialogOnSet";
            TelemetryConstant.EventRecurrenceDialogOnCancel = "RecurrenceDialogOnCancel";
            TelemetryConstant.EventRecurrenceDialogOnEndSeriesClick = "RecurrenceDialogOnEndSeriesClick";
            TelemetryConstant.EventRecurrenceDialogSameDayWeekOnChange = "RecurrenceDialogSameDayWeekOnChange";
            TelemetryConstant.EventRecurrenceDialogRangeEndTypeOnChange = "RecurrenceDialogRangeEndTypeOnChange";
            TelemetryConstant.EventRecurrenceDialogRepeatPatternTypeOnChange = "RecurrenceDialogRepeatPatternTypeOnChange";
            TelemetryConstant.EventRecurrenceDialogEndTimeOnChange = "RecurrenceDialogEndTimeOnChange";
            TelemetryConstant.EventRecurrenceDialogStartTimeOnChange = "RecurrenceDialogStartTimeOnChange";
            TelemetryConstant.EventRecurrenceDialogDurationOnChange = "RecurrenceDialogDurationOnChange";
            TelemetryConstant.EventRecurrenceDialogPatternStartDateOnChange = "RecurrenceDialogPatternStartDateOnChange";
            TelemetryConstant.EventRecurrenceDialogPatternEndDateOnChange = "RecurrenceDialogPatternEndDateOnChange";
            TelemetryConstant.EventEndSeriesDialogOnLoad = "EndSeriesDialogOnLoad";
            TelemetryConstant.EventEndSeriesDialogEndClick = "EndSeriesDialogEndClick";
            TelemetryConstant.EventEndSeriesDialogCancelClick = "EndSeriesDialogCancelClick";
            TelemetryConstant.EventUpdateSeriesDialogOnLoad = "UpdateSeriesDialogOnLoad";
            TelemetryConstant.EventUpdateSeriesDialogOkClick = "UpdateSeriesDialogOkClick";
            TelemetryConstant.EventUpdateSeriesDialogCancelClick = "UpdateSeriesDialogCancelClick";
            TelemetryConstant.EventParameterFileSize = "param_AttachmentFileSize";
            TelemetryConstant.EventParameterFileType = "param_AttachmentFileType";
            TelemetryConstant.EventParameterAttachmentCount = "param_AttachmentCount";
            TelemetryConstant.EventParameterTemplateInserted = "param_TemplateInserted";
            TelemetryConstant.EventParameterTemplateId = "param_TemplateId";
            TelemetryConstant.EventEditRecurrence = "RecurrenceDialog";
            TelemetryConstant.EventEndSeries = "EndSeries";
            TelemetryConstant.EventEditSeries = "EditSeries";
            TelemetryConstant.EventRecurringAppointmentDelete = "RecurringAppointmentDelete";
            TelemetryConstant.EventGridRecurringAppointmentDelete = "EventGridRecurringAppointmentDelete";
            TelemetryConstant.RecurrenceDialogAction = "RecurrenceDialogAction";
            TelemetryConstant.FromAppointment = "FromAppointment";
            TelemetryConstant.EndSeriesDialogAction = "EndSeriesDialogAction";
            TelemetryConstant.EnablePerfImprovements = "EnablePerfImprovements";
            TelemetryConstant.UseSchedulingEngine = "UseSchedulingEngine";
            TelemetryConstant.EventAppointmentOnSave = "AppointmentOnSave";
            TelemetryConstant.EventRecurrinAppointmentOnSave = "RecurrinAppointmentOnSave";
            TelemetryConstant.EventBPFNavigationOnAppointmentForm = "BPFNavigationOnAppointmentForm";
            TelemetryConstant.ExecutionContextMissing = "Execution context is missing from the handler";
            TelemetryConstant.TemplatePreviewClicked = "TemplatePreviewClicked";
            TelemetryConstant.EventAnnotationFileDownload = "NoteFileNameClicked";
            TelemetryConstant.EventNoteAttachmentControlUpdateView = "NoteAttachmentControlUpdateView";
            TelemetryConstant.EventNoteRegardingControlUpdateView = "NoteRegardingControlUpdateView";
            TelemetryConstant.EventNoteNavigateToRegarding = "NoteNavigateToRegarding";
            TelemetryConstant.EventNoteRegardingControlInit = "NoteRegardingControlInit";
            TelemetryConstant.AnnotationOnLoad = "AnnotationOnLoad";
            TelemetryConstant.EventRecurrenceDialogRepeatOnChange = "RecurrenceDialogRepeatOnChange";
            TelemetryConstant.EventEmailTemplateOnLoad = "EmailTemplateOnLoad";
            TelemetryConstant.EventSave = "Save";
            TelemetryConstant.EventInsertDynamicText = "InsertDynamicText";
            TelemetryConstant.EventCreateOrConvertToTemplate = "CreateOrConvertToTemplate";
            TelemetryConstant.EmailTemplate = "email.template";
            TelemetryConstant.TemplateDefaultView = "TemplateDefaultView";
            TelemetryConstant.EventSelectTemplate = "SelectTemplate";
            TelemetryConstant.PersistingFilterFeatureEnabled = "PersistingFilterFeatureEnabled";
            TelemetryConstant.EnableEmailTemplateViews = "EnableEmailTemplateViews";
            TelemetryConstant.SkipSelectRecordDialog = "SkipSelectRecordDialog";
            TelemetryConstant.RecordFieldName = "Record Field Name";
        })(TelemetryConstant = Constants.TelemetryConstant || (Constants.TelemetryConstant = {}));
        var DialogNames;
        (function (DialogNames) {
            DialogNames.ApplyEmailTemplate = "ApplyEmailTemplate";
            DialogNames.SelectTemplateRecipient = "SelectTemplateRecipient";
            DialogNames.UpdateAttachment = "UpdateAttachment";
            DialogNames.InsertSignature = "InsertSignature";
            DialogNames.AppointmentSchedulingConflict = "AppointmentSchedulingConflict";
            DialogNames.EmailTemplatePreview = "EmailTemplateDialog";
            DialogNames.LearnMoreDialog = "LearnMoreDialog";
            DialogNames.EmailTemplateInsertDialogFromEmail = "NewEmailTemplateDialog";
            DialogNames.EnhancedEmailTemplateInsertDialogFromEmail = "EnhancedEmailTemplateDialog";
        })(DialogNames = Constants.DialogNames || (Constants.DialogNames = {}));
        var MetadataDrivenDialogConstants;
        (function (MetadataDrivenDialogConstants) {
            // Entity Names
            MetadataDrivenDialogConstants.EmailSignatureEntityName = "emailsignature";
            MetadataDrivenDialogConstants.EmailEntityName = "email";
            MetadataDrivenDialogConstants.TemplateEntityName = "template";
            // Attribute Names
            MetadataDrivenDialogConstants.SubjectAttribute = "subject";
            MetadataDrivenDialogConstants.DescriptionAttribute = "description";
            MetadataDrivenDialogConstants.IsOnlineMeeting = "isonlinemeeting";
            MetadataDrivenDialogConstants.OnlineMeetingType = "onlinemeetingtype";
            MetadataDrivenDialogConstants.OnlineMeetingJoinUrl = "onlinemeetingjoinurl";
            // Insert Email Template Dialog parameters.
            MetadataDrivenDialogConstants.ParamLastButtonClicked = "param_lastButtonClicked";
            MetadataDrivenDialogConstants.ParamEntityId = "param_entityId";
            MetadataDrivenDialogConstants.ParamEmailFormData = "param_emailFormData";
            MetadataDrivenDialogConstants.ParamEntityType = "param_entityType";
            MetadataDrivenDialogConstants.ParamEmailSubject = "param_emailsubject";
            MetadataDrivenDialogConstants.ParamEmailDescription = "param_emaildescription";
            MetadataDrivenDialogConstants.ParamTemplateId = "param_templateId";
            MetadataDrivenDialogConstants.ParamEmailEntityId = "param_id";
            // Insert Signature dialog parameters.
            MetadataDrivenDialogConstants.ParamSignatureText = "param_signaturetext";
            MetadataDrivenDialogConstants.ParamOwnerId = "param_ownerId";
            MetadataDrivenDialogConstants.ParamSenderId = "param_senderId";
            MetadataDrivenDialogConstants.ParamSenderType = "param_sendertype";
            // Scheduling Conflict Dialog Constants
            MetadataDrivenDialogConstants.ParamIsDraft = "param_isDraft";
            MetadataDrivenDialogConstants.ParamNotificationsData = "param_notificationsData";
            MetadataDrivenDialogConstants.ParamActivityType = "param_activityType";
            MetadataDrivenDialogConstants.RecipientNames = "name";
            MetadataDrivenDialogConstants.KeyPresent = "KeyPresent";
            MetadataDrivenDialogConstants.EmailFormData = "emailFormData";
            MetadataDrivenDialogConstants.EmailEntityType = "entityType";
            MetadataDrivenDialogConstants.EmailEntityId = "id";
            MetadataDrivenDialogConstants.EntityTypeCode = "entityTypeCode";
            MetadataDrivenDialogConstants.LastButtonClicked = "lastButtonClicked";
            MetadataDrivenDialogConstants.EmailSubject = "emailsubject";
            MetadataDrivenDialogConstants.TemplateId = "templateId";
            MetadataDrivenDialogConstants.EntityType = "type";
            MetadataDrivenDialogConstants.SelectControlName = "select_id";
            MetadataDrivenDialogConstants.SendControlName = "send_id";
            MetadataDrivenDialogConstants.TemplatePreviewControlName = "template_preview";
            MetadataDrivenDialogConstants.TemplateInsertDataControlName = "template_insert_data";
            MetadataDrivenDialogConstants.BulkEmailSenderControlName = "sender_id";
            MetadataDrivenDialogConstants.BulkEmailSelectedRecordsParam = "param_selectedRecords";
            MetadataDrivenDialogConstants.BulkEmailRecipientsControlName = "recipients";
            MetadataDrivenDialogConstants.GridControl = "param_gridControl";
            MetadataDrivenDialogConstants.PreviewControlName = "preview_id";
            MetadataDrivenDialogConstants.EntityId = "entityId";
            MetadataDrivenDialogConstants.EntityTypeInfo = "entityTypeInfo";
            MetadataDrivenDialogConstants.FieldControlName = "fieldname_id";
            MetadataDrivenDialogConstants.RecordControlName = "record_id";
            MetadataDrivenDialogConstants.ControlNullError = " control cannot be null";
            MetadataDrivenDialogConstants.EmailTemplateControlName = "emailtemplates_id";
            MetadataDrivenDialogConstants.DefaultLookupName = "default";
            MetadataDrivenDialogConstants.LanguageId = "language_id";
            MetadataDrivenDialogConstants.SaveControlId = "save_id";
            MetadataDrivenDialogConstants.ConflictDialogDescription1ControlId = "description1_id";
            MetadataDrivenDialogConstants.ConflictDialogDescription2ControlId = "description2_id";
            MetadataDrivenDialogConstants.ProgressValue = 40;
            MetadataDrivenDialogConstants.ProgressMinValue = 0;
            MetadataDrivenDialogConstants.ProgressMaxValue = 100;
            MetadataDrivenDialogConstants.DialogOkId = "ok_id";
            MetadataDrivenDialogConstants.DialogCancelId = "cancel_id";
            MetadataDrivenDialogConstants.AttachementSubGridControl = "attachmentsGrid";
            MetadataDrivenDialogConstants.EmailSignatureControl = "signatures_id";
            MetadataDrivenDialogConstants.UnresolvedAddress = "unresolvedaddress";
            MetadataDrivenDialogConstants.Required = "requiredattendees";
            MetadataDrivenDialogConstants.Optional = "optionalattendees";
            MetadataDrivenDialogConstants.DialogInsertId = "insert_id";
            //lookup names
            MetadataDrivenDialogConstants.From = "from";
            MetadataDrivenDialogConstants.To = "to";
            MetadataDrivenDialogConstants.Cc = "cc";
            MetadataDrivenDialogConstants.Bcc = "bcc";
            //Mailbox not enabled dialog parameters
            MetadataDrivenDialogConstants.ParamPrimaryText = "param_primarytext";
            MetadataDrivenDialogConstants.ParamTitleText = "param_titletext";
            MetadataDrivenDialogConstants.ParamLearnMoreButtonLabel = "param_learnMoreLabel";
            MetadataDrivenDialogConstants.ParamContinueButtonLabel = "param_continueLabel";
            //Mailbox not enabled dialog controls
            MetadataDrivenDialogConstants.ControlTitle = "title_id";
            MetadataDrivenDialogConstants.ControlPrimaryText = "primarytext_id";
            MetadataDrivenDialogConstants.ControlLearnMoreButton = "learnmore_id";
            MetadataDrivenDialogConstants.ControlContinueButton = "continue_id";
            //UCI Recurrence dialog attributes
            MetadataDrivenDialogConstants.ParamRepeatValue = "param_repeatValue";
            MetadataDrivenDialogConstants.ParamEveryFieldValue = "param_everyFieldValue";
            MetadataDrivenDialogConstants.ParamReturnValueRecurring = "param_returnValueRecurring";
            MetadataDrivenDialogConstants.ParamRadioOptionsList = "param_radioOptionsList";
            MetadataDrivenDialogConstants.ParamIsVertical = "param_isVertical";
            MetadataDrivenDialogConstants.ParamControlLabel = "param_controlLabel";
            MetadataDrivenDialogConstants.ParamSameSelectedValue = "param_sameselectedvalue";
            MetadataDrivenDialogConstants.ParamDaysOfWeekMask = "param_daysofweekmask";
            MetadataDrivenDialogConstants.RecurStartTimeControl = "starttime_id";
            MetadataDrivenDialogConstants.RecurEndTimeControl = "endtime_id";
            MetadataDrivenDialogConstants.RecurDurationControl = "duration_id";
            MetadataDrivenDialogConstants.RecurRepeatPatternControl = "repeat_id";
            MetadataDrivenDialogConstants.RecurDaysOfWeekControl = "daysofweek_id";
            MetadataDrivenDialogConstants.RecurSameRadioControl = "sameradios_id";
            MetadataDrivenDialogConstants.RecurSameWeekWeekControl = "sameweekweek_id";
            MetadataDrivenDialogConstants.RecurSameWeekDayControl = "sameweekday_id";
            MetadataDrivenDialogConstants.RecurSameDayDayControl = "samedayday_id";
            MetadataDrivenDialogConstants.RecurYearlyMonthControl = "yearlymonth_id";
            MetadataDrivenDialogConstants.RecurEveryControl = "every_id";
            MetadataDrivenDialogConstants.RecurRangeStartControl = "rangestart_id";
            MetadataDrivenDialogConstants.RecurRangeEndTypeControl = "endspicklist_id";
            MetadataDrivenDialogConstants.RecurOccurrenceControl = "totaloccurences_id";
            MetadataDrivenDialogConstants.RecurRangeEndDateControl = "enddate_id";
            MetadataDrivenDialogConstants.RecurSetButton = "set_id";
            MetadataDrivenDialogConstants.RecurEndSeriesButton = "endseries_id";
            MetadataDrivenDialogConstants.RecurCancelButton = "cancel_id";
            MetadataDrivenDialogConstants.RecurSeriesIdParam = "param_seriesid";
            /* End Series Dialog Constants*/
            MetadataDrivenDialogConstants.ParamEndSeries_RadioOptions = "param_options";
            MetadataDrivenDialogConstants.ParamEndSeries_SelectedValue = "param_selectedValue";
            MetadataDrivenDialogConstants.ControlEndSeries_TopLabel = "toplabel_id";
            MetadataDrivenDialogConstants.ControlEndSeries_EndDate = "enddate_id";
            MetadataDrivenDialogConstants.ControlEndSeries_ChoiceLabel = "choicelabel_id";
            MetadataDrivenDialogConstants.ControlEndSeries_RadioOptions = "radiooptions_id";
            MetadataDrivenDialogConstants.EndSeriesDialogEndButton = "endbutton_id";
            MetadataDrivenDialogConstants.EndSeriesDialogCancelButton = "cancelbutton_id";
            MetadataDrivenDialogConstants.ParamEndSeries_SeriesId = "param_seriesid";
            /* Update Series Dialog Constants */
            MetadataDrivenDialogConstants.ControlUpdateSeries_TopLabel = "toplabel_id";
            MetadataDrivenDialogConstants.ControlUpdateSeries_FirstLabel = "firsttext_id";
            MetadataDrivenDialogConstants.ControlUpdateSeries_SecondLabel = "secondtext_id";
            MetadataDrivenDialogConstants.UpdateSeriesDialogOkButton = "okupdatebutton_id";
            MetadataDrivenDialogConstants.UpdateSeriesDialogCancelButton = "cancelupdatebutton_id";
            var RepeatPattern;
            (function (RepeatPattern) {
                RepeatPattern[RepeatPattern["Daily"] = 0] = "Daily";
                RepeatPattern[RepeatPattern["Weekly"] = 1] = "Weekly";
                RepeatPattern[RepeatPattern["Monthly"] = 2] = "Monthly";
                RepeatPattern[RepeatPattern["Yearly"] = 3] = "Yearly";
            })(RepeatPattern = MetadataDrivenDialogConstants.RepeatPattern || (MetadataDrivenDialogConstants.RepeatPattern = {}));
            var RangeEndType;
            (function (RangeEndType) {
                RangeEndType[RangeEndType["Never"] = 1] = "Never";
                RangeEndType[RangeEndType["ByNoOfOccurrences"] = 2] = "ByNoOfOccurrences";
                RangeEndType[RangeEndType["ByEndDate"] = 3] = "ByEndDate";
            })(RangeEndType = MetadataDrivenDialogConstants.RangeEndType || (MetadataDrivenDialogConstants.RangeEndType = {}));
            var SameRadioOption;
            (function (SameRadioOption) {
                SameRadioOption[SameRadioOption["Day"] = 1] = "Day";
                SameRadioOption[SameRadioOption["Week"] = 2] = "Week";
            })(SameRadioOption = MetadataDrivenDialogConstants.SameRadioOption || (MetadataDrivenDialogConstants.SameRadioOption = {}));
            var SameWeekWeekInstance;
            (function (SameWeekWeekInstance) {
                SameWeekWeekInstance[SameWeekWeekInstance["First"] = 1] = "First";
                SameWeekWeekInstance[SameWeekWeekInstance["Second"] = 2] = "Second";
                SameWeekWeekInstance[SameWeekWeekInstance["Third"] = 3] = "Third";
                SameWeekWeekInstance[SameWeekWeekInstance["Fourth"] = 4] = "Fourth";
                SameWeekWeekInstance[SameWeekWeekInstance["Last"] = 5] = "Last";
            })(SameWeekWeekInstance = MetadataDrivenDialogConstants.SameWeekWeekInstance || (MetadataDrivenDialogConstants.SameWeekWeekInstance = {}));
            var SameWeekDayOptions;
            (function (SameWeekDayOptions) {
                SameWeekDayOptions[SameWeekDayOptions["Day"] = 0] = "Day";
                SameWeekDayOptions[SameWeekDayOptions["Weekday"] = 1] = "Weekday";
                SameWeekDayOptions[SameWeekDayOptions["Weekend"] = 2] = "Weekend";
                SameWeekDayOptions[SameWeekDayOptions["Sunday"] = 3] = "Sunday";
                SameWeekDayOptions[SameWeekDayOptions["Monday"] = 4] = "Monday";
                SameWeekDayOptions[SameWeekDayOptions["Tuesday"] = 5] = "Tuesday";
                SameWeekDayOptions[SameWeekDayOptions["Wednesday"] = 6] = "Wednesday";
                SameWeekDayOptions[SameWeekDayOptions["Thursday"] = 7] = "Thursday";
                SameWeekDayOptions[SameWeekDayOptions["Friday"] = 8] = "Friday";
                SameWeekDayOptions[SameWeekDayOptions["Saturday"] = 9] = "Saturday";
            })(SameWeekDayOptions = MetadataDrivenDialogConstants.SameWeekDayOptions || (MetadataDrivenDialogConstants.SameWeekDayOptions = {}));
        })(MetadataDrivenDialogConstants = Constants.MetadataDrivenDialogConstants || (Constants.MetadataDrivenDialogConstants = {}));
        var HtmlTags;
        (function (HtmlTags) {
            HtmlTags.Div = "div";
            HtmlTags.Paragraph = "p";
            HtmlTags.Img = "img";
            HtmlTags.Iframe = "iframe";
        })(HtmlTags = Constants.HtmlTags || (Constants.HtmlTags = {}));
        var HtmlTagSelectors;
        (function (HtmlTagSelectors) {
            HtmlTagSelectors.DialogMainDiv = "div[data-preview-id={0}]"; // replace {0} with form id
            HtmlTagSelectors.DialogHeaderDiv = "div[data-id=dialogHeader]";
            HtmlTagSelectors.DialogFooterDiv = "div[data-id=dialogFooter]";
        })(HtmlTagSelectors = Constants.HtmlTagSelectors || (Constants.HtmlTagSelectors = {}));
        var HtmlAttributes;
        (function (HtmlAttributes) {
            HtmlAttributes.Src = "src";
            HtmlAttributes.Base64Template = "data:{0};base64,{1}"; // replace {0} with mimetype and {1} with base64 content
        })(HtmlAttributes = Constants.HtmlAttributes || (Constants.HtmlAttributes = {}));
        var HtmlStyles;
        (function (HtmlStyles) {
            HtmlStyles.Hidden = "hidden";
            HtmlStyles.OneHundredPercent = "100%";
            HtmlStyles.Zero = "0";
            HtmlStyles.Auto = "auto";
            HtmlStyles.Pixel = "px";
            HtmlStyles.Center = "center";
            HtmlStyles.None = "none";
            HtmlStyles.InlineFlex = "inline-flex";
            HtmlStyles.FlexDirectionColumn = "column";
            HtmlStyles.FontWeight600 = "600";
            HtmlStyles.FontSize18 = "18px";
        })(HtmlStyles = Constants.HtmlStyles || (Constants.HtmlStyles = {}));
        // The order of these should be same as defined in FeatureList dictionary defined in PackageTemplate.cs
        var ActivitiesFeature;
        (function (ActivitiesFeature) {
            ActivitiesFeature.ActivitiesFeatureOrgDbOrgSettings = "EnableActivitiesFeatures";
            var ActivitiesFeatureList;
            (function (ActivitiesFeatureList) {
                ActivitiesFeatureList[ActivitiesFeatureList["EnableInsertSignatureInUCI"] = 1] = "EnableInsertSignatureInUCI";
            })(ActivitiesFeatureList = ActivitiesFeature.ActivitiesFeatureList || (ActivitiesFeature.ActivitiesFeatureList = {}));
        })(ActivitiesFeature = Constants.ActivitiesFeature || (Constants.ActivitiesFeature = {}));
        var AppointmentStatusCode;
        (function (AppointmentStatusCode) {
            AppointmentStatusCode[AppointmentStatusCode["busy"] = 5] = "busy";
        })(AppointmentStatusCode = Constants.AppointmentStatusCode || (Constants.AppointmentStatusCode = {}));
        var AppointmentStateCode;
        (function (AppointmentStateCode) {
            AppointmentStateCode[AppointmentStateCode["open"] = 0] = "open";
            AppointmentStateCode[AppointmentStateCode["completed"] = 1] = "completed";
            AppointmentStateCode[AppointmentStateCode["canceled"] = 2] = "canceled";
            AppointmentStateCode[AppointmentStateCode["scheduled"] = 3] = "scheduled";
        })(AppointmentStateCode = Constants.AppointmentStateCode || (Constants.AppointmentStateCode = {}));
        var SaveMode;
        (function (SaveMode) {
            SaveMode[SaveMode["save"] = 1] = "save";
            SaveMode[SaveMode["saveandclose"] = 2] = "saveandclose";
            SaveMode[SaveMode["deactivate"] = 5] = "deactivate";
            SaveMode[SaveMode["saveascompleted"] = 58] = "saveascompleted";
            SaveMode[SaveMode["autosave"] = 70] = "autosave";
        })(SaveMode = Constants.SaveMode || (Constants.SaveMode = {}));
        var DateTimeFieldBehavior;
        (function (DateTimeFieldBehavior) {
            DateTimeFieldBehavior[DateTimeFieldBehavior["None"] = 0] = "None";
            DateTimeFieldBehavior[DateTimeFieldBehavior["UserLocal"] = 1] = "UserLocal";
            DateTimeFieldBehavior[DateTimeFieldBehavior["DateOnly"] = 2] = "DateOnly";
            DateTimeFieldBehavior[DateTimeFieldBehavior["TimeZoneIndependent"] = 3] = "TimeZoneIndependent";
        })(DateTimeFieldBehavior = Constants.DateTimeFieldBehavior || (Constants.DateTimeFieldBehavior = {}));
        var AttributeSubmitModes;
        (function (AttributeSubmitModes) {
            //change this to string enum when upgrading to typecript
            AttributeSubmitModes[AttributeSubmitModes["dirty"] = 0] = "dirty";
            AttributeSubmitModes[AttributeSubmitModes["always"] = 1] = "always";
            AttributeSubmitModes[AttributeSubmitModes["never"] = 2] = "never";
        })(AttributeSubmitModes = Constants.AttributeSubmitModes || (Constants.AttributeSubmitModes = {}));
        var AttributeRequiredLevel;
        (function (AttributeRequiredLevel) {
            AttributeRequiredLevel.None = "none";
            AttributeRequiredLevel.Required = "required";
            AttributeRequiredLevel.Recommended = "recommended";
        })(AttributeRequiredLevel = Constants.AttributeRequiredLevel || (Constants.AttributeRequiredLevel = {}));
        var FormNotificationLevel;
        (function (FormNotificationLevel) {
            FormNotificationLevel.Error = "ERROR";
            FormNotificationLevel.Warning = "WARNING";
            FormNotificationLevel.Info = "INFO";
        })(FormNotificationLevel = Constants.FormNotificationLevel || (Constants.FormNotificationLevel = {}));
        var Templates;
        (function (Templates) {
            // entity attribute names
            Templates.SafeHtml = "safehtml";
            Templates.SubjectSafeHtml = "subjectsafehtml";
            Templates.Subject = "subject";
            Templates.Description = "description";
            Templates.IsEnhancedEditorEnabled = "isenhancededitorenabled";
            Templates.EnahancedEditorHtml = "enahancededitorhtml";
            // dialog names
            Templates.InsertDataDialog = "EmailTemplateInsertDataValue";
            Templates.CreateTemplateDialog = "CreateTemplateDialog";
            Templates.ConvertEmailToTemplateDialog = "ConvertEmailToTemplateDialog";
            // dialog field identifiers
            Templates.TemplateNameId = "templateNameId";
            Templates.PermissionLevelId = "permissionLevelId";
            Templates.LanguageId = "languageId";
            Templates.EmailSubjectWarningId = "emailSubjectWarningId";
            // dialog query parameters
            Templates.ParamCategory = "param_category";
            Templates.ParamSubject = "param_subject";
            Templates.ParamBody = "param_body";
            Templates.ParamEmailId = "param_emailId";
            Templates.ParamTemplateRecord = "param_templateRecord";
            // resx
            Templates.RequiredFieldsErrorMessage = "RequiredFieldsErrorMessage";
            Templates.ConvertingEmailToTemplateProgressMessage = "ConvertingEmailToTemplateProgressMessage";
            Templates.CopyingAttachmentsToTemplateMessage = "CopyingAttachmentsToTemplateMessage";
            Templates.CreatingTemplateProgressMessage = "CreatingTemplateProgressMessage";
            Templates.ErrorCreateTemplate = "ErrorCreateTemplate";
            Templates.ErrorCopyAttachmentsToTemplate = "ErrorCopyAttachmentsToTemplate";
            Templates.ErrorRetrievingAttachmentsForTemplate = "ErrorRetrievingAttachmentsForTemplate";
            Templates.WarningEmailSubjectLengthMessage = "WarningEmailSubjectLengthMessage";
            Templates.CreateOrgEmailTemplatesPrivilegeId = "01750f14-3320-49cc-a7d1-52502cdcd16d";
            Templates.Header_Ownerid = "header_ownerid";
            Templates.TemplateTypeCode = "templatetypecode";
            Templates.ValidEmailSubjectLength = 800;
            Templates.templateFormCkeditorControl = {
                RichTextEditor: "Rich text editor",
                ActivityEditor: false,
            };
            // TemplateInsertDataControl
            Templates.RemoveLabel = "InsertDataRemoveButtonLabel";
            Templates.MoveUpLabel = "InsertDataMoveUpButtonLabel";
            Templates.MoveDownLabel = "InsertDataMoveDownButtonLabel";
            Templates.iconDics = {
                InsertDataRemoveButtonLabel: 7,
                InsertDataMoveUpButtonLabel: 58,
                InsertDataMoveDownButtonLabel: 59,
            };
            // dialog names
            Templates.BlankTemplateBase64 = "/9j/4AAQSkZJRgABAQEAYABgAAD/4RCgRXhpZgAATU0AKgAAAAgABAE7AAIAAAAPAAAISodpAAQAAAABAAAIWpydAAEAAAAeAAAQeuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAENoYW50YWwgTXVydGh5AAAAAeocAAcAAAgMAAAIbAAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQwBoAGEAbgB0AGEAbAAgAE0AdQByAHQAaAB5AAAA/+EKZ2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPkNoYW50YWwgTXVydGh5PC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMABwUFBgUEBwYFBggHBwgKEQsKCQkKFQ8QDBEYFRoZGBUYFxseJyEbHSUdFxgiLiIlKCkrLCsaIC8zLyoyJyorKv/bAEMBBwgICgkKFAsLFCocGBwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKv/AABEIASoBLwMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APpGiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK5DW/ir4M8OavNpes6z9mvIMeZF9lmfbkZHKoR0PrQB19FcD/wALw+Hn/Qw/+SVx/wDG6P8AheHw8/6GH/ySuP8A43QB31FcD/wvD4ef9DD/AOSVx/8AG6P+F4fDz/oYf/JK4/8AjdAHfUVwP/C8Ph5/0MP/AJJXH/xuj/heHw8/6GH/AMkrj/43QB31FcJB8a/h9cXEcMfiFQ8jBVL2s6Lk+rFAAPcnFd0rB1DIQysMgg5BFAC0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXyF8bP+Su6x9Y//Ra19e18hfGz/krusfWP/wBFrTQmbOn/ALPPizUdNtr2DUNGWO5iWVA88oYBhkZxH15qx/wzZ4w/6CWif9/5v/jVfQ/hX/kT9I/68of/AEAVq0XCx8x/8M2eMP8AoJaJ/wB/5v8A41R/wzZ4w/6CWif9/wCb/wCNV9OUUXYWPmP/AIZs8Yf9BLRP+/8AN/8AGqP+GbPGH/QS0T/v/N/8ar6coouwsfDninw3eeEvEdzoupSQS3Ntt3vbsShyoPBIB7+leo/B34xHRGh8O+KZy2msQlrducm2PZWP9z3/AIfp05T42f8AJXdY+sf/AKLWtHx58JZ9D8N2HiXQVkn02e1ikuovvNbMVBLe6E9+1MR9VqwdQyEMrDIIOQRS182/B34xHRGh8O+KZy2msQlrducm2PZWP9z3/h+nT6RVg6hkIZWGQQcgipKFooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK+QvjZ/yV3WPrH/AOi1r69r5C+Nn/JXdY+sf/otaaEz6o8K/wDIn6R/15Q/+gCtWsrwr/yJ+kf9eUP/AKAK1aQwooooAKKKKAPkL42f8ld1j6x/+i1r6m8MxpL4L0qOVFdHsIlZWGQwKDIIr5Z+Nn/JXdY+sf8A6LWo7X4z+PrKzhtbXXtkMCCONfscB2qBgDJTPSq6EnT/ABg+D7+G5Jdf8NQs+kOd09uoybQnuP8AY/l9KsfB34xHRGh8O+KZy2msQlrducm2PZWP9z3/AIfp05OT42fECWNo5deV0cFWVrG3IYHqCPLrhZJDLK0jbQzEk7VCjn0A4H0FAH3urB1DIQysMgg5BFLXhn7O/jLVNSW78OahJ9otbKAS20jnLxjdjZnuvPHp9OnudSUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFfIXxs/5K7rH1j/8ARa19e18hfGz/AJK7rH1j/wDRa00Jn1R4V/5E/SP+vKH/ANAFatZXhX/kT9I/68of/QBWrSGFFFFABRRRQBkX3hHw3qd493qXh/Sru5kxvmuLKOR2wMcsVyar/wDCBeD/APoVNE/8F0P/AMTW/RQBgf8ACBeD/wDoVNE/8F0P/wATXD/GHwl4c0z4Xapd6b4f0uzuUMeya3so43XMig4YDIr1evP/AI3/APJItW+sX/oxaYjyz9mn/kcNW/68h/6GK+k6+bP2af8AkcNW/wCvIf8AoYr6Toe4IKKKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvkL42f8ld1j6x/+i1r69r5C+Nn/JXdY+sf/otaaEz6o8K/8ifpH/XlD/6AK1ayvCv/ACJ+kf8AXlD/AOgCtWkMKKKKACiiigAooooAK8/+N/8AySLVvrF/6MWvQK8/+N//ACSLVvrF/wCjFoA8s/Zp/wCRw1b/AK8h/wChivpOvmz9mn/kcNW/68h/6GK+k6b3EgooopDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK+QvjZ/wAld1j6x/8Aota+va+QvjZ/yV3WPrH/AOi1poTPqjwr/wAifpH/AF5Q/wDoArVrK8K/8ifpH/XlD/6AK1aQwooooAKKKKACiiigArz/AON//JItW+sX/oxa9Arz/wCN/wDySLVvrF/6MWgDyz9mn/kcNW/68h/6GK+k6+bP2af+Rw1b/ryH/oYr6TpvcSCiiikMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr5C+Nn/JXdY+sf/ota+va+QvjZ/yV3WPrH/6LWmhM+qPCv/In6R/15Q/+gCtWsrwr/wAifpH/AF5Q/wDoArVpDCiiigAooooAKKKKACvP/jf/AMki1b6xf+jFr0CvP/jf/wAki1b6xf8AoxaAPLP2af8AkcNW/wCvIf8AoYr6Tr5s/Zp/5HDVv+vIf+hivpOm9xIKKKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvkL42f8AJXdY+sf/AKLWvr2vnL4o/Crxn4j+I2papo2jfabOcp5cv2qFN2EAPDOD1HpTQmet+G/HHhSDwrpUU/ifRo5I7OJXR9QiDKQgyCC3BrT/AOE98H/9DXon/gxh/wDiq+Yv+FH/ABD/AOhe/wDJ23/+OUf8KP8AiH/0L3/k7b//ABynZAfTv/Ce+D/+hr0T/wAGMP8A8VR/wnvg/wD6GvRP/BjD/wDFV8xf8KP+If8A0L3/AJO2/wD8co/4Uf8AEP8A6F7/AMnbf/45RZAfTv8Awnvg/wD6GvRP/BjD/wDFUf8ACe+D/wDoa9E/8GMP/wAVXzF/wo/4h/8AQvf+Ttv/APHKP+FH/EP/AKF7/wAnbf8A+OUWQH07/wAJ74P/AOhr0T/wYw//ABVH/Ce+D/8Aoa9E/wDBjD/8VXzF/wAKP+If/Qvf+Ttv/wDHKP8AhR/xD/6F7/ydt/8A45RZAfTv/Ce+D/8Aoa9E/wDBjD/8VXD/ABh8W+HNT+F2qWmm+INLvLlzHsht72OR2xIpOFBya8a/4Uf8Q/8AoXv/ACdt/wD45R/wo/4h/wDQvf8Ak7b/APxyiyA6n9mn/kcNW/68h/6GK+k68R+B/wAPfE/g/wASajdeI9M+xwzWojjb7RFJltwOMIxPSvbqTBBRRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9k=";
            Templates.defaultFieldPlaceHolder = "---";
            Templates.defaultTextLabel = "InsertDataDefaultTextLabel";
            Templates.recordTypeLabel = "InsertDataRecordTypeLabel";
            Templates.fieldNameLabel = "InsertDataFieldNameLabel";
            Templates.addDataFieldLabel = "InsertDataAddDataFieldButtonLabel";
            Templates.CommonWebResource = "Activities/Resources/Activities";
            Templates.RTEdefaultWebResource = "msdyn_/RichTextEditorControl/RTEGlobalConfiguration.json";
            Templates.malformedDefaultValue = "malformedDefaultValue";
            Templates.subjectSafeHtmlNotification = "subjectsafehtml_RequiredFieldMustBeFilledIn";
            Templates.RequiredFieldMustBeFilledIn = "RequiredFieldMustBeFilledIn";
            Templates.RetrieveRecordTypeComponent = "TemplateInsertDataControl_RetrieveRecordType";
            Templates.RetrieveFieldNameComponent = "TemplateInsertDataControl_RetrieveFieldName";
            Templates.NotFocusedOnSubjectOrBody = "NotFocusedOnSubjectOrBody";
            Templates.nodeType = {
                ELEMENT_NODE: 1,
                TEXT_NODE: 3,
            };
        })(Templates = Constants.Templates || (Constants.Templates = {}));
        var keyboardEvent;
        (function (keyboardEvent) {
            keyboardEvent.keyCode = {
                ArrowRight: "ArrowRight",
                ArrowLeft: "ArrowLeft",
                ArrowUp: "ArrowUp",
                ArrowDown: "ArrowDown",
                Backspace: "Backspace",
            };
        })(keyboardEvent = Constants.keyboardEvent || (Constants.keyboardEvent = {}));
        var MailBoxConstants;
        (function (MailBoxConstants) {
            MailBoxConstants.OutgoingEmailDeliveryMethod = "outgoingemaildeliverymethod";
            MailBoxConstants.EnabledForOutgoingEmail = "enabledforoutgoingemail";
            MailBoxConstants.OutgoingEmailStatus = "outgoingemailstatus";
            var MailboxAccessStatus;
            (function (MailboxAccessStatus) {
                MailboxAccessStatus[MailboxAccessStatus["NotRun"] = 0] = "NotRun";
                MailboxAccessStatus[MailboxAccessStatus["Success"] = 1] = "Success";
                MailboxAccessStatus[MailboxAccessStatus["Failure"] = 2] = "Failure";
            })(MailboxAccessStatus = MailBoxConstants.MailboxAccessStatus || (MailBoxConstants.MailboxAccessStatus = {}));
            var EmailDeliveryMethod;
            (function (EmailDeliveryMethod) {
                EmailDeliveryMethod[EmailDeliveryMethod["Unset"] = -1] = "Unset";
                EmailDeliveryMethod[EmailDeliveryMethod["None"] = 0] = "None";
                EmailDeliveryMethod[EmailDeliveryMethod["OutlookClient"] = 1] = "OutlookClient";
                EmailDeliveryMethod[EmailDeliveryMethod["EmailRouter"] = 2] = "EmailRouter";
                EmailDeliveryMethod[EmailDeliveryMethod["ForwardMailbox"] = 3] = "ForwardMailbox";
            })(EmailDeliveryMethod = MailBoxConstants.EmailDeliveryMethod || (MailBoxConstants.EmailDeliveryMethod = {}));
            var EmailConnectionChannel;
            (function (EmailConnectionChannel) {
                EmailConnectionChannel[EmailConnectionChannel["SSS"] = 0] = "SSS";
                EmailConnectionChannel[EmailConnectionChannel["Router"] = 1] = "Router";
            })(EmailConnectionChannel = MailBoxConstants.EmailConnectionChannel || (MailBoxConstants.EmailConnectionChannel = {}));
        })(MailBoxConstants = Constants.MailBoxConstants || (Constants.MailBoxConstants = {}));
        var NotificationIds;
        (function (NotificationIds) {
            NotificationIds.unresolvedEmailNotificationID = "unresolvedEmailNotSupported";
            NotificationIds.invalidAddressNotificationId = "invalidAddressNotSupported";
        })(NotificationIds = Constants.NotificationIds || (Constants.NotificationIds = {}));
    })(Constants = Activities.Constants || (Activities.Constants = {}));
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var Common;
    (function (Common) {
        var Util;
        (function (Util) {
            function createCallBackFunction(func, parameters) {
                return function (retValue) {
                    parameters.unshift(retValue);
                    return func.apply(null, parameters);
                };
            }
            Util.createCallBackFunction = createCallBackFunction;
            function convertGuidToString(guid) {
                if (guid != null) {
                    guid = guid.replace("{", "").replace("}", "");
                }
                return guid;
            }
            Util.convertGuidToString = convertGuidToString;
            function isExecutionContextMissingAndReport(executionContext, telemetryItem) {
                if (IsNullOrUndefined(executionContext)) {
                    telemetryItem.traceEventError(Activities.Constants.TelemetryConstant.ExecutionContextMissing);
                    telemetryItem.report();
                }
            }
            Util.isExecutionContextMissingAndReport = isExecutionContextMissingAndReport;
            function IsNull(value) {
                return typeof value === "undefined" || typeof value === "unknown" || value == null;
            }
            Util.IsNull = IsNull;
            function IsNotNull(value) {
                return !IsNull(value);
            }
            Util.IsNotNull = IsNotNull;
            function IsNullOrEmptyString(str) {
                return Util.IsNull(str) || str == "";
            }
            Util.IsNullOrEmptyString = IsNullOrEmptyString;
            function IsNullOrUndefined(value) {
                return null == value || typeof value == "undefined";
            }
            Util.IsNullOrUndefined = IsNullOrUndefined;
            function IsNullOrWhiteSpace(value) {
                return Util.IsNullOrEmptyString(value) || value.trim() == "";
            }
            Util.IsNullOrWhiteSpace = IsNullOrWhiteSpace;
            function ShowMoCAOfflineError() {
                Activities.ClientApi.openAlertDialog(Activities.ClientApi.getResourceString("Error_Message_Generic_Mobile_Client_Offline"));
            }
            Util.ShowMoCAOfflineError = ShowMoCAOfflineError;
            function IsNullOrEmptyGuid(guid) {
                return IsNullOrEmptyString(guid) || convertGuidToString(guid) === Activities.Constants.EmptyGuidFormatted;
            }
            Util.IsNullOrEmptyGuid = IsNullOrEmptyGuid;
            function IsNewEntityForm(formContext) {
                return formContext.ui.getFormType() == 1 /* Create */;
            }
            Util.IsNewEntityForm = IsNewEntityForm;
            function GetEntityNames(records) {
                var activityEntityNames = {};
                for (var i = 0; i < records.length; i++) {
                    if (activityEntityNames[records[i].TypeName] == undefined)
                        activityEntityNames[records[i].TypeName] = [];
                }
                return activityEntityNames;
            }
            Util.GetEntityNames = GetEntityNames;
            function CheckIfIsReadOnlyInMobileClient(values) {
                var returnValue = false;
                for (var index = 0; index < values.length; index++) {
                    var value = values[index];
                    if (value["IsReadOnlyInMobileClient"] == true) {
                        returnValue = true;
                        break;
                    }
                }
                if (returnValue) {
                    var errorStrings = {
                        text: Activities.ClientApi.getResourceString("ReadOnlyEntity"),
                        confirmButtonLabel: Activities.ClientApi.getResourceString("Button_Ok"),
                    };
                    Xrm.Navigation.openAlertDialog(errorStrings);
                }
                return returnValue;
            }
            Util.CheckIfIsReadOnlyInMobileClient = CheckIfIsReadOnlyInMobileClient;
            function isOneDriveFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.OneDriveIntegrationFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_OneDriveIntegration));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.OneDriveIntegrationFCB);
                }
            }
            Util.isOneDriveFCBEnabled = isOneDriveFCBEnabled;
            function isEmailEnhancementsFeatureEnabled(featureFCBName) {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isDisruptiveFeatureEnabled(featureFCBName, Activities.Constants.FCBConstant.April2020UpdateFCB);
                }
                else {
                    return (Xrm.Internal.isFeatureEnabled(featureFCBName) &&
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.April2020UpdateFCB));
                }
            }
            Util.isEmailEnhancementsFeatureEnabled = isEmailEnhancementsFeatureEnabled;
            function isEmailEngagementFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailEngagement));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementFCB);
                }
            }
            Util.isEmailEngagementFCBEnabled = isEmailEngagementFCBEnabled;
            function isAllDayEventMidnightFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_AllDayEventInUTCMidnight) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.AllDayEventInUTCMidnight));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_AllDayEventInUTCMidnight);
                }
            }
            Util.isAllDayEventMidnightFCBEnabled = isAllDayEventMidnightFCBEnabled;
            function isSharePointFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SharePointS2SFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_SharePointS2S));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SharePointS2SFCB);
                }
            }
            Util.isSharePointFCBEnabled = isSharePointFCBEnabled;
            function isCursorPositionFCBEnabled() {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.InsertTemplateAtCursorPositionFCB, Activities.Constants.FCBConstant.October2021UpdateFCB);
                }
                return false;
            }
            Util.isCursorPositionFCBEnabled = isCursorPositionFCBEnabled;
            function isRecurrenceUciDialogFCBEnabled() {
                return (Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.RecurringAppointmentUciFCB, Activities.Constants.FCBConstant.April2021UpdateFCB) ||
                    Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.FCB_RecurringAppointmentUci, Activities.Constants.FCBConstant.April2021UpdateFCB));
            }
            Util.isRecurrenceUciDialogFCBEnabled = isRecurrenceUciDialogFCBEnabled;
            function isUpdatedDateValueParsingEnabled() {
                return (Xrm.Internal.isUci() &&
                    Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.UpdateDateValueParsing, Activities.Constants.FCBConstant.October2021UpdateFCB));
            }
            Util.isUpdatedDateValueParsingEnabled = isUpdatedDateValueParsingEnabled;
            function isEmailEngagementAndOneDriveEnabledAtOrgLevel() {
                return (Xrm.Utility.getGlobalContext().organizationSettings.attributes["isonedriveenabled"] &&
                    Xrm.Utility.getGlobalContext().organizationSettings.attributes["isemailmonitoringallowed"]);
            }
            Util.isEmailEngagementAndOneDriveEnabledAtOrgLevel = isEmailEngagementAndOneDriveEnabledAtOrgLevel;
            function isMobile() {
                return Xrm.Utility.getGlobalContext().client.getClient().toString() === "Mobile";
            }
            Util.isMobile = isMobile;
            function isOutlook() {
                return Xrm.Utility.getGlobalContext().client.getClient().toString() === "Outlook";
            }
            Util.isOutlook = isOutlook;
            function isMailApp() {
                var contexts = Xrm && Xrm.ExternalContext ? Xrm.ExternalContext.getAvailableExternalContexts() : null;
                if (contexts && contexts.get("MAIL_CONTEXT")) {
                    return true;
                }
                return false;
            }
            Util.isMailApp = isMailApp;
            function isSendBulkEmailInUciEnabledAtOrgLevel() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["sendbulkemailinuci"])) {
                    return false;
                }
                return attrs["sendbulkemailinuci"] == "1";
            }
            Util.isSendBulkEmailInUciEnabledAtOrgLevel = isSendBulkEmailInUciEnabledAtOrgLevel;
            function resolveSimilarUnresolvedAddresses() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["resolvesimilarunresolvedemailaddress"])) {
                    return true; //the default value of this setting is 1.
                }
                return attrs["resolvesimilarunresolvedemailaddress"] == "1";
            }
            Util.resolveSimilarUnresolvedAddresses = resolveSimilarUnresolvedAddresses;
            function allowUnresolvedPartiesOnEmailSend() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["allowunresolvedpartiesonemailsend"])) {
                    return false; //the default value of this setting is 0.
                }
                return attrs["allowunresolvedpartiesonemailsend"] == "1";
            }
            Util.allowUnresolvedPartiesOnEmailSend = allowUnresolvedPartiesOnEmailSend;
            function orgEmailConnectionChannel() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["emailconnectionchannel"])) {
                    return 0; //the default value of this setting is 0.
                }
                return attrs["emailconnectionchannel"] == "0" ? 0 : 1;
            }
            Util.orgEmailConnectionChannel = orgEmailConnectionChannel;
            function isDocumentManagementEnabled() {
                return Xrm.Utility.getEntityMetadata("email").then(function (res) {
                    return res.IsDocumentManagementEnabled;
                }, function (err) {
                    return false;
                });
            }
            Util.isDocumentManagementEnabled = isDocumentManagementEnabled;
            function isEmailEngagementActionsFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementActionFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailEngagementAction));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementActionFCB);
                }
            }
            Util.isEmailEngagementActionsFCBEnabled = isEmailEngagementActionsFCBEnabled;
            function isMailboxDialogFCBEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.MailboxEnabledDialogFCB) ||
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_MailboxEnabledDialog));
            }
            Util.isMailboxDialogFCBEnabled = isMailboxDialogFCBEnabled;
            function isSafeDescriptionInEmailUCIEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SafeDescriptionInEmailUCIFCB) ||
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_SafeDescriptionInEmailUCI));
            }
            Util.isSafeDescriptionInEmailUCIEnabled = isSafeDescriptionInEmailUCIEnabled;
            function isResolveUnknownEmailsFCBEnabled() {
                if (Xrm.Internal.isUci()) {
                    return (!Activities.ClientApi.IsMocaOffline() &&
                        Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.UnresolvedEmailAddressFeatureFCB, Activities.Constants.FCBConstant.April2020UpdateFCB));
                }
                return false;
            }
            Util.isResolveUnknownEmailsFCBEnabled = isResolveUnknownEmailsFCBEnabled;
            function enableActivitiesTimeLinePerfImprovement(stage) {
                // The perf improvement will retrun false in case of webclient and will return value based on bitmask value set in case of UCI
                if (Xrm.Internal.isUci()) {
                    var perfOrgDbOrgSettings = +this.getOrgDbOrgSettingValue(Activities.Constants.PerfConstants.PerfOrgDbOrgSettings, "0");
                    return (perfOrgDbOrgSettings & stage) == stage;
                }
                else {
                    return false;
                }
            }
            Util.enableActivitiesTimeLinePerfImprovement = enableActivitiesTimeLinePerfImprovement;
            function isFCBEnabled(FCBName, ReleaseWaveFCB) {
                if (Xrm.Internal.isUci()) {
                    if (ReleaseWaveFCB != null) {
                        return Xrm.Internal.isDisruptiveFeatureEnabled(FCBName, ReleaseWaveFCB);
                    }
                    return Xrm.Internal.isFeatureEnabled(FCBName);
                }
                return false;
            }
            Util.isFCBEnabled = isFCBEnabled;
            function EnableEmailEditInMoca() {
                if (Xrm.Internal.isUci()) {
                    return (!Activities.ClientApi.IsMocaOffline() &&
                        Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.EnableEmailEditInMocaFCB, Activities.Constants.FCBConstant.October2020UpdateFCB));
                }
                return false;
            }
            Util.EnableEmailEditInMoca = EnableEmailEditInMoca;
            function isEmailTemplatePreviewFeatureOn(xrmPage) {
                var limitedHeight = 400;
                var limitedWidth = 650;
                // Bug1645736 : The new dialog doesn't render above 110% defaults to older dialog.
                // viewport corresponds to the body of the form and does not include the navigation, header, footer or form assistant areas of the page
                // So adding offset value
                var offset = 225;
                var pageHeight = xrmPage.ui.getViewPortHeight() + offset;
                var pageWidth = xrmPage.ui.getViewPortWidth() + offset;
                if (Xrm.Internal.isUci()) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_April2020Update) &&
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailTemplatePreviewEnhancementsEnabled) &&
                        pageHeight > limitedHeight &&
                        pageWidth > limitedWidth);
                }
                return false;
            }
            Util.isEmailTemplatePreviewFeatureOn = isEmailTemplatePreviewFeatureOn;
            function isActivitiesFeatureEnable(featureName, defaultValue) {
                var activitiesFeatureEnableSettings = +this.getOrgDbOrgSettingValue(Activities.Constants.ActivitiesFeature.ActivitiesFeatureOrgDbOrgSettings, defaultValue);
                return (activitiesFeatureEnableSettings & featureName) == featureName;
            }
            Util.isActivitiesFeatureEnable = isActivitiesFeatureEnable;
            function enableInsertSignatureInUCI() {
                // This function will return true in case the insert signature feature is enabled in UCI and false in all other scenarios
                if (Xrm.Internal.isUci()) {
                    return this.isActivitiesFeatureEnable(Activities.Constants.ActivitiesFeature.ActivitiesFeatureList.EnableInsertSignatureInUCI, Activities.Constants.OrgSettingsConstant.InsertSignatureFeatureBitValue);
                }
                else {
                    return false;
                }
            }
            Util.enableInsertSignatureInUCI = enableInsertSignatureInUCI;
            function enableDynamicTextForSignature() {
                // This function will return true in case the dynamic text is enabled for email signature feature.
                return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_October2022Update) &&
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EnableDynamicTextForEmailSignature);
            }
            Util.enableDynamicTextForSignature = enableDynamicTextForSignature;
            function disableAllControls(executionContext) {
                var formContext = executionContext.getFormContext();
                var controls = formContext && formContext.ui.controls;
                controls &&
                    controls.forEach(function (control) {
                        control.setDisabled(true);
                    });
                var allTabs = formContext && formContext.ui.tabs;
                allTabs &&
                    allTabs.forEach(function (tab) {
                        var allSections = executionContext.getFormContext().ui.tabs.get(tab.getName()).sections;
                        allSections.forEach(function (section) {
                            var allControlsForSection = section.controls;
                            for (var i = 0; i < allControlsForSection.getLength(); i++) {
                                var control = allControlsForSection.getByIndex(i);
                                control.setDisabled(true);
                            }
                        });
                    });
            }
            Util.disableAllControls = disableAllControls;
            function showSpecificSectionOnly(executionContext, tabName, sectionName) {
                var allTabs = executionContext.getFormContext().ui.tabs;
                var BasicTabSections = allTabs.getByName(tabName).sections;
                BasicTabSections.forEach(function (section) {
                    if (section._controlName != sectionName) {
                        section.setVisible(false);
                    }
                });
            }
            Util.showSpecificSectionOnly = showSpecificSectionOnly;
            function addDirection() {
                return Xrm.Internal.isUci() && Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailRTLDirectionInUCI);
            }
            Util.addDirection = addDirection;
            function getDirection() {
                return Xrm.Utility.getGlobalContext() &&
                    Xrm.Utility.getGlobalContext().userSettings &&
                    Xrm.Utility.getGlobalContext().userSettings.isRTL
                    ? "rtl"
                    : "ltr";
            }
            Util.getDirection = getDirection;
            function getfontSizeStyleString() {
                return "9pt";
            }
            Util.getfontSizeStyleString = getfontSizeStyleString;
            function getfontFamilyStyleString() {
                return "'Segoe UI','Helvetica Neue',sans-serif";
            }
            Util.getfontFamilyStyleString = getfontFamilyStyleString;
            /**
             * get the orgDbOrgSetting value if it exists. Required a dependency on the organization entity's orgDbOrgSetting attribute
             * returns false if offline as it can't be assumed that organization entity is available for offline
             * @param orgDbOrgSettingName the orgDbOrgSetting name
             * @param defaultValue the default value to return if the setting is not available
             */
            function getOrgDbOrgSettingValue(orgDbOrgSettingName, defaultValue) {
                if (IsNullOrEmptyString(orgDbOrgSettingName) || Activities.ClientApi.IsMocaOffline()) {
                    return defaultValue;
                }
                var xmlParser = new DOMParser();
                if (ActivityHelper.orgDbOrgSettingsXml === undefined) {
                    try {
                        var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                        if (Xrm.Internal.isUci()) {
                            // Check if the attrs is populated or not
                            if (!IsNullOrUndefined(attrs)) {
                                ActivityHelper.orgDbOrgSettingsXml = attrs["orgdborgsettings"]
                                    ? xmlParser.parseFromString(attrs["orgdborgsettings"], "text/xml")
                                    : null;
                            }
                            else {
                                // if for some reason we are not getting the organizationSettings attributes, then return the default value.
                                return defaultValue;
                            }
                        }
                        else {
                            if (!IsNullOrUndefined(attrs)) {
                                ActivityHelper.orgDbOrgSettingsXml = attrs.orgDBOrgSettings
                                    ? xmlParser.parseFromString(attrs.orgDBOrgSettings, "text/xml")
                                    : null;
                            }
                        }
                    }
                    catch (Exception) {
                        return defaultValue;
                    }
                }
                var orgDbOrgSettingsXml = ActivityHelper.orgDbOrgSettingsXml;
                if (Common.Util.IsNullOrUndefined(orgDbOrgSettingsXml) || orgDbOrgSettingsXml.documentElement == null) {
                    return defaultValue;
                }
                var orgDbOrgSettingNode = orgDbOrgSettingsXml.documentElement.getElementsByTagName(orgDbOrgSettingName);
                return orgDbOrgSettingNode == null || orgDbOrgSettingNode.length <= 0
                    ? null
                    : orgDbOrgSettingNode[0].textContent == null
                        ? null
                        : orgDbOrgSettingNode[0].textContent.toLowerCase();
            }
            Util.getOrgDbOrgSettingValue = getOrgDbOrgSettingValue;
            // XHR wrapped in a promise
            function sendRequest(url, addOdataHeaders, telemetryItem) {
                return new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open("GET", url); //change it to POST or get?
                    if (addOdataHeaders) {
                        request.setRequestHeader("odata-maxversion", "4.0");
                        request.setRequestHeader("odata-version", "4.0");
                        request.setRequestHeader("prefer", 'odata.include-annotations="*"');
                    }
                    request.onreadystatechange = function () {
                        // Mimic Fetch Response object when ready state is 4.
                        if (request.readyState === 4) {
                            var responseBodyInAPromise = function () {
                                return Promise.resolve(JSON.parse(request.responseText));
                            };
                            var isSuccess = request.status === 200;
                            resolve({
                                ok: isSuccess,
                                status: request.status,
                                statusText: request.statusText,
                                json: responseBodyInAPromise,
                                text: responseBodyInAPromise,
                                url: url,
                            });
                            reject = function (error) {
                                telemetryItem.traceEventError("Exception occured while executing XHR request: " + error);
                                reject(error);
                            };
                        }
                    };
                    request.send();
                });
            }
            Util.sendRequest = sendRequest;
            // function to parse json response.
            function parseJsonResponse(response, telemetryItem) {
                return Promise.resolve().then(function () {
                    if (!response) {
                        telemetryItem.traceEventError("Null response from server for request : " + response.url);
                    }
                    else {
                        var contentTypeHeader = getHttpHeader(response.headers, "Content-Type");
                        if (contentTypeHeader && contentTypeHeader.indexOf("text/html") > -1) {
                            return response.text().then(function (text) {
                                telemetryItem.traceEventError("Server returned an HTML error response: " + text);
                            });
                        }
                        else {
                            return response.json();
                        }
                    }
                });
            }
            Util.parseJsonResponse = parseJsonResponse;
            function getHttpHeader(headers, headerName) {
                if (!headers) {
                    return null;
                }
                var headerValue = headers.get(headerName);
                if (!headerValue) {
                    headerValue = headers.get(headerName.toLowerCase());
                }
                return headerValue;
            }
            /**
             * Prepares an XHR request to retrieve relationships metadata for list of lookup attributes.
             * Note: Even though this method generically handles for ownerid attribute as well, but currently we are not passing fetching the relationship metadata for ownerid attribute.
             * @param attributeNames the list of lookup attributes.
             * @param telemetryItem telemetry item.
             * @param addOwnerFilter adds the owner attribute filter in the url.
             * @param isActivity true if the referencing entity is an activity otherwise false.
             */
            function getRelationshipsMetadataForLookups(referencingEntityName, attributeNameValuePairs, telemetryItem, addOwnerFilter, isActivity) {
                if (addOwnerFilter === void 0) { addOwnerFilter = false; }
                if (isActivity === void 0) { isActivity = true; }
                var filterStart = "&$filter=(";
                var filterEnd = ")";
                var referencingEntityFilter = "ReferencingEntity eq '" + referencingEntityName + "'";
                var attributeFilters;
                var filter;
                var url = Xrm.Utility.getGlobalContext().getClientUrl() +
                    "/api/data/v9.0/RelationshipDefinitions/Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata?$select=ReferencingEntityNavigationPropertyName,ReferencingAttribute,ReferencingEntity,ReferencedEntity";
                // Create attribute filters
                for (var attributeName in attributeNameValuePairs) {
                    if (IsNullOrUndefined(attributeNameValuePairs[attributeName]) || attributeName === "ownerid") {
                        continue;
                    }
                    var attributeFilter = "(ReferencedEntity eq '" +
                        attributeNameValuePairs[attributeName][0].entityType +
                        "'" +
                        " and ReferencingAttribute eq '" +
                        attributeName +
                        "')";
                    if (IsNullOrUndefined(attributeFilters)) {
                        attributeFilters = attributeFilter;
                    }
                    else {
                        attributeFilters += " or " + attributeFilter;
                    }
                }
                filter = filterStart;
                if (!IsNullOrUndefined(attributeFilters)) {
                    filter += "(" + referencingEntityFilter + " and (" + attributeFilters + "))";
                }
                // for ownerid attribute the refereced entity is "owner" and not systemuser or team, hence the hardcoding for referenced entity.
                // also for activities to owner relationship the referenceing entity is the activitypointer entity.
                if (addOwnerFilter) {
                    var referencingEntity = isActivity ? "activitypointer" : referencingEntityName;
                    if (!IsNullOrUndefined(attributeFilters)) {
                        filter += "or ";
                    }
                    filter +=
                        "(ReferencingEntity eq '" +
                        referencingEntity +
                        "' and ReferencedEntity eq 'owner' and ReferencingAttribute eq 'ownerid')";
                }
                filter += filterEnd;
                if (filter.length === "&$filter=()".length) {
                }
                else {
                    url += filter;
                }
                telemetryItem.traceEventInformation("Url for relationship metadata query: " + url);
                return Activities.Common.Util.sendRequest(url, true, telemetryItem);
            }
            Util.getRelationshipsMetadataForLookups = getRelationshipsMetadataForLookups;
            /**
             * returns the error or inner error message
             * @param error the error.
             */
            function tryGetErrorMessage(error) {
                if (!IsNullOrUndefined(error.innerror) && !IsNullOrUndefined(error.innerror.message)) {
                    return error.innerror.message;
                }
                else if (!IsNullOrUndefined(error.message)) {
                    return error.message;
                }
                return error;
            }
            Util.tryGetErrorMessage = tryGetErrorMessage;
            /**
             * Gets AttachmentId from email body
             * @param body email body which would be html with image tags
             */
            function getAttachmentIdsFromEmailBody(body) {
                var mimeAttachmentIds = [];
                if (body) {
                    // get id's from download.aspx uri's && data-attachment-id attributes
                    var downloadUriRegex = /img[^>]+src=[^>]+&attachmentid=(.+?)("|')/gi;
                    var dataAttachmentIdRegex = /img[^>]+data-attachment-id[^>]+?("|')([^'"]+?)("|')/gi;
                    // Bug: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2590581
                    // In this case we might not get "" double quotes in our data attachment id. And after id it might close either with space or '>'.
                    if (!Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SSSUseOfficeApiToFilterUnSafeContentFCB)) {
                        dataAttachmentIdRegex = /img[^>]+data-attachment-id[^>]+?("|')?([^'"]+?)(\"|\'|>|\\s)/gi;
                    }
                    var match = void 0;
                    while ((match = downloadUriRegex.exec(body)) != null) {
                        mimeAttachmentIds.push(match[1]);
                    }
                    while ((match = dataAttachmentIdRegex.exec(body)) != null) {
                        mimeAttachmentIds.push(match[2]);
                    }
                }
                return mimeAttachmentIds;
            }
            Util.getAttachmentIdsFromEmailBody = getAttachmentIdsFromEmailBody;
            function getMaskToSameWeekDayMapping(daysOfWeekMask) {
                switch (daysOfWeekMask) {
                    //0x01 is Sunday
                    case 1:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Sunday;
                    case 2:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Monday;
                    case 4:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Tuesday;
                    case 8:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Wednesday;
                    case 16:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Thursday;
                    case 32:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Friday;
                    case 64:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Saturday;
                    case 65:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekend;
                    case 62:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekday;
                    default:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Day;
                }
            }
            Util.getMaskToSameWeekDayMapping = getMaskToSameWeekDayMapping;
            function getSameWeekDayToMaskMapping(day) {
                switch (day) {
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Sunday:
                        return 1;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Monday:
                        return 2;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Tuesday:
                        return 4;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Wednesday:
                        return 8;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Thursday:
                        return 16;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Friday:
                        return 32;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Saturday:
                        return 64;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekend:
                        return 65;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekday:
                        return 62;
                    default:
                        return 127;
                }
            }
            Util.getSameWeekDayToMaskMapping = getSameWeekDayToMaskMapping;
        })(Util = Common.Util || (Common.Util = {}));
        var ActivityHelper = (function () {
            function ActivityHelper() {
            }
            ActivityHelper.setFocusToSubject = function (form, telemetryItem) {
                try {
                    var subjectControl = form.ui.controls.get("subject");
                    subjectControl.setFocus();
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting focus to subject control.", exception.message);
                }
            };
            ActivityHelper.setOwner = function (formContext, telemetryItem) {
                var ownerId = formContext.getAttribute("ownerid");
                try {
                    if (Common.Util.IsNotNull(ownerId) &&
                        (Common.Util.IsNullOrUndefined(ownerId.getValue()) || ownerId.getValue().length == 0) &&
                        formContext.ui.getFormType() !== 2 /* Update */) {
                        ownerId.setValue(ActivityHelper.getCurrentUser());
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting owner value.", exception.message);
                }
            };
            ActivityHelper.setOrganizer = function (formContext, telemetryItem) {
                try {
                    var organizer = formContext.getAttribute("organizer");
                    if (organizer &&
                        (Common.Util.IsNullOrUndefined(organizer.getValue()) || organizer.getValue().length == 0) &&
                        formContext.ui.getFormType() !== 2 /* Update */) {
                        var ownerId = formContext.getAttribute("ownerid");
                        if (ownerId && ownerId.getValue()) {
                            telemetryItem.traceEventInformation("Organizer value is set as obtained from the FORM");
                            organizer.setValue(ownerId.getValue());
                        }
                        else {
                            telemetryItem.traceEventInformation("Organizer value is set as current user, since not obtained from the FORM");
                            organizer.setValue(ActivityHelper.getCurrentUser());
                        }
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting organizer value.", exception.message);
                }
            };
            ActivityHelper.getCurrentUser = function () {
                var owner = [];
                owner.push({
                    id: Xrm.Utility.getGlobalContext().userSettings.userId,
                    name: Xrm.Utility.getGlobalContext().userSettings.userName,
                    entityType: "systemuser",
                });
                return owner;
            };
            ActivityHelper.getParticipationTypeMask = function (entityName, columnName) {
                var participationTypeMask = {
                    appointment: { optionalattendees: 6, organizer: 7, requiredattendees: 5 },
                    campaignactivity: { partners: 1, from: 1 },
                    campaignresponse: { customer: 11, partner: 11, from: 11 },
                    email: { bcc: 4, cc: 3, from: 1, to: 2 },
                    fax: { from: 1, to: 2 },
                    letter: { bcc: 4, from: 1, to: 2 },
                    phonecall: { from: 1, to: 2 },
                    recurringappointmentmaster: { optionalattendees: 6, organizer: 7, requiredattendees: 5 },
                    serviceappointment: { customers: 11, resources: 10 },
                };
                var entityMasksTypes = participationTypeMask[entityName];
                if (!entityMasksTypes) {
                    return null;
                }
                return entityMasksTypes[columnName];
            };
            ActivityHelper.convertServerTimeToUserLocalTime = function (datetime) {
                datetime = new Date(datetime);
                if (Xrm.Internal.isUci())
                    datetime.setMinutes(datetime.getMinutes() +
                        datetime.getTimezoneOffset() +
                        Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes());
                return datetime;
            };
            ActivityHelper.convertUserLocalTimeToServerTime = function (datetime) {
                datetime = new Date(datetime);
                if (Xrm.Internal.isUci())
                    datetime.setMinutes(datetime.getMinutes() -
                        datetime.getTimezoneOffset() -
                        Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes());
                return datetime;
            };
            ActivityHelper.setAttributeValue = function (eventContext, attributeId, value) {
                var attribute = eventContext
                    .getFormContext()
                    .data.attributes.get(attributeId);
                if (attribute != null) {
                    attribute.setValue(value);
                }
            };
            ActivityHelper.closeDialog = function (eventContext) {
                var lastButtonClicked = eventContext
                    .getFormContext()
                    .data.attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
                if (lastButtonClicked != null) {
                    lastButtonClicked.setValue(Activities.Constants.MetadataDrivenDialogConstants.DialogCancelId);
                }
                eventContext.getFormContext().ui.close();
            };
            return ActivityHelper;
        }());
        Common.ActivityHelper = ActivityHelper;
    })(Common = Activities.Common || (Activities.Common = {}));
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var ClientApi;
    (function (ClientApi) {
        ClientApi.IsUci = Xrm.Internal.isUci();
        function getResourceString(key) {
            try {
                var value = ClientApi.ClientApiAbstracts.Instance().getResourceString(key);
                return value;
            }
            catch (exception) {
                //not adding separate telemetry as the error is already logged from the function called in try block
                //this is to handle webclient/ur2 client issue - bug:1834000
                return key;
            }
        }
        ClientApi.getResourceString = getResourceString;
        //To be moved to Common
        function getFormUIForRibbon(form) {
            return ClientApi.ClientApiAbstracts.Instance().getFormUi(form);
        }
        ClientApi.getFormUIForRibbon = getFormUIForRibbon;
        function getFormDataForRibbon(form) {
            return ClientApi.ClientApiAbstracts.Instance().getFormData(form);
        }
        ClientApi.getFormDataForRibbon = getFormDataForRibbon;
        /// <summary>
        /// Error message resource id prefix
        /// </summary>
        var ErrorMessageIdPrefix = "Error_Message_0x";
        var Generic_Error_Mesage = "Generic_ErrorMessage";
        var GenericErrorDialogKey = "Error_In_Dialog_Open";
        /// <summary>
        /// string of hex format error code
        /// </summary>
        /// <param name="errorCode">The error code </param>
        /// <returns>hex format error code</returns>
        function getHexErrorCode(errorCode) {
            var code = errorCode;
            if (code < 0) {
                // Handle negative decimal values
                code = (code + 0xffffffff + 1);
            }
            //Converting the Hex string to lower case to maintain the convention
            return code.toString(16).toLowerCase();
        }
        function getErrorMessageKey(errorCode) {
            return ErrorMessageIdPrefix + getHexErrorCode(errorCode);
        }
        function getErrorMessage(errorCode) {
            var completeErrorCode = getErrorMessageKey(errorCode);
            var errorMessage = ClientApi.ClientApiAbstracts.Instance().getResourceString(completeErrorCode);
            if (Activities.Common.Util.IsNullOrEmptyString(errorMessage) || errorMessage === completeErrorCode) {
                return null;
            }
            else {
                return errorMessage;
            }
        }
        function removeRawFromErrorResponse(response) {
            if (response && response.raw) {
                var raw = response.raw, rest = __rest(response, ["raw"]);
                return rest;
            }
            return response;
        }
        ClientApi.removeRawFromErrorResponse = removeRawFromErrorResponse;
        function dialogActionRawFailedCallback(response, telemetryitem) {
            if (!Activities.Common.Util.IsNullOrUndefined(telemetryitem)) {
                var purgedResponse = removeRawFromErrorResponse(response);
                telemetryitem.traceEventError("Error in dialog action.", purgedResponse);
                telemetryitem.report();
            }
            try {
                var errorMessage = response.message;
                var jsonResponse = response.raw && JSON.parse(response.raw);
                //if there are any parameters in error message and raw response is not null
                if (!Activities.Common.Util.IsNullOrUndefined(errorMessage) &&
                    errorMessage.indexOf("{0}") != -1 &&
                    !Activities.Common.Util.IsNullOrUndefined(jsonResponse) &&
                    !Activities.Common.Util.IsNullOrUndefined(jsonResponse._errorFault) &&
                    !Activities.Common.Util.IsNullOrUndefined(jsonResponse._errorFault._annotations)) {
                    var i = 0;
                    while (i < 10) {
                        if (errorMessage.indexOf("{" + i + "}") != -1) {
                            var param = jsonResponse._errorFault._annotations["@Microsoft.PowerApps.CDS.ErrorDetails." + i];
                            if (!Activities.Common.Util.IsNullOrUndefined(param)) {
                                errorMessage = errorMessage.replace("{" + i + "}", param);
                            }
                        }
                        else {
                            break;
                        }
                        i++;
                    }
                }
                var options = {
                    errorCode: response.errorCode,
                    message: errorMessage,
                };
                Xrm.Navigation.openErrorDialog(options);
            }
            catch (exception) {
                Xrm.Navigation.openErrorDialog(response);
            }
        }
        ClientApi.dialogActionRawFailedCallback = dialogActionRawFailedCallback;
        function dialogActionFailedCallback(response, telemetryitem) {
            if (!Activities.Common.Util.IsNullOrUndefined(telemetryitem)) {
                var purgedResponse = removeRawFromErrorResponse(response);
                telemetryitem.traceEventError("Error in dialog action.", purgedResponse);
                telemetryitem.report();
            }
            Xrm.Navigation.openErrorDialog(response);
        }
        ClientApi.dialogActionFailedCallback = dialogActionFailedCallback;
        function dialogOpenFailedCallback(response, telemetryitem) {
            var genericErrorMessage = getResourceString(GenericErrorDialogKey);
            if (!Activities.Common.Util.IsNullOrUndefined(telemetryitem)) {
                telemetryitem.traceEventError("Error opening dialog.", response);
                telemetryitem.report();
            }
            openAlertDialog(genericErrorMessage);
        }
        ClientApi.dialogOpenFailedCallback = dialogOpenFailedCallback;
        function openDialogFailedCallback(response) {
            var genericErrorMessage = getResourceString(GenericErrorDialogKey);
            openAlertDialog(genericErrorMessage);
        }
        ClientApi.openDialogFailedCallback = openDialogFailedCallback;
        function IsMocaOffline() {
            return IsMobileClient() && IsOffline();
        }
        ClientApi.IsMocaOffline = IsMocaOffline;
        function IsOffline() {
            return Xrm.Utility.getGlobalContext().client.getClientState() == Xrm.Constants.ClientStates.offline;
        }
        ClientApi.IsOffline = IsOffline;
        function IsMobileClient() {
            return Xrm.Utility.getGlobalContext().client.getClient() == Xrm.Constants.ClientNames.mobile;
        }
        ClientApi.IsMobileClient = IsMobileClient;
        function IsOutlookClient() {
            return Xrm.Utility.getGlobalContext().client.getClient() == Xrm.Constants.ClientNames.outlook;
        }
        ClientApi.IsOutlookClient = IsOutlookClient;
        function getWindowCenter() {
            return ClientApi.ClientApiAbstracts.Instance().WindowPositionCenter;
        }
        ClientApi.getWindowCenter = getWindowCenter;
        function openAlertDialog(text) {
            return ClientApi.ClientApiAbstracts.Instance().openAlertDialog(text);
        }
        ClientApi.openAlertDialog = openAlertDialog;
        function openDialog(name, options, parameters) {
            return ClientApi.ClientApiAbstracts.Instance().openDialog(name, options, parameters);
        }
        ClientApi.openDialog = openDialog;
        function openConfirmDialog(confirmStrings, options) {
            return ClientApi.ClientApiAbstracts.Instance().openConfirmDialog(confirmStrings, options);
        }
        ClientApi.openConfirmDialog = openConfirmDialog;
        function retrieveRecord(entityName, recordId, options) {
            if (ClientApi.IsMocaOffline()) {
                return Xrm.WebApi.offline.retrieveRecord(entityName, recordId, options);
            }
            else {
                return Xrm.WebApi.online.retrieveRecord(entityName, recordId, options);
            }
        }
        ClientApi.retrieveRecord = retrieveRecord;
        // Web resource names for getResources
        var CommonWebResource = "Activities/Resources/Activities";
        var ClientApiAbstracts = (function () {
            function ClientApiAbstracts() {
                this.WindowPositionCenter = 1 /* center */;
            }
            ClientApiAbstracts.Instance = function () {
                if (this._clientApi != null) {
                    return this._clientApi;
                }
                if (Xrm.Internal.isUci()) {
                    ClientApiAbstracts._clientApi = new UClientApi();
                }
                else {
                    this._clientApi = new WebClientApi();
                }
                return this._clientApi;
            };
            ClientApiAbstracts.prototype.getResourceString = function (key, webResourceName) {
                if (webResourceName === void 0) { webResourceName = CommonWebResource; }
                return Xrm.Utility.getResourceString(webResourceName, key);
            };
            ClientApiAbstracts.prototype.openAlertDialog = function (text) {
                return Xrm.Navigation.openAlertDialog({ text: text }, null);
            };
            ClientApiAbstracts.prototype.openDialog = function (name, options, parameters) {
                return Xrm.Navigation.openDialog(name, options, parameters);
            };
            ClientApiAbstracts.prototype.openConfirmDialog = function (confirmStrings, options) {
                return Xrm.Navigation.openConfirmDialog(confirmStrings, options);
            };
            return ClientApiAbstracts;
        }());
        ClientApiAbstracts._clientApi = null;
        ClientApi.ClientApiAbstracts = ClientApiAbstracts;
        var UClientApi = (function (_super) {
            __extends(UClientApi, _super);
            function UClientApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UClientApi.prototype.getFormData = function (form) {
                return form.data;
            };
            UClientApi.prototype.getFormUi = function (form) {
                return form.ui;
            };
            return UClientApi;
        }(ClientApiAbstracts));
        var WebClientApi = (function (_super) {
            __extends(WebClientApi, _super);
            function WebClientApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WebClientApi.prototype.getFormData = function (form) {
                return Xrm.Page.data;
            };
            WebClientApi.prototype.getFormUi = function (form) {
                return Xrm.Page.ui;
            };
            return WebClientApi;
        }(ClientApiAbstracts));
    })(ClientApi = Activities.ClientApi || (Activities.ClientApi = {}));
})(Activities || (Activities = {}));
// -----------------------------------------------------------------------
// <copyright file="Common.ts" company="Microsoft">
//		Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// <owner>rishabhs</owner>
// -----------------------------------------------------------------------
var Activities;
(function (Activities) {
    //polyfilling the CustomEvent() constructor functionality for IE
    Activities.polyfillingCustomEvent = function () {
        if (typeof Event === "function") {
            return false;
        }
        function CustomEvent(event, params) {
            if (params === void 0) {
                params = {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined,
                };
            }
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        window.CustomEvent = CustomEvent;
    };
})(Activities || (Activities = {}));
// -----------------------------------------------------------------------
// <copyright file="Email.cs" company="Microsoft">
//		Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// <owner>suduggir</owner>
// -----------------------------------------------------------------------
var Activities;
(function (Activities) {
    //polyfilling the CustomEvent() constructor functionality
    Activities.polyfillingCustomEvent();
    /// <summary>
    /// Email
    /// </summary>
    var Email = (function (_super) {
        __extends(Email, _super);
        function Email() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.emailType = EmailType.Draft;
            return _this;
        }
        // TODO: Email engagement code conversion in the onload handler of Email
        // TaskId: 273926
        /// <summary>
        /// OnLoad method of the email form
        /// </summary>
        /// <param name="executionContext">ExecutionContext to be passed as first parameter</param>
        /// <returns></returns>
        Email.formOnload = function (executionContext) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Constants.EntityNames.Email, Constants.TelemetryConstant.EventEmailOnLoad);
            Activities.Common.Util.isExecutionContextMissingAndReport(executionContext, telemetryItem);
            var form = executionContext.getFormContext();
            var isUci = Xrm.Internal.isUci();
            if (isUci) {
                // lock the new email form to prevent use pre-october 2020
                this.lockNewEmailFormOnload(executionContext, Constants.October2020EmailFormId);
                new Activities.Email().setDefaultValues(form, telemetryItem);
            }
            else {
                Mscrm.EntityPageHandlerFactory.create();
            }
            Activities.EmailEngagement.formOnload(form, isUci, telemetryItem);
            Email.setFormContextInContextualEmail(form);
            var controls = Activities.getAllLookupControls(form);
            var resolveUnknownEmailsFCB = Activities.Common.Util.isResolveUnknownEmailsFCBEnabled();
            if (Activities.ClientApi.IsMobileClient()) {
                resolveUnknownEmailsFCB = resolveUnknownEmailsFCB && Activities.Common.Util.EnableEmailEditInMoca();
            }
            if (resolveUnknownEmailsFCB) {
                telemetryItem.traceEventInformation("Resolve unknown emails handler being attached in record " + form.data.entity.getId());
                if (controls && controls.length > 0) {
                    controls.forEach(function (lookup) {
                        lookup.addOnLookupTagClick(Activities.openLookupDialogToResolveUnknownEmails);
                    });
                }
            }
            var readOnlyForm = form.ui.getFormType() === 4 /* Disabled */ ||
                form.ui.getFormType() === 3 /* ReadOnly */;
            if (!readOnlyForm) {
                Email.checkUnresolvedPartiesinEmail(form, controls);
            }
            // // Task: https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2984460/			
            if (Xrm.Internal.isFeatureEnabled(Constants.FCBConstant.FCB_RemoveUnresolvedInvalidAddressOnSendEmail) && !readOnlyForm) {
                // if unresolved parties are allowed to send email then only check for invalid address. If not then anyways on click of send user will be asked to remove unresolved address. 
                if (Activities.Common.Util.allowUnresolvedPartiesOnEmailSend()) {
                    var lookupControl = Activities.getAllLookupControls(form);
                    for (var control in lookupControl) {
                        lookupControl[control].clearNotification(Constants.NotificationIds.unresolvedEmailNotificationID);
                    }
                    var controlsWithInvalidAddress = Email.getControlsWithInvalidEmailAddress(controls);
                    if (controlsWithInvalidAddress && controlsWithInvalidAddress.length > 0) {
                        for (var control in controlsWithInvalidAddress) {
                            controlsWithInvalidAddress[control].setNotification(Activities.ClientApi.getResourceString("InvalidEmailAddressCannotSend") + " " + Email.getInvalidAddressIds(controlsWithInvalidAddress[control]), Constants.NotificationIds.invalidAddressNotificationId);
                            controlsWithInvalidAddress[control].getAttribute().addOnChange(Email.onChangeCheckInvalidAddressInEmail);
                        }
                    }
                }
            }
        };
        // This function is used to get all the controls with invalid email addresses. For example if "to" and "cc" control has invalid email address it will return an array containing "to" and "cc" control as values.
        Email.getControlsWithInvalidEmailAddress = function (controls) {
            if (controls && controls.length > 0) {
                var controlsWithInvalidAddress = [];
                for (var control = 0; control < controls.length; control++) {
                    var controlValues = controls[control].getAttribute().getValue();
                    if (controlValues && controlValues.length > 0) {
                        var value = 0;
                        while (value < controlValues.length) {
                            if (controlValues[value].entityType == Constants.EntityNames.UnResolvedAddress && !Email.isValidAddress(controlValues[value].name)) {
                                controlsWithInvalidAddress.push(controls[control]);
                                break;
                            }
                            else {
                                value++;
                            }
                        }
                    }
                }
                return controlsWithInvalidAddress;
            }
            else {
                return [];
            }
        };
        // This function will return comma seperated string with all the invalid email id's. 		
        Email.getInvalidAddressIds = function (control) {
            var unresolvedInvalidAddress = [];
            var controlValues = control.getAttribute().getValue();
            if (controlValues && controlValues.length > 0) {
                for (var j = 0; j < controlValues.length; j++) {
                    if (controlValues[j].entityType == Constants.EntityNames.UnResolvedAddress && !Email.isValidAddress(controlValues[j].name)) {
                        unresolvedInvalidAddress.push(controlValues[j].name);
                    }
                }
            }
            return unresolvedInvalidAddress.join(",");
        };
        // This function will be called whenever there is a change in control which has invalid address. 
        // Inside this it will again get all the controls and will check if there is any invalid address present.
        // For control which does not has invalid address it will remove the notification for the same. 
        Email.onChangeCheckInvalidAddressInEmail = function (context) {
            var form = context.getFormContext();
            var controls = Activities.getAllLookupControls(form);
            var controlWithUnresolvedEmail = Email.getControlsWithInvalidEmailAddress(controls);
            for (var control in controls) {
                if (controlWithUnresolvedEmail.indexOf(controls[control]) < 0) {
                    controls[control].clearNotification(Constants.NotificationIds.invalidAddressNotificationId);
                    controls[control].getAttribute().removeOnChange(Email.onchangeCheckUnresolvedEmail);
                }
            }
        };
        // This function is used to detect whether the string is valid or invalid. 		
        Email.isValidAddress = function (inputText) {
            if (inputText && inputText != "") {
                //we have taken reference from this accepted solution with 6300 upvotes: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript 
                // also it is following chromium dev test as well - https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&ss=chromium
                var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (inputText.match(mailformat)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };
        Email.setFormContextInContextualEmail = function (context) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Constants.EntityNames.Email, Constants.TelemetryConstant.EventSetFormContextInContextualEmail);
            try {
                var containerFrameElement = window.parent.frameElement;
                var containerPanelId = containerFrameElement && containerFrameElement.getAttribute("email-popup-id");
                if (containerPanelId) {
                    window.parent.parent.dispatchEvent(new CustomEvent("setFormContextInContextualEmail", {
                        detail: {
                            containerPanelId: containerPanelId,
                            formContext: context,
                        },
                    }));
                }
            }
            catch (e) {
                telemetryItem.traceEventInformation(e);
                telemetryItem.report();
            }
        };
        /**
         * Will lock the new email form by disabling all controls on the page if October2020Update fcb is not enabled
         * @param executionContext
         */
        Email.lockNewEmailFormOnload = function (executionContext, formId) {
            var formContext = executionContext && executionContext.getFormContext();
            var currentFormId = formContext && formContext.ui.formSelector.getCurrentItem().getId();
            var isOctober2020UpdateEnabled = Xrm.Internal.isFeatureEnabled(Constants.October2020UpdateFCBWithoutPrefix);
            if (!isOctober2020UpdateEnabled && currentFormId === formId) {
                var attachmentsGrid = formContext.ui.controls.get(Constants.ControlAttachmentsGrid);
                attachmentsGrid && attachmentsGrid.setVisible(false);
                Activities.Common.Util.disableAllControls(executionContext);
                Activities.Common.Util.showSpecificSectionOnly(executionContext, Constants.TabEmail, Constants.SectionRecipientInformation);
                executionContext
                    .getFormContext()
                    .ui.setFormNotification(Activities.ClientApi.getResourceString(Constants.PreOctoberFormNotification), Xrm.Constants.FormNotificationLevels.information, Constants.PreOctoberFormNotification);
            }
        };
        /// <summary>
        /// Checks if unresolved email are present on form and shows a notification if they arent allowed
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="controls" > List of controls < /param>
        /// <returns></returns>
        Email.checkUnresolvedPartiesinEmail = function (form, controls) {
            if (Activities.Common.Util.allowUnresolvedPartiesOnEmailSend()) {
                return;
            }
            var containsUnresolvedParties = false;
            if (controls && controls.length > 0) {
                for (var i = 0; i < controls.length; i++) {
                    var controlValues = controls[i].getAttribute().getValue();
                    if (controlValues && controlValues.length > 0) {
                        for (var j = 0; j < controlValues.length; j++) {
                            if (controlValues[j].entityType == Constants.EntityNames.UnResolvedAddress) {
                                containsUnresolvedParties = true;
                                break;
                            }
                        }
                    }
                    if (containsUnresolvedParties) {
                        break;
                    }
                }
                if (containsUnresolvedParties) {
                    var notificationId = "email_contains_unresolvedParties_when_allowUnresolvedPartiesOnEmailSend_is_false";
                    form.ui.setFormNotification(Activities.ClientApi.getResourceString("UnresolvedEmailsNotAllowed"), Xrm.Constants.FormNotificationLevels.warning, notificationId);
                }
            }
        };
        /// <summary>
        /// Checks if unresolved email are present on form and shows a notification if they arent allowed
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="controls" > List of controls < /param>
        /// <returns></returns>
        Email.getUnresolvedPartiesInEmail = function (controls) {
            if (Activities.Common.Util.allowUnresolvedPartiesOnEmailSend()) {
                return [];
            }
            var controlsWithError = [];
            if (controls && controls.length > 0) {
                for (var i = 0; i < controls.length; i++) {
                    var controlValues = controls[i].getAttribute().getValue();
                    if (controlValues && controlValues.length > 0) {
                        for (var j = 0; j < controlValues.length; j++) {
                            if (controlValues[j].entityType == Constants.EntityNames.UnResolvedAddress) {
                                controlsWithError.push(controls[i]);
                                break;
                            }
                        }
                    }
                }
            }
            return controlsWithError;
        };
        /**
         * Removes notification from a control if it has no unresolved email id
         * @param context Execution Context
         */
        Email.onchangeCheckUnresolvedEmail = function (context) {
            var form = context.getFormContext();
            var controls = Activities.getAllLookupControls(form);
            var controlWithUnresolvedEmail = Email.getUnresolvedPartiesInEmail(controls);
            for (var control in controls) {
                if (controlWithUnresolvedEmail.indexOf(controls[control]) < 0) {
                    controls[control].clearNotification(Constants.NotificationIds.unresolvedEmailNotificationID);
                    controls[control].getAttribute().removeOnChange(Email.onchangeCheckUnresolvedEmail);
                }
            }
        };
        /**
         * Get list of unresolved email for given control
         * @param control for a control we get all the unresolved email ids
         */
        Email.getUnresolvedEmailIds = function (control) {
            var unresolvedEmails = [];
            var controlValues = control.getAttribute().getValue();
            if (controlValues && controlValues.length > 0) {
                for (var j = 0; j < controlValues.length; j++) {
                    if (controlValues[j].entityType == Constants.EntityNames.UnResolvedAddress) {
                        unresolvedEmails.push(controlValues[j].name);
                    }
                }
            }
            return unresolvedEmails.join(",");
        };
        /// <summary>
        /// Sets the default value for a new email form
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <returns></returns>
        Email.prototype.setDefaultValues = function (form, telemetryItem) {
            _super.prototype.setDefaultValues.call(this, form, telemetryItem);
            //set default email body according to the request parameter
            if (form.ui.getFormType() != 3 /* ReadOnly */) {
                this.setDefaultBody(form, telemetryItem);
            }
            var attributes = form.data.entity.attributes;
            if (Activities.Common.Util.IsNewEntityForm(form)) {
                this.setDefaultFromParty(attributes, telemetryItem);
                this.setDefaultStatusCode(attributes, EmailStatus.Draft, telemetryItem);
                this.setDefaultStateCode(attributes, EmailState.Open, telemetryItem);
                this.setDefaultActualDurationMinutes(attributes, 30, telemetryItem);
            }
            this.postInlineInitialization(form, telemetryItem);
            this.filterInlineImages(form, telemetryItem);
        };
        Email.NotifyPanelSubjectChange = function (context) {
            try {
                if (context && window.parent) {
                    var formContext = context.getFormContext();
                    var subjectAttribute = formContext.data.entity.attributes.get("subject");
                    var containerFrameElement = window.parent.frameElement;
                    var containerPanelId = containerFrameElement && containerFrameElement.getAttribute("email-popup-id");
                    var activityEntityReference = formContext.data.entity.getEntityReference();
                    // on subject change
                    if (subjectAttribute && containerFrameElement) {
                        var subjectContent = subjectAttribute.getValue();
                        if (subjectContent && containerPanelId) {
                            window.parent.parent.dispatchEvent(new CustomEvent("subjectChangedInPanel", {
                                detail: {
                                    containerPanelId: containerPanelId,
                                    subjectContent: subjectContent,
                                },
                            }));
                        }
                    }
                    // on email active save
                    if (activityEntityReference && activityEntityReference.id && containerFrameElement) {
                        var activityId = activityEntityReference.id.replace(/[{}]/g, "").toLowerCase();
                        if (activityId && containerPanelId) {
                            window.parent.parent.dispatchEvent(new CustomEvent("emailActivityCommandActionsInPanel", {
                                detail: {
                                    containerPanelId: containerPanelId,
                                    activityId: activityId,
                                },
                            }));
                        }
                    }
                }
            }
            catch (ex) {
                Xrm.Reporting.reportFailure(Email.name + Email.NotifyPanelSubjectChange, ex);
            }
        };
        Email.prototype.filterInlineImages = function (form, telemetryItem) {
            try {
                if (Activities.Common.Util.isEmailEnhancementsFeatureEnabled(Constants.FCBConstant.EmailUx2020UpdateFCB)) {
                    var descriptionAttribute = form.data.entity.attributes.get(Constants.ControlDescription);
                    if (descriptionAttribute) {
                        var body = descriptionAttribute.getValue();
                        var attachmentIds = Activities.Common.Util.getAttachmentIdsFromEmailBody(body);
                        if (attachmentIds && attachmentIds.length > 0) {
                            var attachmentGrid = form.getControl("attachmentsGrid");
                            if (attachmentGrid) {
                                var filter_1 = '<filter type="and" > <condition attribute="activitymimeattachmentid" operator="not-in" >';
                                attachmentIds.forEach(function (attachmentId) {
                                    filter_1 += "<value>" + attachmentId + "</value>";
                                });
                                filter_1 += "</condition></filter>";
                                //Currently not public api will be public soon.
                                attachmentGrid.setFilterXml(filter_1);
                                attachmentGrid.refresh();
                            }
                        }
                    }
                }
            }
            catch (ex) {
                telemetryItem.traceEventError("Error setting inline image filter on attachment grid.", ex.message);
            }
        };
        Email.prototype.setDefaultFromParty = function (attributes, telemetryItem) {
            var fromAttribute = (attributes.get("from"));
            try {
                // If from party is already set, then do not overwrite it to default value of current user
                if (!Activities.Common.Util.IsNull(fromAttribute) &&
                    (Activities.Common.Util.IsNull(fromAttribute.getValue()) || fromAttribute.getValue().length == 0)) {
                    fromAttribute.setValue(this.getCurrentUser());
                }
            }
            catch (Exception) {
                telemetryItem.traceEventError("Error setting party value.", Exception.message);
            }
        };
        Email.prototype.setDefaultStatusCode = function (attributes, attributeValue, telemetryItem) {
            var attribute = (attributes.get(Constants.ControlStatusCode));
            try {
                if (!Activities.Common.Util.IsNull(attribute) &&
                    (Activities.Common.Util.IsNull(attribute.getValue()) || attribute.getValue() == -1)) {
                    attribute.setValue(attributeValue);
                }
            }
            catch (Exception) {
                telemetryItem.traceEventError("Error setting status code value.", Exception.message);
            }
        };
        Email.prototype.setDefaultStateCode = function (attributes, attributeValue, telemetryItem) {
            var attribute = (attributes.get(Constants.ControlStateCode));
            try {
                if (!Activities.Common.Util.IsNull(attribute) && Activities.Common.Util.IsNull(attribute.getValue())) {
                    attribute.setValue(attributeValue);
                }
            }
            catch (Exception) {
                telemetryItem.traceEventError("Error setting state code value.", Exception.message);
            }
        };
        Email.prototype.setDefaultActualDurationMinutes = function (attributes, attributeValue, telemetryItem) {
            var attribute = (attributes.get(Constants.ControlActualDurationMinutes));
            try {
                if (!Activities.Common.Util.IsNull(attribute) && Activities.Common.Util.IsNull(attribute.getValue())) {
                    attribute.setValue(attributeValue);
                }
            }
            catch (Exception) {
                telemetryItem.traceEventError("Error setting duration value.", Exception.message);
            }
        };
        /// <summary>
        /// Posts the inline initialization.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <returns></returns>
        Email.prototype.postInlineInitialization = function (form, telemetryItem) {
            this.setEmailType(form);
            this.setEmailFieldStates(form);
            var enableInsertSignature = Activities.Common.Util.enableInsertSignatureInUCI();
            if (Xrm.Internal.isUci()) {
                this.updateDefaultSignature(form, false, telemetryItem, enableInsertSignature).then(function () {
                    Activities.ApplyEmailTemplate.SetDefaultTemplateOnLoad(form, telemetryItem);
                });
            }
            if (enableInsertSignature) {
                this.registerAttributeOnChangeEvent(form);
            }
        };
        /// <summary>
        /// Sets the from or to party
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="attributeName">The Name of the attribute to set value for</param>
        /// <param name="currentUser">The user to set as the value of the above attribute</param>
        /// <returns></returns>
        Email.prototype.setParty = function (form, attributeName, currentUser, telemetryItem) {
            try {
                var attribute = (form.data.entity.attributes.get(attributeName));
                if (!Activities.Common.Util.IsNull(attribute)) {
                    attribute.setValue(currentUser);
                }
            }
            catch (Exception) {
                telemetryItem.traceEventError("Error setting party value.", Exception.message);
            }
        };
        /// <summary>
        /// Sets the type of the email.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <returns></returns>
        Email.prototype.setEmailType = function (form) {
            if (!Activities.Common.Util.IsNewEntityForm(form)) {
                var statusAttribute = form.data.entity.attributes.get(Constants.ControlStatusCode);
                if (!Activities.Common.Util.IsNull(statusAttribute)) {
                    var status_1 = statusAttribute.getValue();
                    switch (status_1) {
                        case EmailStatus.Draft:
                            this.emailType = EmailType.Draft;
                            break;
                        case EmailStatus.Sent:
                            this.emailType = EmailType.Sent;
                            break;
                        case EmailStatus.Received:
                            this.emailType = EmailType.Received;
                            break;
                        case EmailStatus.Canceled:
                            this.emailType = EmailType.Canceled;
                            break;
                        case EmailStatus.Completed:
                            this.emailType = EmailType.Completed;
                            break;
                        case EmailStatus.PendingSend:
                            this.emailType = EmailType.PendingSend;
                            break;
                        case EmailStatus.Sending:
                            this.emailType = EmailType.Sending;
                            break;
                        case EmailStatus.Failed:
                            this.emailType = EmailType.Failed;
                            break;
                    }
                }
            }
        };
        /// <summary>
        /// Sets the email field states.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <returns></returns>
        Email.prototype.setEmailFieldStates = function (form) {
            // If the form is read-only then we shouldn't do anything about the regarding control
            var formState = Activities.Common.Util.IsNewEntityForm(form) ? FormState.NewForm : FormState.Existing;
            if (formState != FormState.NewForm && formState != FormState.Existing) {
                return;
            }
            // If the e-mail state is not open ( the email status is NOT draft or failed )..
            var entityStatusAttribute = form.data.entity.attributes.get(Constants.ControlStateCode);
            if (Activities.Common.Util.IsNull(entityStatusAttribute)) {
                return;
            }
            var entityState = entityStatusAttribute.getValue();
            if (entityState != EmailState.Open) {
                var regardingObjectIdAttribute = form.data.entity.attributes.get(Constants.ControlRegardingObjectId);
                // If the e-mail is received, pendingsend, sending or sent
                // then do not disable the control, otherwise do disable it
                if ((this.emailType == EmailType.Sent ||
                    this.emailType == EmailType.Received ||
                    this.emailType == EmailType.PendingSend ||
                    this.emailType == EmailType.Sending) &&
                    regardingObjectIdAttribute.getUserPrivilege().canUpdate) {
                    this.enableRegardingObjectControl(form);
                }
            }
        };
        /// <summary>
        /// Updates the email body with default signature for create forms.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="telemetryItem">Telemetry item.</param>
        /// <param name="enableInsertSignature">boolean SignatureFcbs</param>
        /// <returns></returns>
        Email.prototype.updateDefaultSignature = function (form, overwrite, telemetryItem, enableInsertSignature) {
            if (enableInsertSignature === void 0) { enableInsertSignature = true; }
            var selfReport = !telemetryItem;
            telemetryItem = selfReport ? new TelemetryLogger.TelemetryItem("Email", "updateDefaultSignature") : telemetryItem;
            return new Promise(function (resolve, reject) {
                if (form.ui.getFormType() == 1 /* Create */ ||
                    form.ui.getFormType() == 2 /* Update */) {
                    var description_1 = form.getAttribute(Constants.ControlDescription);
                    var emailDefaultBody_1 = "";
                    if (!Activities.Common.Util.IsNullOrUndefined(description_1)) {
                        var isDescriptionNotSet_1 = Activities.Common.Util.IsNullOrEmptyString(description_1.getValue());
                        if (enableInsertSignature == false && isDescriptionNotSet_1) {
                            description_1.setValue(emailDefaultBody_1);
                            resolve();
                        }
                        else {
                            Activities.Email.RetrieveDefaultSignature(form, telemetryItem).then(function (defaultSignature) {
                                // Decode Signature and then pass it to InsertSignature method.
                                if (!Activities.Common.Util.IsNullOrEmptyString(defaultSignature)) {
                                    Activities.ActivityPageHandler.insertSignature(form, Xrm.Encoding.htmlDecode(defaultSignature), description_1, overwrite);
                                    telemetryItem.traceEventInformation("The insertSignature method from ActivityPageHandler has been successfully executed.");
                                    telemetryItem.report();
                                }
                                else if (Activities.Common.Util.IsNullOrEmptyString(description_1.getValue())) {
                                    description_1.setValue(emailDefaultBody_1);
                                }
                                resolve();
                            }, function (error) {
                                if (isDescriptionNotSet_1) {
                                    description_1.setValue(emailDefaultBody_1);
                                }
                                telemetryItem.traceEventError("Error while reading json response from RetrieveEmailSignatureRequest.", error.innerror ? error.innerror.message : error.message);
                                telemetryItem.report();
                                resolve();
                            });
                        }
                    }
                }
                else {
                    resolve();
                }
            });
        };
        /// <summary>
        /// Checks when value in From filed of Email is changed
        /// Based on the user ,it will update the default signature
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="telemetryItem">Telemetry item.</param>
        /// <returns></returns>
        Email.prototype.registerAttributeOnChangeEvent = function (form) {
            var _this = this;
            var fromAttribute = form.getAttribute(Constants.ControlFrom);
            if (!Activities.Common.Util.IsNullOrUndefined(fromAttribute)) {
                fromAttribute.addOnChange(function (context) {
                    _this.updateDefaultSignature(form, true);
                });
            }
        };
        /// <summary>
        /// Updates the email body with default signature for create forms.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="telemetryItem">Telemetry item.</param>
        /// <returns>Promise<string> which contains the signature returned from server.</returns>
        Email.RetrieveDefaultSignature = function (form, telemetryItem, fromEntityId, fromEntityType) {
            if (fromEntityId === void 0) { fromEntityId = ""; }
            if (fromEntityType === void 0) { fromEntityType = "systemuser"; }
            if (fromEntityId == "") {
                fromEntityId = Activities.Common.Util.convertGuidToString(Xrm.Utility.getGlobalContext().userSettings.userId);
            }
            return new Promise(function (resolve, reject) {
                try {
                    var fromValue = null;
                    if (form == null) {
                        fromValue = [
                            {
                                id: fromEntityId,
                                entityType: fromEntityType,
                            },
                        ];
                    }
                    else {
                        var from = form.getAttribute(Constants.ControlFrom);
                        fromValue = Activities.Common.Util.IsNullOrUndefined(from) ? null : from.getValue();
                        if (Activities.Common.Util.IsNull(fromValue) || fromValue.length <= 0) {
                            telemetryItem.traceEventInformation("fromValue is empty, hence no signature is returned.");
                            telemetryItem.report();
                            return resolve("");
                        }
                    }
                    var emptyGuid = "00000000-0000-0000-0000-000000000000";
                    // Pass signature id as empty guid if retrieving the default signature.
                    var req = new Activities.RetrieveEmailSignatureRequest(emptyGuid, fromValue[0].id, fromValue[0].entityType);
                    Xrm.WebApi.online.execute(req).then(function (response) {
                        return response.json().then(function (jsonResponse) {
                            if (!Activities.Common.Util.IsNullOrEmptyString(jsonResponse)) {
                                telemetryItem.traceEventInformation("Successfully retrieved default signature using RetrieveEmailSignature SDK.");
                                telemetryItem.report();
                                return resolve(jsonResponse.SignatureText);
                            }
                            else {
                                telemetryItem.traceEventInformation("RetrieveEmailSignature json response is empty.");
                                telemetryItem.report();
                                return reject("RetrieveEmailSignature json response is empty");
                            }
                        }, function (error) {
                            telemetryItem.traceEventError("Error while reading json response from RetrieveEmailSignatureRequest.", error.innerror.message);
                            telemetryItem.report();
                            return reject("Error while reading json response from RetrieveEmailSignatureRequest.");
                        });
                    }, function (error) {
                        // If the user do not have priviledge it is a valid scenario and thus the error needs to be logged as info telemetry and not as error telemetry
                        if (error.errorCode == EmailErrorCodes.privilegeErrorCode) {
                            telemetryItem.traceEventInformation("User do not have Privilege to Retrieve EmailSignature.");
                        }
                        else {
                            telemetryItem.traceEventError("Error in RetrieveEmailSignatureRequest.", error.innerror.message);
                        }
                        telemetryItem.report();
                        return reject("Couldn't retrieve email signature.");
                    });
                }
                catch (ex) {
                    telemetryItem.traceEventError("Exception in RetrieveDefaultSignature", ex.message);
                    telemetryItem.report();
                    return reject("Exception in RetrieveDefaultSignature");
                }
            });
        };
        /// <summary>
        /// Enables the regarding object controls.
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <returns></returns>
        Email.prototype.enableRegardingObjectControl = function (form) {
            var regarding = form.ui.controls.get(Constants.ControlRegardingObjectId);
            if (!Activities.Common.Util.IsNull(regarding)) {
                regarding.setDisabled(false);
            }
        };
        /// <summary>
        /// set default email body
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <returns></returns>
        Email.prototype.setDefaultBody = function (form, telemetryItem) {
            var descriptionAttribute = form.data.entity.attributes.get(Constants.ControlDescription);
            if (Activities.Common.Util.IsNotNull(descriptionAttribute) && Activities.Common.Util.IsNotNull(form.data.attributes)) {
                // Equivalent of Xrm.Page.Context.GetQueryStringParameters() is formContext.data.attributes
                var descriptionQueryParameter = form.data.attributes.get(Constants.ControlDescription);
                if (!Activities.Common.Util.IsNull(descriptionQueryParameter)) {
                    // Description is passed as query parameter
                    descriptionAttribute.setValue(descriptionQueryParameter.toString());
                }
                else {
                    var articleIdQueryParameter = form.data.attributes.get(Constants.ArticleId);
                    if (!Activities.Common.Util.IsNull(articleIdQueryParameter)) {
                        // ArticleId is passed as query parameter
                        var articleId = articleIdQueryParameter.toString();
                        Xrm.WebApi.retrieveRecord(Constants.KnowledgeArticle, articleId, "$select=content").then(function (articleContent) {
                            descriptionAttribute.setValue(articleContent[Constants.Content]);
                        }, function (error) {
                            telemetryItem.traceEventError("Error setting email body.", error.innerror);
                            Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                        });
                    }
                }
            }
        };
        return Email;
    }(Activities.ActivityPageHandler));
    Activities.Email = Email;
    /// <summary>
    /// Constants used in Email
    /// </summary>
    var Constants;
    (function (Constants) {
        Constants.ArticleId = "articleid";
        Constants.KnowledgeArticle = "knowledgearticle";
        Constants.Content = "content";
        Constants.ControlFrom = "from";
        Constants.ControlTo = "to";
        Constants.ControlCc = "cc";
        Constants.ControlBcc = "bcc";
        Constants.RegardingObject = "regardingobjectid";
        Constants.ControlMultiSelectAttachTrigger = "multi_select_attach_trigger_control";
        Constants.ControlStatusCode = "statuscode";
        Constants.ControlDescription = "description";
        Constants.ControlActualDurationMinutes = "actualdurationminutes";
        Constants.ControlRegardingObjectId = "regardingobjectid";
        Constants.ControlStateCode = "statecode";
        Constants.ControlEmailEngagementActions = "emailengagementactionscontrol";
        Constants.ControlEmailRecipientActivity = "emailrecipientactivitycontrol";
        Constants.ControlAttachmentsGrid = "attachmentsGrid";
        Constants.FooterEmailFollowed = "footer_emailfollowed";
        Constants.FooterEmailRemainderSet = "footer_emailremainderset";
        Constants.SystemUser = "systemuser";
        Constants.EmailSignature = "emailsignature";
        Constants.October2020EmailFormId = "63769d04-c74f-4808-b0aa-77339e1b9191";
        Constants.October2020UpdateFCBWithoutPrefix = "October2020Update";
        Constants.SectionRecipientInformation = "recipient information";
        Constants.TabEmail = "Email";
        Constants.PreOctoberFormNotification = "PreOctoberNotification";
        Constants.ForwardEmailActionName = "forwardEmail";
        Constants.ReplyEmailActionName = "replyEmail";
        Constants.ReplyAllEmailActionName = "replyAllEmail";
        Constants.SomeAttachmentsNotValidNotification = "WarningSomeAttachmentsNotSupported";
        Constants.TruncatedBodyNoticiation = "TruncatedBodyNotification";
    })(Constants = Activities.Constants || (Activities.Constants = {}));
    /// <summary>
    /// Constants for Email Related Error Codes
    /// </summary>
    var EmailErrorCodes;
    (function (EmailErrorCodes) {
        EmailErrorCodes.privilegeErrorCode = 2147746336;
        EmailErrorCodes.invalidFormErrorCode = 2200000007;
    })(EmailErrorCodes = Activities.EmailErrorCodes || (Activities.EmailErrorCodes = {}));
    /// <summary>
    /// Email Status
    /// </summary>
    var EmailStatus = (function () {
        function EmailStatus() {
        }
        return EmailStatus;
    }());
    EmailStatus.Canceled = 5;
    EmailStatus.Completed = 2;
    EmailStatus.Draft = 1;
    EmailStatus.Failed = 8;
    EmailStatus.PendingSend = 6;
    EmailStatus.Received = 4;
    EmailStatus.Sending = 7;
    EmailStatus.Sent = 3;
    Activities.EmailStatus = EmailStatus;
    /// <summary>
    /// Email type
    /// </summary>
    var EmailType;
    (function (EmailType) {
        EmailType[EmailType["None"] = 0] = "None";
        EmailType[EmailType["Draft"] = 1] = "Draft";
        EmailType[EmailType["Received"] = 4] = "Received";
        EmailType[EmailType["Sent"] = 3] = "Sent";
        EmailType[EmailType["Canceled"] = 5] = "Canceled";
        EmailType[EmailType["Completed"] = 2] = "Completed";
        EmailType[EmailType["PendingSend"] = 6] = "PendingSend";
        EmailType[EmailType["Sending"] = 7] = "Sending";
        EmailType[EmailType["Failed"] = 8] = "Failed";
    })(EmailType || (EmailType = {}));
    /// <summary>
    /// The states that a form can exist in
    /// </summary>
    var FormState;
    (function (FormState) {
        FormState[FormState["NotImplemented"] = 0] = "NotImplemented";
        FormState[FormState["NewForm"] = 1] = "NewForm";
        FormState[FormState["Existing"] = 2] = "Existing";
    })(FormState || (FormState = {}));
    /// <summary>
    /// Email State
    /// </summary>
    var EmailState;
    (function (EmailState) {
        EmailState[EmailState["Open"] = 0] = "Open";
        EmailState[EmailState["Completed"] = 1] = "Completed";
        EmailState[EmailState["Canceled"] = 2] = "Canceled";
    })(EmailState = Activities.EmailState || (Activities.EmailState = {}));
    /// <summary>
    /// Email Response Type
    /// </summary>
    var EmailResponseType;
    (function (EmailResponseType) {
        EmailResponseType[EmailResponseType["Reply"] = 0] = "Reply";
        EmailResponseType[EmailResponseType["ReplyAll"] = 1] = "ReplyAll";
        EmailResponseType[EmailResponseType["Forward"] = 2] = "Forward";
    })(EmailResponseType = Activities.EmailResponseType || (Activities.EmailResponseType = {}));
    var EmailParticipationTypeMask;
    (function (EmailParticipationTypeMask) {
        EmailParticipationTypeMask[EmailParticipationTypeMask["Sender"] = 1] = "Sender";
        EmailParticipationTypeMask[EmailParticipationTypeMask["ToRecepient"] = 2] = "ToRecepient";
        EmailParticipationTypeMask[EmailParticipationTypeMask["CcRecipient"] = 3] = "CcRecipient";
        EmailParticipationTypeMask[EmailParticipationTypeMask["BccRecipient"] = 4] = "BccRecipient";
        EmailParticipationTypeMask[EmailParticipationTypeMask["Regarding"] = 8] = "Regarding";
        EmailParticipationTypeMask[EmailParticipationTypeMask["Owner"] = 9] = "Owner";
        EmailParticipationTypeMask[EmailParticipationTypeMask["Related"] = 13] = "Related";
    })(EmailParticipationTypeMask = Activities.EmailParticipationTypeMask || (Activities.EmailParticipationTypeMask = {}));
    /// <summary>
    /// Email Response Type
    /// </summary>
    var EmailAction;
    (function (EmailAction) {
        EmailAction[EmailAction["Reply"] = 0] = "Reply";
        EmailAction[EmailAction["ReplyAll"] = 1] = "ReplyAll";
        EmailAction[EmailAction["Forward"] = 2] = "Forward";
    })(EmailAction = Activities.EmailAction || (Activities.EmailAction = {}));
    /// <summary>
    /// Notification optionsets for email:
    /// https://dev.azure.com/dynamicscrm/OneCRM/_git/CDS?path=%2Fsrc%2FCommon%2FData%2FDatabase%2FMetadata%2FEmail%2FOptionSets.xml&_a=contents&version=GBv9.0_master
    /// </summary>
    var NotificationTypes;
    (function (NotificationTypes) {
        NotificationTypes[NotificationTypes["None"] = 0] = "None";
        NotificationTypes[NotificationTypes["InvalidAttachments"] = 1] = "InvalidAttachments";
        NotificationTypes[NotificationTypes["TruncatedBody"] = 2] = "TruncatedBody";
    })(NotificationTypes || (NotificationTypes = {}));
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    //polyfilling the CustomEvent() constructor functionality
    Activities.polyfillingCustomEvent();
    var EmailCommandsFIS = (function () {
        function EmailCommandsFIS() {
        }
        /// <summary>
        /// Send
        /// </summary>
        EmailCommandsFIS.send = function (form) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventSend);
            var errorKey = EmailCommandsFIS.validateEmailForSend(form);
            var controls = Activities.getAllLookupControls(form);
            var controlWithUnresolvedEmail = Activities.Email.getUnresolvedPartiesInEmail(controls);
            for (var control in controls) {
                controls[control].clearNotification(Activities.Constants.NotificationIds.unresolvedEmailNotificationID);
            }
            if (!Activities.Common.Util.IsNullOrEmptyString(errorKey)) {
                // Validation error, throwing a dialog
                var alertDialogStrings = {
                    text: Activities.ClientApi.getResourceString(errorKey),
                };
                if (errorKey === "Web.Activities.Email.edit.aspx_70") {
                    alertDialogStrings.title = Activities.ClientApi.getResourceString("Email_No_Recipient_Found_Error_Title");
                }
                if (errorKey === "Web.Activities.Email.edit.aspx_75") {
                    alertDialogStrings.title = Activities.ClientApi.getResourceString("Email_No_Sender_Found_Error_Title");
                }
                Xrm.Navigation.openAlertDialog(alertDialogStrings, null);
            }
            else if (controlWithUnresolvedEmail && controlWithUnresolvedEmail.length > 0) {
                for (var control in controlWithUnresolvedEmail) {
                    controlWithUnresolvedEmail[control].setNotification(Activities.ClientApi.getResourceString("UnresolvedEmailsCanNotSendEmail") +
                        " " +
                        Activities.Email.getUnresolvedEmailIds(controlWithUnresolvedEmail[control]), Activities.Constants.NotificationIds.unresolvedEmailNotificationID);
                    controlWithUnresolvedEmail[control].getAttribute().addOnChange(Activities.Email.onchangeCheckUnresolvedEmail);
                }
                telemetryItem.traceEventInformation("Email With unresolved email ID found while send: unresolved email id is not allowed");
                telemetryItem.report();
                return;
            }
            else {
                // Check if mailbox delivery is enabled for user and send email
                if (Xrm.Internal.isUci() && !Activities.ClientApi.IsOffline() && Activities.Common.Util.isMailboxDialogFCBEnabled()) {
                    EmailCommandsFIS.IsMailBoxEnabledForDelivery(form, telemetryItem)
                        .then(function () {
                            EmailCommandsFIS.sendEmail(form, telemetryItem);
                        })
                        .catch(function (response) {
                            telemetryItem.traceEventInformation(response);
                            telemetryItem.report();
                        });
                }
                else {
                    EmailCommandsFIS.sendEmail(form, telemetryItem);
                }
            }
        };
        /// <summary>
        /// Save and Execute Send Email
        /// </summary>
        EmailCommandsFIS.sendEmail = function (form, telemetryItem) {
            EmailCommandsFIS.toggleProgressIndicator();
            var saveOption = {
                saveMode: 7 /* Send */,
            };
            Activities.ClientApi.getFormDataForRibbon(form)
                .save(saveOption)
                .then(function () {
                    var emailEntityId = Activities.ClientApi.getFormDataForRibbon(form).entity.getId();
                    var emailEntityReference = {
                        activityid: emailEntityId,
                    };
                    // Adding save again in case customer's customizations has set the form dirty
                    Activities.ClientApi.getFormDataForRibbon(form)
                        .save()
                        .then(function () {
                            var sendEmailRequest = new Activities.SendEmailRequest(emailEntityReference, true, "");
                            Xrm.WebApi.online.execute(sendEmailRequest).then(function (sendEmailResponse) {
                                //after successful send and before close if ckeditor in edit mode tries to change the description, we shouldn't allow that and hence setting submit mode of decsription control to never
                                if (!Activities.Common.Util.IsNullOrUndefined(form) &&
                                    !Activities.Common.Util.IsNullOrUndefined(form.getAttribute(Activities.Constants.ControlDescription))) {
                                    form
                                        .getAttribute(Activities.Constants.ControlDescription)
                                        .setSubmitMode(Activities.Constants.AttributeSubmitModes[Activities.Constants.AttributeSubmitModes.never]);
                                }
                                Activities.ClientApi.getFormUIForRibbon(form).close();
                                EmailCommandsFIS.refreshParentFromEmailPopup();
                                telemetryItem.report();
                                EmailCommandsFIS.toggleProgressIndicator(false);
                            }, function (error) {
                                Activities.ClientApi.dialogActionRawFailedCallback(error, telemetryItem);
                                EmailCommandsFIS.toggleProgressIndicator(false);
                            });
                        }, function (error) {
                            if (!Activities.Common.Util.IsNullOrUndefined(error) &&
                                error.errorCode == Activities.EmailErrorCodes.invalidFormErrorCode) {
                                var purgedError = Activities.ClientApi.removeRawFromErrorResponse(error);
                                telemetryItem.traceEventError("Error in send email form after save", purgedError);
                                telemetryItem.report();
                            }
                            else if (!Activities.Common.Util.IsNullOrUndefined(error)) {
                                Activities.ClientApi.dialogActionRawFailedCallback(error, telemetryItem);
                            }
                            EmailCommandsFIS.toggleProgressIndicator(false);
                        });
                }, function (error) {
                    // If there is a mandatory field that is not populated and the user performs a send action there will not be an error dialog.
                    if (!Activities.Common.Util.IsNullOrUndefined(error) && error.errorCode == Activities.EmailErrorCodes.invalidFormErrorCode) {
                        var purgedError = Activities.ClientApi.removeRawFromErrorResponse(error);
                        telemetryItem.traceEventError("Error in send email form.", purgedError);
                        telemetryItem.report();
                    }
                    else if (!Activities.Common.Util.IsNullOrUndefined(error)) {
                        Activities.ClientApi.dialogActionRawFailedCallback(error, telemetryItem);
                    }
                    EmailCommandsFIS.toggleProgressIndicator(false);
                });
        };
        /// <summary>
        /// Validate Email For Send
        /// </summary>
        EmailCommandsFIS.validateEmailForSend = function (form) {
            var from = (Activities.ClientApi.getFormDataForRibbon(form).entity.attributes.get(Activities.Constants.ControlFrom));
            if (from != null) {
                if (from.getValue() == null || from.getValue().length == 0) {
                    return "Web.Activities.Email.edit.aspx_75";
                }
            }
            // Get the number of recipients - "to" field is required for form, others may have been
            // removed, so verify they are there before getting counts from them
            var recipients = (Activities.ClientApi.getFormDataForRibbon(form).entity.attributes.get(Activities.Constants.ControlTo));
            var numberOfRecipients = 0;
            if (recipients != null) {
                numberOfRecipients = recipients.getValue() == null ? 0 : recipients.getValue().length;
            }
            var cc = (Activities.ClientApi.getFormDataForRibbon(form).entity.attributes.get(Activities.Constants.ControlCc));
            if (cc != null) {
                if (cc.getValue() != null) {
                    numberOfRecipients += cc.getValue().length;
                }
            }
            var bcc = (Activities.ClientApi.getFormDataForRibbon(form).entity.attributes.get(Activities.Constants.ControlBcc));
            if (bcc != null) {
                if (bcc.getValue() != null) {
                    numberOfRecipients += bcc.getValue().length;
                }
            }
            if (numberOfRecipients <= 0) {
                return "Web.Activities.Email.edit.aspx_70";
            }
            return null;
        };
        /// <summary>
        /// Check if the sender has mailbox setup and open confirmation dialog if not enabled
        ///</summary>
        EmailCommandsFIS.IsMailBoxEnabledForDelivery = function (form, telemetryItem) {
            EmailCommandsFIS.toggleProgressIndicator();
            var from = (Activities.ClientApi.getFormDataForRibbon(form).entity.attributes.get(Activities.Constants.ControlFrom));
            //from is not null already checked in Validate function. no need to check again.
            var fromRecord = from.getValue()[0];
            var fromTypeCode = Xrm.Internal.getEntityCode(fromRecord.entityType);
            var deliveryMethod = Activities.Constants.MailBoxConstants.OutgoingEmailDeliveryMethod;
            var outgoingEmailEnabled = Activities.Constants.MailBoxConstants.EnabledForOutgoingEmail;
            var outgoingEmailStatus = Activities.Constants.MailBoxConstants.OutgoingEmailStatus;
            var mailBoxFetchXml = "?fetchXml=<fetch version='1.0' mapping='logical'>" +
                "<entity name='mailbox'>" +
                "<attribute name='outgoingemaildeliverymethod' />" +
                "<attribute name='enabledforoutgoingemail' />" +
                "<attribute name='outgoingemailstatus' />" +
                "<filter type='and'>" +
                "<condition attribute='regardingobjectid' operator='eq' value='" +
                fromRecord.id +
                "' />" +
                "<condition attribute='regardingobjecttypecode' operator='eq' value='" +
                fromTypeCode +
                "' />" +
                "</filter>" +
                "</entity>" +
                "</fetch>";
            return Xrm.WebApi.online.retrieveMultipleRecords("mailbox", mailBoxFetchXml).then(function (response) {
                var mailboxes = response && response.entities ? response.entities : null;
                if (mailboxes != null && mailboxes.length > 0) {
                    var mailbox = mailboxes[0];
                    // If email configuration is set to SSS, check if mailbox is enabled and status is success.
                    // if not enabled, then pop up Confirmation dialog.
                    // On clicking Continue of dialog, send email. On Cancel, close dialog and go do nothing
                    if (mailbox[deliveryMethod] == Activities.Constants.MailBoxConstants.EmailDeliveryMethod.EmailRouter &&
                        Activities.Common.Util.orgEmailConnectionChannel() ==
                        Activities.Constants.MailBoxConstants.EmailConnectionChannel.SSS &&
                        (mailbox[outgoingEmailEnabled] == false ||
                            mailbox[outgoingEmailStatus] != Activities.Constants.MailBoxConstants.MailboxAccessStatus.Success)) {
                        return EmailCommandsFIS.openMailboxNotEnabledDialog(telemetryItem, fromRecord.name);
                    }
                    else {
                        EmailCommandsFIS.toggleProgressIndicator(false);
                        //send the email if mailbox is up and running
                        return Promise.resolve();
                    }
                }
                else {
                    EmailCommandsFIS.toggleProgressIndicator(false);
                    telemetryItem.traceEventError("Mailbox record not found for user");
                    return Promise.resolve();
                }
            }, function (error) {
                EmailCommandsFIS.toggleProgressIndicator(false);
                //if error in fetching mailbox, continue sending the email. and log telemetry. dont block
                telemetryItem.traceEventError("Error fetching mailbox records for objectid: " + fromRecord.id);
                return Promise.resolve();
            });
        };
        /// <summary>
        /// opens custom LearnMore dialog for user to Continue to send mail or Cancel
        /// </summary>
        EmailCommandsFIS.openMailboxNotEnabledDialog = function (telemetryItem, userName) {
            telemetryItem.traceEventInformation("opening mailbox not enabled dialog");
            var primaryText = Activities.ClientApi.getResourceString("Mailbox_Not_Enabled_Dialog_Text").replace("{0}", userName);
            var isSysAdmin = Activities.ActivityPageHandler.isSystemAdmin();
            EmailCommandsFIS.toggleProgressIndicator(false);
            if (!isSysAdmin) {
                primaryText += "\n" + Activities.ClientApi.getResourceString("Mailbox_Not_Enabled_Dialog_Instruction_NonAdmin");
            }
            var dialogOptions = { height: 220, width: 400, position: 1 /* center */ };
            var dialogParameters = {};
            dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamTitleText] = Activities.ClientApi.getResourceString("Mailbox_Not_Enabled_Dialog_Title");
            dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamPrimaryText] = primaryText;
            return Xrm.Navigation.openDialog(Activities.Constants.DialogNames.LearnMoreDialog, dialogOptions, dialogParameters).then(function (response) {
                if (response != null) {
                    var lastButton = response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                    if (!Activities.Common.Util.IsNullOrEmptyString(lastButton)) {
                        if (lastButton == Activities.Constants.MetadataDrivenDialogConstants.ControlContinueButton) {
                            telemetryItem.traceEventInformation("Continue without mailbox. IsSystemAdmin: " + isSysAdmin);
                            return Promise.resolve();
                        }
                        else {
                            return Promise.reject("Learn More clicked. IsSystemAdmin: " + isSysAdmin);
                        }
                    }
                    else {
                        //if no button was clicked, then it means dialog was just closed using close icon on top. do nothing
                        return Promise.reject("Dialog was closed without action. IsSystemAdmin: " + isSysAdmin);
                    }
                }
                else {
                    return Promise.reject("No response from dialog. IsSystemAdmin: " + isSysAdmin);
                }
            }, function (errorResponse) {
                //Continue to send email. Dont block if opening dialog encountered error. Just log
                telemetryItem.traceEventError("Error opening MailboxNotEnabled dialog");
                return Promise.resolve();
            });
        };
        /// <summary>
        /// Save email (even with unsaved changes)
        /// </summary>
        /// <param name="form">Form context object</param>
        /// <param name="executable">Executable after save</param>
        /// <param name="failureExecutable">Executable after error</param>
        EmailCommandsFIS.SaveEmailAndExecute = function (form, telemetryItem, executable, failureExecutable, saveOptions // XrmClientApi.SaveOptions,
        ) {
            // Passing suppressErrorDialog as any to suppress save error dialog in FormSave
            // TODO: 2849095 save function in XrmFormData UCI to utilize suppressErrorDialog for all cases
            var saveOptionsWrapper = __assign({ suppressErrorDialog: true }, (saveOptions && { saveOptions: saveOptions }));
            form.data.save(saveOptionsWrapper).then(function () {
                executable();
            }, function (error) {
                telemetryItem.traceEventError("Error occured while force saving email.", error.innerror ? error.innerror.message : error.message);
                failureExecutable(error, telemetryItem);
            });
        };
        /// <summary>
        /// Reply to the mail
        /// </summary>
        /// <param name="form">Form context object</param>
        EmailCommandsFIS.reply = function (form) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventReply);
            var subjectPrefix = Activities.ClientApi.getResourceString("Email_Prefix_Reply");
            var currentEmailId = EmailCommandsFIS.getCurrentEmailIdFromForm(form);
            EmailCommandsFIS.toggleProgressIndicator();
            EmailCommandsFIS.SaveEmailAndExecute(form, telemetryItem, function () {
                EmailCommandsFIS.createMail(currentEmailId, Activities.EmailAction.Reply, subjectPrefix, telemetryItem, "replyEmail", null, EmailCommandsFIS.handleNavigationFromFormCallback);
            }, function (error, telemetryItem) {
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                EmailCommandsFIS.toggleProgressIndicator(false);
            });
        };
        /// <summary>
        /// Reply to all
        /// </summary>
        /// <param name="form">Form context object</param>
        EmailCommandsFIS.replyall = function (form) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventReplyAll);
            var subjectPrefix = Activities.ClientApi.getResourceString("Email_Prefix_Reply");
            var currentEmailId = EmailCommandsFIS.getCurrentEmailIdFromForm(form);
            EmailCommandsFIS.toggleProgressIndicator();
            EmailCommandsFIS.SaveEmailAndExecute(form, telemetryItem, function () {
                EmailCommandsFIS.createMail(currentEmailId, Activities.EmailAction.ReplyAll, subjectPrefix, telemetryItem, "replyAll", null, EmailCommandsFIS.handleNavigationFromFormCallback);
            }, function (error, telemetryItem) {
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                EmailCommandsFIS.toggleProgressIndicator(false);
            });
        };
        /// <summary>
        /// Forward email
        /// </summary>
        /// <param name="form">Form context object</param>
        EmailCommandsFIS.forward = function (form) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventForward);
            var subjectPrefix = Activities.ClientApi.getResourceString("Email_Prefix_Forward");
            var currentEmailId = EmailCommandsFIS.getCurrentEmailIdFromForm(form);
            EmailCommandsFIS.toggleProgressIndicator();
            EmailCommandsFIS.SaveEmailAndExecute(form, telemetryItem, function () {
                EmailCommandsFIS.createMail(currentEmailId, Activities.EmailAction.Forward, subjectPrefix, telemetryItem, "ForwardEmail", null, EmailCommandsFIS.handleNavigationFromFormCallback);
            }, function (error, telemetryItem) {
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                EmailCommandsFIS.toggleProgressIndicator(false);
            });
        };
        EmailCommandsFIS.handleNavigationFromForm = function (newEmailId) {
            Xrm.Utility.openEntityForm(Activities.Constants.EntityNames.Email, newEmailId);
            // Refresh timeline wall control to display created draft email when user clicks on Reply, ReplyAll and Forward from email Popupup
            EmailCommandsFIS.refreshParentFromEmailPopup();
        };
        EmailCommandsFIS.getParentEntityLookupFromGridControl = function (gridControl) {
            var parentControl = gridControl && gridControl.getParentForm ? gridControl.getParentForm() : Xrm.Page;
            var parentEntity = parentControl.data.entity.getEntityReference();
            return parentEntity;
        };
        /// <summary>
        /// Reply to the email from a Grid or SubGrid, such as UCI Timeline
        /// </summary>
        EmailCommandsFIS.replyFromGrid = function (gridControl, records) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventReply);
            var subjectPrefix = Activities.ClientApi.getResourceString("Email_Prefix_Reply");
            var currentEmailId = EmailCommandsFIS.getCurrentEmailIdFromSelectedRecords(records);
            var parentEntity = EmailCommandsFIS.getParentEntityLookupFromGridControl(gridControl);
            EmailCommandsFIS.toggleProgressIndicator();
            EmailCommandsFIS.createMail(currentEmailId, Activities.EmailAction.Reply, subjectPrefix, telemetryItem, "replyEmail", parentEntity, function (newEmailId) {
                EmailCommandsFIS.handleNavigationFromGrid(gridControl, newEmailId, Activities.Constants.ReplyEmailActionName);
            });
        };
        /// <summary>
        /// Reply all to the email from Grid or SubGrid, such as UCI Timeline
        /// </summary>
        EmailCommandsFIS.replyAllFromGrid = function (gridControl, records) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventReplyAll);
            var subjectPrefix = Activities.ClientApi.getResourceString("Email_Prefix_Reply");
            var currentEmailId = EmailCommandsFIS.getCurrentEmailIdFromSelectedRecords(records);
            var parentEntity = EmailCommandsFIS.getParentEntityLookupFromGridControl(gridControl);
            EmailCommandsFIS.toggleProgressIndicator();
            EmailCommandsFIS.createMail(currentEmailId, Activities.EmailAction.ReplyAll, subjectPrefix, telemetryItem, "replyAll", parentEntity, function (newEmailId) {
                EmailCommandsFIS.handleNavigationFromGrid(gridControl, newEmailId, Activities.Constants.ReplyAllEmailActionName);
            });
        };
        /// <summary>
        /// Forward the email from Grid or SubGrid, such as UCI Timeline
        /// </summary>
        EmailCommandsFIS.forwardFromGrid = function (gridControl, records) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventForward);
            var subjectPrefix = Activities.ClientApi.getResourceString("Email_Prefix_Forward");
            var currentEmailId = EmailCommandsFIS.getCurrentEmailIdFromSelectedRecords(records);
            var parentEntity = EmailCommandsFIS.getParentEntityLookupFromGridControl(gridControl);
            EmailCommandsFIS.toggleProgressIndicator();
            EmailCommandsFIS.createMail(currentEmailId, Activities.EmailAction.Forward, subjectPrefix, telemetryItem, "ForwardEmail", parentEntity, function (newEmailId) {
                EmailCommandsFIS.handleNavigationFromGrid(gridControl, newEmailId, Activities.Constants.ForwardEmailActionName);
            });
        };
        EmailCommandsFIS.refreshParentFromEmailPopup = function () {
            // Dispatch event to refresh the parent timeline wall control on Send, Reply, ReplyAll and Forward email events from email popup. Also on Reply, ReplyAll and Forward from timelinewall grid
            // Event Listener added in Contextual Email Control
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventRefreshParentFromEmailPopup);
            try {
                var containerFrameElement = window.parent.frameElement;
                var containerPanelId = containerFrameElement && containerFrameElement.getAttribute("email-popup-id");
                window.parent.parent.dispatchEvent(new CustomEvent("refreshParentFromEmailPopup", {
                    detail: {
                        containerPanelId: containerPanelId,
                    },
                }));
            }
            catch (e) {
                telemetryItem.traceEventInformation(e);
                telemetryItem.report();
            }
        };
        EmailCommandsFIS.handleNavigationFromGrid = function (gridControl, newEmailId, emailAction) {
            if (EmailCommandsFIS.isTimelineGridComponent(gridControl)) {
                try {
                    // invoke internal client API to pass entity to Timeline.
                    // Timeline will then decide via configuration and FCB checks to open via form or open via contextual email
                    var timelineControl = gridControl;
                    if (timelineControl && timelineControl.openEmail) {
                        var entityReference = {
                            id: newEmailId,
                            logicalName: Activities.Constants.EntityNames.Email,
                        };
                        timelineControl.openEmail(entityReference, emailAction);
                    }
                    else {
                        Xrm.Utility.openEntityForm(Activities.Constants.EntityNames.Email, newEmailId);
                    }
                }
                catch (e) {
                    // the new entity has successfully been created.
                    // if for some reason call to set contextual email entity fails
                    // we might as well navigate them to the new entity form
                    Xrm.Utility.openEntityForm(Activities.Constants.EntityNames.Email, newEmailId);
                }
            }
            else {
                Xrm.Utility.openEntityForm(Activities.Constants.EntityNames.Email, newEmailId);
            }
        };
        EmailCommandsFIS.getCurrentEmailIdFromForm = function (form) {
            return Activities.ClientApi.getFormDataForRibbon(form).entity.getId();
        };
        EmailCommandsFIS.getCurrentEmailIdFromSelectedRecords = function (records) {
            // to reach this point Commanding would have evaluated against EnableRule configured with behavior: isSingleEmailRecordSelected
            return records[0].Id;
        };
        EmailCommandsFIS.isSingleEmailRecordSelected = function (records) {
            return records && records.length == 1 && records[0].TypeName == "email";
        };
        /// <summary>
        /// CustomRule function to check if the caller is the Timeline component
        /// Implementing this will prevent Timeline-specific Commands to be displayed within other activitypointer grids
        /// </summary>
        /// <param name="gridControl">Grid control which invoked the rule</param>
        EmailCommandsFIS.isTimelineGridComponent = function (gridControl) {
            if (gridControl &&
                gridControl.getGridType &&
                gridControl.getGridType() == 3 /* Subgrid */) {
                try {
                    // SubGrids interface extends both XrmClientApi.Controls.GridControl and XrmClientApi.Controls.Control
                    // XrmClietApi.Controls.Control has behavior of knowing its ControlType
                    var timelineSubGrid = gridControl;
                    if (timelineSubGrid && timelineSubGrid.getControlType) {
                        // cannot replace with XrmClientApi.Constants.ControlType.timelinewall
                        // behavior fails with XrmClientApi is not defined
                        return timelineSubGrid.getControlType() == "timelinewall";
                    }
                }
                catch (error) {
                }
            }
            return false;
        };
        /// <summary>
        /// Creates a new email
        /// </summary>
        /// <param name="emailId">ID of the current email</param>
        /// <param name="emailAction">Action, Reply or Reply All or Forward</param>
        /// <param name="subjectPrefix">Subject prefix</param>
        /// <param name="parentEntityLookup">The parent entity associated with the grid control context. Will be null when invoked from Form.</param>
        EmailCommandsFIS.createMail = function (emailId, emailAction, subjectPrefix, telemetryItem, componentName, parentEntityLookup, handleNavigationCallback) {
            var optionsString = "?$select=statecode,statuscode,subject,directioncode,ownerid,actualdurationminutes,prioritycode,scheduledend,parentactivityid,description,actualend,baseconversationindexhash&$expand=email_activity_parties";
            if (Xrm.Internal.isUci() && !Activities.ClientApi.IsOffline() && Activities.Common.Util.isSafeDescriptionInEmailUCIEnabled())
                optionsString =
                    "?$select=statecode,statuscode,subject,directioncode,ownerid,actualdurationminutes,prioritycode,scheduledend,parentactivityid,description,safedescription,actualend,baseconversationindexhash&$expand=email_activity_parties";
            Xrm.WebApi.online.retrieveRecord(Activities.Constants.EntityNames.Email, emailId, optionsString).then(function (retrievedEmail) {
                EmailCommandsFIS.createFromRetrievedEmail(emailId, retrievedEmail, emailAction, subjectPrefix, telemetryItem, parentEntityLookup, handleNavigationCallback, componentName);
            }, function (error) {
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                EmailCommandsFIS.toggleProgressIndicator(false);
            });
        };
        EmailCommandsFIS.toggleProgressIndicator = function (show) {
            if (show === void 0) { show = true; }
            if (Activities.Common.Util.isEmailEnhancementsFeatureEnabled(Activities.Constants.FCBConstant.EmailUx2020UpdateFCB)) {
                var processingMessage = Activities.ClientApi.getResourceString("Msg_Progress_MOCA_Dialog");
                if (show) {
                    Xrm.Utility.showProgressIndicator(processingMessage);
                }
                else {
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        EmailCommandsFIS.createFromRetrievedEmail = function (currentEmailId, retrievedEmail, emailAction, subjectPrefix, telemetryItem, parentEntityLookup, handleNavigationCallback, componentName) {
            var parentActivityId = Activities.Common.Util.convertGuidToString(currentEmailId);
            var newEmail = (_a = {},
                _a["statecode"] = Activities.EmailState.Open,
                _a["statuscode"] = Activities.EmailStatus.Draft,
                _a["subject"] = EmailCommandsFIS.prependSubjectWithPrefix(retrievedEmail["subject"], subjectPrefix),
                _a["directioncode"] = true,
                _a["actualdurationminutes"] = retrievedEmail["actualdurationminutes"],
                _a["prioritycode"] = retrievedEmail["prioritycode"],
                _a["scheduledend"] = retrievedEmail["scheduledend"],
                _a["parentactivityid@odata.bind"] = "emails(" + parentActivityId + ")",
                _a["actualend"] = retrievedEmail["actualend"],
                _a["baseconversationindexhash"] = retrievedEmail["baseconversationindexhash"],
                _a["messageid"] = null,
                _a["inreplyto"] = null,
                _a["conversationindex"] = null,
                _a);
            EmailCommandsFIS.updatePartiesAndDescription(currentEmailId, retrievedEmail, newEmail, emailAction, subjectPrefix, telemetryItem, parentEntityLookup, handleNavigationCallback, componentName);
            var _a;
        };
        EmailCommandsFIS.updatePartiesAndDescription = function (currentEmailId, retrievedEmail, newEmail, emailAction, subjectPrefix, telemetryItem, parentEntityLookup, handleNavigationCallback, componentName) {
            return __awaiter(this, void 0, void 0, function () {
                var retrievedActivityParties, newActivityParties, fromActivityParties, toActivityParties, ccActivityParties, entitySetNames, entitySetNamePromises, shouldAddRelatedParties, i, retrievedActivityParty, participationTypeMask, lookuplogicalname, retrievedDescription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            retrievedActivityParties = retrievedEmail["email_activity_parties"];
                            newActivityParties = new Array();
                            fromActivityParties = [];
                            toActivityParties = [];
                            ccActivityParties = [];
                            entitySetNames = EmailCommandsFIS.getEntitySetNameMap();
                            entitySetNamePromises = [];
                            return [4 /*yield*/, EmailCommandsFIS.shouldAddRelatedEntitiesForEmail(telemetryItem)
                                .catch(function (error) {
                                    Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                                    EmailCommandsFIS.toggleProgressIndicator(false);
                                    throw error;
                                })];
                        case 1:
                            shouldAddRelatedParties = _a.sent();
                            if (retrievedActivityParties.length > 0) {
                                for (i = 0; i < retrievedActivityParties.length; i++) {
                                    retrievedActivityParty = retrievedActivityParties[i];
                                    participationTypeMask = retrievedActivityParty["participationtypemask"];
                                    lookuplogicalname = retrievedActivityParty["_partyid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                                    switch (participationTypeMask) {
                                        case Activities.EmailParticipationTypeMask.ToRecepient:
                                            toActivityParties.push(EmailCommandsFIS.getActivityPartyAddressUsed(retrievedActivityParty));
                                            if (emailAction == Activities.EmailAction.ReplyAll) {
                                                newActivityParties.push(retrievedActivityParty);
                                                EmailCommandsFIS.createEntitySetNamePromise(lookuplogicalname, entitySetNamePromises, entitySetNames);
                                            }
                                            break;
                                        case Activities.EmailParticipationTypeMask.CcRecipient:
                                            ccActivityParties.push(EmailCommandsFIS.getActivityPartyAddressUsed(retrievedActivityParty));
                                            if (emailAction == Activities.EmailAction.ReplyAll) {
                                                newActivityParties.push(retrievedActivityParty);
                                                EmailCommandsFIS.createEntitySetNamePromise(lookuplogicalname, entitySetNamePromises, entitySetNames);
                                            }
                                            break;
                                        case Activities.EmailParticipationTypeMask.BccRecipient:
                                            break;
                                        case Activities.EmailParticipationTypeMask.Sender:
                                            fromActivityParties.push(EmailCommandsFIS.getActivityPartyAddressUsed(retrievedActivityParty));
                                            if (emailAction == Activities.EmailAction.Reply || emailAction == Activities.EmailAction.ReplyAll) {
                                                // ParticipationTypeMask is sender for the parent email, creating the new record as to recipient.
                                                retrievedActivityParty["participationtypemask"] = Activities.EmailParticipationTypeMask.ToRecepient;
                                                newActivityParties.push(retrievedActivityParty);
                                                EmailCommandsFIS.createEntitySetNamePromise(lookuplogicalname, entitySetNamePromises, entitySetNames);
                                            }
                                            break;
                                        case Activities.EmailParticipationTypeMask.Regarding:
                                            newActivityParties.push(retrievedActivityParty);
                                            EmailCommandsFIS.createEntitySetNamePromise(lookuplogicalname, entitySetNamePromises, entitySetNames);
                                            break;
                                        case Activities.EmailParticipationTypeMask.Owner:
                                            break;
                                        case Activities.EmailParticipationTypeMask.Related:
                                            if (shouldAddRelatedParties && Activities.Common.Util.IsNullOrUndefined(parentEntityLookup) && !retrievedActivityParty["ispartydeleted"]) {
                                                newActivityParties.push(retrievedActivityParty);
                                                EmailCommandsFIS.createEntitySetNamePromise(lookuplogicalname, entitySetNamePromises, entitySetNames);
                                            }
                                            break;
                                    }
                                }
                            }
                            if (!(shouldAddRelatedParties && !Activities.Common.Util.IsNullOrUndefined(parentEntityLookup))) return [3 /*break*/, 3];
                            return [4 /*yield*/, EmailCommandsFIS.isActivityParty(telemetryItem, parentEntityLookup.entityType).then(function (isActivityParty) {
                                if (isActivityParty) {
                                    var relatedParty = {};
                                    relatedParty["_partyid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] = parentEntityLookup.entityType;
                                    relatedParty["_partyid_value"] = Activities.Common.Util.convertGuidToString(parentEntityLookup.id);
                                    relatedParty["participationtypemask"] = Activities.EmailParticipationTypeMask.Related;
                                    newActivityParties.push(relatedParty);
                                }
                            }, function (error) {
                                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                                EmailCommandsFIS.toggleProgressIndicator(false);
                                throw error;
                            })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            retrievedDescription = retrievedEmail["description"];
                            if (Xrm.Internal.isUci() && !Activities.ClientApi.IsOffline() && Activities.Common.Util.isSafeDescriptionInEmailUCIEnabled())
                                retrievedDescription = retrievedEmail["safedescription"];
                            newEmail["description"] = EmailCommandsFIS.buildEmailFollowUpBody(retrievedDescription, fromActivityParties, toActivityParties, ccActivityParties, Xrm.Encoding.htmlEncode(retrievedEmail["subject"]), retrievedEmail["actualend"]);
                            if (entitySetNamePromises.length > 0) {
                                Promise.all(entitySetNamePromises).then(function (values) {
                                    for (var i = 0; i < values.length; i++) {
                                        entitySetNames[values[i].LogicalName] = values[i].EntitySetName;
                                    }
                                    EmailCommandsFIS.bindPartiesAndCreateEmail(currentEmailId, newEmail, emailAction, newActivityParties, entitySetNames, telemetryItem, handleNavigationCallback, componentName);
                                });
                            }
                            else {
                                EmailCommandsFIS.bindPartiesAndCreateEmail(currentEmailId, newEmail, emailAction, newActivityParties, entitySetNames, telemetryItem, handleNavigationCallback, componentName);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailCommandsFIS.isActivityParty = function (telemetryItem, entityName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityName).then(function (res) {
                            if (Activities.Common.Util.IsNullOrUndefined(res)) {
                                var errorString = "Get entity metadata returned null for " + entityName + ".";
                                telemetryItem.traceEventError(errorString);
                                telemetryItem.report();
                                throw new Error(errorString);
                            }
                            return res.IsActivityParty;
                        }, function (error) {
                            var errorString = "Error response occurred while getting entity metadata for " + entityName + ".";
                            telemetryItem.traceEventError(errorString);
                            telemetryItem.report();
                            throw error;
                        })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        EmailCommandsFIS.shouldAddRelatedEntitiesForEmail = function (telemetryItem) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_AddRelatedEntitiesForEmail)) {
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(Activities.Constants.EntityNames.Email, [Activities.Constants.EmailFields.Related]).then(function (metadata) {
                                if (Activities.Common.Util.IsNullOrUndefined(metadata) || Activities.Common.Util.IsNullOrUndefined(metadata.Attributes)) {
                                    var errorString = "Get entity metadata attributes returned null for Email.";
                                    telemetryItem.traceEventError(errorString);
                                    telemetryItem.report();
                                    throw new Error(errorString);
                                }
                                return !Activities.Common.Util.IsNullOrUndefined(metadata.Attributes.get(Activities.Constants.EmailFields.Related));
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        EmailCommandsFIS.createEntitySetNamePromise = function (lookuplogicalname, entitySetNamePromises, entitySetNames) {
            var lookupEntitySetName = entitySetNames[lookuplogicalname];
            if (lookupEntitySetName == null && lookuplogicalname != null) {
                var promise = Xrm.Utility.getEntityMetadata(lookuplogicalname, [
                    "EntitySetName",
                ]);
                // Adding a blank value to avoid duplicate calls for the same entity.
                entitySetNames[lookuplogicalname] = "";
                entitySetNamePromises.push(promise);
            }
        };
        EmailCommandsFIS.getEntitySetNameMap = function () {
            var entitySetNameMap = {
                account: "accounts",
                bulkoperation: "bulkoperations",
                campaign: "campaigns",
                campaignactivity: "campaignactivities",
                contact: "contacts",
                contract: "contracts",
                entitlement: "entitlements",
                equipment: "equipments",
                incident: "incidents",
                invoice: "invoices",
                knowledgearticle: "knowledgearticles",
                lead: "leads",
                opportunity: "opportunities",
                queue: "queues",
                quote: "quotes",
                salesorder: "salesorders",
                systemuser: "systemusers",
                unresolvedaddress: "unresolvedaddresses",
            };
            return entitySetNameMap;
        };
        EmailCommandsFIS.bindPartiesAndCreateEmail = function (currentEmailId, email, emailAction, emailActivityPartyList, entitySetNames, telemetryItem, handleNavigationCallback, componentName) {
            var toParties = emailActivityPartyList.filter(function (emailActivityParty) {
                return emailActivityParty["participationtypemask"] == Activities.EmailParticipationTypeMask.ToRecepient;
            });
            var ownerActivityParty = EmailCommandsFIS.getCurrentUserActivityParty(Activities.EmailParticipationTypeMask.Owner);
            var senderActivityParty = EmailCommandsFIS.getCurrentUserActivityParty(Activities.EmailParticipationTypeMask.Sender);
            //We don't add the sender in "To"(ToActivityParty) by default.
            var skipSenderInToField = true;
            //If there is only one activityParty in "To" and that is the current sender, then include the sender as a ToActivityParty.
            //This is for the scenario where the user is replying to its own sent mail. The expectation is to have the To field update with Sender
            //Whereas if the user hits reply all and the To field has more than 1 user who is not the sender then skip the sender in To.
            if (toParties && toParties.length == 1) {
                skipSenderInToField = false;
            }
            email["email_activity_parties"] = [];
            email["email_activity_parties"].push(ownerActivityParty);
            email["email_activity_parties"].push(senderActivityParty);
            var unresolveDeletedParties = Activities.Common.Util.isFCBEnabled(Activities.Constants.FCBConstant.FCB_ConvertDeletedPartiesToUnresolvedEmails, null);
            for (var i = 0; i < emailActivityPartyList.length; i++) {
                var retrievedActivityParty = emailActivityPartyList[i];
                if (unresolveDeletedParties && retrievedActivityParty["ispartydeleted"]) {
                    retrievedActivityParty["_partyid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] = null;
                }
                var newActivityParty = EmailCommandsFIS.cloneActivityParty(retrievedActivityParty, telemetryItem);
                var lookupLogicalName = retrievedActivityParty["_partyid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                if (!Activities.Common.Util.IsNullOrEmptyString(lookupLogicalName)) {
                    newActivityParty["partyid_" + lookupLogicalName + "@odata.bind"] =
                        entitySetNames[lookupLogicalName.toLowerCase()] + "(" + retrievedActivityParty["_partyid_value"] + ")";
                    //Below if condition is added to check for regarding activity party from retrieved activity and add it to the new email to be created
                    if (retrievedActivityParty["participationtypemask"] == Activities.EmailParticipationTypeMask.Regarding) {
                        email["regardingobjectid_" + lookupLogicalName + "_email@odata.bind"] =
                            "/" +
                            entitySetNames[lookupLogicalName.toLowerCase()] +
                            "(" +
                            retrievedActivityParty["_partyid_value"] +
                            ")";
                    }
                }
                var updateActivityParties = EmailCommandsFIS.updateActivityParty(retrievedActivityParty, skipSenderInToField);
                if (updateActivityParties) {
                    email["email_activity_parties"].push(newActivityParty);
                }
            }
            EmailCommandsFIS.createEmailRecord(currentEmailId, email, emailAction, telemetryItem, handleNavigationCallback, componentName);
        };
        EmailCommandsFIS.updateActivityParty = function (retrievedParty, skipSenderInToField) {
            var retrievedPartyId = retrievedParty["_partyid_value"];
            // if we are adding current user, and if skipSenderinTo is true
            if ((retrievedPartyId ===
                Activities.Common.Util.convertGuidToString(Xrm.Utility.getGlobalContext().userSettings.userId).toLowerCase() &&
                skipSenderInToField) ||
                retrievedParty["participationtypemask"] == Activities.EmailParticipationTypeMask.Regarding) {
                return false;
            }
            return true;
        };
        EmailCommandsFIS.cloneActivityParty = function (retrievedActivityParty, telemetryItem) {
            var newActivityParty = {
                participationtypemask: retrievedActivityParty["participationtypemask"],
                donotemail: retrievedActivityParty["donotemail"],
                donotfax: retrievedActivityParty["donotfax"],
                donotpostalmail: retrievedActivityParty["donotpostalmail"],
                donotphone: retrievedActivityParty["donotphone"],
                ispartydeleted: retrievedActivityParty["ispartydeleted"],
                instancetypecode: retrievedActivityParty["instancetypecode"],
            };
            // As per Bug - 1316324 : skipping the addressused property for records which are having addressused as NULL value.
            if (retrievedActivityParty["addressused"] !== null) {
                newActivityParty["addressused"] = retrievedActivityParty["addressused"];
            }
            else {
                telemetryItem.traceEventInformation("addressused is null for activityparty with id - " +
                    retrievedActivityParty["activitypartyid"] +
                    " and party id - " +
                    retrievedActivityParty["_partyid_value"]);
            }
            var lookuplogicalname = retrievedActivityParty["_partyid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
            if (!Activities.Common.Util.IsNullOrEmptyString(lookuplogicalname)) {
                newActivityParty["partyid_" + lookuplogicalname + "@odata.bind"] =
                    lookuplogicalname + "(" + retrievedActivityParty["_partyid_value"] + ")";
            }
            telemetryItem.report();
            return newActivityParty;
        };
        // Using the same method to set both sender and owner.
        EmailCommandsFIS.getCurrentUserActivityParty = function (participationTypeMask) {
            var currentUserActivityParty = (_a = {},
                _a["partyid_systemuser@odata.bind"] = "systemusers(" +
                Activities.Common.Util.convertGuidToString(Xrm.Utility.getGlobalContext().userSettings.userId) +
                ")",
                _a["participationtypemask"] = participationTypeMask,
                _a);
            return currentUserActivityParty;
            var _a;
        };
        EmailCommandsFIS.buildEmailFollowUpBody = function (description, senderParty, toParty, ccParty, subject, actualEnd) {
            var data = "";
            var emailBodyDescription = "";
            emailBodyDescription = description;
            if (description != null) {
                if (description.indexOf("id=signature") > -1 || description.indexOf('id="signature"') > -1) {
                    emailBodyDescription = emailBodyDescription.replace("<div id=signature>", "<div id=oldsignature>");
                    emailBodyDescription = emailBodyDescription.replace('<div id="signature">', "<div id=oldsignature>");
                }
                if (Activities.Common.Util.addDirection()) {
                    try {
                        if (description.indexOf("<body") > -1) {
                            var start = description.indexOf("<body");
                            var bodyNode = emailBodyDescription.substring(start);
                            var end = bodyNode.indexOf(">");
                            var direcrionRegex = /^<body.*((direction|dir)\s*(=|:)\s*(\\?)("|'?)(\b[a-zA-Z]{3}\b)).*>/gi;
                            var dir = "ltr";
                            var match = direcrionRegex.exec(emailBodyDescription.substring(start, start + end + 1));
                            if (match != null) {
                                dir = match[6];
                            }
                            emailBodyDescription =
                                emailBodyDescription.substring(0, start + end + 1) +
                                ("<div dir=\"" + dir + "\">") +
                                emailBodyDescription.substring(start + end + 1).replace("</body>", "</div></body>");
                        }
                    }
                    catch (e) {
                    }
                }
            }
            data = data.concat('<font face="');
            data = data.concat(Activities.ClientApi.getResourceString("Microsoft_Crm_Msgbody_Default_fonts"));
            data = data.concat('" size="2">');
            data = data.concat(Activities.ClientApi.getResourceString("Email_Followup_Header"));
            data = data.concat("<br>");
            if (senderParty != null && senderParty.length > 0) {
                data = data.concat(EmailCommandsFIS.addPartyToHeader(Activities.ClientApi.getResourceString("Email_Followup_Sender"), senderParty));
            }
            data = data.concat("<b>");
            data = data.concat(Activities.ClientApi.getResourceString("Email_Followup_ReceivedDate"));
            data = data.concat("</b> ");
            if (actualEnd) {
                var actualEndDate = new Date(actualEnd.toString());
                data = data.concat(actualEndDate.toString());
            }
            data = data.concat("<br>");
            if (toParty != null && toParty.length > 0) {
                data = data.concat(EmailCommandsFIS.addPartyToHeader(Activities.ClientApi.getResourceString("Email_Followup_ToRecipients"), toParty));
            }
            if (ccParty != null && ccParty.length > 0) {
                data = data.concat(EmailCommandsFIS.addPartyToHeader(Activities.ClientApi.getResourceString("Email_Followup_CcRecipients"), ccParty));
            }
            data = data.concat("<b>");
            data = data.concat(Activities.ClientApi.getResourceString("Email_Followup_Subject"));
            data = data.concat("</b> ");
            data = data.concat(subject);
            data = data.concat("</font><br><br>");
            if (description != null && description != "") {
                data = data.concat(emailBodyDescription);
            }
            return data.toString();
        };
        /// <summary>
        /// Creates a new email record with attachments in case of forward email and opens the new email using openEntityForm
        /// </summary>
        EmailCommandsFIS.createEmailRecord = function (currentEmailId, newEmail, emailAction, telemetryItem, handleNavigationCallback, componentName) {
            Xrm.WebApi.online.createRecord(Activities.Constants.EntityNames.Email, newEmail).then(function (lookupValue) {
                var signatureDiv = '<br/><br/><br/><div id=newsignature style="display: none;"></div>';
                var getSignaturePromise = new Promise(function (resolve, reject) {
                    Xrm.WebApi.retrieveMultipleRecords("activityparty", "?$filter=_activityid_value eq " +
                        lookupValue.id +
                        " and participationtypemask eq 1&$select=_partyid_value").then(function (result) {
                            var fromEntity = result && result.entities && result.entities.length > 0 ? result.entities[0] : null;
                            if (fromEntity != null) {
                                Activities.Email.RetrieveDefaultSignature(null, telemetryItem, fromEntity["_partyid_value"], fromEntity["_partyid_value@Microsoft.Dynamics.CRM.lookuplogicalname"]).then(function (defaultSignature) {
                                    if (!Activities.Common.Util.IsNullOrEmptyString(defaultSignature)) {
                                        signatureDiv =
                                            '<br/><br/><br/><div id="newsignature">' +
                                            Xrm.Encoding.htmlDecode(defaultSignature) +
                                            "</div>";
                                    }
                                    resolve(signatureDiv);
                                }, function (error) {
                                    resolve(signatureDiv);
                                    telemetryItem.traceEventError("Error while reading json response from RetrieveEmailSignatureRequest.", error.innerror ? error.innerror.message : error.message);
                                    telemetryItem.report();
                                });
                            }
                            else {
                                resolve(signatureDiv);
                                telemetryItem.traceEventError("Error while reading from value of the email record.");
                                telemetryItem.report();
                            }
                        }, function (error) {
                            resolve(signatureDiv);
                            var purgedError = Activities.ClientApi.removeRawFromErrorResponse(error);
                            telemetryItem.traceEventError("Error while retrieving the updated from value of the email ", purgedError);
                            telemetryItem.report();
                        });
                });
                var getUpdatedDescriptionPromise = new Promise(function (resolve, reject) {
                    Xrm.WebApi.retrieveRecord("email", lookupValue.id, "?$select=description").then(function (success) {
                        resolve(success.description);
                    }, function (error) {
                        resolve(newEmail["description"]);
                        var purgedError = Activities.ClientApi.removeRawFromErrorResponse(error);
                        telemetryItem.traceEventError("Error while retrieving the updated description of the email " + purgedError);
                        telemetryItem.report();
                    });
                });
                var addSignaturePromise = new Promise(function (resolve, reject) {
                    Promise.all([getSignaturePromise, getUpdatedDescriptionPromise]).then(function (values) {
                        if (values && values.length > 1) {
                            var updatedDescription = values[0] + values[1];
                            if (Activities.Common.Util.addDirection()) {
                                updatedDescription =
                                    "<div style=\"direction:" + Activities.Common.Util.getDirection() + "\">" +
                                    updatedDescription +
                                    "</div>";
                            }
                            Xrm.WebApi.updateRecord(Activities.Constants.EntityNames.Email, lookupValue.id, {
                                description: updatedDescription,
                            }).then(function (lookupValue1) {
                                resolve(lookupValue);
                            }, function (error) {
                                resolve(lookupValue);
                                var purgedError = Activities.ClientApi.removeRawFromErrorResponse(error);
                                telemetryItem.traceEventError("Error while adding signature div in the email ", purgedError);
                                telemetryItem.report();
                            });
                        }
                        else {
                            resolve(lookupValue);
                            telemetryItem.traceEventError("getting updated description or getting the signature didn't succeed.");
                            telemetryItem.report();
                        }
                    }, function (error) {
                        resolve(lookupValue);
                        var purgedError = Activities.ClientApi.removeRawFromErrorResponse(error);
                        telemetryItem.traceEventError("getting updated description or getting the signature threw error ", purgedError);
                        telemetryItem.report();
                    });
                });
                var getAttachmentsPromise = new Promise(function (resolve, reject) {
                    if (emailAction == Activities.EmailAction.Forward) {
                        var attachmentsFetchXml = "?$filter=objectid_email/activityid eq " +
                            Activities.Common.Util.convertGuidToString(currentEmailId) +
                            " and not contains(mimetype, 'svg')";
                        Xrm.WebApi.online.retrieveMultipleRecords("activitymimeattachment", attachmentsFetchXml).then(function (response) {
                            var attachments = response && response.entities ? response.entities : null;
                            if (attachments != null && attachments.length > 0) {
                                resolve(attachments);
                            }
                            else {
                                resolve(null);
                            }
                        }, function (error) {
                            resolve(null);
                        });
                    }
                    else {
                        resolve(null);
                    }
                });
                Promise.all([addSignaturePromise, getAttachmentsPromise]).then(function (values) {
                    if (values && values.length > 0 && values[1] != null) {
                        EmailCommandsFIS.copyAttachment(values[1], lookupValue.id, telemetryItem, handleNavigationCallback, newEmail);
                    }
                    else {
                        telemetryItem.report();
                        EmailCommandsFIS.toggleProgressIndicator(false);
                        handleNavigationCallback(lookupValue.id);
                    }
                }, function (error) {
                    Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                    EmailCommandsFIS.toggleProgressIndicator(false);
                });
            }, function (error) {
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                EmailCommandsFIS.toggleProgressIndicator(false);
            });
        };
        EmailCommandsFIS.copyAttachment = function (attachmentCollection, activityId, telemetryItem, handleNavigationCallback, newEmail) {
            var mimeAttachmentIds;
            var nonMimeAttachmentCollection = [];
            var fileAttachmentCount = 0;
            var createdRecordCount = 0;
            if (Activities.Common.Util.isEmailEnhancementsFeatureEnabled(Activities.Constants.FCBConstant.InlineImagesData2020UpdateFCB)) {
                var body = newEmail && newEmail["description"] ? newEmail["description"] : "";
                mimeAttachmentIds = Activities.Common.Util.getAttachmentIdsFromEmailBody(body);
                for (var attachmentCount = 0; attachmentCount < attachmentCollection.length; attachmentCount++) {
                    var attachment = attachmentCollection[attachmentCount];
                    if (mimeAttachmentIds && mimeAttachmentIds.indexOf(attachment["activitymimeattachmentid"]) > -1) {
                        // We don't clone the activitymimeattachment record from client as we do that in the server side plugin -PreSendEmail
                        continue;
                    }
                    else {
                        nonMimeAttachmentCollection.push(attachment);
                    }
                }
            }
            else {
                nonMimeAttachmentCollection = attachmentCollection;
            }
            fileAttachmentCount = nonMimeAttachmentCollection.length;
            for (var attachmentCount = 0; attachmentCount < fileAttachmentCount; attachmentCount++) {
                var attachment = nonMimeAttachmentCollection[attachmentCount];
                var clonedAttachmentRecord = {
                    activitysubject: attachment["activitysubject"],
                    body: attachment["body"],
                    filename: attachment["filename"],
                    objecttypecode: attachment["objecttypecode"],
                    mimetype: attachment["mimetype"],
                    // we need not strip off the {cid:} from the contentid here as these are for fileattachments not referred in email body.
                    attachmentcontentid: attachment["attachmentcontentid"],
                    "objectid_email@odata.bind": "emails(" + activityId + ")",
                };
                Xrm.WebApi.createRecord(Activities.Constants.EntityNames.ActivityMimeAttachment, clonedAttachmentRecord).then(function (createdAttachmentEntity) {
                    if (fileAttachmentCount == ++createdRecordCount) {
                        EmailCommandsFIS.onCopyAttachmentComplete(telemetryItem, activityId, handleNavigationCallback);
                    }
                }, function (error) {
                    Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                    EmailCommandsFIS.toggleProgressIndicator(false);
                });
            }
            // if there are no file attachments, we can call complete.
            if (Activities.Common.Util.isEmailEnhancementsFeatureEnabled(Activities.Constants.FCBConstant.InlineImagesData2020UpdateFCB) &&
                fileAttachmentCount == 0) {
                EmailCommandsFIS.onCopyAttachmentComplete(telemetryItem, activityId, handleNavigationCallback);
            }
        };
        EmailCommandsFIS.onCopyAttachmentComplete = function (telemetryItem, activityId, handleNavigationCallback) {
            if (!(Activities.ClientApi.IsOutlookClient() &&
                !(Xrm.Utility.getGlobalContext().client.getClientState() == Xrm.Constants.ClientStates.online))) {
                telemetryItem.report();
                handleNavigationCallback(activityId.toString());
                EmailCommandsFIS.toggleProgressIndicator(false);
            }
        };
        EmailCommandsFIS.addPartyToHeader = function (partyName, partyCollection) {
            var data = "";
            data = data.concat("<b>");
            data = data.concat(partyName);
            data = data.concat("</b> ");
            for (var i = 0; i < partyCollection.length; i++) {
                var displayValue = partyCollection[i];
                data = data.concat(displayValue);
                data = data.concat("; ");
            }
            data = data.concat("<br>");
            return data.toString();
        };
        EmailCommandsFIS.getActivityPartyAddressUsed = function (partyMember) {
            var displayValue = "";
            if (partyMember["_partyid_value"] != null) {
                displayValue = partyMember["_partyid_value@OData.Community.Display.V1.FormattedValue"];
                if (!Activities.Common.Util.IsNullOrUndefined(partyMember["addressused"]) &&
                    Activities.Common.Util.isFCBEnabled(Activities.Constants.FCBConstant.AddEmailAddressOnReplyFCB, Activities.Constants.FCBConstant.April2021UpdateFCB)) {
                    displayValue = (Activities.Common.Util.IsNullOrUndefined(displayValue) ? "" : displayValue).concat(" &lt;", partyMember["addressused"], "&gt;");
                }
            }
            else {
                displayValue = partyMember["addressused"];
            }
            return displayValue;
        };
        EmailCommandsFIS.prependSubjectWithPrefix = function (subject, subjectPrefix) {
            var titleEllipsis = "...";
            if (!subject) {
                subject = "";
            }
            if (subject.substr(0, subjectPrefix.length).toUpperCase() != subjectPrefix.toUpperCase()) {
                subject =
                    subjectPrefix +
                    " " +
                    (subjectPrefix.length + 1 + subject.length > 200
                        ? subject.substring(0, subject.length - subjectPrefix.length - titleEllipsis.length - 1) + titleEllipsis
                        : subject);
            }
            return subject;
        };
        /// <summary>
        /// This function inserts htmlToInsert at the cursor position inside the editor having originalHtml as the content.
        /// </summary>
        EmailCommandsFIS.insertAtCursorPosition = function (formContext, originalHtml, htmlToInsert) {
            var defaultTemplateInsertion = htmlToInsert + originalHtml;
            var isCursorPositionFCBEnabled = Activities.Common.Util.isCursorPositionFCBEnabled();
            if (isCursorPositionFCBEnabled) {
                try {
                    var parentWindow = parent.window;
                    if (parentWindow) {
                        var rteditorUtility = parentWindow.RTEditorUtility;
                        if (rteditorUtility) {
                            var editor = rteditorUtility.getRTE("description.fieldControl_container");
                            if (editor) {
                                editor.insertHtml("<span>" + htmlToInsert + "</span>");
                                return editor.document.getBody().$.innerHTML;
                            }
                        }
                    }
                }
                catch (error) {
                    return defaultTemplateInsertion;
                }
            }
            return defaultTemplateInsertion;
        };
        /// <summary>
        /// This function gets call when user try to insert a email template.
        /// </summary>
        EmailCommandsFIS.insertEmailTemplate = function (xrmPage) {
            var _this = this;
            if (!Activities.Common.Util.IsNullOrUndefined(xrmPage) &&
                xrmPage.ui.getFormType() == 1 &&
                Activities.Common.Util.isFCBEnabled(Activities.Constants.FCBConstant.InsertTemplateAutoSaveOctober2020UpdateFCB, Activities.Constants.FCBConstant.October2020UpdateFCB)) {
                // automatically save the form
                var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventInsertEmailTemplate);
                var saveOptions = {
                    suppressErrorDialog: false,
                };
                EmailCommandsFIS.SaveEmailAndExecute(xrmPage, telemetryItem, function () { return _this.openEmailTemplateDialog(xrmPage); }, function (error, telemetryItem) {
                    telemetryItem.report();
                    _this.openEmailTemplateDialog(xrmPage);
                }, saveOptions);
            }
            else {
                this.openEmailTemplateDialog(xrmPage);
            }
        };
        /// <summary>
        /// This function calls Email Template MDD Dialog , it evaluates different data from Email Form to be passed to Dialog , Make calls to Different Dialog depending on number of different objects to resolve against.
        /// </summary>
        EmailCommandsFIS.openEmailTemplateDialog = function (xrmPage) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventInsertEmailTemplate);
            var dialogParameters = {};
            var recipientRecords = {};
            var unResolvedRecipientsCount = 0;
            //create controls array containing to, cc, regarding fields
            var controls = new Array(3);
            controls[0] = xrmPage.getControl(Activities.Constants.ControlTo);
            controls[1] = xrmPage.getControl(Activities.Constants.ControlCc);
            controls[2] = xrmPage.getControl(Activities.Constants.ControlRegardingObjectId);
            var parameterData = [];
            for (var id = 0; id < controls.length; ++id) {
                if (Activities.Common.Util.IsNullOrUndefined(controls[id]))
                    continue;
                var fieldName = controls[id].getName();
                var fieldLabel = controls[id].getLabel();
                var fieldValue = controls[id].getAttribute().getValue();
                if (fieldName === Activities.Constants.ControlTo ||
                    fieldName === Activities.Constants.ControlCc ||
                    fieldName === Activities.Constants.ControlRegardingObjectId) {
                    if (fieldValue) {
                        for (var item = 0; item < fieldValue.length; item++) {
                            if (Activities.EmailCommandsFIS.isEntityValidForInsertTemplate(fieldValue[item])) {
                                var AttributeValue = fieldValue[item];
                                // To avoid duplicates in the select recipient dialog
                                if (!recipientRecords[AttributeValue[Activities.Constants.MetadataDrivenDialogConstants.EmailEntityId]]) {
                                    recipientRecords[AttributeValue[Activities.Constants.MetadataDrivenDialogConstants.EmailEntityId]] =
                                        Activities.Constants.MetadataDrivenDialogConstants.KeyPresent;
                                    unResolvedRecipientsCount += 1;
                                }
                                var parameterDataobj = {
                                    fieldname: fieldName,
                                    id: AttributeValue[Activities.Constants.MetadataDrivenDialogConstants.EmailEntityId],
                                    entityType: AttributeValue[Activities.Constants.MetadataDrivenDialogConstants.EmailEntityType],
                                    name: AttributeValue[Activities.Constants.MetadataDrivenDialogConstants.RecipientNames],
                                    fieldLabel: fieldLabel,
                                };
                                parameterData.push(parameterDataobj);
                            }
                        }
                    }
                }
            }
            var isPersistingFilterFeatureEnabled = Activities.Common.Util.isFCBEnabled(Activities.Constants.FCBConstant.EnhancedEmailApril23, Activities.Constants.FCBConstant.EnhancedEmailTemplateDialog);
            dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailFormData] = JSON.stringify(parameterData);
            var dialogOptions = {
                height: 400,
                width: 400,
                position: 1 /* center */,
            };
            // 'if' statement to completely filter out any code that may be affected by email enhancements
            if (isPersistingFilterFeatureEnabled) {
                // Enhanced email templates
                var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings;
                var organization = { id: orgSettings.organizationId, entityType: "organization" };
                var SkipSelectRecordDialog_1 = false;
                var EnableEmailTemplateViews_1 = false;
                Xrm.WebApi.online.retrieveRecord(organization.entityType, organization.id).then(function (response) {
                    if (response.skipselectrecorddialog != null && response.skipselectrecorddialog != undefined)
                        SkipSelectRecordDialog_1 = response.skipselectrecorddialog;
                    if (response.enableemailtemplateviews != null && response.enableemailtemplateviews != undefined)
                        EnableEmailTemplateViews_1 = response.enableemailtemplateviews;
                    if (unResolvedRecipientsCount == 0) {
                        // No recipients added to the email, throw an error dialog
                        var errorStrings = {
                            text: Activities.ClientApi.getResourceString("Web._cs.ApplyEmailTemplate.dlg_InvalidTargetRecipient"),
                            confirmButtonLabel: "Ok",
                        };
                        Xrm.Navigation.openAlertDialog(errorStrings);
                    }
                    else if (isPersistingFilterFeatureEnabled && SkipSelectRecordDialog_1) {
                        // Both enhanced email templates and the new record control is enabled, go for the full experience
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType] = parameterData[0].entityType;
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId] = parameterData[0].id;
                        Activities.ApplyEmailTemplate.OpenEmailTemplateDialog(xrmPage, dialogParameters, dialogOptions, telemetryItem, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews_1, SkipSelectRecordDialog_1);
                    }
                    else if (unResolvedRecipientsCount == 1) {
                        // Normal scenario with 1 recepient where you don't need extra dialogs to pick
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType] = parameterData[0].entityType;
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId] = parameterData[0].id;
                        Activities.ApplyEmailTemplate.OpenEmailTemplateDialog(xrmPage, dialogParameters, dialogOptions, telemetryItem, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews_1, SkipSelectRecordDialog_1);
                    }
                    else {
                        // Default condition where you have multiple recepients and you need an extra
                        // dialog to let the user decide which one to pick
                        Xrm.Navigation.openDialog(Activities.Constants.DialogNames.SelectTemplateRecipient, dialogOptions, dialogParameters).then(function (response) {
                            dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType] =
                                response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType];
                            dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId] =
                                response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId];
                            dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                                response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                            Activities.ApplyEmailTemplate.closeRecipientTemplateCallback(xrmPage, dialogParameters, telemetryItem, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews_1, SkipSelectRecordDialog_1);
                        });
                    }
                });
            }
            else {
                // Legacy dialogs and controls
                if (unResolvedRecipientsCount == 0) {
                    // No recipients added to the email, throw an error dialog
                    var errorStrings = {
                        text: Activities.ClientApi.getResourceString("Web._cs.ApplyEmailTemplate.dlg_InvalidTargetRecipient"),
                        confirmButtonLabel: "Ok",
                    };
                    Xrm.Navigation.openAlertDialog(errorStrings);
                }
                else if (unResolvedRecipientsCount == 1) {
                    // Normal scenario with 1 recepient where you don't need extra dialogs to pick
                    dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType] = parameterData[0].entityType;
                    dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId] = parameterData[0].id;
                    Activities.ApplyEmailTemplate.OpenEmailTemplateDialog(xrmPage, dialogParameters, dialogOptions, telemetryItem, false, false, false);
                }
                else {
                    // Default condition where you have multiple recepients and you need an extra
                    Xrm.Navigation.openDialog(Activities.Constants.DialogNames.SelectTemplateRecipient, dialogOptions, dialogParameters).then(function (response) {
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType] =
                            response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType];
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId] =
                            response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId];
                        dialogParameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                            response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                        Activities.ApplyEmailTemplate.closeRecipientTemplateCallback(xrmPage, dialogParameters, telemetryItem, false, false, false);
                    });
                }
            }
        };
        EmailCommandsFIS.getSettingValue = function (settingName) {
            var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
            if (this.IsNullOrUndefined(attrs) ||
                this.IsNullOrUndefined(attrs[settingName]) ||
                attrs[settingName] == false ||
                attrs[settingName] == 0) {
                return false;
            }
            return true;
        };
        EmailCommandsFIS.IsNullOrUndefined = function (value) {
            return null == value || typeof value == "undefined";
        };
        /// <summary>
        /// This function calls Insert Signature MDD Dialog. .
        /// </summary>
        EmailCommandsFIS.insertSignature = function (form) {
            var from = form.getAttribute(Activities.Constants.ControlFrom);
            var fromValue = Activities.Common.Util.IsNullOrUndefined(from) ? null : from.getValue();
            if (!Activities.Common.Util.IsNull(fromValue) && fromValue.length > 0) {
                if (form.ui.getFormType() == 1 /* Create */ ||
                    form.ui.getFormType() == 2 /* Update */) {
                    var description_2 = form.getAttribute(Activities.Constants.ControlDescription);
                    if (!Activities.Common.Util.IsNullOrUndefined(description_2)) {
                        var telemetryItem_1 = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.Email, Activities.Constants.TelemetryConstant.EventInsertSignature);
                        var dialogOptions_1 = {
                            height: 400,
                            width: 400,
                            position: 1 /* center */,
                        };
                        var dialogParameters_1 = {};
                        if (Activities.Common.Util.enableDynamicTextForSignature()) {
                            dialogParameters_1[Activities.Constants.MetadataDrivenDialogConstants.ParamSenderId] = fromValue[0].id;
                            dialogParameters_1[Activities.Constants.MetadataDrivenDialogConstants.ParamSenderType] = fromValue[0].entityType;
                        }
                        if (fromValue[0].entityType != Activities.Constants.EntityNames.SystemUser) {
                            var optionsString = "?$select=_ownerid_value";
                            Xrm.WebApi.online.retrieveRecord(fromValue[0].entityType, fromValue[0].id, optionsString).then(function (response) {
                                if (!Activities.Common.Util.IsNullOrUndefined(response)) {
                                    telemetryItem_1.traceEventInformation("Signature is retrieved using the value of the owner.");
                                    var ownerId = response["_ownerid_value"];
                                    dialogParameters_1[Activities.Constants.MetadataDrivenDialogConstants.ParamOwnerId] = ownerId;
                                    telemetryItem_1.traceEventInformation("The owner has been successfully retrieved.");
                                    // Opening Insert Signature Dialog.
                                    Activities.InsertEmailSignature.OpenInsertSignatureDialog(form, description_2, dialogParameters_1, dialogOptions_1, telemetryItem_1);
                                }
                            }, function (error) {
                                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem_1);
                            });
                        }
                        else {
                            dialogParameters_1[Activities.Constants.MetadataDrivenDialogConstants.ParamOwnerId] = fromValue[0].id;
                            telemetryItem_1.traceEventInformation("Signature is retrieved using the value of the 'from' field.");
                            // Opening Insert Signature Dialog.
                            Activities.InsertEmailSignature.OpenInsertSignatureDialog(form, description_2, dialogParameters_1, dialogOptions_1, telemetryItem_1);
                        }
                    }
                }
            }
        };
        EmailCommandsFIS.isEntityValidForInsertTemplate = function (EntityInfo) {
            var nObjectType = EntityInfo[Activities.Constants.MetadataDrivenDialogConstants.EmailEntityType], InvalidEntity = nObjectType === "" ||
                nObjectType === "queue" ||
                nObjectType === "bulkoperation" ||
                nObjectType === "unresolvedaddress";
            return !InvalidEntity;
        };
        return EmailCommandsFIS;
    }());
    EmailCommandsFIS.handleNavigationFromFormCallback = function (newEmailId) {
        EmailCommandsFIS.handleNavigationFromForm(newEmailId);
    };
    Activities.EmailCommandsFIS = EmailCommandsFIS;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var LearnMoreDialog = (function () {
        function LearnMoreDialog() {
        }
        LearnMoreDialog.OnLoad = function (eventContext) {
            var form = eventContext.getFormContext();
            var DialogTitleControl = (form.getControl(Activities.Constants.MetadataDrivenDialogConstants.ControlTitle));
            var attributes = form.data.attributes;
            var titleText = attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamTitleText);
            if (titleText == null || Activities.Common.Util.IsNullOrEmptyString(titleText.getValue())) {
                DialogTitleControl.setLabel(Activities.ClientApi.getResourceString("LearnMoreDialog_Title"));
            }
            else {
                DialogTitleControl.setLabel(titleText.getValue());
            }
            //set learn more button label
            var LearnMoreButtonControl = form.getControl(Activities.Constants.MetadataDrivenDialogConstants.ControlLearnMoreButton);
            var learnMoreLabel = attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamLearnMoreButtonLabel);
            if (learnMoreLabel == null || Activities.Common.Util.IsNullOrEmptyString(learnMoreLabel.getValue())) {
                LearnMoreButtonControl.setLabel(Activities.ClientApi.getResourceString("LearnMoreDialog_Button_LearnMore"));
            }
            else {
                LearnMoreButtonControl.setLabel(learnMoreLabel.getValue());
            }
            //set continue button label
            var ContinueButtonControl = form.getControl(Activities.Constants.MetadataDrivenDialogConstants.ControlContinueButton);
            var continueLabel = attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamContinueButtonLabel);
            if (continueLabel == null || Activities.Common.Util.IsNullOrEmptyString(continueLabel.getValue())) {
                ContinueButtonControl.setLabel(Activities.ClientApi.getResourceString("LearnMoreDialog_Button_Continue"));
            }
            else {
                ContinueButtonControl.setLabel(continueLabel.getValue());
            }
            // set top text control
            var PrimaryTextControl = form.getControl(Activities.Constants.MetadataDrivenDialogConstants.ControlPrimaryText);
            var primaryText = attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamPrimaryText);
            if (primaryText == null || Activities.Common.Util.IsNullOrEmptyString(primaryText.getValue())) {
                PrimaryTextControl.setLabel(Activities.ClientApi.getResourceString("LearnMoreDialog_DefaultPrimaryText"));
            }
            else {
                PrimaryTextControl.setLabel(primaryText.getValue());
            }
        };
        LearnMoreDialog.OnContinueClick = function (eventContext) {
            var form = eventContext.getFormContext();
            var lastButtonClickedAttribute = form.data.attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
            lastButtonClickedAttribute.setValue(Activities.Constants.MetadataDrivenDialogConstants.ControlContinueButton);
            form.ui.close();
        };
        LearnMoreDialog.OnLearnMoreClick = function (eventContext) {
            var form = eventContext.getFormContext();
            var learnMoreLink = Activities.ActivityPageHandler.isSystemAdmin()
                ? "https://go.microsoft.com/fwlink/p/?linkid=2132292"
                : "https://go.microsoft.com/fwlink/p/?linkid=2132175";
            var lastButtonClicked = form.data.attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
            var urloptions = {
                isExternal: true,
            };
            Xrm.Navigation.openUrl(learnMoreLink, urloptions);
            lastButtonClicked.setValue(Activities.Constants.MetadataDrivenDialogConstants.ControlLearnMoreButton);
            form.ui.close();
        };
        return LearnMoreDialog;
    }());
    Activities.LearnMoreDialog = LearnMoreDialog;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var EmailEngagement = (function () {
        function EmailEngagement() {
        }
        EmailEngagement.formOnload = function (form, isUci, telemetryItem) {
            if (Activities.ClientApi.IsMocaOffline()) {
                EmailEngagement.hideEmailEngagementControls(form, Activities.Constants.ControlEmailEngagementActions, false);
                EmailEngagement.hideEmailEngagementControls(form, Activities.Constants.ControlEmailRecipientActivity, false);
                return;
            }
            var isEmailEngagementEnabled = EmailEngagement.isEmailEngagementEnabled(isUci);
            if (isUci) {
                var directionCode = form.data.entity.attributes.get("directioncode")
                    ? form.data.entity.attributes.get("directioncode").getValue()
                    : null;
                if (directionCode === null || directionCode === undefined) {
                    directionCode = true;
                }
                EmailEngagement.emailEngagementActionStatus =
                    Activities.Common.Util.isEmailEngagementActionsFCBEnabled(isUci) && directionCode;
                if (!EmailEngagement.emailEngagementActionStatus) {
                    EmailEngagement.hideEmailEngagementControls(form, Activities.Constants.ControlEmailEngagementActions, false);
                }
                if (directionCode && form.data.entity.getId() === "" && EmailEngagement.emailEngagementActionStatus) {
                    form.data.entity.attributes.get("isemailfollowed").setValue(true);
                    form.data.entity.attributes.get("followemailuserpreference").setValue(true);
                }
                //Hiding emailrecipientactivitycontrol, emailfollowed and emailremainderset footers when email is not followed and formtype is create
                var isEmailFollowed = form.data.entity.attributes.get("isemailfollowed") == null
                    ? false
                    : form.data.entity.attributes.get("isemailfollowed").getValue();
                var statusCode = form.data.entity.attributes.get("statuscode") == null
                    ? 1
                    : form.data.entity.attributes.get("statuscode").getValue();
                var showHideEmailEnagagementControl = isEmailEngagementEnabled &&
                    isEmailFollowed &&
                    form.ui.getFormType() != 1 &&
                    (statusCode == 2 || statusCode == 3 || statusCode == 4);
                // Hiding emailrecipientactivitycontrol,depend on emailfollowed ,statusCode and Email Engagment FCB .
                EmailEngagement.hideEmailEngagementControls(form, Activities.Constants.ControlEmailRecipientActivity, showHideEmailEnagagementControl);
                if (!isEmailEngagementEnabled) {
                    EmailEngagement.hideControl(form, Activities.Constants.FooterEmailFollowed);
                    EmailEngagement.hideControl(form, Activities.Constants.FooterEmailRemainderSet);
                }
                telemetryItem.report();
            }
            else {
                if (isEmailEngagementEnabled) {
                    // Adding the onLoad to attachments grid only when email engagement is enabled.
                    EmailEngagement.addOnLoadtoAttachmentsGrid(form);
                }
                else {
                    EmailEngagement.hideEmailEngagementControls(form, Activities.Constants.ControlEmailEngagementActions, false);
                    EmailEngagement.hideEmailEngagementControls(form, Activities.Constants.ControlEmailRecipientActivity, false);
                }
            }
        };
        /// Used to add an onload event to the attachments grid when Email engagement is enabled.
        /// This will be called only in Web client.
        EmailEngagement.addOnLoadtoAttachmentsGrid = function (form) {
            var attachmentsGrid = (form.ui.controls.get(Activities.Constants.ControlAttachmentsGrid));
            if (attachmentsGrid != null && form.getAttribute(Activities.Constants.ControlStatusCode).getValue() == 1) {
                attachmentsGrid.addOnLoad(function () {
                    EmailEngagement.attachmentsGridOnLoad(form.data.entity.getId());
                });
            }
            if (!EmailEngagement.isSaveHandlerAdded) {
                form.data.entity.addOnSave(EmailEngagement.formOnSave);
                EmailEngagement.isSaveHandlerAdded = true;
            }
        };
        EmailEngagement.hideControl = function (form, controlName) {
            var control = form.getControl(controlName);
            if (control != null) {
                control.setVisible(false);
            }
        };
        EmailEngagement.hideEmailEngagementControls = function (form, controlName, isVisible) {
            var control = form.getControl(controlName);
            if (control != null) {
                control.setVisible(isVisible);
                var parent_1 = control.getParent();
                if (parent_1 != null && parent_1.controls.getLength() == 1) {
                    parent_1.setVisible(isVisible);
                }
            }
        };
        EmailEngagement.isEmailEngagementEnabled = function (isUci) {
            return EmailEngagement.isEmailEngagementFCBEnabled(isUci) && Xrm.Utility.getGlobalContext().organizationSettings.attributes["isemailmonitoringallowed"];
        };
        EmailEngagement.isEmailEngagementFCBEnabled = function (isUci) {
            if (isUci) {
                return (Xrm.Internal.isFeatureEnabled(EmailEngagement.EmailEngagementFCB) ||
                    Xrm.Internal.isFeatureEnabled(EmailEngagement.FCB_EmailEngagement));
            }
            else {
                return Xrm.Internal.isFeatureEnabled(EmailEngagement.EmailEngagementFCB);
            }
        };
        EmailEngagement.attachmentsGridOnLoad = function (entityId) {
            if (EmailEngagement.saveAndCloseCalled) {
                EmailEngagement.saveAndCloseCalled = false;
                return;
            }
            if (parent == null || parent.document == null) {
                return;
            }
            var blockingMessageDiv = parent.document.querySelector(".ms-crm-Inline-Edit-email-body #trBlockMsg");
            if (blockingMessageDiv != null) {
                var cloudAttachmentsDiv_1 = parent.document.getElementById("cloud_attachments");
                //check if cloud_attachments div is already present. If not create one
                if (cloudAttachmentsDiv_1 == null) {
                    //create div
                    cloudAttachmentsDiv_1 = EmailEngagement.createCloudAttachmentsDiv(parent.document, blockingMessageDiv);
                }
                // TODO: any => XrmClientApi.WebApi.RetrieveMultipleResponse  once RetrieveMultipleResponse structure is updated
                EmailEngagement.getCloudAttachments(entityId).then(function (response) {
                    if (parent == null) {
                        return;
                    }
                    // TODO: Handle retrieve multiple response once entire repo starts using response.value
                    // Below check is to prevent BVT from failing. Bug: https://dynamicscrm.visualstudio.com/OneCRM/_workitems?id=510285&triage=false&_a=edit
                    if (!response || !response.entities) {
                        return;
                    }
                    var attachments = response.entities;
                    var currentRow = parent.document.createElement("tr");
                    var attachmentCell = parent.document.createElement("td");
                    var attachmentCellDiv = parent.document.createElement("div");
                    attachmentCellDiv.setAttribute("class", "ms-crm-cloudattachment-cell-div");
                    attachmentCellDiv.setAttribute("aria-label", Activities.ClientApi.getResourceString("Followed_Email_Attachments_Tooltip"));
                    attachmentCellDiv.setAttribute("title", Activities.ClientApi.getResourceString("Followed_Email_Attachments_Tooltip"));
                    attachmentCell.appendChild(attachmentCellDiv);
                    if (attachments.length == 0) {
                        cloudAttachmentsDiv_1.style.display = "none";
                    }
                    else {
                        var cloudAttachments = 0;
                        var attachment = null;
                        for (var _i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
                            attachment = attachments_1[_i];
                            if (attachment["isfollowed"] == "1") {
                                var cloudAttachmentDiv = parent.document.createElement("div");
                                cloudAttachmentDiv.setAttribute("class", "ms-crm-cloud-attachment");
                                var fileName = attachment["filename"];
                                if (Activities.Common.Util.IsNull(fileName)) {
                                    fileName = "";
                                }
                                if (fileName.length > 50) {
                                    fileName = fileName.substring(0, 47) + "...";
                                }
                                cloudAttachmentDiv.innerHTML = fileName;
                                attachmentCellDiv.appendChild(cloudAttachmentDiv);
                                cloudAttachments++;
                            }
                        }
                        currentRow.appendChild(attachmentCell);
                        cloudAttachmentsDiv_1.innerHTML = currentRow.innerHTML;
                        if (cloudAttachments > 0) {
                            cloudAttachmentsDiv_1.style.display = "block";
                        }
                        else {
                            cloudAttachmentsDiv_1.style.display = "none";
                        }
                    }
                    parent.document.getElementById("description_d").style.height =
                        parseInt(parent.document.getElementById("description_d").getAttribute("data-height")) +
                        parent.document.getElementById("cloud_attachments").offsetHeight +
                        "px";
                });
            }
        };
        EmailEngagement.createCloudAttachmentsDiv = function (emailBodyDocument, blockingMessageDiv) {
            var cloudAttachmentsDiv = emailBodyDocument.createElement("tr");
            var emailDescriptionTable = emailBodyDocument.querySelector(".ms-crm-Inline-Edit-email-body #description_i");
            emailDescriptionTable.childNodes[0].insertBefore(cloudAttachmentsDiv, blockingMessageDiv);
            cloudAttachmentsDiv.setAttribute("id", "cloud_attachments");
            var cloudAttachmentsTable = emailBodyDocument.createElement("table");
            cloudAttachmentsTable.setAttribute("class", "ms-crm-cloud_attachments");
            cloudAttachmentsDiv.insertBefore(cloudAttachmentsTable, cloudAttachmentsDiv.childNodes[0]);
            return cloudAttachmentsDiv;
        };
        EmailEngagement.getCloudAttachments = function (entityId) {
            var optionsString = "fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical'><entity name='activitymimeattachment'>" +
                "<attribute name='filename' /><attribute name='filesize' />" +
                "<attribute name='activitymimeattachmentid' /><attribute name='isfollowed' />" +
                "<attribute name='anonymouslink' />" +
                "<order attribute='filename' descending='false' />" +
                "<filter><condition attribute='objectid' operator = 'eq' value='" +
                entityId +
                "'></condition></filter>" +
                "</entity></fetch>";
            return Xrm.WebApi.online.retrieveMultipleRecords("activitymimeattachment", optionsString);
        };
        EmailEngagement.formOnSave = function (executionContext) {
            var saveEventArguments = (executionContext.getEventArgs());
            if (saveEventArguments.getSaveMode() == 2) {
                EmailEngagement.saveAndCloseCalled = true;
            }
        };
        return EmailEngagement;
    }());
    EmailEngagement.isSaveHandlerAdded = false;
    EmailEngagement.saveAndCloseCalled = false;
    EmailEngagement.emailEngagementActionStatus = false;
    EmailEngagement.EmailEngagementFCB = "FCB.EmailEngagement";
    EmailEngagement.FCB_EmailEngagement = "EmailEngagement";
    Activities.EmailEngagement = EmailEngagement;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var InsertSignatureDialog = (function () {
        function InsertSignatureDialog() {
        }
        InsertSignatureDialog.onLoad = function (eventContext) {
            var form = eventContext.getFormContext();
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.EmailSignature, Activities.Constants.TelemetryConstant.EventInsertEmailSignatureDialogOnLoad);
            var selectControl = form.getControl(Activities.Constants.MetadataDrivenDialogConstants.SelectControlName);
            var signatureControl = (form.getControl(Activities.Constants.MetadataDrivenDialogConstants.EmailSignatureControl));
            signatureControl.addPreSearch(InsertSignatureDialog.signaturePreSearchHandler);
            selectControl.setDisabled(true);
            telemetryItem.report();
        };
        InsertSignatureDialog.onSelect = function (eventContext) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.EmailSignature, Activities.Constants.TelemetryConstant.EventInsertSignature);
            var form = eventContext.getFormContext();
            var signatureControl = (form.getControl(Activities.Constants.MetadataDrivenDialogConstants.EmailSignatureControl));
            var signatureAttribute = signatureControl.getAttribute();
            var signatureAttributeValue = signatureAttribute.getValue()[0];
            var signatureId = signatureAttributeValue[Activities.Constants.MetadataDrivenDialogConstants.EmailEntityId];
            telemetryItem.traceEventInformation("The value of signatureId is: " + signatureId);
            var senderIdValue = null;
            var senderTypeValue = null;
            if (Activities.Common.Util.enableDynamicTextForSignature()) {
                var senderIdAttribute = form.getAttribute(Activities.Constants.MetadataDrivenDialogConstants.ParamSenderId);
                senderIdValue = senderIdAttribute.getValue();
                telemetryItem.traceEventInformation("The value of senderId is: " + senderIdValue);
                var senderTypeAttribute = form.getAttribute(Activities.Constants.MetadataDrivenDialogConstants.ParamSenderType);
                senderTypeValue = senderTypeAttribute.getValue();
                telemetryItem.traceEventInformation("The value of senderType is: " + senderTypeValue);
            }
            var req = new Activities.RetrieveEmailSignatureRequest(signatureId, senderIdValue, senderTypeValue);
            Xrm.WebApi.online.execute(req).then(function (response) {
                return response.json().then(function (jsonResponse) {
                    if (!Activities.Common.Util.IsNullOrEmptyString(jsonResponse)) {
                        telemetryItem.traceEventInformation("Successfully retrieved default signature using RetrieveEmailSignature SDK.");
                        if (!Activities.Common.Util.IsNullOrEmptyString(jsonResponse.SignatureText)) {
                            Activities.Common.ActivityHelper.setAttributeValue(eventContext, Activities.Constants.MetadataDrivenDialogConstants.ParamSignatureText, jsonResponse.SignatureText);
                            Activities.Common.ActivityHelper.setAttributeValue(eventContext, Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked, Activities.Constants.MetadataDrivenDialogConstants.SelectControlName);
                        }
                    }
                    telemetryItem.report();
                    form.ui.close();
                }, function (error) {
                    telemetryItem.traceEventError("Error while reading json response from RetrieveEmailSignatureRequest.", error.innerror.message);
                    telemetryItem.report();
                });
            }, function (error) {
                telemetryItem.traceEventError("Error in RetrieveEmailSignatureRequest.", error.innerror.message);
                telemetryItem.report();
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
            });
        };
        InsertSignatureDialog.onSignatureChange = function (eventContext) {
            var selectControl = eventContext
                .getFormContext()
                .getControl(Activities.Constants.MetadataDrivenDialogConstants.SelectControlName);
            var signatureControl = (eventContext
                .getFormContext()
                .getControl(Activities.Constants.MetadataDrivenDialogConstants.EmailSignatureControl));
            if (signatureControl != null &&
                signatureControl.getAttribute() != null &&
                signatureControl.getAttribute().getValue() != null) {
                selectControl.setDisabled(false);
            }
            else {
                selectControl.setDisabled(true);
            }
        };
        /// <summary>
        /// Function Handles Field Language Field changes on  Insert Signature Dialog , accordingly Lookup Data for Email Signature gets modified
        /// </summary>
        InsertSignatureDialog.onLanguageChange = function (eventContext) {
            var signatureControl = (eventContext
                .getFormContext()
                .getControl(Activities.Constants.MetadataDrivenDialogConstants.EmailSignatureControl));
            eventContext
                .getFormContext()
                .getControl(Activities.Constants.MetadataDrivenDialogConstants.LanguageId)
                .setFocus();
            signatureControl.removePreSearch(InsertSignatureDialog.signaturePreSearchHandler);
            signatureControl.addPreSearch(InsertSignatureDialog.signaturePreSearchHandler);
        };
        InsertSignatureDialog.signaturePreSearchHandler = function (eventContext) {
            var form = eventContext.getFormContext();
            var formAttributes = form.data.attributes;
            var languageOptionSet = formAttributes.get(Activities.Constants.MetadataDrivenDialogConstants.LanguageId);
            var languageOption = languageOptionSet.getValue() != null ? languageOptionSet.getValue().toString() : "";
            var signatureControl = (form.getControl(Activities.Constants.MetadataDrivenDialogConstants.EmailSignatureControl));
            var languageFilter = !Activities.Common.Util.IsNullOrEmptyString(languageOption) && languageOption !== "-1"
                ? "<filter type='and'><condition attribute='languagecode' operator='eq' value='" +
                languageOption +
                "'/></filter>"
                : "";
            //let ownerId = formAttributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamOwnerId).getValue();
            //let ownerFilter: string = "<filter type='and'><condition attribute='ownerid' operator='eq' value='" + ownerId + "'/></filter>";
            //let customFilter: string = "<filter type='and'>" + languageFilter + ownerFilter + "</filter>";
            // TODO: Need to add ownerid filter as well.
            var customFilter = "<filter type='and'>" + languageFilter + "</filter>";
            signatureControl.addCustomFilter(customFilter, Activities.Constants.MetadataDrivenDialogConstants.EmailSignatureEntityName);
        };
        return InsertSignatureDialog;
    }());
    Activities.InsertSignatureDialog = InsertSignatureDialog;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var InstantiateTemplateRequest = (function () {
        function InstantiateTemplateRequest(templateId, objectType, objectId) {
            this.TemplateId = templateId;
            this.ObjectType = objectType;
            this.ObjectId = objectId;
        }
        InstantiateTemplateRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    TemplateId: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                    ObjectType: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                    ObjectId: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                },
                operationName: "InstantiateTemplate",
                operationType: 0,
            };
            return metadata;
        };
        return InstantiateTemplateRequest;
    }());
    Activities.InstantiateTemplateRequest = InstantiateTemplateRequest;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    ///// <summary>
    ///// Create Send Email Request
    ///// </summary>
    var SendEmailRequest = (function () {
        function SendEmailRequest(entity, issueSend, trackingToken) {
            this.entity = null;
            this.IssueSend = false;
            this.TrackingToken = null;
            this.entity = entity;
            this.IssueSend = issueSend;
            this.TrackingToken = trackingToken;
        }
        SendEmailRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    entity: {
                        typeName: "Microsoft.Dynamics.CRM.email",
                        structuralProperty: 5,
                    },
                    IssueSend: {
                        typeName: "Edm.Boolean",
                        structuralProperty: 1,
                    },
                    TrackingToken: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                },
                operationName: "emails(" +
                    Activities.Common.Util.convertGuidToString(this.entity["activityid"]) +
                    ")/Microsoft.Dynamics.CRM.SendEmail",
                operationType: 0,
            };
            return metadata;
        };
        return SendEmailRequest;
    }());
    Activities.SendEmailRequest = SendEmailRequest;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var RetrieveEmailSignatureRequest = (function () {
        function RetrieveEmailSignatureRequest(signatureId, senderId, senderType) {
            if (senderId === void 0) { senderId = null; }
            if (senderType === void 0) { senderType = null; }
            this.SignatureId = signatureId;
            this.SenderId = senderId;
            this.SenderType = senderType;
        }
        RetrieveEmailSignatureRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    SignatureId: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                    SenderId: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                    SenderType: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                },
                operationName: "RetrieveEmailSignature",
                operationType: 0,
            };
            return metadata;
        };
        return RetrieveEmailSignatureRequest;
    }());
    Activities.RetrieveEmailSignatureRequest = RetrieveEmailSignatureRequest;
})(Activities || (Activities = {}));
/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="InstantiateTemplateRequest.ts" />
// This utility is convert the dynamic text preset in subject and description of email to static value based on entityId and entitytype.
// The get function will call the custom action Instantiatetemplate which will return the static values from the dynamic text.
var Activities;
(function (Activities) {
    var EmailTemplatePreviewCache = (function () {
        function EmailTemplatePreviewCache() {
            this._cache = new Map();
        }
        EmailTemplatePreviewCache.prototype.Get = function (templateId, objectId, objectType) {
            var _this = this;
            var request = {
                TemplateId: templateId,
                EntityId: objectId,
                EntityType: objectType,
            };
            return new Promise(function (resolve, reject) {
                var previewCache = _this._cache;
                var response = previewCache.get(JSON.stringify(request));
                if (response != null) {
                    resolve(response);
                }
                else {
                    if (objectId != null) {
                        _this._fetch(request).then(function (data) {
                            previewCache.set(JSON.stringify(request), data);
                            resolve(data);
                        }, function (error) {
                            reject(error);
                        });
                    }
                    else {
                        Xrm.WebApi.online.retrieveRecord("template", templateId).then(function (retrieveResponse) {
                            var data = {
                                Subject: retrieveResponse.subjectsafehtml,
                                Description: retrieveResponse.safehtml,
                                TemplateTitle: retrieveResponse.title,
                            };
                            previewCache.set(JSON.stringify(request), data);
                            resolve(data);
                        });
                    }
                }
            });
        };
        EmailTemplatePreviewCache.prototype._fetch = function (request) {
            var req = new Activities.InstantiateTemplateRequest(request.TemplateId, request.EntityType, request.EntityId);
            return new Promise(function (resolve, reject) {
                Xrm.WebApi.execute(req).then(function (response) {
                    return response.json().then(function (jsonResponse) {
                        if (jsonResponse != null && jsonResponse.value != null && jsonResponse.value.length == 1) {
                            resolve({
                                Subject: jsonResponse.value[0].subject,
                                Description: jsonResponse.value[0].description,
                                TemplateTitle: jsonResponse.value[0].title,
                            });
                        }
                        else {
                            reject("preview_not_available");
                        }
                    }, function (error) {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        };
        return EmailTemplatePreviewCache;
    }());
    Activities.EmailTemplatePreviewCache = EmailTemplatePreviewCache;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var ApplyEmailTemplate = (function () {
        function ApplyEmailTemplate() {
        }
        ApplyEmailTemplate.closeEmailTemplateCallback = function (xrmPage, dialogParams, telemetryItem) {
            if (dialogParams != null &&
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] ===
                Activities.Constants.MetadataDrivenDialogConstants.SelectControlName &&
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId] != null &&
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId] != undefined) {
                var subjectContent = dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject];
                var descriptiontContent = dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription];
                var templateId = dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId];
                ApplyEmailTemplate.updateEmailEntityPage(xrmPage, templateId, subjectContent, descriptiontContent, telemetryItem);
            }
            Xrm.Utility.closeProgressIndicator();
        };
        ApplyEmailTemplate.closeRecipientTemplateCallback = function (xrmPage, dialogParams, telemetryItem, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews, SkipSelectRecordDialog) {
            if (dialogParams != null &&
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] ===
                Activities.Constants.MetadataDrivenDialogConstants.SelectControlName) {
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType] =
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType];
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId] =
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId];
                ApplyEmailTemplate.OpenEmailTemplateDialog(xrmPage, dialogParams, null, telemetryItem, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews, SkipSelectRecordDialog);
            }
        };
        ApplyEmailTemplate.OpenEmailTemplateDialog = function (xrmPage, dialogParams, dialogOptions, telemetryItem, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews, SkipSelectRecordDialog) {
            var entityTypeInfo = dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityType];
            Xrm.Utility.getEntityMetadata(entityTypeInfo).then(function (entityMetaData) {
                var formData = JSON.parse(dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailFormData]);
                for (var index = 0; index < formData.length; index++) {
                    if (formData[index].id == dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEntityId]) {
                        formData[index].entityOtc = entityMetaData.ObjectTypeCode;
                        break;
                    }
                }
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailFormData] = JSON.stringify(formData);
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] = null;
                // This is a new power platform setting which is introduced in service repo from where we will be controlling the visibility of new insert template dialog at app leve.
                // PR: https://dev.azure.com/dynamicscrm/OneCRM/_git/CRM.Solutions.Service/pullrequest/670101?path=/solutions/Service/Solution/Dialogs/%7Be1adb62d-88f2-4126-9448-99355384a332%7D.xml
                var selectnewinserttemplatedialog = Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdynce_inserttemplatedialogsetting");
                if (selectnewinserttemplatedialog == null || selectnewinserttemplatedialog == undefined) {
                    ApplyEmailTemplate.oldDialogOfInsertEmailTemplate(xrmPage, dialogParams, dialogOptions, telemetryItem);
                }
                else if (selectnewinserttemplatedialog == false) {
                    ApplyEmailTemplate.oldDialogOfInsertEmailTemplate(xrmPage, dialogParams, dialogOptions, telemetryItem);
                }
                else {
                    var previewGalleryViewList_1 = new Array("tiles", "grid", "list");
                    var defaultView_1 = "list";
                    if (Xrm &&
                        Xrm.Internal &&
                        Xrm.Internal.isFeatureEnabled("EnhancedEmailTemplateDialog") &&
                        Xrm.Utility.getGlobalContext() != null &&
                        Xrm.Utility.getGlobalContext() != undefined) {
                        var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings;
                        var organization = {
                            id: orgSettings.organizationId,
                            entityType: "organization",
                        };
                        var query = "?$select=emailtemplatedefaultview";
                        Xrm.WebApi.retrieveRecord(organization.entityType, organization.id, query).then(function (response) {
                            if (response != null &&
                                response != undefined &&
                                response.emailtemplatedefaultview != null &&
                                response.emailtemplatedefaultview != undefined) {
                                defaultView_1 = previewGalleryViewList_1[response.emailtemplatedefaultview - 1];
                                telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.TemplateDefaultView + ": " + defaultView_1);
                                telemetryItem.report();
                                ApplyEmailTemplate.openNewEmailTemplateDialogFromEmailForm(dialogParams, xrmPage, telemetryItem, defaultView_1, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews, SkipSelectRecordDialog);
                            }
                        }, function () {
                            ApplyEmailTemplate.openNewEmailTemplateDialogFromEmailForm(dialogParams, xrmPage, telemetryItem, defaultView_1, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews, SkipSelectRecordDialog);
                        });
                    }
                    else {
                        ApplyEmailTemplate.oldDialogOfInsertEmailTemplate(xrmPage, dialogParams, dialogOptions, telemetryItem);
                    }
                }
            });
        };
        ApplyEmailTemplate.oldDialogOfInsertEmailTemplate = function (xrmPage, dialogParams, dialogOptions, telemetryItem) {
            if (xrmPage.data.entity) {
                var emailid = xrmPage.data.entity.getId();
                telemetryItem.traceEventCustom("oldTemplate", emailid);
            }
            var options = {
                height: 610,
                width: 720,
                position: 1 /* center */,
            };
            if (Activities.Common.Util.isEmailTemplatePreviewFeatureOn(xrmPage)) {
                Xrm.Navigation.openDialog(Activities.Constants.DialogNames.EmailTemplatePreview, options, dialogParams).then(function (response) {
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject];
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription];
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId];
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                    ApplyEmailTemplate.closeEmailTemplateCallback(xrmPage, dialogParams, telemetryItem);
                });
            }
            else {
                Xrm.Navigation.openDialog(Activities.Constants.DialogNames.ApplyEmailTemplate, dialogOptions, dialogParams).then(function (response) {
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject];
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription];
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId];
                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                    ApplyEmailTemplate.closeEmailTemplateCallback(xrmPage, dialogParams, telemetryItem);
                });
            }
        };
        // In this function we are rendering templategalleryhost control from where we are rendering preview gallery control dialog which is provided by marketing team.
        // This new dialog is available from insert template ribbon in email form and customer can use the old dialog by changing the "msdynce_inserttemplatedialogsetting" power platform setting to No at app level.
        ApplyEmailTemplate.openNewEmailTemplateDialogFromEmailForm = function (dialogParams, xrmPage, telemetryItem, defaultView, isPersistingFilterFeatureEnabled, EnableEmailTemplateViews, SkipSelectRecordDialog) {
            if (xrmPage.data.entity) {
                var emailid = xrmPage.data.entity.getId();
                telemetryItem.traceEventCustom("enhancedTemplate", emailid);
            }
            var parsedEmailFormData = JSON.parse(dialogParams.param_emailFormData);
            telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.PersistingFilterFeatureEnabled + ": " + isPersistingFilterFeatureEnabled);
            telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EnableEmailTemplateViews + ": " + EnableEmailTemplateViews);
            telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.SkipSelectRecordDialog + ": " + SkipSelectRecordDialog);
            if (isPersistingFilterFeatureEnabled && (EnableEmailTemplateViews || SkipSelectRecordDialog)) {
                var i = 0;
                var recordSelectorData_1 = [];
                var defaultSelectedRecordDetails_1 = {};
                var regardingObjectFieldData = [];
                var toFieldData = [];
                var ccFieldData = [];
                var uniqueEntitySetNames_1 = [];
                //This step is required to prepare data in this format.
                // [{regardingobjectid: [{}]}, {to: [{},{},{}]}, ]
                for (i = 0; i < parsedEmailFormData.length; i++) {
                    if (parsedEmailFormData[i].fieldname == "regardingobjectid") {
                        regardingObjectFieldData.push(parsedEmailFormData[i]);
                    }
                    else if (parsedEmailFormData[i].fieldname == "to") {
                        toFieldData.push(parsedEmailFormData[i]);
                    }
                    else if (parsedEmailFormData[i].fieldname == "cc") {
                        ccFieldData.push(parsedEmailFormData[i]);
                    }
                    if (uniqueEntitySetNames_1.indexOf(parsedEmailFormData[i].entityType) == -1) {
                        uniqueEntitySetNames_1.push(parsedEmailFormData[i].entityType);
                    }
                }
                if (regardingObjectFieldData.length > 0) {
                    var tempObject = {};
                    tempObject['regardingobjectid'] = regardingObjectFieldData;
                    recordSelectorData_1.push(tempObject);
                    if (!Object.keys(defaultSelectedRecordDetails_1).length) {
                        defaultSelectedRecordDetails_1 = regardingObjectFieldData[0];
                    }
                }
                if (toFieldData.length > 0) {
                    var tempObject = {};
                    tempObject['to'] = toFieldData;
                    recordSelectorData_1.push(tempObject);
                    if (!Object.keys(defaultSelectedRecordDetails_1).length) {
                        defaultSelectedRecordDetails_1 = toFieldData[0];
                    }
                }
                if (ccFieldData.length > 0) {
                    var tempObject = {};
                    tempObject['cc'] = ccFieldData;
                    recordSelectorData_1.push(tempObject);
                    if (!Object.keys(defaultSelectedRecordDetails_1).length) {
                        defaultSelectedRecordDetails_1 = ccFieldData[0];
                    }
                }
                Xrm.Utility.getEntityMetadata(defaultSelectedRecordDetails_1.entityType).then(function (entityMetaData) {
                    var dialogConfiguration = {
                        entityName: "template",
                        filterFormId: "ffb6b565-1401-4a05-b5ff-52d82293f685",
                        propertiesFormId: "7eece8d9-61bb-4e63-91bf-7be455907177",
                        viewId: "21b8d323-06c2-4cde-b756-95b86f0b3ea1",
                        defaultLanguageFilterAttribute: "languagecode",
                        isDataImportInProgress: null,
                        defaultView: defaultView,
                        config: JSON.stringify({
                            previewWidth: 600,
                            previewHeight: 350,
                            iFrameHeight: 331,
                            iFrameWidth: 530,
                            enableScrollableIframe: true,
                            viewOrderInsideViewSwitchButton: [1, 2, 0],
                            recordSelectorOptions: recordSelectorData_1,
                            EnableEmailTemplateViews: EnableEmailTemplateViews,
                            SkipSelectRecordDialog: SkipSelectRecordDialog
                        }),
                        titleColumn: "title",
                        labelColumn: "ispersonal",
                        htmlColumn: "safehtml",
                        permissionColumn: "ispersonal",
                        categoryColumn: "templatetypecode",
                        languageColumn: "languagecode",
                        entityOTC: entityMetaData.ObjectTypeCode,
                        selectedRecordInRecordSelector: JSON.stringify(defaultSelectedRecordDetails_1),
                        uniqueEntitySetNames: uniqueEntitySetNames_1
                    };
                    dialogParams["input_config"] = JSON.stringify(dialogConfiguration);
                    var _this = this;
                    var dialogWidth = 1005;
                    if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled("EnhancedEmailTemplateDialog")) {
                        dialogWidth = 1105;
                    }
                    Xrm.Navigation.openDialog(Activities.Constants.DialogNames.EnhancedEmailTemplateInsertDialogFromEmail, {
                        width: dialogWidth,
                        height: 800,
                    }, dialogParams).then(function (response) {
                        if (response.parameters.dialog_result) {
                            if (response.parameters.selected_item) {
                                Xrm.Utility.showProgressIndicator("");
                                var parseSelectedItem = JSON.parse(response.parameters.selected_item);
                                var templateId_1 = parseSelectedItem.Id;
                                var selectedRecordDetailsChangedInRecordSelector = JSON.parse(parseSelectedItem.selectedRecordDetailsChangedInRecordSelector);
                                telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.RecordFieldName + ": " + selectedRecordDetailsChangedInRecordSelector.fieldname);
                                telemetryItem.report();
                                dialogParams.param_entityId = selectedRecordDetailsChangedInRecordSelector.id;
                                dialogParams.param_entityType = selectedRecordDetailsChangedInRecordSelector.entityType;
                                var previewCache = new Activities.EmailTemplatePreviewCache();
                                previewCache.Get(templateId_1, dialogParams.param_entityId, dialogParams.param_entityType).then(function (customActionResponse) {
                                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject] =
                                        customActionResponse.Subject;
                                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription] =
                                        customActionResponse.Description;
                                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId] = templateId_1;
                                    dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                                        response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                                    ApplyEmailTemplate.closeEmailTemplateCallback(xrmPage, dialogParams, telemetryItem);
                                }, function () {
                                    Xrm.Utility.closeProgressIndicator();
                                });
                            }
                        }
                    });
                });
            }
            else {
                var entityOTC = 8;
                for (var i = 0; i < parsedEmailFormData.length; i++) {
                    if (parsedEmailFormData[i].id == dialogParams.param_entityId) {
                        entityOTC = parsedEmailFormData[i].entityOtc;
                        break;
                    }
                }
                var dialogConfiguration = {
                    entityName: "template",
                    filterFormId: "ffb6b565-1401-4a05-b5ff-52d82293f685",
                    propertiesFormId: "7eece8d9-61bb-4e63-91bf-7be455907177",
                    viewId: "21b8d323-06c2-4cde-b756-95b86f0b3ea1",
                    defaultLanguageFilterAttribute: "languagecode",
                    isDataImportInProgress: null,
                    defaultView: defaultView,
                    config: JSON.stringify({
                        previewWidth: 600,
                        previewHeight: 350,
                        iFrameHeight: 331,
                        iFrameWidth: 530,
                        enableScrollableIframe: true,
                        viewOrderInsideViewSwitchButton: [1, 2, 0],
                    }),
                    titleColumn: "title",
                    labelColumn: "ispersonal",
                    htmlColumn: "safehtml",
                    permissionColumn: "ispersonal",
                    categoryColumn: "templatetypecode",
                    languageColumn: "languagecode",
                    entityOTC: entityOTC,
                };
                dialogParams["input_config"] = JSON.stringify(dialogConfiguration);
                var _this = this;
                var dialogWidth = 1005;
                if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled("EnhancedEmailTemplateDialog")) {
                    dialogWidth = 1105;
                }
                Xrm.Navigation.openDialog(Activities.Constants.DialogNames.EmailTemplateInsertDialogFromEmail, {
                    width: dialogWidth,
                    height: 800,
                }, dialogParams).then(function (response) {
                    if (response.parameters.dialog_result) {
                        if (response.parameters.selected_item) {
                            Xrm.Utility.showProgressIndicator("");
                            var parseSelectedItem = JSON.parse(response.parameters.selected_item);
                            var templateId_2 = parseSelectedItem.Id;
                            var previewCache = new Activities.EmailTemplatePreviewCache();
                            previewCache.Get(templateId_2, dialogParams.param_entityId, dialogParams.param_entityType).then(function (customActionResponse) {
                                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailSubject] =
                                    customActionResponse.Subject;
                                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamEmailDescription] =
                                    customActionResponse.Description;
                                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamTemplateId] = templateId_2;
                                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                                    response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                                ApplyEmailTemplate.closeEmailTemplateCallback(xrmPage, dialogParams, telemetryItem);
                            }, function () {
                                Xrm.Utility.closeProgressIndicator();
                            });
                        }
                    }
                });
            }
            telemetryItem.report();
        };
        ApplyEmailTemplate.SetDefaultTemplateOnLoad = function (formContext, telemetryItem) {
            if (formContext.ui.getFormType() == 1 /* Create */) {
                var regarding = formContext.getAttribute("regardingobjectid");
                var template = formContext.getAttribute("templateid");
                var templateId = null;
                var regardingObjectId = null;
                var regardingObjectType = null;
                if (regarding) {
                    var regardingObject = regarding.getValue() ? regarding.getValue()[0] : null;
                    regardingObjectId = regardingObject ? regardingObject.id : null;
                    regardingObjectType = regardingObject ? regardingObject.entityType : null;
                }
                if (template) {
                    var templateObject = template.getValue() ? template.getValue()[0] : null;
                    templateId = templateObject ? templateObject.id : null;
                    telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterTemplateId + ": " + templateId);
                }
                if (templateId && regardingObjectId && regardingObjectType) {
                    var req = new Activities.InstantiateTemplateRequest(templateId, regardingObjectType, regardingObjectId);
                    Xrm.WebApi.online.execute(req).then(function (response) {
                        response.json().then(function (jsonResponse) {
                            if (jsonResponse.value.length == 1) {
                                var subjectAttribute = formContext.getAttribute("subject");
                                if (subjectAttribute) {
                                    subjectAttribute.setValue(jsonResponse.value[0].subject);
                                    subjectAttribute.fireOnChange();
                                }
                                var descriptionAttribute = formContext.getAttribute("description");
                                if (descriptionAttribute) {
                                    if (descriptionAttribute.getValue()) {
                                        var description = jsonResponse.value[0].description + descriptionAttribute.getValue(); // to support default email signature
                                        descriptionAttribute.setValue(description);
                                    }
                                    else {
                                        descriptionAttribute.setValue(jsonResponse.value[0].description);
                                    }
                                }
                                telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterTemplateInserted + ": true");
                                telemetryItem.report();
                            }
                        }, function (error) {
                            telemetryItem.traceEventError("Error in getting default template " + error.message, error);
                            telemetryItem.report();
                        });
                    }, function (error) {
                        telemetryItem.traceEventError("Error in getting default template " + error.message, error);
                        telemetryItem.report();
                    });
                }
                else {
                    telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterTemplateInserted + ": false");
                    telemetryItem.report();
                }
            }
        };
        ApplyEmailTemplate.updateEmailEntityPage = function (xrmPage, templateId, subject, description, telemetryItem) {
            var emailRecordId = xrmPage.data.entity.getId();
            var emailEntityName = xrmPage.data.entity.getEntityName();
            var fetchXml = "?$filter=objectid_template/templateid eq " +
                Activities.Common.Util.convertGuidToString(templateId) +
                " and objecttypecode eq 'template'";
            Xrm.WebApi.retrieveMultipleRecords("activitymimeattachment", fetchXml).then(function (response) {
                if (!response || !response.entities) {
                    return;
                }
                telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterTemplateId + ": " + templateId);
                if (response.entities.length > 0) {
                    if (!ApplyEmailTemplate.isNewEmail(emailRecordId)) {
                        for (var attachementnumber = 0; attachementnumber < response.entities.length; attachementnumber++) {
                            var record = response.entities[attachementnumber];
                            var updateAttachementEntity = {
                                activitysubject: subject,
                                body: record["body"],
                                filename: record["filename"],
                                objecttypecode: "email",
                                mimetype: record["mimetype"],
                                "objectid_email@odata.bind": "emails(" + Activities.Common.Util.convertGuidToString(emailRecordId) + ")",
                            };
                            Xrm.WebApi.createRecord(Activities.Constants.EntityNames.ActivityMimeAttachment, updateAttachementEntity).then(function (lookupValue) {
                                var control = xrmPage.getControl(Activities.Constants.MetadataDrivenDialogConstants.AttachementSubGridControl);
                                control.refresh();
                            }),
                                function (error) {
                                    Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
                                };
                        }
                        telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterAttachmentCount + ": " + response.entities.length);
                        ApplyEmailTemplate.updateBodyAndSubject(xrmPage, subject, description, templateId, telemetryItem);
                    }
                    else {
                        ApplyEmailTemplate.showAttachementConfirmDialog(xrmPage, subject, description, templateId, telemetryItem);
                    }
                }
                else {
                    telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterAttachmentCount + ": , 0");
                    ApplyEmailTemplate.updateBodyAndSubject(xrmPage, subject, description, templateId, telemetryItem);
                }
            }, function (error) {
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
            });
        };
        ApplyEmailTemplate.isNewEmail = function (emailRecordId) {
            return !(emailRecordId &&
                emailRecordId !== Activities.Constants.EmptyGuid &&
                emailRecordId !== Activities.Constants.EmptyGuidFormatted);
        };
        ApplyEmailTemplate.updateBodyAndSubject = function (xrmPage, subject, description, templateId, telemetryItem) {
            var currentSubject = xrmPage.data.entity.attributes.get("subject").getValue();
            if (currentSubject && currentSubject !== "") {
                ApplyEmailTemplate.showSubjectConfirmDialog(xrmPage, subject, description, templateId, telemetryItem);
            }
            else {
                ApplyEmailTemplate.updateEmailRecord(xrmPage, true, subject, description, templateId, telemetryItem);
            }
        };
        ApplyEmailTemplate.updateEmailRecord = function (xrmPage, confirmSubjectReplacement, subject, description, templateId, telemetryItem) {
            var descriptionAttribute = xrmPage.data.entity.attributes.get("description");
            if (descriptionAttribute) {
                if (descriptionAttribute.getValue())
                    description = Activities.EmailCommandsFIS.insertAtCursorPosition(xrmPage, descriptionAttribute.getValue(), description);
                if (Activities.Common.Util.addDirection()) {
                    description = "<div style=\"direction:" + Activities.Common.Util.getDirection() + "\">" + description + "</div>";
                }
                descriptionAttribute.setValue(description);
            }
            if (confirmSubjectReplacement) {
                var subjectAttribute = xrmPage.data.entity.attributes.get("subject");
                if (subjectAttribute) {
                    subjectAttribute.setValue(subject);
                    subjectAttribute.fireOnChange();
                }
            }
            var templateIdAttribute = xrmPage.data.entity.attributes.get("templateid");
            if (templateIdAttribute) {
                var templateIdLookupReference = [];
                var templateIdLookupValue = {
                    id: templateId,
                    entityType: Activities.Constants.MetadataDrivenDialogConstants.TemplateEntityName,
                    name: Activities.Constants.MetadataDrivenDialogConstants.DefaultLookupName,
                };
                templateIdLookupReference.push(templateIdLookupValue);
                templateIdAttribute.setValue(templateIdLookupReference);
            }
            else {
                telemetryItem.traceEventWarning("Templateid attribute doesn't exist on the form. Cannot setValue for null attribute");
            }
            telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterTemplateInserted + ": true");
            telemetryItem.report();
        };
        ApplyEmailTemplate.showSubjectConfirmDialog = function (xrmPage, subject, description, templateId, telemetryItem) {
            var options = {
                height: 250,
                width: 400,
                position: Activities.ClientApi.getWindowCenter(),
            };
            var confirmDialogStrings = ApplyEmailTemplate.prepareConfirmDialogStrings(Activities.Constants.DialogNames.ApplyEmailTemplate);
            Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(function (response) {
                ApplyEmailTemplate.updateEmailRecord(xrmPage, !!response.confirmed, subject, description, templateId, telemetryItem);
            });
        };
        ApplyEmailTemplate.showAttachementConfirmDialog = function (xrmPage, subject, description, templateId, telemetryItem) {
            var options = {
                height: 330,
                width: 400,
                position: Activities.ClientApi.getWindowCenter(),
            };
            var confirmDialogStrings = ApplyEmailTemplate.prepareConfirmDialogStrings(Activities.Constants.DialogNames.UpdateAttachment);
            Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(function (response) {
                if (response.confirmed == true) {
                    telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterAttachmentCount + ": 0");
                    ApplyEmailTemplate.updateBodyAndSubject(xrmPage, subject, description, templateId, telemetryItem);
                }
                else {
                    telemetryItem.traceEventInformation(Activities.Constants.TelemetryConstant.EventParameterTemplateInserted + ": false");
                    telemetryItem.report();
                }
                // No action if user clicks on cancel. User is expected to save the form and then launch the insert template again.
            });
        };
        ApplyEmailTemplate.prepareConfirmDialogStrings = function (dialogName) {
            var confirmDialogStrings = {
                title: "",
                subtitle: "",
                text: "",
                confirmButtonLabel: "",
                cancelButtonLabel: "",
            };
            switch (dialogName) {
                case Activities.Constants.DialogNames.ApplyEmailTemplate:
                    confirmDialogStrings.text = Activities.ClientApi.getResourceString("Web._cs.ApplyEmailTemplate.dlg_ConfirmResolveText");
                    break;
                case Activities.Constants.DialogNames.UpdateAttachment:
                    confirmDialogStrings.text = Activities.ClientApi.getResourceString("AddTemplateWithoutAttachment");
                    break;
            }
            confirmDialogStrings.confirmButtonLabel = Activities.ClientApi.getResourceString("Button_Label_OK");
            confirmDialogStrings.cancelButtonLabel = Activities.ClientApi.getResourceString("Button_Label_Cancel");
            confirmDialogStrings.title = Activities.ClientApi.getResourceString("Web._cs.ApplyEmailTemplate.dlg_ConfirmResolveTitle");
            return confirmDialogStrings;
        };
        return ApplyEmailTemplate;
    }());
    Activities.ApplyEmailTemplate = ApplyEmailTemplate;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var InsertEmailSignature = (function () {
        function InsertEmailSignature() {
        }
        InsertEmailSignature.closeInsertSignatureCallback = function (formContext, description, dialogParams, telemetryItem) {
            if (dialogParams != null &&
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] ===
                Activities.Constants.MetadataDrivenDialogConstants.SelectControlName) {
                var signatureText = dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamSignatureText];
                Activities.ActivityPageHandler.insertSignature(formContext, Xrm.Encoding.htmlDecode(signatureText), description, true);
                if (formContext.data.entity) {
                    var emailid = formContext.data.entity.getId();
                    telemetryItem.traceEventCustom("signature", emailid);
                }
                telemetryItem.traceEventInformation("Signature has been successfully selected.");
            }
            else {
                telemetryItem.traceEventInformation("No signature has been selected.");
            }
            telemetryItem.report();
        };
        InsertEmailSignature.OpenInsertSignatureDialog = function (formContext, description, dialogParams, dialogOptions, telemetryItem) {
            Xrm.Navigation.openDialog(Activities.Constants.DialogNames.InsertSignature, dialogOptions, dialogParams).then(function (response) {
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamSignatureText] =
                    response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamSignatureText];
                dialogParams[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] =
                    response.parameters[Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked];
                InsertEmailSignature.closeInsertSignatureCallback(formContext, description, dialogParams, telemetryItem);
            }, function (error) {
                telemetryItem.traceEventError("Error in OpenInsertSignatureDialog.", error.innerror.message);
                Activities.ClientApi.dialogActionFailedCallback(error, telemetryItem);
            });
        };
        return InsertEmailSignature;
    }());
    Activities.InsertEmailSignature = InsertEmailSignature;
})(Activities || (Activities = {}));
// -----------------------------------------------------------------------
// <copyright file="Email.cs" company="Microsoft">
//		Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// <owner>ActivitiesFTE</owner>
// -----------------------------------------------------------------------
var AssociatedGrid;
(function (AssociatedGrid) {
    var RibbonButtonEnableRule = (function () {
        function RibbonButtonEnableRule() {
        }
        RibbonButtonEnableRule.ActivityTypeFilterOrgSettingEnabled = function () {
            var isOctober2022UpdateEnabled = Xrm.Internal.isFeatureEnabled("October2022Update") === true;
            var isActivityTypeFilterEnabled = isOctober2022UpdateEnabled &&
                Xrm.Utility.getGlobalContext().organizationSettings.attributes.activitytypefilterv2 !== undefined
                ? Xrm.Utility.getGlobalContext().organizationSettings.attributes.activitytypefilterv2 === 1
                : Xrm.Utility.getGlobalContext().organizationSettings.attributes.activitytypefilter === 1;
            return !Activities.ClientApi.IsOffline() && isActivityTypeFilterEnabled;
        };
        RibbonButtonEnableRule.ActivityTypeFilterOrgSettingDisabled = function () {
            // activitytypefilter will not be available during offline scenario, it will be undefined in that case
            // During the offline or other scenario when activitytypefilter is not available , we will always use the old ActivityRibbonButton without filtering
            var isOctober2022UpdateEnabled = Xrm.Internal.isFeatureEnabled("October2022Update") === true;
            var activitytypefilter = Xrm.Utility.getGlobalContext().organizationSettings.attributes
                .activitytypefilter;
            var activitytypefilterv2 = Xrm.Utility.getGlobalContext().organizationSettings.attributes
                .activitytypefilterv2;
            // Check whether both org settings are unavailable
            var isOrgSettingsUnavailable = activitytypefilter === undefined && activitytypefilterv2 === undefined;
            var isActivityTypeFilterDisabled = isOctober2022UpdateEnabled && activitytypefilterv2 !== undefined
                ? activitytypefilterv2 !== 1
                : activitytypefilter !== 1;
            return (Activities.ClientApi.IsOffline() || isOrgSettingsUnavailable || isActivityTypeFilterDisabled || Xrm.Internal.isFeatureEnabled("NewActivityRibbonButton") === false);
        };
        return RibbonButtonEnableRule;
    }());
    AssociatedGrid.RibbonButtonEnableRule = RibbonButtonEnableRule;
})(AssociatedGrid || (AssociatedGrid = {}));
var Activities;
(function (Activities) {
    var InsertTemplateFieldOptions;
    (function (InsertTemplateFieldOptions) {
        InsertTemplateFieldOptions[InsertTemplateFieldOptions["ToField"] = 0] = "ToField";
        InsertTemplateFieldOptions[InsertTemplateFieldOptions["CcField"] = 1] = "CcField";
        InsertTemplateFieldOptions[InsertTemplateFieldOptions["Regarding"] = 2] = "Regarding";
        InsertTemplateFieldOptions[InsertTemplateFieldOptions["None"] = 3] = "None";
    })(InsertTemplateFieldOptions = Activities.InsertTemplateFieldOptions || (Activities.InsertTemplateFieldOptions = {}));
    var TemplateUtil = (function () {
        function TemplateUtil() {
        }
        TemplateUtil.setAttributeValue = function (eventContext, attributeId, value) {
            var attribute = eventContext.getFormContext().data.attributes.get(attributeId);
            if (attribute != null) {
                attribute.setValue(value);
            }
        };
        ;
        TemplateUtil.closeDialog = function (eventContext) {
            var lastButtonClicked = eventContext.getFormContext().data.attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
            if (lastButtonClicked != null) {
                lastButtonClicked.setValue(Activities.Constants.MetadataDrivenDialogConstants.DialogCancelId);
            }
            eventContext.getFormContext().ui.close();
        };
        ;
        return TemplateUtil;
    }());
    Activities.TemplateUtil = TemplateUtil;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var Util = Activities.Common.Util;
    var Constants = Activities.Constants;
    /// <summary>
    /// Opens simple lookup control to resolve email address.
    /// </summary>
    /// <param name="executionContext">XrmClientApi.EventContext</param>
    /// <returns> void </returns>
    function openLookupDialogToResolveUnknownEmails(executionContext) {
        var entityName = executionContext.getFormContext().data.entity.getEntityName();
        var telemetryItem = new TelemetryLogger.TelemetryItem(entityName, Constants.TelemetryConstant.EventUnresolveEmailAddressLookupDialogOnload);
        var form = executionContext.getFormContext();
        var entityId = form.data.entity.getId();
        var eventArgs = executionContext.getEventArgs();
        var eventPayload = eventArgs ? eventArgs.getTagValue() : null;
        if (Util.IsNullOrUndefined(eventPayload)) {
            telemetryItem.traceEventError("No data found in event arguments for record " + entityId);
            telemetryItem.report();
            return;
        }
        var control = form.getControl(eventPayload.fieldName);
        var selectedActivityParty = {
            id: eventPayload.id,
            entityType: eventPayload.entityType,
            name: eventPayload.name,
        };
        if (selectedActivityParty.entityType !== Constants.MetadataDrivenDialogConstants.UnresolvedAddress) {
            return;
        }
        if (Util.IsNullOrUndefined(control)) {
            telemetryItem.traceEventError("Null/Undefined source Lookup Control passed");
            telemetryItem.report();
            return;
        }
        telemetryItem.traceEventInformation("Resolve unknown emails handler invoked for record " + entityId);
        //preventing the default action.
        executionContext.getEventArgs().preventDefault();
        //Get the look up options.
        var lookUpOptions = getLookUpOptions(control);
        //This populates the text field with the unknown email and triggers a search
        lookUpOptions["searchText"] = selectedActivityParty.name;
        var lookUpPromise = Xrm.Utility.lookupObjects(lookUpOptions);
        lookUpPromise
            .then(function (data) {
                handleLookupResponse(data, telemetryItem, selectedActivityParty, control, executionContext);
                telemetryItem.report();
            })
            .catch(function (exception) {
                telemetryItem.traceEventError("Encountered the following exception", exception);
                telemetryItem.report();
            });
    }
    Activities.openLookupDialogToResolveUnknownEmails = openLookupDialogToResolveUnknownEmails;
    /// <summary>
    /// Gets the lookup options parameters to be passed
    /// </summary>
    /// <param name="executionContext">XrmClientApi.EventContext</param>
    /// <returns> void </returns>
    function getLookUpOptions(controlAttribute) {
        //["queue", "systemuser", "unresolvedaddress"]: FROM
        //["account", "contact", "entitlement", "knowledgearticle", "queue", "systemuser", "unresolvedaddress"]; TO,CC,BCC,REQUIRED, OPTIONAL
        var activityParties = controlAttribute.getEntityTypes();
        var defaultEntityforLookup = controlAttribute.getName() === Constants.MetadataDrivenDialogConstants.From
            ? Constants.EntityNames.SystemUser
            : Constants.EntityNames.Contact;
        var isDefaultEntitypresent = activityParties.find(function (value) {
            return value === defaultEntityforLookup;
        });
        var activityPartiesNotIncluded = ["knowledgearticle", "unresolvedaddress"];
        activityParties = activityParties.filter(function (activityParty) { return activityPartiesNotIncluded.filter(function (item) { return item === activityParty; }).length == 0; });
        var lookUpOptions = {
            entityTypes: activityParties,
            defaultEntityType: Util.IsNullOrUndefined(isDefaultEntitypresent) ? activityParties[0] : isDefaultEntitypresent,
        };
        return lookUpOptions;
    }
    /// <summary>
    /// Handles the response returned by lookup dialog.
    /// </summary>
    /// <param name="executionContext">XrmClientApi.EventContext</param>
    /// <returns> void </returns>
    function handleLookupResponse(data, telemetryItem, unknownEmailRecord, control, executionContext) {
        telemetryItem.traceEventInformation("Unresolved email look up dialog closed by user.");
        if (data == null || data.length == 0) {
            telemetryItem.traceEventInformation("User selected no record. Returning.");
            return;
        }
        else if (data.length > 1) {
            telemetryItem.traceEventError("Expecting just one lookup value as a resolution. Got " + data.length + " values");
            return;
        }
        if (data[0].entityType === Activities.Constants.MetadataDrivenDialogConstants.UnresolvedAddress) {
            telemetryItem.traceEventError("The lookup value is an unresolved email.");
            return;
        }
        var resolveAllSimilarEmails = Activities.Common.Util.resolveSimilarUnresolvedAddresses();
        telemetryItem.traceEventInformation("resolveSimilarUnresolvedAddresses value : " + resolveAllSimilarEmails);
        //resolving emails for the current lookup
        resolveEmailsAndSetLookupValue(control, unknownEmailRecord, data[0], resolveAllSimilarEmails, telemetryItem);
        //resolving emails for the other lookups if the setting is true.
        if (resolveAllSimilarEmails) {
            var controls = getAllLookupControls(executionContext.getFormContext()).filter(function (value) {
                return value.getName() !== control.getName();
            }); //Check from lookup.
            controls.forEach(function (item) {
                resolveEmailsAndSetLookupValue(item, unknownEmailRecord, data[0], resolveAllSimilarEmails, telemetryItem);
            });
        }
        control.setFocus();
    }
    function getAllLookupControls(form) {
        var controls = form.ui.controls.get().filter(function (value) {
            if (value.getAttrDescriptor && value.getAttrDescriptor().Type) {
                return value.getAttrDescriptor().Type === "partylist";
            }
        });
        return controls;
    }
    Activities.getAllLookupControls = getAllLookupControls;
    function resolveEmailsAndSetLookupValue(control, unknownEmailRecord, resolvedRecord, resolveAllSimilarEmails, telemetryItem) {
        var currentLookUpValue = control.getAttribute().getValue();
        if (!currentLookUpValue || currentLookUpValue.length == 0) {
            telemetryItem.traceEventInformation("The lookup " + control.getName() + " has no value.");
            return;
        }
        var updateFlag = false;
        var count = 0;
        for (var i = 0; i < currentLookUpValue.length; i++) {
            if (currentLookUpValue[i].name.toLocaleUpperCase() === unknownEmailRecord.name.toLocaleUpperCase()) {
                updateFlag = true;
                count++;
                currentLookUpValue[i].name = resolvedRecord.name;
                currentLookUpValue[i].id = resolvedRecord.id;
                currentLookUpValue[i].entityType = resolvedRecord.entityType;
                //if resolve similar emails is true: it resolves all identical unknown records across all emails.
                //if it is false, it doesnt even touch other identical records in the same email.
                if (!resolveAllSimilarEmails) {
                    break;
                }
            }
        }
        if (updateFlag) {
            try {
                telemetryItem.traceEventInformation("Trying to set Value for Lookup: " + control.getName() + ", " + resolvedRecord.id + ", Count of unresolved Emails: " + count + ".");
                control.getAttribute().setValue(currentLookUpValue);
            }
            catch (exception) {
                telemetryItem.traceEventError("Encountered the following exception when trying to set " + control.getName() + " value.", exception.message);
            }
        }
    }
})(Activities || (Activities = {}));
//# sourceMappingURL=Email.js.map