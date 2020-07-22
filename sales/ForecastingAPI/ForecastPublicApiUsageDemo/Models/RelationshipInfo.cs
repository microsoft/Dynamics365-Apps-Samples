using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains relation ship information between entities. like linked entity in CRM
    /// </summary>
    public class RelationshipInfo
    {
        /// <summary>
        /// logical name of entityset
        /// </summary>
        public EntityInfo EntityInfo { get; set; }

        /// <summary>
        /// linking attribute
        /// </summary>
        public string RelatedFrom { get; set; }

        /// <summary>
        /// linking attribute
        /// </summary>
        public RelationshipInfo Relationship { get; set; }               
    }

    /*
     * EXAMPLE RELATION FROM OPPORTUNITY TO TERRITORY
     * {
                        EntityInfo : {
                                EntityName : 'opportunity',
                                PrimaryNameAttribute : 'opportunityname',
                                PrimaryIdAttribute : 'opportunityid',
                                EntitySetAttribute : '',                               
                            },
                        RelatedFrom : null,                        
                        Relationship :    {
                                Entityinfo : {
                                            EntityName : 'systemuser',
                                            PrimaryNameAttribute : 'fullname',
                                            PrimaryIdAttribute : 'systemuserid',
                                            EntitySetAttribute : '',
                                        },
                                RelatedFrom : 'owninguserid',
                                Relationship :   {
                                            Entityinfo : {
                                                        EntityName : 'territory',
                                                        PrimaryNameAttribute : 'name',
                                                        PrimaryIdAttribute : 'territoryid',
                                                        EntitySetAttribute : 'Territories',
                                                        HierarchyAttribute : 'new_parentterritoryid'
                                                    },
                                            RelatedFrom : 'territoryid'                                            
                                        }
                                  }
                     }

        */
}