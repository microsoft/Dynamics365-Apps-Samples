"use strict";
/* tslint:disable:no-console */
var msdyn_SearchResourceAvailabilityForRequirementGroupSample = /** @class */ (function () {
    function msdyn_SearchResourceAvailabilityForRequirementGroupSample() {
    }
    /**
     * Sends a msdyn_SearchResourceAvailabilityForRequirementGroup request and logs output to the console.
     */
    msdyn_SearchResourceAvailabilityForRequirementGroupSample.prototype.sendRequest = function () {
        var _this = this;
        // enable the extended behavior that allows nested entities to be present in the SOAP payload.
        SdkExtensions.Mode.enableNestedEntities(true);
        // version is a required parameter
        var version = '1';
        // Update the Guid identifiers to match identifiers in your dev/test organization.
        // Selectively change or comment/uncomment some of the below values to see the impact on the results. 
        // Set breakpoints and reload page after each change.
        // Update the requirement group GUID that is targeted for search.
        var requirementGroup = new Sdk.EntityReference('msdyn_requirementgroup', 'D4D0E0B7-0216-EA11-A81C-000D3AC4134D');
        // Additional requirement group's requirement specification examples: overwrite search start/end date
        var requirementSpecification = new Sdk.Entity('msdyn_resourcerequirement');
        var fromDate = new Date();
        var toDate = new Date();
        toDate.setDate(toDate.getDate() + 10);
        requirementSpecification.addAttribute(new Sdk.DateTime('msdyn_fromdate', fromDate));
        requirementSpecification.addAttribute(new Sdk.DateTime('msdyn_todate', toDate));
        // Additional Settings examples.
        var settings = new Sdk.Entity('organization');
        // Resources must belong to the required resources identified by their Id
        var requiredResources = this.buildIdEntityCollection('bookableresource', 'value', ['165b06a9-141d-ea11-a81e-000d3ac4134d', '21da6ca1-141d-ea11-a81e-000d3ac4134d']);
        settings.addAttribute(new SdkExtensions.EntityCollectionAttribute('RequiredResources', requiredResources));
        // Resources must belong to one of the specified organizational units identified by their Id
        var organizationalUnits = this.buildIdEntityCollection('msdyn_organizationalunit', 'msdyn_organizationalunitid', ['3544397e-7d1b-ea11-a81d-000d3ac4134d']);
        settings.addAttribute(new SdkExtensions.EntityCollectionAttribute('OrganizationUnits', organizationalUnits));
        // create the request
        var request = new Sdk.msdyn_SearchResourceAvailabilityForRequirementGroupRequest(version, requirementGroup, requirementSpecification, settings);
        // execute the request with success and error callback functions
        Sdk.Async.execute(request, function (response) {
            // the time slots entity collection contains all of the identified time slots
            // this includes time slots that are not eligible for the requirement, check the 'Potential' attribute for eligible slots.
            var timeSlots = response.getTimeSlots();
            // the requirements entity collection contains information about the requirements of the targeting requirement group.
            var requirements = response.getRequirements();
            // the sets of proposal resource assignment on each requirement under the targeting requirement group.
            var proposalResourceAssignmentSets = response.getProposalResourceAssignmentSets();
            // The pagingInfos entity may contain the paging infos.
            var pagingInfos = response.getPagingInfos();
            // The following shows different ways to parse the results. 
            // Using the Sdk entity collections and entities directly will have the most detailed information,
            // but is also very verbose and may throw errors when checking for non-existing attributes for example.
            _this.showProposalResourceAssignmentSetsUsingEntities(proposalResourceAssignmentSets);
            // Using the view() function is less verbose, easier to navigate and makes it easier to discover result 
            // properties in the console. 
            _this.showProposalResourceAssignmentSetsUsingView(proposalResourceAssignmentSets);
            // Finally, using simple objects is the least verbose way to navigate results, but also contains less information.
            // For example it does not include any information about the result property types.
            _this.showProposalResourceAssignmentSetsUsingSimpleObject(proposalResourceAssignmentSets);
        }, function (error) {
            console.log(error.message);
        });
    };
    /**
     * Creates an entity collection from an array of Ids.
     * @param entityLogicalName The entity logical name.
     * @param attributeName The attribute name.
     * @param ids an array of Ids.
     */
    msdyn_SearchResourceAvailabilityForRequirementGroupSample.prototype.buildIdEntityCollection = function (entityLogicalName, attributeName, ids) {
        var collection = new Sdk.EntityCollection();
        if (ids !== null) {
            ids.forEach(function (id) {
                var entity = new Sdk.Entity(entityLogicalName);
                entity.addAttribute(new Sdk.Guid(attributeName, id));
                collection.addEntity(entity);
            });
        }
        return collection;
    };
    /**
     * Demonstrates the usage of entities and their access functions to show resource data.
     * @param proposalResourceAssignmentSets The proposal resource assignment sets.
     */
    msdyn_SearchResourceAvailabilityForRequirementGroupSample.prototype.showProposalResourceAssignmentSetsUsingEntities = function (proposalResourceAssignmentSets) {
        if (proposalResourceAssignmentSets !== null) {
            var entities = proposalResourceAssignmentSets.getEntities();
            var setNumber_1 = 1;
            entities.forEach(function (entity) {
                var intervalStart = entity.getAttributes().getAttributeByName('IntervalStart').getValue();
                var proposalResourceAssignments = entity.getAttributes().getAttributeByName('ProposalResourceAssignments').getValue();
                if (proposalResourceAssignments != null) {
                    proposalResourceAssignments.getEntities().forEach(function (assignment) {
                        var requirementId = assignment.getAttributes().getAttributeByName('RequirementId').getValue();
                        var resourceId = assignment.getAttributes().getAttributeByName('ResourceId').getValue();
                        console.log("Set Number: " + setNumber_1 + ", Interval Start: " + intervalStart + ", RequirementId: " + requirementId + ", ResourceId: " + resourceId);
                    });
                    setNumber_1++;
                }
            });
            if (entities != null && entities.getCount() === 0) {
                console.log("There are no resources that meet this search criteria. Please modify your search and try again.");
            }
        }
    };
    /**
     * Demonstrates the usage of the view() function to access resource data.
     * @param proposalResourceAssignmentSets The requirements.
     */
    msdyn_SearchResourceAvailabilityForRequirementGroupSample.prototype.showProposalResourceAssignmentSetsUsingView = function (proposalResourceAssignmentSets) {
        if (proposalResourceAssignmentSets !== null) {
            var view = proposalResourceAssignmentSets.view();
            var setNumber_2 = 1;
            view.entities.forEach(function (entity) {
                var intervalStart = entity.attributes.IntervalStart.value;
                var proposalResourceAssignments = entity.attributes.ProposalResourceAssignments;
                if (proposalResourceAssignments != null) {
                    entity.attributes.ProposalResourceAssignments.value.entities.forEach(function (assignment) {
                        var requirementId = assignment.attributes.RequirementId.value;
                        var resourceId = assignment.attributes.ResourceId.value;
                        console.log("Set Number: " + setNumber_2 + ", Interval Start: " + intervalStart + ", RequirementId: " + requirementId + ", ResourceId: " + resourceId);
                    });
                    setNumber_2++;
                }
            });
            if (view.entities != null && view.entities.length === 0) {
                console.log("There are no resources that meet this search criteria. Please modify your search and try again.");
            }
        }
    };
    /**
     * Demonstrates the usage of the toSimpleObject() function to access resource data.
     * @param requirements The requirements.
     */
    msdyn_SearchResourceAvailabilityForRequirementGroupSample.prototype.showProposalResourceAssignmentSetsUsingSimpleObject = function (proposalResourceAssignmentSets) {
        if (proposalResourceAssignmentSets !== null) {
            var simpleObjects = proposalResourceAssignmentSets.toSimpleObject();
            var setNumber_3 = 1;
            simpleObjects.forEach(function (simpleObject) {
                var assignments = simpleObject.ProposalResourceAssignments;
                if (assignments != null) {
                    assignments.forEach(function (assignment) {
                        var requirementId = assignment.RequirementId;
                        var resourceId = assignment.ResourceId;
                        console.log("Set Number: " + setNumber_3 + ", Interval Start: " + simpleObject.IntervalStart + ", RequirementId: " + requirementId + ", ResourceId: " + resourceId);
                    });
                    setNumber_3++;
                }
            });
            if (simpleObjects != null && simpleObjects.length === 0) {
                console.log("There are no resources that meet this search criteria. Please modify your search and try again.");
            }
        }
    };
    return msdyn_SearchResourceAvailabilityForRequirementGroupSample;
}());
// execute the request now
new msdyn_SearchResourceAvailabilityForRequirementGroupSample().sendRequest();
