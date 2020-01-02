using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Crm.Sdk.Messages;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        public static Guid _unitGroupId;
        public static Guid _product1Id;
        public static Guid _product2Id;
        public static Guid _productFamilyId;
        public static Guid _productPropertyId;
        public static Guid _productOverridenPropertyId;
        public static Guid _productOverwrittenPropertyId;
        public static Guid _priceListId;
        public static Guid _priceListItem1Id;
        public static Guid _priceListItem2Id;
        public static Guid _priceListItem3Id;
        public static Guid _productRelationId;
        public static UoM unit;
        private static OrganizationServiceProxy _serviceProxy;
        //private static Guid member1;

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
            // TODO Create entity records
            Console.WriteLine("Creating required records for the sample");
            Console.WriteLine("*****************************************");
            // Create a unit group.  
            UoMSchedule newUnitGroup = new UoMSchedule
            {
                Name = "Example Unit Group",
                BaseUoMName = "Example Primary Unit"
            };

            _unitGroupId = _serviceProxy.Create(newUnitGroup);

            Console.WriteLine("Created {0}", newUnitGroup.Name);

            // retrieve the unit id.  
            QueryExpression unitQuery = new QueryExpression
            {
                EntityName = UoM.EntityLogicalName,
                ColumnSet = new ColumnSet("uomid", "name"),
                Criteria = new FilterExpression(),
                PageInfo = new PagingInfo
                {
                    PageNumber = 1,
                    Count = 1
                }
            };
            unitQuery.Criteria.AddCondition("uomscheduleid", ConditionOperator.Equal, _unitGroupId);

            // Retrieve the unit.  
            _unit = (UoM)_serviceProxy.RetrieveMultiple(unitQuery).Entities[0];

            Console.WriteLine("Retrieved {0}", _unit.Name);

            // Create a price list  
            PriceLevel newPriceList = new PriceLevel
            {
                Name = "Example Price List"
            };
            _priceListId = _serviceProxy.Create(newPriceList);

            Console.WriteLine("Created {0}", newPriceList.Name);
            Console.WriteLine("*****************************************");

            return;
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
                Console.WriteLine("Deleting entity records... please wait!");

                _serviceProxy.Delete(ProductSubstitute.EntityLogicalName, _productRelationId);
                _serviceProxy.Delete(ProductPriceLevel.EntityLogicalName, _priceListItem1Id);
                _serviceProxy.Delete(ProductPriceLevel.EntityLogicalName, _priceListItem2Id);
                _serviceProxy.Delete(Product.EntityLogicalName, _productFamilyId);
                _serviceProxy.Delete(PriceLevel.EntityLogicalName, _priceListId);
                _serviceProxy.Delete(UoMSchedule.EntityLogicalName, _unitGroupId);

                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
