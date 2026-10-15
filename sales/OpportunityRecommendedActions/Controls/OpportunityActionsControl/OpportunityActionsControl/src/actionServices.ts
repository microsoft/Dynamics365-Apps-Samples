import { PacAction } from "./actionPayload";
import { normalizeOpportunityId } from "./pacRepository";

export type LifecycleOperation = "done" | "dismiss";
export interface ActionServices {
	update: (actionId: string, operation: LifecycleOperation) => Promise<void>;
	open: (url: string) => Promise<void>;
}

/** Returns a safe destination following SuggestedActionBuilder's navigation mappings.
 * @param action The selected recommendation.
 * @param opportunityId The current validated Opportunity.
 * @param trackingId A per-control correlation ID.
 */
export function getActionDestination(action: PacAction, opportunityId: string, trackingId: string): string | null {
	if (action.payloadUnavailable || !normalizeOpportunityId(opportunityId)) return null;
	const type = action.clickType?.trim().toLowerCase() || "navigate";
	const parameters = action.clickParameters || {};
	const values: Record<string, unknown> = Object.create(null);
	for (const key of Object.keys(parameters)) values[key.toLowerCase()] = parameters[key];
	const entity = typeof values.etn === "string" ? values.etn.trim().toLowerCase() : "opportunity";
	if (!/^[a-z][a-z0-9_]*$/.test(entity)) return null;
	if (type === "openurl") {
		try {
			const url = new URL(typeof values.url === "string" ? values.url : "");
			return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
		} catch {
			return null;
		}
	}
	if (type === "navigaterecord") {
		const id = normalizeOpportunityId(typeof values.id === "string" ? values.id : null) || opportunityId;
		return `/main.aspx?pagetype=entityrecord&etn=${encodeURIComponent(entity)}&id=${id}`;
	}
	if (type === "navigatelist") {
		const viewId = normalizeOpportunityId(typeof values.viewid === "string" ? values.viewid : null);
		return viewId ? `/main.aspx?pagetype=entitylist&etn=${encodeURIComponent(entity)}&viewid=${viewId}` : null;
	}
	if (type !== "navigate" && type !== "navigatetourl") return null;
	const detailsEvent = ["emailcreated", "meetingended"].includes(action.eventType?.trim().toLowerCase() || "");
	if (detailsEvent && action.actionId) {
		return `/main.aspx?pagetype=control&controlName=msdyn_Sales.DataQualityAgent.ActionDetailsControl&data=${encodeURIComponent(
			JSON.stringify(action.actionId)
		)}`;
	}
	if (
		typeof values.controlname === "string" &&
		(typeof values.pagetype !== "string" || values.pagetype.toLowerCase() !== "entityrecord") &&
		action.actionId
	) {
		if (!/^[a-z][a-z0-9_.]*$/i.test(values.controlname)) return null;
		const data = `/opportunities/${opportunityId}/research/trackingId/${encodeURIComponent(
			trackingId
		)}/actionId/${encodeURIComponent(action.actionId)}`;
		return `/main.aspx?pagetype=control&controlName=${encodeURIComponent(
			values.controlname
		)}&data=${encodeURIComponent(JSON.stringify(data))}`;
	}
	return `/main.aspx?pagetype=entityrecord&etn=opportunity&id=${opportunityId}`;
}

/** Calls the same lifecycle API as the carousel, including its explicit success response.
 * @param fetcher Same-origin authenticated browser transport.
 * @param actionId The business msdyn_actionid, never the PAC row ID.
 * @param operation The user's lifecycle operation.
 */
export async function updateActionState(
	fetcher: typeof fetch,
	actionId: string,
	operation: LifecycleOperation
): Promise<void> {
	if (!actionId?.trim() || (operation !== "done" && operation !== "dismiss")) throw new Error("Invalid action.");
	const response = await fetcher("/api/data/v9.2/msdyn_RAAgent_UpdateRecommendedActionExecutionState", {
		method: "POST",
		credentials: "same-origin",
		headers: { "Content-Type": "application/json", Accept: "application/json", "OData-Version": "4.0" },
		body: JSON.stringify({ msdyn_actionid: actionId, msdyn_operationtype: operation === "done" ? 1 : 0 }),
	});
	if (!response.ok) throw new Error("Action update failed.");
	const body: unknown = await response.json();
	if (!body || typeof body !== "object" || !("msdyn_response" in body)) throw new Error("Invalid action response.");
	const raw = (body as { msdyn_response: unknown }).msdyn_response;
	const result: unknown = typeof raw === "string" ? JSON.parse(raw) : null;
	if (!result || typeof result !== "object" || !("Success" in result) || result.Success !== true) {
		throw new Error("Action update was not accepted.");
	}
}
