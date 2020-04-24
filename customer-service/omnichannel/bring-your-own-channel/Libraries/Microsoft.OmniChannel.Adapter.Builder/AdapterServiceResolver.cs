// Copyright (c) Microsoft Corporation. All rights reserved.

namespace Microsoft.OmniChannel.Adapter.Builder
{
    /// <summary>
    /// Dependency Injection Resolver Shared Delegate
    /// </summary>
    /// <param name="key">Adapter Type</param>
    /// <returns>Adapter builder interface</returns>
    public delegate IAdapterBuilder AdapterServiceResolver(string key);
}
