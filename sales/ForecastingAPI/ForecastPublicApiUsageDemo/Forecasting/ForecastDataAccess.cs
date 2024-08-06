using ForecastPublicApiUsageDemo.Models;
using ForecastPublicApiUsageDemo.Utility;
using Microsoft.Dynamics.Forecasting.Common.Models;
using Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ForecastPublicApiUsageDemo.Forecasting
{
    class ForecastDataAccess
    {
        private IOrganizationService _organizationService;

        public ForecastDataAccess(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        /// <summary>
        /// This will use the API "GET_ForecastConfigurations" to 
        /// get the entire list of Forecast Configuration the underlying user has access to
        /// </summary>
        /// <returns></returns>
        public List<ForecastConfiguration> GetFCList()
        {
            List<ForecastConfiguration> forecastConfigurationsList = new List<ForecastConfiguration>();
            try
            {
                string respJsonString = ExecuteCrmApiCustomAction(Constants.GET_ForecastConfigurations, "{}");
                forecastConfigurationsList = JsonConvert.DeserializeObject<List<ForecastConfiguration>>(respJsonString);
            }
            catch (Exception ex)
            {
                LogWriter.GetLogWriter().LogWrite("Something went wrong at GetFCList() API");
                LogWriter.GetLogWriter().LogWrite(ex.Message);
            }
            return forecastConfigurationsList;
        }


        /// <summary>
        /// This will use the API "GET_ForecastConfigurationsByName"
        /// to get the Forecast Configuration by Name the underlying user has access to
        /// </summary>
        /// <param name="fcName">Forecast Configuration Name</param>
        /// <returns></returns>
        public List<ForecastConfiguration> GetFCListByName(String fcName)
        {
            var reqObj = new FcByNameRequest()
            {
                Name = fcName
            };

            List<ForecastConfiguration> forecastConfigurationsList = new List<ForecastConfiguration>();

            try
            {
                string respJsonString = ExecuteCrmApiCustomAction(Constants.GET_ForecastConfigurationsByName, reqObj);
                forecastConfigurationsList = JsonConvert.DeserializeObject<List<ForecastConfiguration>>(respJsonString);
            }
            catch (Exception ex)
            {
                LogWriter.GetLogWriter().LogWrite("Something went wrong at GetFCList() API");
                LogWriter.GetLogWriter().LogWrite(ex.Message);
            }

            return forecastConfigurationsList;

        }

        /// <summary>
        /// This will use the API "GET_ParticipatingRecordsFetchXML"
        /// to retrieve fetch xml to get participating records for a forecast configurtaion
        /// </summary>
        /// <param name="fcId">Forecast Configuration Id</param>
        /// <returns></returns>
        public string GetParticipatingRecordsFetchXML(ForecastConfiguration fc, ForecastRecurrence fr, ForecastInstance forecastInstance)
        {
            string fetchXML = "";

            try
            {
                var hierarchyRecordId = forecastInstance.HierarchyEntityRecord.RecordId;
                var columnId = fc.Columns.First(col => col.UniqueName == Constants.columnUniqueName).ForecastConfigurationColumnId;
                var recordViewId = GetRecordViewId(Constants.recordViewName);
                var reqObj = new ParticipatingRecordFetchXMLRequest
                {
                    ForecastConfigurationId = fc.ForecastConfigurationId,
                    ForecastPeriodId = fr.Id,
                    HierarchyRecordId = hierarchyRecordId,
                    ForecastInstanceId = forecastInstance.ForecastInstanceId,
                    ForecastConfigurationColumnId = columnId,
                    RecordViewId = new Guid(Constants.recordViewId),
                    IsRolledUpNodeRequested = true
                };

                fetchXML = ExecuteCrmApiCustomAction(Constants.GET_ParticipatingRecordsFetchXML, reqObj);
            }
            catch (Exception ex)
            {
                LogWriter.GetLogWriter().LogWrite("Something went wrong at GetParticipatingRecordsFetchXML() API");
                LogWriter.GetLogWriter().LogWrite(ex.Message);
            }

            return fetchXML;
        }


        /// <summary>
        /// This will use the API for savedqueries
        /// to retrieve record view id using record view name
        /// public doc link: https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/savedquery?view=dataverse-latest
        /// </summary>
        /// <param name="name">Record view name</param>
        /// <returns></returns>
        public Guid GetRecordViewId(string name)
        {
            QueryExpression query = new QueryExpression("savedquery")
            {
                ColumnSet = new ColumnSet("savedqueryid"),
                Criteria = new FilterExpression
                {
                    Conditions =
                    {
                        new ConditionExpression("name", ConditionOperator.Equal, name)
                    }
                },
                TopCount = 1
            };

            // Execute the query
            EntityCollection results = _organizationService.RetrieveMultiple(query);

            // Process the results
            if (results.Entities.Count > 0)
            {
                Entity savedQuery = results.Entities[0];
                Guid savedQueryId = savedQuery.Id;
                string queryName = savedQuery.GetAttributeValue<string>("name");

                Console.WriteLine($"Saved Query ID: {savedQueryId}");
                Console.WriteLine($"Query Name: {queryName}");
                return savedQueryId;
            }
            else
            {
                Console.WriteLine("No saved query found with the specified name.");
                return new Guid(Constants.recordViewId);
            }
        }

        public Entity[] GetParticipatingRecords(string fetchXML)
        {
            try
            {
                EntityCollection entityCollection = _organizationService.RetrieveMultiple(new FetchExpression(fetchXML));
                return entityCollection.Entities.Count != 0 ? entityCollection.Entities.ToArray() : null;
            }
            catch (Exception ex)
            {
                LogWriter.GetLogWriter().LogWrite("Something went wrong at GetParticipatingRecordsFetchXML() API");
                LogWriter.GetLogWriter().LogWrite(ex.Message);
                throw;
            }

        }

        /// <summary>
        /// This will use the API "GET_ForecastPeriodsByForecastConfigurationId"
        /// to retrieve all the forecast periods under Forecast Configuration
        /// </summary>
        /// <param name="fcId">Forecast Configuration Id</param>
        /// <returns></returns>
        public List<ForecastRecurrence> GetForecastPeriodsList(Guid fcId)
        {
            var reqObj = new GetFRsForFCServiceRequest()
            {
                ForecastConfigurationId = fcId
            };

            List<ForecastRecurrence> forecastPeriods = new List<ForecastRecurrence>();
            try
            {
                string respJsonString = ExecuteCrmApiCustomAction(Constants.GET_FORECASTPERIODS_BY_FORECASTCONFIGID, reqObj);
                forecastPeriods = JsonConvert.DeserializeObject<List<ForecastRecurrence>>(respJsonString);

            }
            catch (Exception ex)
            {
                LogWriter.GetLogWriter().LogWrite("Something went wrong at GetForecastPeriodsList() API");
                LogWriter.GetLogWriter().LogWrite(ex.Message);
            }

            return forecastPeriods;

        }


        /// <summary>
        /// This will use the API "GET_ForecastInstances" to retrieve all the
        /// forecast Instances for the given Forecast Configuration and Forecast Period
        /// </summary>
        /// <param name="fcId">Forecast Configuration Id</param>
        /// <param name="frId">Forecast Period Id</param>
        /// <param name="pageSize">Number of records in a page</param>
        /// <param name="pageNo">Current Page number</param>
        /// <returns></returns>

        public List<ForecastInstance> FetchFullFIList(Guid fcId, Guid frId, int pageSize = 200, int pageNo = 1)
        {
            var watch = new System.Diagnostics.Stopwatch();
            watch.Start();
            List<ForecastInstance> forecastInstances = new List<ForecastInstance>();

            var reqObj = new PublicForecastInstanceListRequest()
            {
                ForecastConfigurationId = fcId,
                ForecastPeriodId = frId,
                PageInfo = new PageInfo()
                {
                    PageSize = pageSize,
                    PageNo = pageNo
                }

            };

            while (true)
            {
                Console.WriteLine("Req Obj Page No: " + reqObj.PageInfo.PageNo);
                try
                {
                    string respJsonString = ExecuteCrmApiCustomAction(Constants.GET_ForecastInstances, reqObj);
                    var fiResponse = JsonConvert.DeserializeObject<FetchForecastInstanceListServiceResponse>(respJsonString);
                    forecastInstances.AddRange(fiResponse.ForecastInstances);
                    Console.WriteLine("Current Size: " + forecastInstances.Count());
                    Console.WriteLine("HasMorePages: " + fiResponse.HasMorePages);
                    Console.WriteLine("Last FI fetched: " + forecastInstances[forecastInstances.Count - 1].ForecastInstanceId);
                    if (fiResponse.HasMorePages == false)
                    {
                        break;
                    }
                    reqObj.PageInfo.PageNo++;
                }
                catch (Exception ex)
                {
                    LogWriter.GetLogWriter().LogWrite("Something went wrong at FetchFullFIList() API");
                    LogWriter.GetLogWriter().LogWrite(ex.Message);
                    Console.WriteLine("Something went wrong at FetchFullFIList() API");
                    Console.WriteLine(ex.Message);
                }
            }
            watch.Stop();
            LogWriter.GetLogWriter().LogWrite($"Fetching all FIs Time: {watch.ElapsedMilliseconds} ms");
            return forecastInstances;
        }

        /// <summary>
        /// This will use the API "Update_SimpleColumnByFIId" to udpate the simple column value
        /// </summary>
        /// <param name="fcId">Forecast Configuration Id</param>
        /// <param name="frId">Forecast Period Id</param>
        /// <param name="forecastInstances">List of Forecast Instances to be updated</param>
        /// <param name="dataSet">Dataset dictionary holding the values to be updated for forecast instances</param>
        /// <returns></returns>
        public List<UpdateSimpleColumnServiceBody<UpdateSimpleColumnByFIIdResponse>> UpdateSimpleColumnByFIId(Guid fcId,
            Guid frId,
           List<ForecastInstance> forecastInstances,
            Dictionary<Guid, Double> dataSet)
        {
            List<UpdateSimpleColumnRequestByFIId> updateSimpleColumnRequestByFIIds = new List<UpdateSimpleColumnRequestByFIId>();
            List<UpdateSimpleColumnServiceBody<UpdateSimpleColumnByFIIdResponse>> updateSimpleColumnServiceBodies = new List<UpdateSimpleColumnServiceBody<UpdateSimpleColumnByFIIdResponse>>();
            var watch = new System.Diagnostics.Stopwatch();
            watch.Start();

            int count = 0;
            int thresholdValue = 50;

            while (count < forecastInstances.Count)
            {
                Console.WriteLine("Updating {0} to {1}", count, count + thresholdValue);
                Console.WriteLine("Remaining Updating {0}", forecastInstances.Count - count);
                updateSimpleColumnRequestByFIIds = new List<UpdateSimpleColumnRequestByFIId>();

                foreach (ForecastInstance forecastInstance in forecastInstances.GetRange(count, Math.Min(thresholdValue, forecastInstances.Count - count)))
                {
                    double value = 0;
                    dataSet.TryGetValue(forecastInstance.HierarchyEntityRecord.RecordId, out value);
                    updateSimpleColumnRequestByFIIds.Add(new UpdateSimpleColumnRequestByFIId(forecastInstance.ForecastInstanceId,
                        forecastInstance.AggregatedColumns[1].ForecastConfigurationColumnId, value, false));
                }
                Console.WriteLine("Request List size: " + updateSimpleColumnRequestByFIIds.Count);
                var reqObj = new UpdateSimpleColumnByFIIdServiceRequest
                {
                    ForecastConfigurationId = fcId,
                    ForecastRecurranceId = frId,
                    SimpleColumnUpdateRequests = updateSimpleColumnRequestByFIIds
                };
                try
                {
                    string respJsonString = ExecuteCrmApiCustomAction(Constants.Update_SimpleColumnByFIId, reqObj);
                    LogWriter.GetLogWriter().LogWrite(respJsonString);
                    var fiResponse = JsonConvert.DeserializeObject<List<UpdateSimpleColumnServiceBody<UpdateSimpleColumnByFIIdResponse>>>(respJsonString);
                    updateSimpleColumnServiceBodies.AddRange(fiResponse);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                count += 49;
            }

            watch.Stop();
            LogWriter.GetLogWriter().LogWrite($"Updating all FIs Time: {watch.ElapsedMilliseconds} ms");
            return updateSimpleColumnServiceBodies;
        }

        /// <summary>
        /// This will execute the public API request
        /// </summary>
        /// <param name="name">Request End Point</param>
        /// <param name="reqObj">Json request Object</param>
        /// <returns></returns>
        private string ExecuteCrmApiCustomAction(string name, object reqObj)
        {
            string reqJSON = JsonConvert.SerializeObject(reqObj);

            var testCustomAction = new OrganizationRequest()
            {
                RequestName = Constants.MSDYN_FORECASTAPI_PATH
            };

            testCustomAction.Parameters.Add("WebApiName", name);
            testCustomAction.Parameters.Add("RequestJson", reqJSON);

            var resp = _organizationService.Execute(testCustomAction);
            var respJsonString = (string)resp.Results["response"];
            return respJsonString;
        }
    }
}
