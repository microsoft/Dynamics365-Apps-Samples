using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;

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
                    // // Create a Connection Role for account and contact
                    ConnectionRole newConnectionRole = new ConnectionRole
                    {
                        Name = "Example Connection Role",
                        Category = new OptionSetValue((int)connectionrole_category.Business)
                    };

                    _connectionRoleId = _serviceProxy.Create(newConnectionRole);
                    Console.WriteLine("Created {0}.", newConnectionRole.Name);

                    // Create a related Connection Role Object Type Code record for Account
                    ConnectionRoleObjectTypeCode newAccountConnectionRoleTypeCode
                        = new ConnectionRoleObjectTypeCode
                        {
                            ConnectionRoleId = new EntityReference(
                                ConnectionRole.EntityLogicalName, _connectionRoleId),
                            AssociatedObjectTypeCode = Account.EntityLogicalName
                        };

                    _serviceProxy.Create(newAccountConnectionRoleTypeCode);
                    Console.WriteLine(
                        "Created a related Connection Role Object Type Code record for Account."
                        );

                    // Create a related Connection Role Object Type Code record for Contact
                    ConnectionRoleObjectTypeCode newContactConnectionRoleTypeCode
                        = new ConnectionRoleObjectTypeCode
                        {
                            ConnectionRoleId = new EntityReference(
                                ConnectionRole.EntityLogicalName, _connectionRoleId),
                            AssociatedObjectTypeCode = Contact.EntityLogicalName
                        };

                    _serviceProxy.Create(newContactConnectionRoleTypeCode);
                    Console.WriteLine(
                        "Created a related Connection Role Object Type Code record for Contact."
                        );

                    // Associate the connection role with itself.
                    AssociateRequest associateConnectionRoles = new AssociateRequest
                    {
                        Target = new EntityReference(ConnectionRole.EntityLogicalName,
                            _connectionRoleId),
                        RelatedEntities = new EntityReferenceCollection()
                        {
                            new EntityReference(ConnectionRole.EntityLogicalName,
                                _connectionRoleId)
                        },
                        // The name of the relationship connection role association 
                        // relationship in MS CRM.
                        Relationship = new Relationship()
                        {
                            PrimaryEntityRole = EntityRole.Referencing, // Referencing or Referenced based on N:1 or 1:N reflexive relationship.
                            SchemaName = "connectionroleassociation_association"
                        }
                    };

                    _serviceProxy.Execute(associateConnectionRoles);
                    Console.WriteLine("Associated the connection role with itself.");

                    // Create an Account
                    Account setupAccount = new Account { Name = "Example Account" };
                    _accountId = _serviceProxy.Create(setupAccount);
                    Console.WriteLine("Created {0}.", setupAccount.Name);

                    // Create a Contact
                    Contact setupContact = new Contact { LastName = "Example Contact" };
                    _contactId = _serviceProxy.Create(setupContact);
                    Console.WriteLine("Created {0}.", setupContact.LastName);

                    return;
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
