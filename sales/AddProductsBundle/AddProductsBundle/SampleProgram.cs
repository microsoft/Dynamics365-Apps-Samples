using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        [STAThread] // Required to support the interactive login experience
        static void Main(string[] args)
        {
            CrmServiceClient service = null;
            try
            {
                service = SampleHelpers.Connect("Connect");
                if (service.IsReady)
                {
                    // Create any entity records that the demonstration code requires
                    SetUpSample(service);

                    #region Demonstrate
                    // TODO Add demonstration code here
                    //<snippetCreateandublishProducts1>  
                    // Create a product family  
                    Product newProductFamily = new Product
                    {
                        Name = "Example Product Family",
                        ProductNumber = "PF001",
                        ProductStructure = new OptionSetValue(2)
                    };
                    _productFamilyId = _serviceProxy.Create(newProductFamily);
                    Console.WriteLine("\nCreated '{0}'", newProductFamily.Name);

                    // Create a product property  
                    DynamicProperty newProperty = new DynamicProperty
                    {
                        Name = "Example Property",
                        RegardingObjectId = new EntityReference(Product.EntityLogicalName,
                                            _productFamilyId),
                        IsReadOnly = true,
                        IsRequired = true,
                        IsHidden = false,
                        DataType = new OptionSetValue(3), //Single line of text  
                        DefaultValueString = "Default Value"
                    };
                    _productPropertyId = _serviceProxy.Create(newProperty);
                    Console.WriteLine("\nCreated '{0}' for the product family", newProperty.Name);

                    // Create couple of product records under the product family  
                    Product newProduct1 = new Product
                    {
                        Name = "Example Product 1",
                        ProductNumber = "P001",
                        ProductStructure = new OptionSetValue(1),
                        ParentProductId = new EntityReference(Product.EntityLogicalName, _productFamilyId),
                        QuantityDecimal = 2,
                        DefaultUoMScheduleId = new EntityReference(UoMSchedule.EntityLogicalName, _unitGroupId),
                        DefaultUoMId = new EntityReference(UoM.EntityLogicalName, _unit.Id)
                    };
                    _product1Id = _serviceProxy.Create(newProduct1);

                    Console.WriteLine("\nCreated '{0}' under the product family", newProduct1.Name);

                    Product newProduct2 = new Product
                    {
                        Name = "Example Product 2",
                        ProductNumber = "P002",
                        ProductStructure = new OptionSetValue(1),
                        ParentProductId = new EntityReference(Product.EntityLogicalName, _productFamilyId),
                        QuantityDecimal = 2,
                        DefaultUoMScheduleId = new EntityReference(UoMSchedule.EntityLogicalName, _unitGroupId),
                        DefaultUoMId = new EntityReference(UoM.EntityLogicalName, _unit.Id)
                    };
                    _product2Id = _serviceProxy.Create(newProduct2);

                    Console.WriteLine("Created '{0}' under the product family", newProduct2.Name);

                    // Create a price list items for the products  
                    ProductPriceLevel newPriceListItem1 = new ProductPriceLevel
                    {
                        PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName, _priceListId),
                        ProductId = new EntityReference(Product.EntityLogicalName, _product1Id),
                        UoMId = new EntityReference(UoM.EntityLogicalName, _unit.Id),
                        Amount = new Money(20)
                    };
                    _priceListItem1Id = _serviceProxy.Create(newPriceListItem1);

                    Console.WriteLine("\nCreated price list for '{0}'", newProduct1.Name);

                    ProductPriceLevel newPriceListItem2 = new ProductPriceLevel
                    {
                        PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName, _priceListId),
                        ProductId = new EntityReference(Product.EntityLogicalName, _product2Id),
                        UoMId = new EntityReference(UoM.EntityLogicalName, _unit.Id),
                        Amount = new Money(20)
                    };
                    _priceListItem2Id = _serviceProxy.Create(newPriceListItem2);

                    Console.WriteLine("Created price list for '{0}'", newProduct2.Name);

                    // Set the product relationship  
                    // Set Example Product 1 and Example Product 2 as substitute of each other (bi-directional)  
                    ProductSubstitute newProductRelation = new ProductSubstitute
                    {
                        SalesRelationshipType = new OptionSetValue(3),
                        Direction = new OptionSetValue(1),
                        ProductId = new EntityReference(Product.EntityLogicalName, _product1Id),
                        SubstitutedProductId = new EntityReference(Product.EntityLogicalName, _product2Id)
                    };
                    _productRelationId = _serviceProxy.Create(newProductRelation);

                    Console.WriteLine("\nCreated a substitute relation between the two products.");
                    //</snippetCreateandublishProducts1>  

                    // Override a product property at the product level  
                    // In this case we will override the property for 'Example Product 1'  
                    DynamicProperty newOverrideProperty = new DynamicProperty();
                    newOverrideProperty.BaseDynamicPropertyId = new EntityReference(DynamicProperty.EntityLogicalName,
                                               _productPropertyId);
                    newOverrideProperty.RegardingObjectId = new EntityReference(Product.EntityLogicalName, _product1Id);
                    _productOverridenPropertyId = _serviceProxy.Create(newOverrideProperty);

                    // Retrieve the attributes of the cloned property you want to update                      
                    ColumnSet columns = new ColumnSet();
                    columns.AddColumns("name", "isreadonly", "isrequired");
                    DynamicProperty retrievedOverridenProperty = (DynamicProperty)_serviceProxy.Retrieve(
                                               DynamicProperty.EntityLogicalName, _productOverridenPropertyId,
                                               columns);

                    // Update the attributes  
                    retrievedOverridenProperty.Name = "Overridden Example Property";
                    retrievedOverridenProperty.IsReadOnly = true;
                    retrievedOverridenProperty.IsRequired = false;
                    _serviceProxy.Update(retrievedOverridenProperty);
                    Console.WriteLine("\nOverridden the product property for 'Example Product 1'.");

                    // Prompt the user whether to publish the product family and products  
                    bool publishRecords = true;
                    Console.WriteLine("\nDo you want the product records published? (y/n)");
                    String answer = Console.ReadLine();
                    publishRecords = (answer.StartsWith("y") || answer.StartsWith("Y"));

                    if (publishRecords)
                    {
                        PublishProductHierarchyRequest publishReq = new PublishProductHierarchyRequest
                        {
                            Target = new EntityReference(Product.EntityLogicalName, _productFamilyId)
                        };
                        PublishProductHierarchyResponse published = (PublishProductHierarchyResponse)_serviceProxy.Execute(publishReq);
                        if (published.Results != null)
                        {
                            Console.WriteLine("Published the product records");
                        }

                        // Overwrite a product property  
                        Console.WriteLine("\nRevising 'Example Product 1' to demonstrate product property overwrite.");

                        // Retrieve the StateCode of Product that you want to revise                       
                        ColumnSet cols = new ColumnSet();
                        cols.AddColumns("name", "statecode");
                        Product retrievedPublishedProduct = (Product)_serviceProxy.Retrieve(
                                                   Product.EntityLogicalName, _product1Id,
                                                   cols);

                        // Update the state of the Product to "Under Revision"  
                        retrievedPublishedProduct.StateCode = ProductState.UnderRevision;
                        UpdateRequest updatePropertyState = new UpdateRequest
                        {
                            Target = retrievedPublishedProduct
                        };
                        _serviceProxy.Execute(updatePropertyState);
                        Console.WriteLine("\nChanged '{0}' to 'Under Revision' state.", retrievedPublishedProduct.Name);

                        DynamicProperty newOverwriteProperty = new DynamicProperty();
                        newOverwriteProperty.BaseDynamicPropertyId = new EntityReference(DynamicProperty.EntityLogicalName,
                                                   _productOverridenPropertyId);
                        newOverwriteProperty.RegardingObjectId = new EntityReference(Product.EntityLogicalName,
                            _product1Id);
                        _productOverwrittenPropertyId = _serviceProxy.Create(newOverwriteProperty);

                        // Retrieve the attributes of the cloned property you want to update  
                        ColumnSet myCols = new ColumnSet();
                        myCols.AddColumns("name", "isreadonly", "isrequired");
                        DynamicProperty retrievedOverwrittenProperty = (DynamicProperty)_serviceProxy.Retrieve(
                                                   DynamicProperty.EntityLogicalName, _productOverwrittenPropertyId,
                                                   myCols);

                        // Update the attributes of the cloned property to complete the overwrite   
                        retrievedOverwrittenProperty.Name = "Overwritten Example Property";
                        retrievedOverwrittenProperty.IsReadOnly = true;
                        retrievedOverridenProperty.IsRequired = false;
                        _serviceProxy.Update(retrievedOverwrittenProperty);
                        Console.WriteLine("\nOverwritten the product property for 'Example Product 1'.");

                        // Retrieve the StateCode of Product that you want to publish                       
                        ColumnSet prodCols = new ColumnSet();
                        prodCols.AddColumns("name", "statecode");
                        Product retrievedRevisedProduct = (Product)_serviceProxy.Retrieve(
                                                   Product.EntityLogicalName, _product1Id,
                                                   prodCols);

                        // Update the state of the Product to "Active"  
                        retrievedRevisedProduct.StateCode = ProductState.Active;
                        UpdateRequest publishProduct1 = new UpdateRequest
                        {
                            Target = retrievedRevisedProduct
                        };
                        _serviceProxy.Execute(publishProduct1);
                        Console.WriteLine("\nPublished '{0}'.", retrievedRevisedProduct.Name);
                    }
                    #endregion Demonstrate
                }
                else
                {
                    const string UNABLE_TO_LOGIN_ERROR = "Unable to Login to Common Data Service";
                    if (service.LastCrmError.Equals(UNABLE_TO_LOGIN_ERROR))
                    {
                        Console.WriteLine("Check the connection string values in cds/App.config.");
                        throw new Exception(service.LastCrmError);
                    }
                    else
                    {
                        throw service.LastCrmException;
                    }
                }
            }
            catch (Exception ex)
            {
                SampleHelpers.HandleException(ex);
            }

            finally
            {
                if (service != null)
                    service.Dispose();

                Console.WriteLine("Press <Enter> to exit.");
                Console.ReadLine();
            }

        }
    }
}
