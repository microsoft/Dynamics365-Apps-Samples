// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// =====================================================================


//If the SDK namespace object is not defined, create it.
if (typeof (SDK) == "undefined")
{ SDK = {}; }
// Create Namespace container for functions in this library;
SDK.DependentOptionSet = {};
SDK.DependentOptionSet.config = null;

/**
 * @function SDK.DependentOptionSet.init
 * @param {string} webResourceName the name of the JavaScript web resource containing the JSON definition 
 * of option dependencies
 */
SDK.DependentOptionSet.init = function (webResourceName) {
    if (SDK.DependentOptionSet.config == null) {
        //Retrieve the JavaScript Web Resource specified by the parameter passed
        var clientURL = Xrm.Page.context.getClientUrl();

        var pathToWR = clientURL + "/WebResources/" + webResourceName;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", pathToWR, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                this.onreadystatechange = null;
                if (this.status == 200) {
                    SDK.DependentOptionSet.config = JSON.parse(this.response);
                    SDK.DependentOptionSet.completeInitialization();
                }
                else {
                    throw new Error("Failed to load configuration data for dependent option sets.");
                }
            }
        };
        xhr.send();
    }
    else {
        SDK.DependentOptionSet.completeInitialization();
    }
};

/**
 * @function SDK.DependentOptionSet.completeInitialization
 * Initializes the dependent option set options when the form loads
 */
SDK.DependentOptionSet.completeInitialization = function () {
    //If the parent field is null, make sure the child field is null and disabled
    // Otherwise, call fireOnChange to filter the child options
    for (var i = 0; i < SDK.DependentOptionSet.config.length; i++) {
        var parentAttribute = Xrm.Page.getAttribute(SDK.DependentOptionSet.config[i].parent);
        var parentFieldValue = parentAttribute.getValue();
        if (parentFieldValue == null || parentFieldValue == -1) {
            var childAttribute = Xrm.Page.getAttribute(SDK.DependentOptionSet.config[i].child);
            childAttribute.setValue(null);
            childAttribute.controls.forEach(function (c) { c.setDisabled(true); });
        }
        else {
            parentAttribute.fireOnChange();
        }
    }
}

/**
 * @function SDK.DependentOptionSet.filterDependentField
 * Locates the correct set of configurations
 * @param {string} parentFieldParam The name of the parent field
 * @param {string} childFieldParam The name of the dependent field
 */
SDK.DependentOptionSet.filterDependentField = function (parentFieldParam, childFieldParam) {

 //Don't do anything if the SDK.DependentOptionSet.config is not initialized
 if (SDK.DependentOptionSet.config != null) {
  //Looping through the array of all the possible dependency configurations
  for (var i = 0; i < SDK.DependentOptionSet.config.length; i++) {

   var dependentOptionSet = SDK.DependentOptionSet.config[i];

   /* Match the parameters to the correct dependent optionset mapping*/
   if ((dependentOptionSet.parent == parentFieldParam) &&
       (dependentOptionSet.child == childFieldParam)) {

    /*
    * Using setTimeout to allow a little time between calling this potentially recursive function.
    * Without including some time between calls, the value at the end of the chain of dependencies 
    * was being set to null on form load.
    */


    setTimeout(SDK.DependentOptionSet.filterOptions,
        100, parentFieldParam,
        childFieldParam,
        //Get a copy of the dependent dependentOptionSet so it is passed
        //by value and not affected when there are many entries
        //Thanks to Guido Preite (http://www.crmanswers.net/)
        JSON.parse(JSON.stringify(dependentOptionSet)));
   }
  }

 }

};

/**
 * @function SDK.DependentOptionSet.filterOptions
 * Filters options available in dependent fields when the parent field changes
 * @param {string} parentFieldParam The name of the parent field
 * @param {string} childFieldParam The name of the dependent field
 * @param {object} dependentOptionSet The configuration data for the dependent options
 */
SDK.DependentOptionSet.filterOptions = function (parentFieldParam, childFieldParam, dependentOptionSet)
{
    /* Get references to the related fields*/
    var parentField = Xrm.Page.getAttribute(parentFieldParam);
    var parentFieldValue = parentField.getValue();
    var childField = Xrm.Page.getAttribute(childFieldParam);
    /* Capture the current value of the child field*/
    var currentChildFieldValue = childField.getValue();
    /* If the parent field is null, set the Child field to null */
    //Interactive Service Hub, CRM for Tablets & CRM for phones can return -1 when no option selected
    if (parentFieldValue == null || parentFieldValue == -1) {
        childField.setValue(null);
        childField.fireOnChange(); //filter any dependent optionsets
        // Any attribute may have any number of controls
        // So disable each instance
        childField.controls.forEach(function (c) {
            c.setDisabled(true);
        });
        //Nothing more to do when parent attribute is null
        return;
    }

    //The valid child options defined by the configuration
    var validOptionValues = dependentOptionSet.options[parentFieldValue.toString()];

    //When the parent field has a value
    //Any attribute may have more than one control in the form,
    // So iterate over each one
    childField.controls.forEach(function (c) {
        c.setDisabled(false);
        c.clearOptions();
        //The attribute contains the valid options
        var childFieldAttribute = c.getAttribute();

        //The attribute options for the Interactive Service Hub, CRM for Tablets & 
        // CRM for phones clients do not include a definition for an unselected option.
        // This will add it
        if (Xrm.Page.context.client.getClient() == "Mobile") {
            c.addOption({ text: "", value: -1 });
        }

        //For each option value, get the definition from the attribute and add it to the control.
            validOptionValues.forEach(function (optionValue) {
                //Get the option defnition from the attribute
                var option = childFieldAttribute.getOption(parseInt(optionValue));
                //Add the option to the control
                c.addOption(option);
            })
    });
    //Set the value back to the current value if it is a valid value.                
    if (currentChildFieldValue != null &&
        validOptionValues.indexOf(currentChildFieldValue.toString()) > -1) {
        childField.setValue(currentChildFieldValue);
    }
    else {
        //Otherwise set it to null
        childField.setValue(null);
        childField.fireOnChange(); //filter any other dependent optionsets
    }
}




