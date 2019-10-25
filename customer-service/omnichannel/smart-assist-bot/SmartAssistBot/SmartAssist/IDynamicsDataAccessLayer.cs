// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Threading.Tasks;

namespace Microsoft.BotBuilderSamples
{
    public interface IDynamicsDataAccessLayer
    {
        Task<string> FullTextKBSearchAsync(string searchString);
    }
}