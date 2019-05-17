// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/* For the possible phone states, "renderWidget" is the toast-area div and "renderSidePanel" is
 * the side-bar area div that should be made visible */
var PhoneState = Object.freeze({
    Idle: { renderWidget: ".idlePhone", renderSidePanel: ".idlePhoneSidebar"},
    Ongoing: { renderWidget: ".ongoingCall", renderSidePanel: ".ongoingCallSidebar"},
    Incoming: { renderWidget: ".incomingCall", renderSidePanel: ".ongoingCallSidebar"},
    Dialing: { renderWidget: ".outgoingCall", renderSidePanel: ".ongoingCallSidebar"},
    CallAccepted: { renderWidget: ".incomingCall", renderSidePanel: ".ongoingCallSidebar" },
    CallSummary: { renderWidget: ".callSummary", renderSidePanel: ".idlePhoneSidebar" }
});

var CallDirection = Object.freeze({
    None: 0,
    Incoming: 1,
    Outgoing: 2
});

var DisplayMode = Object.freeze({
    Minimized: 0,   //XrmClientApi.Constants.PanelState.Collapsed
    Docked: 1       //XrmClientApi.Constants.PanelState.Expanded
});

/* In expanded mode, the toast area will be set to this width.
 * This is set at runtime based on available screen width. See site.css:root */
var expandedWidgetWidth = "271fr";

/* Whether Minimized or Docked */
var _CurrentPanelMode = null;

/* A timer for counting the duration of current call in the current state */
class Timer {
    /* timerElemjQuery - Will update the value of all DOM elements returned by this jquery to current timer value
     * startElemJQuery - Will update the value of all DOM elements returned by this jquery to timer start time
     * refreshInterval - the timer periodicity */
    constructor(timerElemJQuery, startElemJQuery, refreshInterval) {
        this._start = null;
        this._timerElemjQuery = timerElemJQuery;
        this.refreshInterval = refreshInterval;
        this._handle = null;
        this._startElemjQuery = startElemJQuery;
        this._duration = 0;
    }
    get refreshInterval() {
        return this._refreshInterval;
    }
    set refreshInterval(value) {
        this._refreshInterval = value;
    }
    /* Stop the timer with value frozen at current instance */
    stop() {
        if (this._handle) {
            window.clearInterval(this._handle);
            this._handle = null;
        }
    }
    /* Stop the timer and reset it to zero */
    reset() {
        this.stop();
        $(this._timerElemjQuery).text("00");
        this._start = null;
        this._duration = 0;
    }
    get startTime() {
        return this._start;
    }
    get duration() {
        return this._duration;
    }
    start() {
        if (this._start) {
            this.stop();
        }
        this._start = new Date();
        $(this._startElemjQuery).text(this._start.toLocaleTimeString());
        this._handle = window.setInterval(function () {
            var now = new Date().getTime();
            var secs = (now - this._start.getTime()) / 1000;
            this._duration = secs;
            var hrs = Math.floor(secs / 3600);
            secs = secs % 3600;
            var mins = Math.floor(secs / 60);
            secs = Math.floor(secs % 60);
            var timeStr = hrs + ":" + mins + ":" + secs;
            $(this._timerElemjQuery).text(timeStr);
        }.bind(this), this.refreshInterval);
    }
    
};

/* Manages a single phone call session */
class Phone {
    /* initialMode - whether to start in Docked or Minimized mode */
    constructor(initialMode) {
        this._name = null;          //Current caller name by searching all contact records based on phone number
        this._contactid = null;     //CRM record ID of contact record for current phone number
        this._number = null;        //Current phone number
        this._timer = new Timer(".timer", ".timeStart", 1000);
        this.state = PhoneState.Idle;
        this.conn = null;           //Current Twilio connection
        this.mode = initialMode;
        this._activityId = null;    //Activity record created for current phone session
        this._direction = CallDirection.None;   //Incoming or Outgoing
        this._environ = null;
        this._caseId = null;        //Any Case/Incident record created for current phone session

        /* Invoke the CIF API to get current username, appid, language code etc */
        Microsoft.CIFramework.getEnvironment().then(function (res) {
            this._environ = JSON.parse(res);
        }.bind(this));
    }

    /* Display the current caller's name and initials. if the name is not available, display the phone number */
    renderCallerName() {
        var fn = this.name;
        if (!this.name) {
            fn = "Unknown(" + this._number + ")";
        }
        $(".callerName").text(fn);
        var sp = fn.split(" ");
        $(".callerInit").text(sp[0][0]+(sp[1]?sp[1][0]:sp[0][1]));
    }

    /* For an ongoing call, search and open contact record for the calling phone number */
    updateCRMPage() {
        if (this.state != PhoneState.Ongoing) {
            return;
        }
        this.updateCallerDetailsFromCRM(false);
        log("Initiated CRM page update");
    }

    /* Search, and optionally open the record using CIF API searchAndOpenRecords()
     * searchOnly - when 'true', search but do not open the record, when 'false', also open the record
     * recordid - An optional CRM record Id to open. If not passed a search based on current phone number will be performed */
    updateCallerDetailsFromCRM(searchOnly, recordId) {
        if (!this._number) {
            return; //Not a phone number or another search in progress
        }
        log("Trying to find name of caller " + this._number + " with searchOnly=" + searchOnly);
        var query = "?$select=fullname&$filter=";   //In this sample, we are retrieving the 'fullname' attribute of the record
        if (recordId) { //oData query to retrieve a specific record
            query += "contactid eq " + recordId;
        }
        else {  //oData query to search all records for current phone number
            query += "contains(mobilephone, '" + this._number.substring(1) + "') or contains(mobilephone, '" + this._number.substring(2) + "') or contains(mobilephone, '" + this._number.substring(3) + "')";
        }
        //In this sample, we search all 'contact' records
        Microsoft.CIFramework.searchAndOpenRecords("contact", query, searchOnly).then(
            function (valStr) {    //We got the CRM contact record for our search query
                try {
                    let val = JSON.parse(valStr);
                    //Record the fullname and CRM record id
                    this._name = val[0].fullname;
                    this._contactid = val[0].contactid;
                    log("The caller name is " + val[0].fullname);
                    this.renderCallerName();

                }
                catch (e) {
                    log("Unable to find caller name- Exception: " + e);
                }
            }.bind(this)
        ).catch(function (reason) {
            if (!reason) {
                reason = "Unknown Reason";
            }
            log("Couldn't retrieve caller name because " + reason.toString());
        }.bind(this));
    }
    /* Current contact name, if available */
    get name() {
        if (this._name) {
            return this._name;
        }
        else {
            return this._number;
        }
    }

    /* Any Case, if created */
    get currentCase() {
        return this._caseId;
    }
    set currentCase(value) {
        this._caseId = value;
    }
    get isNameValid() {
        return (this._name ? true : false);
    }

    /* Update the current name. If we only have a phone number, initiate a lookup into CRM */
    set name(value) {
        if (!value) {
            this._name = this._number = null;
            return;
        }
        if (value.startsWith("+")) {    //We have a phone number but no name
            this._number = value;
            this.updateCallerDetailsFromCRM(true);
            log("Initiated number lookup");
        }
        else {
            this._name = value;
        }
    }

    get contactId() {
        return this._contactid;
    }

    get direction() {
        return this._direction;
    }

    get state() {
        if (!this._state) {
            return PhoneState.Idle;
        }
        return this._state;
    }

    get activityId() {
        return this._activityId;
    }

    get currentEnvironment() {
        return this._environ;
    }

    /* End the current phone call, disconnecting Twilio as well */
    endCall(oldState) {
        if (this.conn) {
            if (oldState == PhoneState.Incoming) {
                this.conn.reject();
            }
            log("Phone state changed to idle. Disconnecting all calls");
            Twilio.Device.disconnectAll();
            this.conn = null;
        }
    }

    stripParens(val) {
        var start = val.indexOf('{') + 1, end = val.lastIndexOf('}');
        end = (end > 0 ? end : val.length);
        return val.substring(start, end);
    }

    /* Create a new activity record for this phone call using appropriate CIF APIs. */
    createCallActivity() {
        var phActivity = {};
        //Setup basic details of the activity - subject, direction, duration
        phActivity["phonenumber"] = this._number;
        phActivity["subject"] = "Call with " + this.name + " at " + this._timer.startTime.toLocaleTimeString();
        phActivity["directioncode"] = this.direction == CallDirection.Incoming ? false : true;
        phActivity["actualdurationminutes"] = Math.trunc(this._timer.duration / 60);
        //Capture any call notes as 'description' attribute of the activity
        phActivity["description"] = $('#callNotesField').text();

        var sysuser = null;
        if (this.currentEnvironment) {
            sysuser = this.stripParens(this.currentEnvironment.userId);
        }

        var us = {};

        //If we have the CRM contact record, use it to setup the calling parties for this activity
        if (sysuser && this.contactId) {
            us["partyid_systemuser@odata.bind"] = "/systemusers(" + sysuser + ")";
            us["participationtypemask"] = (this.direction == CallDirection.Incoming ? 2 : 1);

            var them = {};
            them["partyid_contact@odata.bind"] = "/contacts(" + this.contactId + ")";
            them["participationtypemask"] = (this.direction == CallDirection.Incoming ? 1 : 2);

            var parties = [];
            parties[0] = us; parties[1] = them;
            phActivity.phonecall_activity_parties = parties;
        }

        //If any case/incident was created, set it as the 'regarding' object; else just set the contact
        if (this.currentCase) {
            phActivity["regardingobjectid_incident@odata.bind"] = "/incidents(" + this.stripParens(this.currentCase) + ")";
        } else if(this.contactId) {
            phActivity["regardingobjectid_contact@odata.bind"] = "/contacts(" + this.contactId + ")";
        }

        //Now invoke CIF to create the phonecall activcity
        Microsoft.CIFramework.createRecord("phonecall", JSON.stringify(phActivity)).then(function (newActivityStr) {
            let newActivity = JSON.parse(newActivityStr);
            this._activityId = newActivity.id;
            $("#activityLink").show();
        }.bind(this));
    }

    /* Manages state transition of the phone call
     *  - update the UI
     *  - Update internal state and execute required CRM states (creating a case, activity, searching records etc)
     *  - manage Twilio connection state */
    set state(value) {
        if (this._state == value) {
            return;
        }

        let oldState = this._state;
        this._state = value;
        this.updateCRMPage();

        if (this._state != PhoneState.CallSummary) {
            $(".activityLink").hide();
        }

        switch (this._state) {
            case PhoneState.Idle:
                this._timer.reset();
                this.name = null;
                this._number = null;
                this._contactid = null;
                this._activityId = null;
                $(".callerName").empty();
                $(".callerInit").empty();
                $('#dialerPhoneNumber').empty();
                this.endCall(oldState);
                this._direction = CallDirection.None;
                this.currentCase = null;
                //if(oldState)                                            //DEBUG ONLY
                //    document.location.href = document.location.href;    //DEBUG ONLY 
                break;
            case PhoneState.CallSummary:
                this._timer.stop();
                this.endCall(oldState);
                this.createCallActivity();
                break;
            case PhoneState.Incoming:
                this._direction = CallDirection.Incoming;
                this._timer.start();
                break;
            case PhoneState.Outgoing:
                this._direction = CallDirection.Outgoing;
                this._timer.start();
                break;
            default:
                this._timer.start();
        }
        this.render();
    }
    get conn() {
        return this._conn;
    }
    set conn(value) {
        this._conn = value;
    }
    get mode() {
        return this._mode;
    }
    set mode(value) {
        if (this._mode == value) {
            return;
        }
        this._mode = value;
        log("Invoking setPanelMode");
        setPanelMode(this._mode);
        log("Done setPanelmode");
        this.render();
    }
    get busy() {
        return !(this.state == PhoneState.Idle || this.state == PhoneState.CallSummary)
    }
    render() {
        if (this.state == PhoneState.Ongoing || this.state == PhoneState.CallSummary) {
            $(".callNotes").show();
        }
        else {
            $(".callNotes").hide();
        }

        if (this.state == PhoneState.Idle) {
            $(".callNotesField").empty();
        }

        if (this.state == PhoneState.CallSummary) {
            $(".notesMenuItem").show();
        }
        else {
            $(".notesMenuItem").hide();
        }

        this.renderCallerName();
        let widgetToRender = (this.mode == DisplayMode.Minimized ? null : this.state.renderWidget);
        let sidePanelToRender = this.state.renderSidePanel;
        Object.values(PhoneState).forEach((state) => {
            if (state.renderWidget != widgetToRender) {
                $(state.renderWidget).hide();
            }
            if (state.renderSidePanel != sidePanelToRender) {
                $(state.renderSidePanel).hide();
            }
        });
        $(widgetToRender).show();
        $(sidePanelToRender).show();
    }
}

/* Programatically set the panel mode using CIF */
function setPanelMode(mode) {
    if (_CurrentPanelMode == mode) {
        return;
    }
    Microsoft.CIFramework.setMode(mode).then(function (val) {
        log("Successfully set the panel mode " + val);
        _CurrentPanelMode = mode;
    }).catch(function (reason) {
        log("Failed to set mode due to: " + reason);
    });
}

/* Our clickToAct handler. This will place a phone call and change the phone state accordingly */
function clickToActHandler(paramStr) {
    return new Promise(function (resolve, reject) {
        try {
            let params = JSON.parse(paramStr);
            var phNo = params.value;   //Retrieve the phone number to dial from parameters passed by CIF
            log("Click To Act placing a phone call to " + phNo);
            $("#dialerPhoneNumber").val(phNo);
            expandPanel();  //Programatically expand the panel if required
            placeCall();    //Make the call
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
    
}

function sendKBArticleHandler(paramStr) {
    return new Promise(function (resolve, reject) {
        try {
            let params = JSON.parse(paramStr);
            var kbMsg = "KB Title: " + params["title"] + " KB link: " + params["link"];
            log("Send KB article invoked " + kbMsg);
            //$(".callNotesField").empty();
            $(".callNotesField").append(kbMsg);
            $(".callNotes").show(); //DEBUGGING ONLY
        }
        catch (error) {
        }
    });
}

/* Our handler invoked by CIF when the user changes panel mode */
function modeChangedHandler(paramStr) {
    return new Promise(function (resolve, reject) {
        try {
            let params = JSON.parse(paramStr);
            var mode = params["value"];
            log("Mode changed to " + mode);
            //Get the new mode from the parameters passed by CIF and update our state accordingly
            if (mode == DisplayMode.Docked) {
                expandPanel();
            }
            else {
                collapsePanel();
            }            
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });

}

/* Our handler invoked by CIF whenever any navigation happens on main UCI page.
 * In this sample, we simply record the contact or case record Id to be used for our case or activity record creation */
function pageNavigateHandler(paramStr) {
    return new Promise(function (resolve, reject) {
        try {
            let params = JSON.parse(paramStr);
            if (phone && !phone.isNameValid && phone.state != PhoneState.Idle && phone.state != PhoneState.CallSummary) {
                var page = params["value"];
                
                var queryParams = new URL(page).searchParams;
                log("Page navigated to " + queryParams.get("etn") + " pagetype " + queryParams.get("pagetype") + " id = " + queryParams.get("id") + " with ph = " + phone.name);
                if (queryParams.get("etn") == "contact" && queryParams.get("pagetype") == "entityrecord") {
                    console.log("Trying to fetch record details based on record id");
                    phone.updateCallerDetailsFromCRM(true, queryParams.get("id"));
                }
                if (queryParams.get("etn") == "incident" && queryParams.get("pagetype") == "entityrecord") {
                    phone.currentCase = queryParams.get("id");
                }
            }
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });

}

var phone = null;   //The global phone object in this sample

/* Our handler to be invoked by Twilio for an incoming call.
 * If the call is acceptable, set the phone state appropriately to trigger our sample work-flow */
function incomingCall(conn) {
    if (phone.busy) {
        log("Can't accept another call when one is in progress");
        conn.reject();  //not supporting multiple calls right now
        return;
    }
    phone.state = PhoneState.Idle;  //Ensure we start with a clean slate
    phone.conn = conn;
    phone.state = PhoneState.Incoming;
    phone.name = conn.parameters.From;
    expandPanel();                  //Programatically expand the panel using CIF
    log("Received incoming call from " + phone.name);
}

/* Display the toast area along with the sidebar area */
function expandPanel() {
    phone.mode = DisplayMode.Docked;
    document.documentElement.style.setProperty("--widgetAreaWidth", expandedWidgetWidth);
    $(".expanded").show();
}

/* Hide the toast area; only display sidebar area */
function collapsePanel() {
    phone.mode = DisplayMode.Minimized;
    document.documentElement.style.setProperty("--widgetAreaWidth", "0px");
    $(".expanded").hide();
    
}

/* Event handler for when user clicks on "accept call" button.
 * Update our state to Accepted */
function answerCall() {
    phone.state = PhoneState.CallAccepted;
    log("Accepting incoming call from " + phone.name);
    if (phone.conn) {
        phone.conn.accept();
    }
}

/* Event handler for when the user clicks on "Decline call" button */
function declineCall() {
    phone.state = PhoneState.Idle;
    if (phone.conn) {
        phone.conn.reject();
        phone.conn = null;
    }
    collapsePanel();
    log("Declining incoming call from " + phone.name);
}

/* Our callback to be invoked by Twilio when a call is successfully connected */
function ongoingCall() {
    phone.state = PhoneState.Ongoing;
    log("Ongoing call with " + phone.name);
}

/* Event handler for when the user clicks on the "hang up" button */
function hangupCall() {
    log("Hanging up call with " + phone.name);
    phone.state = PhoneState.CallSummary;
}

/* Event handler to be invoked when the user wishes to place a call via either "clickToAct" or using our rudimentary dialer */
function placeCall() {
    if (phone.busy) {
        throw new Error("Cannot place call. Phone busy");
    }
    var params = {
        To: "+" + document.getElementById('dialerPhoneNumber').value
    };
    phone.state = PhoneState.Idle;
    log('Placing a call to ' + params.To + '...');
    phone.name = params.To;
    
    Twilio.Device.connect(params);
    phone.state = PhoneState.Dialing;
}

/* Event handler for the dialpad button on the sidebar */
function resetPhone() {
    if (phone && !phone.busy) {
        phone.state = PhoneState.Idle;
    }
}

/* Invoke CIF APIs to create a new case record.
 * This will open the case create form with certain fields like contactId and description pre-populated */
function createCase() {
    var ef = {};
    ef["entityName"] = "incident";
    var fp = {};
    fp["customerid"] = phone.contactId; //prepopulate some fields we know
    fp["customeridtype"] = "contact";
    fp["caseorigincode"] = 1;
    fp["description"] = $('#callNotesField').text();
    //Now invoke CIF API
    Microsoft.CIFramework.openForm(JSON.stringify(ef), JSON.stringify(fp)).then(function (resultStr) {
        let result = JSON.parse(resultStr);
        //Once the form is opened and saved, CIF will return the newly created recordId. Save it for later use
        result["savedEntityReference"].forEach(function (elem) {
            if (elem.entityType == "incident") {
                phone.currentCase = elem.id;
                $('#caseLink').text(elem.name)
                $('#caseLink').show();
                return;
            }
        });
    }); 
}

/* Event handler. When clicked, opens the activity record created for this phone call */
function openActivity() {
    var ef = {};
    ef["entityName"] = "phonecall";
    if (phone.activityId) {
        ef["entityId"] = phone.activityId; 
    }
    Microsoft.CIFramework.openForm(JSON.stringify(ef));
}

/* Event handler. When clicked, opens the case record created for this phone call */
function openCase() {
    var ef = {};
    ef["entityName"] = "incident";
    if (phone.currentCase) {
        ef["entityId"] = phone.currentCase;
    }
    Microsoft.CIFramework.openForm(JSON.stringify(ef));
}

/* Update the activity record with additional details. In this sample, we update the 'description' field with the notes taken during the call */
function updateActivity() {
    if (!phone || phone.state != PhoneState.CallSummary) {
        return;
    }
    if (!phone.activityId) {
        phone.createCallActivity();
        return;
    }
    var data = {};
    data["description"] = $('#callNotesField').text(); 
    Microsoft.CIFramework.updateRecord("phonecall", phone.activityId, JSON.stringify(data)).then(function (ret) {
        openActivity();
    });
}

/* Initialization function for this application.
 * Registers handlers for various CIF events */
function initCTI() {
    Microsoft.CIFramework.setClickToAct(true);
    Microsoft.CIFramework.addHandler("onclicktoact", clickToActHandler);
    Microsoft.CIFramework.addHandler("onmodechanged", modeChangedHandler);
    Microsoft.CIFramework.addHandler("onpagenavigate", pageNavigateHandler);
    Microsoft.CIFramework.addHandler("onsendkbarticle", sendKBArticleHandler);
    phone = new Phone(DisplayMode.Minimized);
    log("Added handlers for the panel");
}

/* Global initialization function. Set up the event handlers, initialize CIF and Twilio */
function initAll() {
    $("img#expand").click(function () {
        expandPanel();
    });
    $("img#collapse").click(function () {
        collapsePanel();
    });
    $("#answerCall").click(function () {
        answerCall();
    });
    $("#declineCall").click(function () {
        declineCall();
    });
    $("#placeCall").click(function () {
        placeCall();
    });
    $(".hangupCall").click(function () {
        Twilio.Device.disconnectAll();
    });
    $("#dialpad").click(function () {
        resetPhone();
    });
    $(".createCase").click(function () {
        createCase();
    });
    $("#activityLink").click(function () {
        openActivity();
    });
    $("#caseLink").click(function () {
        openCase();
    });
    $("#addNotes").click(function () {
        updateActivity();
    });
    log('Requesting Capability Token...');

    $.getJSON(twilioAppURL)
        .done(function (data) {
            log('Got a token.');
            console.log('Token: ' + data.token);

            // Setup Twilio.Device
            Twilio.Device.setup(data.token, {debug: true});

            Twilio.Device.ready(function (device) {
                log('Twilio.Device Ready!');
                initCTI();
            });

            Twilio.Device.error(function (error) {
                log('Twilio.Device Error: ' + error.message);
                collapsePanel();
            });

            Twilio.Device.connect(function (conn) {
                log('Successfully established call!');
                ongoingCall();
            });

            Twilio.Device.disconnect(function (conn) {
                log('Call ended.');
                hangupCall();
            });

            Twilio.Device.incoming(function (conn) {
                incomingCall(conn);
            });
        })
        .fail(function () {
            log('Could not get a token from server!');
        });
}

// Activity log
function log(message) {
    message = new Date().toString() + " " + message;
    console.log(message);
}

function tryInitAll() {
    let htmlStyles = window.getComputedStyle(document.querySelector("html"));
    expandedWidgetWidth = htmlStyles.getPropertyValue("--expandedWidgetWidth");
    if (twilioLoaded && ciLoaded) {
        initAll();
    }
    else {
        if (!twilioLoaded) {
            console.log("Waiting for twilio libraries to load");
        }
        if (!ciLoaded) {
            console.log("Waiting for CIF libraries to load");
        }
        window.setTimeout(tryInitAll, 100);
    }
}

$(function () {
    tryInitAll();
});

