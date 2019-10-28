using System.Collections.Generic;

namespace CoreBot.Models
{

    /// <summary>
    /// Action data to be set to invoke Macros on Action.Submit
    /// </summary>
    public class MacroData {
        /// <summary>
        /// Name of the macro as defined in the org - This is case sensitive
        /// </summary>
        public string MacroName { get; set; }

        /// <summary>
        /// Parameters to the macro
        /// </summary>
        public Dictionary<string, string> MacroParameters { get; set; }
    }

    /// <summary>
    /// Action data to be set to invoke Custom action on Action.Submit
    /// </summary>
    public class CustomActionData {
        /// <summary>
        /// Name of the Custom action - This is case sensitive
        /// </summary>
        public string CustomAction { get; set; }

        /// <summary>
        /// Custom parameters to be passed to Custom action
        /// </summary>
        public object CustomParameters { get; set; }
    }
}
