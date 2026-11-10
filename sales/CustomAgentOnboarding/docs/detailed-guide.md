# Custom agent onboarding for Recommended Actions (detailed guide)

This article provides detailed information about connecting a custom agent to Recommended Actions in Dynamics 365 Sales. For the basic steps, see [Connect your custom agent to Recommended Actions](quickstart.md).

## Integration architecture

Your agent decides *what* a seller should do. Recommended Actions decides *whether and when* to show it, and ranks it alongside the suggestions that Microsoft provides. Everything runs in your Dataverse environment.

1. **Your agent** (a Copilot Studio agent, a Power Automate flow, or your own service) finds a follow-up for a record.
1. The agent calls `msdyn_PushActionDataToRecommendedActionAgent` with your **Source ID**.
1. **Intake** checks the Source ID against your registered source and the record's table, and stores the suggestion.
1. **Ranking** runs on a schedule (about every four hours). It reads the record's signals, applies exclusion rules, and scores the suggestion against all other suggestions.
1. **Sellers** see eligible suggestions in **Recommended actions** on the table's list page and on **Sales home**.
1. Your agent can update or remove its suggestions, and can be notified when a seller marks one done or dismisses it. For details, see [Two-way sync](#two-way-sync).

| Onboarding step | What it sets up |
|---|---|
| Register your agent | Your source and its Source ID, so that intake accepts your suggestions |
| Import the table solution | Lets suggestions point to the table's records, and turns on the seller panel |
| Add ranking signals | Tells ranking which columns indicate value and urgency for the table |
| Connect your agent | The call from your agent to the API |

Keep the following in mind:

- **Identity:** The call runs as the account that your agent connects as. That account needs access to Recommended Actions.
- **Timing:** Suggestions are ranked on a schedule. New ranking settings take effect within an hour.
- **Display:** A suggestion can be received and ranked, but filtered out as not important or not urgent.
- **One card per record:** If a record already has a higher-ranked suggestion, a newer one might not be visible.

## Ranking signals

Before a suggestion reaches sellers, ranking scores it by using *signals*, which are columns read from the record. Two questions decide most of the outcome:

- **Impact:** Is the suggestion important? This is usually how much money is involved.
- **Urgency:** Is it time-sensitive? This is usually how soon something is due.

Opportunity, Lead, Contact, and Account include signals. Other tables start with none.

### What the signals tool sets up for a new table

| Part | What it reads | What it tells ranking |
|---|---|---|
| Signal `record_state` | The record's status | Whether the record is still open |
| Signal `record_value` | Your value column | Impact. Higher values mean more important. |
| Signal `due_date_days` | Days until your date column | Urgency. Negative values are overdue. |
| Exclusion rule `F-RAA-STATE` | Status | Excludes inactive records (for activities, canceled ones) |
| Exclusion rule `F-RAA-VALUE` | Value | Excludes records with a value of 0 or less |
| Benchmark `<table>_estimated_value` | Value of active records over the last 365 days | Whether a value is high or low for your organization |

The value signal, value rule, and benchmark are added only when you specify a value column. The urgency signal is added only when you specify a date column.

### Default columns for the provided tables

| Table | Value column | Due-date column |
|---|---|---|
| Quote (`quote`) | `totalamount` | `effectiveto` |
| Order (`salesorder`) | `totalamount` | `requestdeliveryby` |
| Invoice (`invoice`) | `totalamount` | `duedate` |
| Case (`incident`) | None | `followupby` |
| Email, Appointment, Task, Phone Call | None | `scheduledend` |

You can choose different columns when you run the tool.

### Run the signals tool

Use [Set-Table-Signals.js](../scripts/Set-Table-Signals.js) in the browser console on a Sales Hub page, or [Set-RaaTableSignals.ps1](../scripts/Set-RaaTableSignals.ps1) for new tables. The tool validates the table and columns, shows a preview, downloads a backup of the current settings, saves with a concurrency check, and reads the result back. It changes only the Recommended Actions ranking settings, not business records. A System Administrator normally runs it.

To find logical names, go to Power Apps > **Tables** > your table > **Properties**. Under **Columns**, open a column to see its logical name.

### Adjust signals for Opportunity, Lead, Contact, and Account

If your organization tracks value or urgency in a different column, you can add it by using the same tool. For these tables, the tool adds or updates only two signals, `custom_value` and `custom_due_date`. It doesn't change the existing signals or rules.

> [!CAUTION]
> These signals rank all suggestions for the table, including the suggestions that Microsoft provides. Test the change in a test environment first, and keep the backup file.

### Undo a change

Each save downloads a backup file named `raa-settings-backup-<date>.json`. To restore it, run [Restore-Signals-Backup.js](../scripts/Restore-Signals-Backup.js) in the browser console and provide the backup file. Ranking uses the restored settings within an hour.

## Enable a custom table

To enable a table that your organization created:

1. Open [Get-Your-Package.html](../tools/Get-Your-Package.html) in a browser, enter the table's logical name (for example, `cr123_project`), and download the solution.
1. Import the solution into a development environment.
1. Add ranking signals with your table's value and due-date columns.
1. Add the table to the app that your sellers use, and publish the app.
1. Export the solution from the development environment as a **managed** solution, and import the managed solution into your test and production environments.

> [!NOTE]
> The generator creates an unmanaged solution. Import it only into a development environment.

## Send suggestions without Copilot Studio

### Power Automate

- Add the Dataverse action **Perform an unbound action**, select `msdyn_PushActionDataToRecommendedActionAgent`, and enter the seven values. For details, see [Call the API from code](#call-the-api-from-code).
- Alternatively, import the optional helper flow, [RecommendedActions_SendSuggestion.zip](../solutions/RecommendedActions_SendSuggestion.zip), and call it from your flow by using **Run a child flow**. Your flow must be in a solution to use child flows.

### Other agents

- Connect the agent to the Dataverse MCP server at `https://<org>.crm.dynamics.com/api/mcp`, and use the **invoke_api** tool with the instruction from the quickstart. Your admin must allow the MCP client for the environment.
- Alternatively, call the API directly from code.

## Call the API from code

`msdyn_PushActionDataToRecommendedActionAgent` is a Dataverse custom API (an unbound action). You can call it through the Web API or the Dataverse SDK.

| Parameter | Description |
|---|---|
| `msdyn_SourceAgentId` | The Source ID that you registered |
| `msdyn_ActionId` | Your ID for this suggestion. Sending the same ID again replaces the earlier version. |
| `msdyn_TargetEntityTypeName` | The table's logical name, for example `opportunity` |
| `msdyn_TargetEntityId` | The record ID, lowercase, without braces |
| `msdyn_ActionReason` | One sentence that says what to do, why, and by when |
| `msdyn_ActionUIPayload` | The card definition, as serialized JSON |
| `msdyn_ActionPrioritizationData` | The title and reason for ranking, as serialized JSON |

### Web API example

```http
POST https://<org>.crm.dynamics.com/api/data/v9.2/msdyn_PushActionDataToRecommendedActionAgent
Authorization: Bearer <token>
Content-Type: application/json

{
  "msdyn_SourceAgentId": "renewal-agent",
  "msdyn_ActionId": "renewal_<recordId>_1",
  "msdyn_TargetEntityTypeName": "opportunity",
  "msdyn_TargetEntityId": "<recordId>",
  "msdyn_ActionReason": "The close date passed on October 21. Call the customer today.",
  "msdyn_ActionUIPayload": "{\"version\":\"1.0\",\"payload\":{\"header\":\"Rescue the overdue deal\",\"description\":\"The close date passed on October 21. Call the customer today.\",\"oncardClickActionType\":\"Navigate\",\"oncardClickActionTypeParameters\":\"{etn=\\\"opportunity\\\", id=\\\"<recordId>\\\", pagetype=\\\"entityrecord\\\"}\"}}",
  "msdyn_ActionPrioritizationData": "[{\"actionHeader\":\"Rescue the overdue deal\"},{\"actionDescription\":\"The close date passed on October 21. Call the customer today.\"}]"
}
```

A successful call returns **204 No Content**.

### C# example

```csharp
var card = JsonSerializer.Serialize(new {
    version = "1.0",
    payload = new {
        header = title,
        description = reason,
        oncardClickActionType = "Navigate",
        oncardClickActionTypeParameters = $"{{etn=\"{table}\", id=\"{id}\", pagetype=\"entityrecord\"}}"
    }
});
var ranking = JsonSerializer.Serialize(new object[] {
    new { actionHeader = title }, new { actionDescription = reason } });

var req = new OrganizationRequest("msdyn_PushActionDataToRecommendedActionAgent");
req["msdyn_SourceAgentId"] = "renewal-agent";
req["msdyn_ActionId"] = $"renewal_{id}_1";
req["msdyn_TargetEntityTypeName"] = table;
req["msdyn_TargetEntityId"] = id.ToString("D");
req["msdyn_ActionReason"] = reason;
req["msdyn_ActionUIPayload"] = card;
req["msdyn_ActionPrioritizationData"] = ranking;
service.Execute(req);
```

### Authentication for a service

1. In Microsoft Entra ID, register an application, and store its credential in Azure Key Vault.
1. In the Power Platform admin center, add an application user for the app, and assign a security role with access to Recommended Actions.
1. Request a token for `https://<org>.crm.dynamics.com/.default`. For .NET, `ServiceClient` in `Microsoft.PowerPlatform.Dataverse.Client` handles this.

Send every value as a string. The two JSON values must be serialized JSON text.

## Two-way sync

### From your agent to Recommended Actions

| Scenario | API | Parameters |
|---|---|---|
| New suggestion | `msdyn_PushActionDataToRecommendedActionAgent` | The seven values |
| Update a suggestion | Same API, same `msdyn_ActionId` | The new version replaces the old one after the next ranking run. |
| Remove a suggestion | `msdyn_RAAgent_RemoveActionsV2` | `ActionId`, `TargetId`, `SourceAgentConfigId` (the source's row ID) |
| Mark done or dismissed | `msdyn_SyncActionExecutionStateFromAgent` | `msdyn_ActionId`, `msdyn_ActionState` (2 = done, 3 = dismissed), `msdyn_TargetEntityId`, `msdyn_TargetEntityTypeName` |

### From Recommended Actions to your agent

When a seller marks a suggestion done or gives it a thumbs down, Recommended Actions can call an API that you provide.

1. Create a Dataverse custom API with these string inputs: `ActionId`, `Action` (`markAsDone` or `thumbsDown`), `TargetEntityTypeName`, and `TargetEntityId`.
1. In your source's settings, set **Sync action execution state API config** to `{"syncactionuistatusapiname":"<your custom API unique name>"}`.
1. In the API, update your agent's records, for example to stop sending that suggestion.

## Related information

- [Integrate custom agents with Recommended Actions Agent](https://learn.microsoft.com/dynamics365/sales/developer/recommended-actions-api)
- [Configure Recommended Actions agent](https://learn.microsoft.com/dynamics365/sales/configure-recommended-actions)
- [Dataverse MCP](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp)
