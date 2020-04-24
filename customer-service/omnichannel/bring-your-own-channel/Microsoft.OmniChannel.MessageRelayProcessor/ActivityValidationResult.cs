// Copyright (c) Microsoft Corporation. All rights reserved.

using System.Collections.Generic;

namespace Microsoft.OmniChannel.MessageRelayProcessor
{
    /// <summary>
	/// The result of data object validation.
	/// </summary>
	public class ActivityValidationResult
    {
        /// <summary>
        /// True if validation succeeded; otherwise false.
        /// </summary>
        public bool IsValid => BrokenRules.Count == 0;

        /// <summary>
        /// The collection of broken validation rules.
        /// </summary>
        public List<string> BrokenRules { get; } = new List<string>();
    }
}
