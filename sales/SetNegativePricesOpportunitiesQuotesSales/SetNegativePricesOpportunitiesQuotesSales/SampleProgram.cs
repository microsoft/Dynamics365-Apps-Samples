using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk;

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
                    #region Opportunity with negative estimated value

                    // Create a new opportunity with user-specified negative 
                    // estimated value.
                    Opportunity opportunity = new Opportunity
                    {
                        Name = "Example Opportunity",
                        CustomerId = new EntityReference(Account.EntityLogicalName,
                            _accountId),
                        PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName,
                            _priceListId),
                        IsRevenueSystemCalculated = false,
                        EstimatedValue = new Money(-400.00m),
                        FreightAmount = new Money(10.00m),
                        ActualValue = new Money(-390.00m),
                        OwnerId = new EntityReference
                        {
                            Id = _salesRepresentativeIds[0],
                            LogicalName = SystemUser.EntityLogicalName
                        }
                    };
                    _opportunityId = _serviceProxy.Create(opportunity);
                    opportunity.Id = _opportunityId;

                    // Create a catalog product for the opportunity.
                    OpportunityProduct catalogProduct = new OpportunityProduct
                    {
                        OpportunityId = opportunity.ToEntityReference(),
                        ProductId = new EntityReference(Product.EntityLogicalName,
                            _product1Id),
                        UoMId = new EntityReference(UoM.EntityLogicalName,
                            _defaultUnitId),
                        Quantity = 8,
                        Tax = new Money(12.42m),
                    };
                    _catalogProductId = _serviceProxy.Create(catalogProduct);

                    Console.WriteLine("Created opportunity with negative estimated value.");

                    #endregion

                    #region Quote with negative quantity

                    // Create the quote.
                    Quote quote = new Quote()
                    {
                        CustomerId = new EntityReference(Account.EntityLogicalName,
                            _accountId),
                        Name = "Sample Quote",
                        PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName,
                            _priceListId)
                    };
                    _quoteId = _serviceProxy.Create(quote);
                    quote.Id = _quoteId;

                    // Set the quote's product quantity to a negative value.
                    QuoteDetail quoteDetail = new QuoteDetail()
                    {
                        ProductId = new EntityReference(Product.EntityLogicalName,
                            _product1Id),
                        Quantity = -4,
                        QuoteId = quote.ToEntityReference(),
                        UoMId = new EntityReference(UoM.EntityLogicalName,
                            _defaultUnitId)
                    };
                    _quoteDetailId = _serviceProxy.Create(quoteDetail);

                    Console.WriteLine("Created quote with negative quantity.");

                    #endregion

                    #region Sales Order with negative price

                    // Create the sales order.
                    SalesOrder order = new SalesOrder()
                    {
                        Name = "Faux Order",
                        DateFulfilled = new DateTime(2010, 8, 1),
                        PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName,
                            _priceListId),
                        CustomerId = new EntityReference(Account.EntityLogicalName,
                            _accountId),
                        FreightAmount = new Money(20.0M)
                    };
                    _orderId = _serviceProxy.Create(order);
                    order.Id = _orderId;

                    // Add the product to the order with the price overriden with a
                    // negative value.
                    SalesOrderDetail orderDetail = new SalesOrderDetail()
                    {
                        ProductId = new EntityReference(Product.EntityLogicalName,
                            _product1Id),
                        Quantity = 4,
                        SalesOrderId = order.ToEntityReference(),
                        IsPriceOverridden = true,
                        PricePerUnit = new Money(-40.0M),
                        UoMId = new EntityReference(UoM.EntityLogicalName,
                            _defaultUnitId)
                    };
                    _orderDetailId = _serviceProxy.Create(orderDetail);

                    Console.WriteLine("Created order with negative price per unit.");

                    #endregion
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
