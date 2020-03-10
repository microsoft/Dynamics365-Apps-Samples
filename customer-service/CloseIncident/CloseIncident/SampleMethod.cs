using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using PowerApps.Samples.LoginUX;
using System;
using System.Configuration;
using System.ServiceModel;
using Microsoft.Crm.Sdk.Messages;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        //private static Guid member1;
        private static Guid _incidentId;
        private static Guid _appointmentId;
        private static Guid _accountId;

        private static bool prompt = true;
        /// <summary>
        /// Function to set up the sample.
        /// </summary>
        /// <param name="service">Specifies the service to connect to.</param>
        /// 
        /// <summary>
        /// This method creates any entity records that this sample requires.
        /// Creates the email activity.
        /// </summary>
        private static void CreateRequiredRecords(CrmServiceClient service)
        {
            // Create an account to act as a customer for the incident.
            var account = new Account
            {
                Name = "Litware, Inc.",
                Address1_StateOrProvince = "Colorado"
            };
            _accountId = (service.Create(account));
        }

        
        private static void NotifyTimeSpentOnIncident(CrmServiceClient service)
        {
            // Calculate the total number of minutes spent on an incident. 
            var calculateRequestTime = new CalculateTotalTimeIncidentRequest
            {
                IncidentId = _incidentId
            };
            var response =
                (CalculateTotalTimeIncidentResponse)service.Execute(calculateRequestTime);

            Console.WriteLine("  {0} minutes have been spent on the incident.",
                response.TotalTime);
        }
        private static void NotifyEntityCreated(String entityName, Guid entityId)
        {
            Console.WriteLine("  {0} created with GUID {{{1}}}",
                entityName, entityId);
        }
        private static void NotifyValidityOfIncidentSolvedStateChange(CrmServiceClient service)
        {
            // Validate the state transition.  
            var isValidRequest = new IsValidStateTransitionRequest
            {
                Entity = new EntityReference(Incident.EntityLogicalName, _incidentId),
                NewState = IncidentState.Resolved.ToString(),
                NewStatus = (int)incident_statuscode.ProblemSolved
            };

            var response =
                (IsValidStateTransitionResponse)service.Execute(isValidRequest);
            var isValidString = response.IsValid ? "is valid" : "is not valid";
            Console.WriteLine("  The transition to a completed status reason {0}.",
                isValidString);
        }
        private static void RunIncidentManipulation(CrmServiceClient service)
        {
            Console.WriteLine("=== Creating and Closing an Incident (Case) ===");

            // Create an incident.
            var incident = new Incident
            {
                CustomerId = new EntityReference(Account.EntityLogicalName, _accountId),
                Title = "Sample Incident"
            };

            _incidentId = service.Create(incident);
            NotifyEntityCreated(Incident.EntityLogicalName, _incidentId);

            // Create a 30-minute appointment regarding the incident.
            var appointment = new Appointment
            {
                ScheduledStart = DateTime.Now,
                ScheduledEnd = DateTime.Now.Add(new TimeSpan(0, 30, 0)),
                Subject = "Sample 30-minute Appointment",
                RegardingObjectId = new EntityReference(Incident.EntityLogicalName,
                    _incidentId)
            };

            _appointmentId = service.Create(appointment);
            NotifyEntityCreated(Appointment.EntityLogicalName, _appointmentId);

            // Show the time spent on the incident before closing the appointment.
            NotifyTimeSpentOnIncident(service);
            // Check the validity of the state transition to closed on the incident.
            NotifyValidityOfIncidentSolvedStateChange(service);
            // Close the appointment.
            var setAppointmentStateReq = new SetStateRequest
            {
                EntityMoniker = new EntityReference(Appointment.EntityLogicalName,
                    _appointmentId),
                State = new OptionSetValue((int)AppointmentState.Completed),
                Status = new OptionSetValue((int)appointment_statuscode.Completed)
            };

            service.Execute(setAppointmentStateReq);

            Console.WriteLine("  Appointment state set to completed.");

            // Show the time spent on the incident after closing the appointment.
            NotifyTimeSpentOnIncident(service);
            // Check the validity of the state transition to closed again.
            NotifyValidityOfIncidentSolvedStateChange(service);

            // Create the incident's resolution.
            var incidentResolution = new IncidentResolution
            {
                Subject = "Resolved Sample Incident",
                IncidentId = new EntityReference(Incident.EntityLogicalName, _incidentId)
            };

            // Close the incident with the resolution.
            var closeIncidentRequest = new CloseIncidentRequest
            {
                IncidentResolution = incidentResolution,
                Status = new OptionSetValue((int)incident_statuscode.ProblemSolved)
            };

            service.Execute(closeIncidentRequest);

            Console.WriteLine("  Incident closed.");
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
                service.Delete(Account.EntityLogicalName, _accountId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

        private static void CleanUpSample(CrmServiceClient service)
        {
            DeleteRequiredRecords(service, prompt);
        }
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
        
    
        private static bool CheckIfNotValidEntity(EntityReference entity)
        {
            switch (entity.LogicalName)
            {
                case "opportunity":
                case "quote":
                case "salesorder":
                case "invoice":
                case "opportunityproduct":
                case "invoicedetail":
                case "quotedetail":
                case "salesorderdetail":
                    return false;

                default:
                    return true;
            }
        }

        // Method to calculate price in an opportunity        
        private static void CalculateOpportunity(EntityReference entity, IOrganizationService service)
        {
            Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("statecode"));
            OptionSetValue statecode = (OptionSetValue)e["statecode"];
            if (statecode.Value == 0)
            {
                ColumnSet columns = new ColumnSet();
                columns.AddColumns("totaltax", "totallineitemamount", "totalamountlessfreight", "discountamount");
                Entity opp = service.Retrieve(entity.LogicalName, entity.Id, columns);

                QueryExpression query = new QueryExpression("opportunityproduct");
                query.ColumnSet.AddColumns("quantity", "priceperunit");
                query.Criteria.AddCondition("opportunityid", ConditionOperator.Equal, entity.Id);
                EntityCollection ec = service.RetrieveMultiple(query);
                opp["totallineitemamount"] = 0;

                decimal total = 0;
                decimal discount = 0;
                decimal tax = 0;

                for (int i = 0; i < ec.Entities.Count; i++)
                {
                    total = total + ((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value);
                    (ec.Entities[i])["extendedamount"] = new Money(((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value));
                    service.Update(ec.Entities[i]);
                }

                opp["totallineitemamount"] = new Money(total);

                // Calculate discount based on the total amount
                discount = CalculateDiscount(total);
                total = total - discount;
                opp["discountamount"] = new Money(discount);
                opp["totalamountlessfreight"] = new Money(total);
                service.Update(opp);

                // Calculate tax after the discount is applied
                tax = CalculateTax(total);
                total = total + tax;
                opp["totaltax"] = new Money(tax);
                opp["totalamount"] = new Money(total);
                opp["estimatedvalue"] = new Money(total);
                service.Update(opp);
            }
            return;
        }

        // Method to calculate extended amount in the product line items in an opportunity
        private static void CalculateOpportunityProduct(EntityReference entity, IOrganizationService service)
        {
            try
            {
                ColumnSet columns = new ColumnSet();
                Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("quantity", "priceperunit"));
                decimal total = 0;
                total = total + ((decimal)e["quantity"] * ((Money)e["priceperunit"]).Value);
                e["extendedamount"] = new Money(total);
                service.Update(e);
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                System.Diagnostics.Debug.Write(ex.Message);
            }
        }

        #region Calculate Quote Price
        // Method to calculate price in a quote
        private static void CalculateQuote(EntityReference entity, IOrganizationService service)
        {
            Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("statecode"));
            OptionSetValue statecode = (OptionSetValue)e["statecode"];
            if (statecode.Value == 0)
            {
                ColumnSet columns = new ColumnSet();
                columns.AddColumns("totaltax", "totallineitemamount", "totalamountlessfreight", "discountamount");
                Entity quote = service.Retrieve(entity.LogicalName, entity.Id, columns);

                QueryExpression query = new QueryExpression("quotedetail");
                query.ColumnSet.AddColumns("quantity", "priceperunit");
                query.Criteria.AddCondition("quoteid", ConditionOperator.Equal, entity.Id);
                EntityCollection ec = service.RetrieveMultiple(query);
                quote["totallineitemamount"] = 0;

                decimal total = 0;
                decimal discount = 0;
                decimal tax = 0;

                for (int i = 0; i < ec.Entities.Count; i++)
                {
                    total = total + ((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value);
                    (ec.Entities[i])["extendedamount"] = new Money(((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value));
                    service.Update(ec.Entities[i]);
                }

                quote["totallineitemamount"] = new Money(total);

                // Calculate discount based on the total amount
                discount = CalculateDiscount(total);
                total = total - discount;
                quote["discountamount"] = new Money(discount);
                quote["totalamountlessfreight"] = new Money(total);
                service.Update(quote);

                // Calculate tax after the discount is applied
                tax = CalculateTax(total);
                total = total + tax;
                quote["totaltax"] = new Money(tax);
                quote["totalamount"] = new Money(total);
                service.Update(quote);
            }
            return;
        }

        // Method to calculate extended amount in the product line items in a quote
        private static void CalculateQuoteProduct(EntityReference entity, IOrganizationService service)
        {
            try
            {
                ColumnSet columns = new ColumnSet();
                Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("quantity", "priceperunit"));
                decimal total = 0;
                total = total + ((decimal)e["quantity"] * ((Money)e["priceperunit"]).Value);
                e["extendedamount"] = new Money(total);
                service.Update(e);
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                System.Diagnostics.Debug.Write(ex.Message);
            }
        }

        #endregion

        #region Calculate Order Price
        // Method to calculate price in an order
        private static void CalculateOrder(EntityReference entity, IOrganizationService service)
        {
            Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("statecode"));
            OptionSetValue statecode = (OptionSetValue)e["statecode"];
            if (statecode.Value == 0)
            {
                ColumnSet columns = new ColumnSet();
                columns.AddColumns("totaltax", "totallineitemamount", "totalamountlessfreight", "discountamount");
                Entity order = service.Retrieve(entity.LogicalName, entity.Id, columns);

                QueryExpression query = new QueryExpression("salesorderdetail");
                query.ColumnSet.AddColumns("quantity", "salesorderispricelocked", "priceperunit");
                query.Criteria.AddCondition("salesorderid", ConditionOperator.Equal, entity.Id);

                QueryExpression query1 = new QueryExpression("salesorderdetail");
                query1.ColumnSet.AddColumns("salesorderispricelocked");
                query1.Criteria.AddCondition("salesorderid", ConditionOperator.Equal, entity.Id);

                EntityCollection ec = service.RetrieveMultiple(query);
                EntityCollection ec1 = service.RetrieveMultiple(query1);
                order["totallineitemamount"] = 0;

                decimal total = 0;
                decimal discount = 0;
                decimal tax = 0;

                for (int i = 0; i < ec.Entities.Count; i++)
                {
                    total = total + ((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value);
                    (ec1.Entities[i])["extendedamount"] = new Money(((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value));
                    service.Update(ec1.Entities[i]);
                }

                order["totallineitemamount"] = new Money(total);

                // Calculate discount based on the total amount
                discount = CalculateDiscount(total);
                total = total - discount;
                order["discountamount"] = new Money(discount);
                order["totalamountlessfreight"] = new Money(total);
                service.Update(order);

                // Calculate tax after the discount is applied
                tax = CalculateTax(total);
                total = total + tax;
                order["totaltax"] = new Money(tax);
                order["totalamount"] = new Money(total);
                service.Update(order);
            }
            return;
        }

        // Method to calculate extended amount in the product line items in a order
        private static void CalculateOrderProduct(EntityReference entity, IOrganizationService service)
        {
            try
            {
                ColumnSet columns = new ColumnSet();
                Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("quantity", "priceperunit", "salesorderispricelocked"));
                Entity e1 = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("quantity", "salesorderispricelocked"));
                decimal total = 0;
                total = total + ((decimal)e["quantity"] * ((Money)e["priceperunit"]).Value);
                e1["extendedamount"] = new Money(total);
                service.Update(e1);
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                System.Diagnostics.Debug.Write(ex.Message);
            }
        }

        #endregion

        #region Calculate Invoice Price
        // Method to calculate price in an invoice
        private static void CalculateInvoice(EntityReference entity, IOrganizationService service)
        {
            Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("statecode"));
            OptionSetValue statecode = (OptionSetValue)e["statecode"];
            if (statecode.Value == 0)
            {
                ColumnSet columns = new ColumnSet();
                columns.AddColumns("totaltax", "totallineitemamount", "totalamountlessfreight", "discountamount");

                Entity invoice = service.Retrieve(entity.LogicalName, entity.Id, columns);

                QueryExpression query = new QueryExpression("invoicedetail");
                query.ColumnSet.AddColumns("quantity", "invoiceispricelocked", "priceperunit");
                query.Criteria.AddCondition("invoiceid", ConditionOperator.Equal, entity.Id);

                QueryExpression query1 = new QueryExpression("invoicedetail");
                query1.ColumnSet.AddColumns("quantity", "invoiceispricelocked");
                query1.Criteria.AddCondition("invoiceid", ConditionOperator.Equal, entity.Id);

                EntityCollection ec = service.RetrieveMultiple(query);
                EntityCollection ec1 = service.RetrieveMultiple(query1);

                invoice["totallineitemamount"] = 0;

                decimal total = 0;
                decimal discount = 0;
                decimal tax = 0;

                for (int i = 0; i < ec.Entities.Count; i++)
                {
                    total = total + ((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value);
                    (ec1.Entities[i])["extendedamount"] = new Money(((decimal)ec.Entities[i]["quantity"] * ((Money)ec.Entities[i]["priceperunit"]).Value));
                    service.Update(ec1.Entities[i]);
                }

                invoice["totallineitemamount"] = new Money(total);

                // Calculate discount based on the total amount
                discount = CalculateDiscount(total);
                total = total - discount;
                invoice["discountamount"] = new Money(discount);
                invoice["totalamountlessfreight"] = new Money(total);
                service.Update(invoice);

                // Calculate tax after the discount is applied
                tax = CalculateTax(total);
                total = total + tax;
                invoice["totaltax"] = new Money(tax);
                invoice["totalamount"] = new Money(total);
                service.Update(invoice);
            }
            return;
        }

        // Method to calculate extended amount in the product line items in an invoice
        private static void CalculateInvoiceProduct(EntityReference entity, IOrganizationService service)
        {
            try
            {
                ColumnSet columns = new ColumnSet();
                Entity e = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("quantity", "priceperunit", "invoiceispricelocked"));
                Entity e1 = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet("quantity", "invoiceispricelocked"));
                decimal total = 0;
                total = total + ((decimal)e["quantity"] * ((Money)e["priceperunit"]).Value);
                e1["extendedamount"] = new Money(total);
                service.Update(e1);
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                System.Diagnostics.Debug.Write(ex.Message);
            }
        }

        #endregion


        // Method to calculate discount.
        private static decimal CalculateDiscount(decimal amount)
        {
            decimal discount = 0;

            if (amount > (decimal)1000.00 && amount < (decimal)5000.00)
            {
                discount = amount * (decimal)0.05;
            }
            else if (amount >= (decimal)5000.00)
            {
                discount = amount * (decimal)0.10;
            }
            return discount;
        }

        // Method to calculate tax.        
        private static decimal CalculateTax(decimal amount)
        {
            decimal tax = 0;
            if (amount < (decimal)5000.00)
            {
                tax = amount * (decimal)0.10;
            }
            else
            {
                tax = amount * (decimal)0.08;
            }
            return tax;
        }
    }

}

    

