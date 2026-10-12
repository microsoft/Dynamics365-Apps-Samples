---
languages:
- typescript
products:
- dynamics-sales
- power-apps
page_type: sample
level: intermediate
role: developer
description: "A PCF pilot that displays existing Recommended Actions Agent recommendations on an Opportunity form in Dynamics 365 Sales."
---

# Sample: Opportunity recommended actions PCF

This Power Apps Component Framework (PCF) control displays existing Recommended Actions Agent recommendations on a Dynamics 365 Sales Opportunity form. It provides expandable reasons, refresh, scroll paging, and **Done** and **Dismiss** actions. Recommendation titles do not navigate, and numeric priority scores are not displayed.

> This is a **pilot sample for evaluation**, not a supported production release. Review the prerequisites and known limitations before importing into a nonproduction environment.

The parent Sales index describes older C# samples. Use this sample's instructions instead: this is a TypeScript PCF for Dynamics 365 Sales online, not a Visual Studio F5 or on-premises sample.

## Download the solution

Download [RAAOpportunityActionsPilot-1.0.6.0.zip](download/RAAOpportunityActionsPilot-1.0.6.0.zip) using **Download raw file** on its GitHub file page. Do not import the repository's **Download ZIP** archive; that contains source code, not a Dataverse solution.

| Item | Value |
| --- | --- |
| Solution | `RAAOpportunityActionsPilot`, version `1.0.6.0`, unmanaged |
| Control | `Raa.Pilot.OpportunityActionsControl`, version `0.1.7` |
| Publisher | `RAAOpportunityPilot`, prefix `raapilot` |
| Download size | 49,198 bytes |
| SHA-256 | `52c862b0bfaa340bda56762f6c52a94ac2af23fa1f09a0fcd36bb1a2fb83f173` |

The ZIP contains **only the control**. It has no Opportunity form, security role, table or backend API. Importing it does not change the Opportunity form layout or create recommendations; form placement is a separate step below. The publisher identity is retained from the pilot and must be agreed with the environment owner before adoption.

## Prerequisites

- Dynamics 365 Sales online with the Recommended Actions Agent backend already configured and producing Opportunity recommendations. This is not an on-premises compatibility claim.
- The `msdyn_prioritizedactioncatalogue` table, its Opportunity relationship, and `msdyn_RAAgent_UpdateRecommendedActionExecutionState` API installed in the target environment. They are not supplied by this sample.
- Appropriate solution-import and form-customization permissions for the installer.
- Verified least-privilege access for the intended sellers. Do not grant broad table access merely to make the sample work.
- Approval to use a test environment and test records. Done/Dismiss changes recommendation state.

## Import and configure

1. Back up the target form and customizations through your normal change process. Start with a sandbox, not production.
2. Open [Power Apps](https://make.powerapps.com), select the correct environment, then **Solutions > Import solution**. Import the solution ZIP linked above and publish customizations after the import completes.
3. Open the Opportunity main form used by the intended model-driven app and users, preferably from your own customization solution.
4. Add a one-column section where the panel should appear, for example below **Up next**. Keep the existing sections and fields intact.
5. Add **Opportunity recommended actions (pilot)**. Bind **Anchor column** (`anchorField`) to a single-line text column such as **Topic**. It is an anchor only; the control returns no changed column values. Keep the original editable Topic field where sellers need it.
6. Configure **Entity name** (`entityName`) as `opportunity`. Bind **Opportunity ID** (`entityId`) to the current Opportunity's primary-key column, `opportunityid`, as described in the [public PCF record-binding guidance](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/faq#how-can-i-access-the-record-id-or-table-name). **Do not hardcode a record ID.** If the required binding cannot be configured in your form designer, stop and confirm the supported setup with the owner; do not assume leaving it blank is supported.
7. Hide the host label if desired, save and publish. Reopen the correct app and form.
8. Verify an existing Opportunity, an unsaved Opportunity, and navigation between two different Opportunities. Each saved record must display only its own recommendations.
9. Test the intended seller role and a denied-access role. Confirm reads and Done/Dismiss behavior; use disposable recommendations for lifecycle tests.

Only Web has live pilot evidence. Device registration or automated narrow-layout tests do not establish mobile/tablet compatibility; validate those clients separately if required.

## Expected behavior and troubleshooting

- Active recommendations for the current Opportunity are sorted by stored score, although the numeric score is not shown. Scroll the list for additional pages.
- **Show more / Show less** expands or collapses a card's reasons; it does not select another Opportunity or recalculate recommendations.
- **Refresh** reloads existing recommendations. It does not trigger the scoring service.
- **Done / Dismiss** uses the existing lifecycle API and refreshes the list only after a confirmed success.
- If no recommendations appear, check that the backend produced active rows for this Opportunity, record binding is correct, and the user has the intended access. Do not expand permissions indiscriminately.
- If the component is missing from the form designer, confirm successful solution import and publication, then reopen the designer.
- If an old layout appears, check the actual app/form and publication status, close and reopen the record, and refresh. Do not clear all browser storage or authentication data as a blanket fix.

## Known limitations

- **Record binding:** version `0.1.7` retains a fallback to the undocumented `context.mode.contextInfo` property when explicit inputs are empty. Configure and validate explicit inputs; the fallback is not a supported portability guarantee.
- **Property help:** the historical pilot's anchor-field help says the current Opportunity is read automatically. That wording describes the fallback, not a supported alternative to configuring `entityId` and `entityName` as above.
- **Authorization:** native caller-scoped Dataverse reads are not certified equivalent to RAA assignment/target-ownership filtering. Seller visibility and lifecycle authorization require an owner-approved decision and testing.
- **Host APIs:** the existing lifecycle adapter uses the model-driven host's same-origin session. Its PCF surface compatibility requires owner review before broader use.
- **Accessibility:** automated component/layout/accessibility tests are not complete screen-reader or customer-environment certification. Keyboard focus after successful Done/Dismiss refresh also needs live validation.
- **Data:** the control renders stored recommendations. Do not include real records, environment URLs, credentials or browser captures in contributions or issue reports.

## Build from source

The sample has its own npm workspace and public npm/NuGet feed configuration. It does not require the internal product repository. For development, use Node.js 22 and npm. Solution packaging also requires a compatible .NET/MSBuild installation for the checked-in Power Apps packages and .NET Framework 4.6.2 reference assemblies.

From this sample directory:

```text
npm install
npm run verify
npm run build:solution
```

`verify` generates manifest types, type-checks production and test code, checks formatting/lint, runs Jest, and builds the production bundle. `build:solution` creates a local unmanaged solution package without importing or publishing anything.

**Source-build status:** a clean public-feed restore and standalone test/build run have not yet completed for this contribution because registry access was unavailable during preparation. Direct versions are pinned; a reviewed transitive lockfile is still pending. Do not infer that the included historical pilot ZIP is a new standalone build. Before redistributing a rebuilt package, validate import/upgrade and assign a distinct release version if its contents differ.

## Remove the sample

Remove the component from every affected form and publish. **Deleting an unmanaged solution container does not remove the components it introduced.** Deleting the underlying custom control is a separate dependency-checked operation requiring change approval. Do not delete backend RAA tables, APIs, or the Topic column simply because this sample used them.

## License, notices and support

The source contribution follows the repository's [MIT license](../../LICENSE). Third-party packages retain their own licenses; the solution ZIP retains its embedded bundle-license notices. See [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt).

For contributions and security reporting, follow the repository [contribution guidance](../../README.md#contributing) and [security policy](../../SECURITY.md). Do not post credentials or customer data in public issues. This sample does not establish a production support commitment or replace the owner's release, security and privacy approvals.