
This project contains two files:

- SDK.DependentOptionSet.js
- TicketDependentOptionSetConfig.js

SDK.DependentOptionSet.js =========================================================================
This is a re-usable JavaScript library you can use to create a JavaScript web resource in Microsoft CRM.
This library depends on JSON configuration data stored in an JavaScript web resource and configuration 
settings for form event handlers to filter optionset options in a child optionset depending on the value 
selected in a parent optionset.

The goal is to demonstrate how logic within form scripts can be controlled using data rather than 
hard-coding logic to filter a specific pair of fields.

Configure a form to include the web resource containing the SDK.DependentOptionSet.js 
library in the OnLoad event.
Configure the Onload event to call the SDK.DependentOptionSet.init function and configure the event 
handler for this event to include the name of an JavaScript web resource that contains the 
mapping definitions.

Configure the OnChange event for any parent field to execute the 
SDK.DependentOptionSet.filterDependentField function and the event handler for this event to include 
the names of both the parent field and the child field whose options will be filtered when the parent 
field value changes.
For example: "parent_field_name","child_field_name"

This library allows mapping a pair of field or a chain of filtered fields.


TicketDependentOptionSetConfig.js  ==============================================================
This is an example configuration file that demonstrates a chain of three fields with options 
filtered based on the options chosen in the parent field.

This JSON defines a mapping of dependent OptionSets within an entity with 
the logical namme 'sample_ticket' that is included in the managed solution included.

The data represents a mapping between three fields:


Category           Sub Category           Type
(sample_category)  (sample_subcategory)   (sample_type) 
===============================================================
Software          Personal Productivity   Word Processor
                                          Spreadsheet
                                          Internet Browser
                                          E-mail
                  Business Applications   Customer Relationship Management
                                          Enterprise Resource Management
                                          Human Resource Management
                  Operating Systems       Windows 10
                                          Windows 8
                                          Windows Server 2016
                                          Windows Server 2012
Hardware          Desktop Computer        Workstation x1000
                                          Workstation x2000
                                          Workstation x3000
                                          Workstation x4000
                  Laptop Computer         Laptop 1000 series
                                          Laptop 2000 series
                                          Laptop 3000 series
                                          Laptop 4000 series
                  Monitor                 CRT
                                          LCD
                                          LED
                                          Projector
                  Printer                 Inkjet
                                          Laser
                                          LED
                                          Solid-ink
                  Telephone               Landline
                                          Mobile
                                          Smart Phone



While TicketDependentOptionSetConfig.js represents a more complex mapping, the following example
shows a simple template where the 6 available options in a child field are filtered by the 
choice made between the two options in a parent field. 

This describes the basic template you must follow when configuring the option mappings. 


[{
    "parent": "parent_field_name",
    "child": "child_field_name",
    "options": {
        "0": [
            "0",
            "1",
            "2"
        ],
        "1": [
            "3",
            "4",
            "5",
            "6",
            "7"
        ]
    }

}]

