using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Tooling.Connector;
using System;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        public static Guid _vanId;
        public static Guid _groupId;
        public static Guid _specId;
        public static Guid _plumberServiceId;

        private static bool prompt = true;
        /// <summary>
        /// Function to set up the sample.
        /// </summary>
        /// <param name="service">Specifies the service to connect to.</param>
        /// 
        private static void SetUpSample(CrmServiceClient service)
        {
            // Check that the current version is greater than the minimum version
            if (!SampleHelpers.CheckVersion(service, new Version("9.0.0.0")))
            {
                //The environment version is lower than version 9.0.0.0
                return;
            }

            CreateRequiredRecords(service);
        }

        private static void CleanUpSample(CrmServiceClient service)
        {
            DeleteRequiredRecords(service, prompt);
        }

        /// <summary>
        /// This method creates any entity records that this sample requires.
        /// Creates the email activity.
        /// </summary>
        public static void CreateRequiredRecords(CrmServiceClient service)
        {
            WhoAmIRequest userRequest = new WhoAmIRequest();
            WhoAmIResponse userResponse = (WhoAmIResponse)service.Execute(userRequest);

            // Create the van resource.
            Equipment van = new Equipment
            {
                Name = "Van 1",
                TimeZoneCode = 1,
                BusinessUnitId = new EntityReference(BusinessUnit.EntityLogicalName, userResponse.BusinessUnitId)
            };

            _vanId = service.Create(van);

            Console.WriteLine("Created a sample equipment: {0}.", van.Name);

            // Create the contraints for creating the plumber resource group
            System.Text.StringBuilder builder = new System.Text.StringBuilder("<Constraints>");
            builder.Append("<Constraint>");
            builder.Append("<Expression>");
            builder.Append("<Body>resource[\"Id\"] == ");
            builder.Append(userResponse.UserId.ToString("B"));
            builder.Append(" || resource[\"Id\"] == ");
            builder.Append(_vanId.ToString("B"));
            builder.Append("</Body>");
            builder.Append("<Parameters>");
            builder.Append("<Parameter name=\"resource\" />");
            builder.Append("</Parameters>");
            builder.Append("</Expression>");
            builder.Append("</Constraint>");
            builder.Append("</Constraints>");

            // Define an anonymous type to define the possible constraint based group type code values.
            var ConstraintBasedGroupTypeCode = new
            {
                Static = 0,
                Dynamic = 1,
                Implicit = 2
            };
            // Create the plumber resource group.
            ConstraintBasedGroup group = new ConstraintBasedGroup
            {
                BusinessUnitId = new EntityReference(BusinessUnit.EntityLogicalName, userResponse.BusinessUnitId),
                Name = "Plumber with Van 1",
                Constraints = builder.ToString(),
                GroupTypeCode = new OptionSetValue(ConstraintBasedGroupTypeCode.Static),
            };

            _groupId = service.Create(group);

            Console.WriteLine("Created a sample resource group: {0}.", group.Name);

            // Create the resource specification.
            ResourceSpec spec = new ResourceSpec
            {
                BusinessUnitId = new EntityReference(BusinessUnit.EntityLogicalName, userResponse.BusinessUnitId),
                ObjectiveExpression = @"
                    <Expression>
                        <Body>udf ""Random""(factory,resource,appointment,request,leftoffset,rightoffset)</Body>
                        <Parameters>
                            <Parameter name=""factory"" />
                            <Parameter name=""resource"" />
                            <Parameter name=""appointment"" />
                            <Parameter name=""request"" />
                            <Parameter name=""leftoffset"" />
                            <Parameter name=""rightoffset"" />
                        </Parameters>
                        <Properties EvaluationInterval=""P0D"" evaluationcost=""0"" />
                    </Expression>",
                RequiredCount = 1,
                Name = "Test Spec",
                GroupObjectId = _groupId
            };
            _specId = service.Create(spec);

            // Create the plumber required resource object.
            RequiredResource plumberReq = new RequiredResource
            {
                ResourceId = userResponse.UserId,   // assume current user is the plumber
                ResourceSpecId = _specId
            };


            // Create the service for the equipment.
            Service plumberService = new Service
            {
                Name = "Plumber 1",
                Duration = 60,
                InitialStatusCode = new OptionSetValue(1),
                Granularity = "FREQ=MINUTELY;INTERVAL=15;",
                ResourceSpecId = new EntityReference(ResourceSpec.EntityLogicalName, _specId)
            };

            _plumberServiceId = service.Create(plumberService);

            Console.WriteLine("Created a sample service for the equipment: {0}.", plumberService.Name);

            Console.WriteLine("Required records have been created.");
        }


        /// <summary>
        /// Deletes the custom entity record that was created for this sample.
        /// <param name="prompt">Indicates whether to prompt the user 
        /// to delete the entity created in this sample.</param>
        /// </summary>
        public static void DeleteRequiredRecords(CrmServiceClient service, bool prompt)
        {
            bool deleteRecords = true;

            if (prompt)
            {
                Console.WriteLine("\nDo you want these entity records deleted? (y/n)");
                String answer = Console.ReadLine();

                deleteRecords = (answer.StartsWith("y") || answer.StartsWith("Y"));
            }

            if (deleteRecords)
            {
                // TODO Delete entity records

                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
