// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.Bot.Connector.DirectLine;
using System;

namespace Microsoft.OmniChannel.MessageRelayProcessor
{
    /// <summary>
    /// A helper class to validate Activity request.
    /// </summary>
    public static class RelayProcessorHelper
    {
        /// <summary>
        /// validating Direct Line activity object.
        /// </summary>
        /// <param name="activity">Activity Data Object</param>
        /// <returns>Validation Result</returns>
        public static ActivityValidationResult Validate(Activity activity)
        {
            var validatedType = typeof(Activity);
            var validationResult = new ActivityValidationResult();

            if (activity == null)
            {
                validationResult.BrokenRules.Add(GetErrorMessageText(nameof(activity), validatedType));
            }

            if (activity != null && activity.From == null)
            {
                validationResult.BrokenRules.Add(GetErrorMessageText(nameof(activity.From), validatedType));
            }

            if (activity != null && string.IsNullOrEmpty(activity.Type))
            {
                validationResult.BrokenRules.Add(GetErrorMessageText(nameof(activity.Type), validatedType));
            }

            if (activity != null && activity.ChannelData == null)
            {
                validationResult.BrokenRules.Add(GetErrorMessageText(nameof(activity.ChannelData), validatedType));
            }

            return validationResult;
        }

        /// <summary>
		/// Gets validation error message for empty field.
		/// </summary>
		/// <param name="fieldName">The field name that is empty.</param>
		/// <param name="dataObjectType">The type of the validated data object.</param>
		/// <returns>The string with error message.</returns>
        private static string GetErrorMessageText(string fieldName, Type dataObjectType)
        {
            return $"The field {fieldName} is not set on {dataObjectType}.";
        }
    }
}
