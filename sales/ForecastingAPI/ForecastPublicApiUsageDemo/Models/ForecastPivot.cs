using Microsoft.Dynamics.Forecasting.Common.Models;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ForecastPublicApiUsageDemo.Models
{
    public class ForecastPivot
    {
        [DataMember]
        public Guid ForecastPivotId
        {
            get;
            set;
        }

        /// <summary>
        /// Display name for the pivot
        /// </summary>
        [DataMember]
        public string PivotName
        {
            get;
            set;
        }

        /// <summary>
        /// Enum to suggest if its an optionset type pivot or an entity type pivot
        /// </summary>
        [DataMember]
        public ForecastPivotType PivotType
        {
            get;
            set;
        }

        /// <summary>
        /// In case of option set type pivot, this contains optionset entity, optionset attribute name
        /// and relationship of optionset entity with amount entity.
        /// </summary>
        [DataMember]
        public AttributeInfo PivotOptionSetAttributeInfo
        {
            get;
            set;
        }

        /// <summary>
        /// The forecast values are split amongst the records of pivot entity.
        /// And, these records and the corresponding splits are displayed to the user.
        /// </summary>
        [DataMember]
        public EntityInfo PivotEntity
        {
            get;
            set;
        }

        /// <summary>
        /// The source entity contains the attribute to be aggregated.
        /// This can be same as rollup entity of forecast configuration.
        /// </summary>
        [DataMember]
        public EntityInfo SourceEntity
        {
            get;
            set;
        }

        /// <summary>
        /// In case of entity type pivot, this dictionary will provide the
        /// amount attribute name on the source entity corresponding to each column.
        /// E.g. For 'Bestcase', estimatedvalue will be source attribute,
        /// but for 'Won' column, it will be actualvalue.
        /// Note - Added the BsonDictionaryOption since the default BSON serialization technique was "Document" based for dictionary attributes
        /// which had this restriction of key of Dictionary to always being a string. (http://mongodb.github.io/mongo-csharp-driver/2.2/reference/bson/mapping/#dictionary-serialization-options)
        /// The "ArrayOfDocuments" technique doesn't have this restriction
        /// </summary>
        [BsonDictionaryOptions(DictionaryRepresentation.ArrayOfDocuments)]
        [DataMember]
        public Dictionary<Guid, string> AmountAttributesPerColumn
        {
            get;
            set;
        }

        /// <summary>
        /// If the source entity is different from rollup entity of forecast config,
        /// this property describes the relationship between two.
        /// </summary>
        [DataMember]
        public RelationshipInfo AmountEntityToRollupEntityRelation
        {
            get;
            set;
        }

        /// <summary>
        /// This describe the relationship between pivot entity and source entity.
        /// </summary>
        [DataMember]
        public RelationshipInfo AmountEntityToPivotEntityRelation
        {
            get;
            set;
        }

        /// <summary>
        /// Check if pivot should be enabled for quota and column
        /// </summary>
        [DataMember]
        public bool IsPivotEnabledForQuotaAndSimpleColumns
        {
            get;
            set;
        }

        /// <summary>
        /// Check if pivot is set to be Default Pivot
        /// </summary>
        [DataMember]
        public bool isPivotDefault
        {
            get;
            set;
        }
    }

    // Example - Consider user hierarhcy forecast with opportunity as rollup entity.
    // Suppose we need to pivot on product entity. Then, a sample pivot json can be as follows.
    // Please note that the attribute names might not be exact.
    //{
    //    "PivotEntity": {
    //        "EntityLogicalName": "product",
    //        "PrimaryIdAttribute": "productid",
    //        "PrimaryNameAttribute": "name",
    //        "EntitySetName": "products",
    //        "HierarchyAttribute": "parentproductid"
    //    },
    //    "SourceEntity": {
    //        "EntityLogicalName": "opportunityproduct",
    //        "PrimaryIdAttribute": "opportunityproductid",
    //        "PrimaryNameAttribute": "opportunityproductname",
    //        "EntitySetName": "opportunityproducts",
    //        "HierarchyAttribute": null
    //    },
    //    "TargetAttributeName": "extendedamount",
    //    "AmountEntityToRollupEntityRelation": {
    //        "EntityInfo": {
    //            "EntityLogicalName": "opportunityproduct",
    //            "PrimaryIdAttribute": "opportunityproductid",
    //            "PrimaryNameAttribute": "opportunityproductname",
    //            "EntitySetName": "opportunityproducts",
    //            "HierarchyAttribute": null
    //        },
    //        "RelatedFrom": null,
    //        "Relationship": {
    //            "EntityInfo": {
    //                "EntityLogicalName": "opportunity",
    //                "PrimaryIdAttribute": "opportunityid",
    //                "PrimaryNameAttribute": "opportunityname",
    //                "EntitySetName": "opportunities",
    //                "HierarchyAttribute": null
    //            },
    //            "RelatedFrom": "opportunityid",
    //            "Relationship": null
    //        }
    //    },
    //    "AmountEntityToPivotEntityRelation": {
    //        "EntityInfo": {
    //            "EntityLogicalName": "opportunityproduct",
    //            "PrimaryIdAttribute": "opportunityproductid",
    //            "PrimaryNameAttribute": "opportunityproductname",
    //            "EntitySetName": "opportunityproducts",
    //            "HierarchyAttribute": null
    //        },
    //        "RelatedFrom": null,
    //        "Relationship": {
    //            "EntityInfo": {
    //                "EntityLogicalName": "product",
    //                "PrimaryIdAttribute": "productid",
    //                "PrimaryNameAttribute": "name",
    //                "EntitySetName": "products",
    //                "HierarchyAttribute": "parentproductid"
    //            },
    //            "RelatedFrom": "productid",
    //            "Relationship": null
    //        }
    //    }
    //}
}
