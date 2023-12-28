# Introduction

This repo provides samples for apps, solutions, and related services for Dynamics 365. For Dynamics 365 docs, visit <https://docs.microsoft.com/dynamics365>.

## Agent-Specific Real-Time Translation

To support agent-specific real-time translation in Omnichannel for Customer Service, a new field must be added to the `systemuser` entity within the Dataverse. This field will store the ISO 639-1 language code representing the agent's preferred language. The language code should be a two-letter code (e.g., 'de' for German, 'es' for Spanish, etc.).

To enable and configure agent-specific real-time translation, follow these steps:

1. Add a custom field to the `systemuser` entity in the Dataverse to store the ISO 639-1 language code for each agent's preferred language (e.g., 'en' for English, 'de' for German).

2. In the script, locate the `C1WebResourceNamespace` object and find the `agentPreferredLanguageField` property. Replace `'jkalz_preferredlanguagecode'` with the actual schema name of the custom field you added in step 1. This should be a string in single quotes.

3. Set the `enableAgentSpecificTranslation` property to `true` to activate the agent-specific translation feature.

Example configuration in the script:
```javascript
var C1WebResourceNamespace = {
    // ... (other properties)

    // The actual schema name of the custom field for agent's preferred language
    agentPreferredLanguageField: 'your_custom_field_name_here',

    // Enable agent-specific translations
    enableAgentSpecificTranslation: true,

    // ... (rest of the script)
};
```

After configuring these values, the script will use the preferred language settings from each agent's profile to perform translations during customer interactions.
## Related samples repos

- AL language code samples for Dynamics 365 Business Central: <https://github.com/Microsoft/AL>.
- Power Apps and Dataverse samples: <https://github.com/Microsoft/PowerApps-Samples>.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments . 
