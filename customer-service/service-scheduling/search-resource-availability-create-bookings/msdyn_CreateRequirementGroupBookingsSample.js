"use strict";
/* tslint:disable:no-console */
var SampleCreateRequirementGroupBookings = /** @class */ (function () {
    function SampleCreateRequirementGroupBookings() {
    }
    /**
     * Sends a msdyn_CreateRequirementGroupBookings request and logs output to the console.
     */
    SampleCreateRequirementGroupBookings.prototype.sendRequest = function () {
        // enable the extended behavior that allows nested entities to be present in the SOAP payload.
        SdkExtensions.Mode.enableNestedEntities(true);
        // version is a required parameter
        var version = '1';
        // Update the Guid identifiers to match identifiers in your dev/test organization.
        // Selectively change or comment/uncomment some of the below values to see the impact on the results. 
        // Set breakpoints and reload page after each change.
        // Update the requirement group GUID that is targeted for search.
        var requirementGroup = new Sdk.EntityReference('msdyn_requirementgroup', 'e6474733-8e3d-ea11-a81c-000d3a6dde06');
        // update the bookings start time.
        var start = new Date(Date.now());
        // update the bookings duration.
        var duration = 60;
        // update the resource assginments for each requirement in the requirement group
        var resourceAssignmentscollection = new Sdk.EntityCollection();
        this.addResourceAssignments('aba63f31-bb3d-ea11-a81e-000d3a6dde06', '6f02735b-863d-ea11-a81c-000d3a6dde06', resourceAssignmentscollection);
        this.addResourceAssignments('407dd43a-8e3d-ea11-a81c-000d3a6dde06', '35d49f64-863d-ea11-a81c-000d3a6dde06', resourceAssignmentscollection);
        // create the request
        var request = new Sdk.msdyn_CreateRequirementGroupBookingsRequest(version, start, duration, resourceAssignmentscollection, requirementGroup);
        // execute the request with success and error callback functions
        Sdk.Async.execute(request, function (response) {
            // the time slots entity collection contains all of the identified time slots
            // this includes time slots that are not eligible for the requirement, check the 'Potential' attribute for eligible slots.
            var handlerExecuted = response.getHandlerExecuted();
            console.log("Handler Executed: " + handlerExecuted);
        }, function (error) {
            console.log(error.message);
        });
    };
    /**
     * Creates an entity collection of mappings of requirment and resource assignments.
     * @param requirementId The requirement Id.
     * @param resourceId The resource Id.
     * @param resourceAssignmentscollection the resource assignments for each requirement in the requirement group.
     */
    SampleCreateRequirementGroupBookings.prototype.addResourceAssignments = function (requirementId, resourceId, resourceAssignmentscollection) {
        var assignment = new Sdk.Entity('organization');
        assignment.addAttribute(new Sdk.Guid('RequirementId', requirementId));
        assignment.addAttribute(new Sdk.Guid('ResourceId', resourceId));
        resourceAssignmentscollection.addEntity(assignment);
    };
    return SampleCreateRequirementGroupBookings;
}());
// execute the request now
new SampleCreateRequirementGroupBookings().sendRequest();
