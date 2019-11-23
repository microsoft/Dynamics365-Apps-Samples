// =====================================================================
//
//  This file is part of the Microsoft Dynamics CRM SDK Code Samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or online documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
//
// =====================================================================
//<snippetFilteringService>

// Define SKIP_STATE_OPTIONSETS if you plan on using this extension in conjunction with
// the unextended CrmSvcUtil, since it already generates state optionsets.
#define SKIP_STATE_OPTIONSETS

using System;
using System.Collections.Generic;
//using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;

namespace Microsoft.Crm.Sdk.Samples
{ 

    public interface ICodeWriterFilterService
    {
    bool GenerateAttribute(AttributeMetadata attributeMetadata, IServiceProvider services);
    bool GenerateEntity(EntityMetadata entityMetadata, IServiceProvider services);
    bool GenerateOption(OptionMetadata optionMetadata, IServiceProvider services);
    bool GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata,
    IServiceProvider services);
    bool GenerateServiceContext(IServiceProvider services);
    }   
    /// <summary>
    /// Create an implementation of ICodeWriterFilterService if you want to provide your own
    /// logic for whether or not a given item will have code generated for it.
    /// </summary>
    public sealed class FilteringService : ICodeWriterFilterService
    {
        private Dictionary<String, bool> GeneratedOptionSets { get; set; }

        private ICodeWriterFilterService DefaultService { get; set; }

        public FilteringService(ICodeWriterFilterService defaultService)
        {
            DefaultService = defaultService;
            GeneratedOptionSets = new Dictionary<String, bool>();
        }

        /// <summary>
        /// Does not mark the OptionSet for generation if it has already been marked for
        /// generation.
        /// </summary>
        public bool GenerateOptionSet(
            OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            #if SKIP_STATE_OPTIONSETS 
                // Only skip the state optionsets if the user of the extension wishes to.
                if (optionSetMetadata.OptionSetType == OptionSetType.State)
                {
                    return false;
                }
            #endif

            if (optionSetMetadata.IsGlobal.HasValue && optionSetMetadata.IsGlobal.Value)
            {
                if (!GeneratedOptionSets.ContainsKey(optionSetMetadata.Name))
                {
                    GeneratedOptionSets[optionSetMetadata.Name] = true;
                    return true;
                }
            }
            else
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Ideally, we wouldn't generate any attributes, but we must in order to leverage
        /// the logic in CrmSvcUtil.  If the attribute for an OptionSet is not generated,
        /// then a null reference exception is thrown when attempting to create the
        /// OptionSet.  We will remove these in our ICustomizeCodeDomService implementation.
        /// </summary>
        public bool GenerateAttribute(AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            return (attributeMetadata.AttributeType == AttributeTypeCode.Picklist
                || attributeMetadata.AttributeType == AttributeTypeCode.State
                || attributeMetadata.AttributeType == AttributeTypeCode.Status);
        }

        /// <summary>
        /// Ideally, we wouldn't generate any entities, but we must in order to leverage
        /// the logic in CrmSvcUtil.  If an entity which contains a custom OptionSet
        /// attribute is not generated, then the custom OptionSet will not be generated,
        /// either.  We will remove these in our ICustomizeCodeDomService implementation.
        /// </summary>
        public bool GenerateEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            return DefaultService.GenerateEntity(entityMetadata, services);
        }

        /// <summary>
        /// We don't want to generate any relationships.
        /// </summary>
        public bool GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata,
            IServiceProvider services)
        {
            return false;
        }

        /// <summary>
        /// We don't want to generate any service contexts.
        /// </summary>
        public bool GenerateServiceContext(IServiceProvider services)
        {
            return false;
        }

        public bool GenerateOption(OptionMetadata optionMetadata, IServiceProvider services)
        {
            return DefaultService.GenerateOption(optionMetadata, services);
        }
    }
}
//</snippetFilteringService>