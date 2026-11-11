# Sample: Configure the Field Service Work Ingestion Agent

This sample finishes the connection and trigger-flow setup for the Field Service Email Agent (Work Ingestion Agent). It is adapted from the agent setup PowerShell sample and is intended for a non-production preview environment with the agent components already installed. It is not a complete onboarding script.

## Prerequisites

- PowerShell 7 or later.
- A Dataverse environment with Dynamics 365 Field Service version 8.8.900.428 or later and the Field Service Email Agent components provisioned. The version alone does not guarantee that these preview components are available.
- An agent user identity with the required Field Service, Copilot Studio, and Power Automate licenses, including permission to use premium connectors. Assign the **Field Service - Field Service Email Agent** and **Environment Maker** roles to this identity.
- A shared mailbox and queue configured for server-side synchronization, with the mailbox approved, tested, and enabled. Set the `msdyn_FSWorkIngestionAgent.SharedMailboxAddress` environment variable to the shared mailbox address.
- Microsoft Dataverse and Microsoft Copilot Studio connections created in the target environment, authenticated as the agent user identity.
- An environment administrator account authorized to update connection references and activate the agent's Power Automate flows.

The script uses the `Microsoft.PowerApps.PowerShell` and `Az.Accounts` modules (`Az.Accounts` version 2.17 or later). It attempts to install missing modules for the current user from the configured PowerShell repository. If your organization restricts module installation, arrange for the modules to be installed before running the script.

## How to run this sample

1. Open a PowerShell 7 console in this sample folder.
2. In the Power Platform admin center, find the environment ID and Dataverse URL for the **same** target environment.
3. In the Power Apps maker portal, select that environment and open **Connections**. Record the connection name/ID for each of the two connections. Use the unique connection name/ID, not the connector type name. The script also accepts a display name, but uses the first matching connection if display names are duplicated.
4. Replace the placeholders below and run the script. When prompted for device authentication, sign in as the environment administrator.

```powershell
.\configureWorkIngestionAgent.ps1 `
    -environmentId '<environment-id>' `
    -dataverseUrl 'https://<organization>.crm.dynamics.com' `
    -DVConnectionName '<dataverse-connection-name-or-id>' `
    -MCSConnectionName '<copilot-studio-connection-name-or-id>'
```

Use the actual Dataverse URL for your region, including `https://`, without a trailing slash. Omitted mandatory parameters are prompted for at runtime.

| Parameter | Value |
| --- | --- |
| `environmentId` | Power Platform environment ID used to look up the environment and its connections. |
| `dataverseUrl` | Dataverse base URL used for token acquisition and Web API requests. |
| `DVConnectionName` | Existing Microsoft Dataverse connection name/ID (or unique display name). |
| `MCSConnectionName` | Existing Microsoft Copilot Studio connection name/ID (or unique display name). |

Only these four inputs are required. No HTTP connector is used.

## What this sample does

The script authenticates interactively, retrieves a secure Dataverse access token, and checks that the environment is accessible. It then updates the two product connection references to use the supplied connections and activates these two product workflows:

| Connector | Workflow ID |
| --- | --- |
| Microsoft Dataverse | `8fa8d877-0928-4e0a-b462-9ebf46915ff3` |
| Microsoft Copilot Studio | `77a708ea-a1b2-4042-951b-93011306f83b` |

The connection-reference logical names and workflow IDs in the script identify agent solution components; they are not example tenant or environment values. Confirm that the target environment contains those components before running this sample.

**Running this script changes the environment.** It overwrites the two connection-reference assignments and enables the two trigger flows, which can start processing agent emails. Record the existing assignments and flow states before running it. Changes are sequential, not transactional: an error stops execution but does not roll back earlier updates. Restore previous assignments and flow states manually if needed.

The script does not create users, assign licenses or roles, create connections, synchronize mailboxes, or configure forms and Field Service settings. Complete those onboarding steps separately. After a successful run, inspect the connection references and flow states in the Field Service Copilot solution, complete the remaining product configuration, and validate the agent with a test email in the non-production environment.
