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
//<snippetCodeCustomizationService>

// Define REMOVE_PROXY_TYPE_ASSEMBLY_ATTRIBUTE if you plan on compiling the output from
// this CrmSvcUtil extension with the output from the unextended CrmSvcUtil in the same
// assembly (this assembly attribute can only be defined once in the assembly).
#define REMOVE_PROXY_TYPE_ASSEMBLY_ATTRIBUTE

using System;
using System.CodeDom;
using System.Diagnostics;
//using Microsoft.Crm.Services.Utility;

namespace Microsoft.Crm.Sdk.Samples
{
    public interface ICustomizeCodeDomService
    {
        void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services);
    }
    /// <summary>
    /// Create an implementation of ICustomizeCodeDomService if you want to manipulate the
    /// code dom after ICodeGenerationService has run.
    /// </summary>
    public sealed class CodeCustomizationService : ICustomizeCodeDomService
    {
        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            Trace.TraceInformation("Entering ICustomizeCodeDomService.CustomizeCodeDom");
            Trace.TraceInformation(
                "Number of Namespaces generated: {0}", codeUnit.Namespaces.Count);

            #if REMOVE_PROXY_TYPE_ASSEMBLY_ATTRIBUTE

            foreach (CodeAttributeDeclaration attribute in codeUnit.AssemblyCustomAttributes)
            {
                Trace.TraceInformation("Attribute BaseType is {0}",
                    attribute.AttributeType.BaseType);
                if (attribute.AttributeType.BaseType ==
                    "Microsoft.Xrm.Sdk.Client.ProxyTypesAssemblyAttribute")
                {
                    codeUnit.AssemblyCustomAttributes.Remove(attribute);
                    break;
                }
            }

            #endif

            // Iterate over all of the namespaces that were generated.
            for (var i = 0; i < codeUnit.Namespaces.Count; ++i)
            {
                var types = codeUnit.Namespaces[i].Types;
                Trace.TraceInformation("Number of types in Namespace {0}: {1}",
                    codeUnit.Namespaces[i].Name, types.Count);
                // Iterate over all of the types that were created in the namespace.
                for (var j = 0; j < types.Count; )
                {
                    // Remove the type if it is not an enum (all OptionSets are enums) or has no members.
                    if (!types[j].IsEnum || types[j].Members.Count == 0)
                    {
                        types.RemoveAt(j);
                    }
                    else
                    {
                        j += 1;
                    }
                }
            }
            Trace.TraceInformation("Exiting ICustomizeCodeDomService.CustomizeCodeDom");
        }
    }
}
//</snippetCodeCustomizationService>