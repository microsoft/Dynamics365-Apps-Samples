# Custom agent onboarding for Recommended Actions

This sample shows how to connect your own agent to Recommended Actions in Dynamics 365 Sales, so that its suggestions are ranked and shown to sellers alongside the suggestions that Microsoft provides.

## Get started

1. Read the [quickstart](docs/quickstart.md). It covers the three steps: register your agent, enable your table, and connect your agent.
1. For architecture, ranking signals, custom tables, Power Automate, code samples, and two-way sync, see the [detailed guide](docs/detailed-guide.md).

## Contents

| Folder | Contents | When you need it |
|---|---|---|
| [docs](docs) | Quickstart and detailed guide | Always |
| [solutions](solutions) | Managed solutions that enable Account, Case, Email, Appointment, Task, Phone Call, Quote, Order, and Invoice. `RecommendedActions_SendSuggestion.zip` is an optional Power Automate helper flow. | Only for tables other than Opportunity, Lead, and Contact |
| [scripts](scripts) | `Set-Table-Signals.js` (adds ranking signals), `Restore-Signals-Backup.js` (undoes a signals change), and `Set-RaaTableSignals.ps1` (PowerShell alternative) | After you import a table solution |
| [tools](tools) | `Get-Your-Package.html`, which generates a solution for a custom table | Only for a custom table |

## Which files do I need?

| Your agent's suggestions are for | Table setup | Agent connection |
|---|---|---|
| Opportunity, Lead, or Contact | None | Dataverse MCP Server tool and one instruction |
| Account | Account solution, only if the panel doesn't appear | Dataverse MCP Server tool and one instruction |
| Case, Email, Appointment, Task, Phone Call, Quote, Order, or Invoice | The table's solution, then `Set-Table-Signals.js` | Dataverse MCP Server tool and one instruction |
| A custom table | Generate a solution with `Get-Your-Package.html`, then `Set-Table-Signals.js` | Dataverse MCP Server tool and one instruction |

## Prerequisites

- Dynamics 365 Sales with Recommended Actions set up
- The System Administrator role in the environment
- Copilot Studio, if you use the Dataverse MCP Server to connect your agent

Try the sample in a test environment first.

## Related information

- [Configure Recommended Actions agent](https://learn.microsoft.com/dynamics365/sales/configure-recommended-actions)
- [Integrate custom agents with Recommended Actions Agent](https://learn.microsoft.com/dynamics365/sales/developer/recommended-actions-api)
