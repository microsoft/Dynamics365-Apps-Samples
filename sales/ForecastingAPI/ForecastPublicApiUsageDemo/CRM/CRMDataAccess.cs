using Microsoft.Dynamics.Forecasting.Common.DataAccess;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;

namespace ForecastPublicApiUsageDemo.CRM
{
    class CRMDataAccess
    {
		private IOrganizationService _service;
		private IOrganizationService _baseService;
		private IOrganizationServiceFactory _serviceFactory;

		public CRMDataAccess(IOrganizationService service, IOrganizationServiceFactory serviceFactory)
		{
			this._service = service;
			this._baseService = service;
			this._serviceFactory = serviceFactory;
		}

		/// <summary>
		/// Set user context.
		/// </summary>
		/// <returns></returns>
		public void SetUserContext(Guid userId)
		{
			this._service = this._serviceFactory.CreateOrganizationService(userId);
		}

		/// <summary>
		/// Reset user context.
		/// </summary>
		/// <returns></returns>
		public void ResetUserContext()
		{
			this._service = this._baseService;
		}

		/// <summary>
		/// Wrapper on organization service create SDK
		/// </summary>
		/// <param name="record"></param>
		/// <returns>guid of created record</returns>
		public Guid Create(Entity record)
		{
			return this._service.Create(record);
		}

		/// <summary>
		/// Method to retrieve entity.
		/// </summary>
		/// <param name="entityName"></param>
		/// <param name="id"></param>
		/// <param name="columnSet"></param>
		/// <returns></returns>
		public Entity Retrieve(string entityName, Guid id, ColumnSet columnSet)
		{
			return this._service.Retrieve(entityName, id, columnSet);
		}

		/// <summary>
		/// Method to retrieve entity collection based on FetchExpression.
		/// </summary>
		/// <param name="expression"></param>
		/// <returns></returns>
		public EntityCollection RetrieveMultiple(FetchExpression expression)
		{
			return this._service.RetrieveMultiple(expression);
		}

		/// <summary>
		/// Method to retrieve entity collection based on QueryExpression.
		/// </summary>
		/// <param name="expression"></param>
		/// <returns></returns>
		public EntityCollection RetrieveMultiple(QueryExpression expression)
		{
			return this._service.RetrieveMultiple(expression);
		}

		/// <summary>
		/// Method to retrieve record based on QueryExpression.
		/// </summary>
		/// <param name="expression"></param>
		/// <returns></returns>
		public IEnumerable<Entity> Retrieve(QueryExpression expression)
		{
			PagedEntityEnumerator entityEnumerator = new PagedEntityEnumerator(this._service, expression);

			//Use Entity enumerator
			while (entityEnumerator.MoveNext())
			{
				//Create object from current entity
				yield return entityEnumerator.Current;
			}

			//End enumeration
			yield break;
		}

		/// <summary>
		/// Method to update record.
		/// </summary>
		/// <param name="record"></param>
		public void Update(Entity record)
		{
			this._service.Update(record);
		}

		/// <summary>
		/// Method to update multiple record.
		/// </summary>
		/// <param name="records"></param>
		public void UpdateMultiple(EntityCollection records)
		{
			var requestToUpdateRecords = new ExecuteTransactionRequest()
			{
				// Create an empty organization request collection.
				Requests = new OrganizationRequestCollection(),
				ReturnResponses = false
			};

			if (records != null && records.Entities != null)
			{
				int requests = 0;
				foreach (var entity in records.Entities)
				{
					UpdateRequest updateRequest = new UpdateRequest { Target = entity };
					requestToUpdateRecords.Requests.Add(updateRequest);
					requests++;

					// Maximum batch size of execute multiple = 1000.
					if (requests >= 1000)
					{
						this._service.Execute(requestToUpdateRecords);
						requestToUpdateRecords.Requests.Clear();
						requests = 0;
					}
				}
				if (requests > 0)
					this._service.Execute(requestToUpdateRecords);
			}
		}

		/// <summary>
		/// Method to delete a record.
		/// </summary>
		/// <param name="entityName"></param>
		/// <param name="id"></param>
		public void Delete(string entityName, Guid id)
		{
			this._service.Delete(entityName, id);
		}

		/// <summary>
		/// Method to excute organization request.
		/// </summary>
		/// <param name="request"></param>
		/// <returns></returns>
		public OrganizationResponse Execute(OrganizationRequest request)
		{
			return this._service.Execute(request);
		}
	}
}
