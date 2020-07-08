using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.Collections;
using System.Collections.Generic;


namespace Microsoft.Dynamics.Forecasting.Common.DataAccess
{
    /// <summary>
    /// Enumerator object for paged entity retrieval from CRM
    /// </summary>
    public sealed class PagedEntityEnumerator : IEnumerator<Entity>
    {
        #region Constructor
        public PagedEntityEnumerator(IOrganizationService dataAccessObject, QueryExpression query)
        {
            //Setup private members
            _query = query;
            _organizationDataAccessObject = dataAccessObject;

            //Initialize state
            InitializeEnumerator();
        }
        #endregion

        #region IEnumerator Implementation
        public bool MoveNext()
        {
            //Increment index
            _currentEntityIndex++;

            //Check if there are any records left to be enumerated
            if (_currentEntityIndex == _currentPageSize && _hasMorePages)
            {
                RetrieveNextPage();
                _currentEntityIndex = 0;
            }

            //Return true if there are more entities
            return _currentEntityIndex < _currentPageSize;
        }

        public Entity Current
        {
            get
            {
                //Pull from cache
                return _entities.Entities[_currentEntityIndex];
            }
        }

        object IEnumerator.Current
        {
            get
            {
                return this.Current;
            }
        }

        public void Reset()
        {
            InitializeEnumerator();
        }

        public void Dispose()
        {
            //Nothing to dispose. IEnumerator extends this interface.
        }
        #endregion

        #region Implementation Details
        private void RetrieveNextPage()
        {
            //Retrieve a page of entities
            if (_organizationDataAccessObject != null)
            {
                _entities = _organizationDataAccessObject.RetrieveMultiple(_query);
            }

            //Set up page info for next query
            _query.PageInfo.PagingCookie = _entities.PagingCookie;
            _query.PageInfo.PageNumber++;

            //Check for more pages
            _hasMorePages = _entities.MoreRecords;
            _currentPageSize = _entities.Entities.Count;
        }

        private void InitializeEnumerator()
        {
            //Initilize pointer
            _currentEntityIndex = -1;

            //Set collection properties
            _hasMorePages = true;
            _currentPageSize = 0;
        }
        #endregion

        #region Private Members
        private QueryExpression _query;
        private bool _hasMorePages;
        private int _currentPageSize;
        private int _currentEntityIndex;
        private EntityCollection _entities;
        private IOrganizationService _organizationDataAccessObject;
        #endregion
    }
}

