const TABLE_NAME = "msdyn_prioritizedactioncatalogue";
const ENTITY_SET = "msdyn_prioritizedactioncatalogues";
const PAGE_SIZE = 50;
const EMPTY_ID = "00000000-0000-0000-0000-000000000000";
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SELECT_COLUMNS = [
	"msdyn_prioritizedactioncatalogueid",
	"msdyn_actionid",
	"msdyn_actionscore",
	"msdyn_actionuipayload",
	"msdyn_scoredetails",
	"msdyn_eventtype",
	"msdyn_actionuistatus",
	"statecode",
	"statuscode",
].join(",");

export type PacRecord = Record<string, unknown>;
export type PacReadClient = Pick<ComponentFramework.WebApi, "retrieveMultipleRecords">;

export interface PacPage {
	entities: PacRecord[];
	nextLink: string | null;
}

/** Normalizes a record identity without accepting query fragments or empty GUIDs.
 * @param value The form-bound identity.
 */
export function normalizeOpportunityId(value: string | null | undefined): string | null {
	const normalized = value
		?.trim()
		.replace(/^\{(.+)\}$/, "$1")
		.toLowerCase();
	return normalized && GUID_PATTERN.test(normalized) && normalized !== EMPTY_ID ? normalized : null;
}

/** Retrieves a caller-authorized page for one Opportunity, without carousel selection rules.
 * @param client The public PCF read API.
 * @param opportunityId The current, validated form record.
 * @param nextLink The continuation supplied by the previous page.
 */
export async function fetchOpportunityActions(
	client: PacReadClient,
	opportunityId: string,
	nextLink?: string
): Promise<PacPage> {
	const id = normalizeOpportunityId(opportunityId);
	if (!id) {
		throw new Error("Invalid opportunity identity.");
	}
	const filter = `msdyn_targetentity_opportunity/opportunityid eq ${id} and statecode eq 0 and statuscode eq 1 and msdyn_actionuistatus eq 1`;
	let options = `?$select=${SELECT_COLUMNS}&$filter=${filter}&$orderby=msdyn_actionscore desc,createdon desc,msdyn_prioritizedactioncatalogueid asc`;
	if (nextLink) {
		const continuation = new URL(nextLink);
		if (
			continuation.protocol !== "https:" ||
			continuation.username ||
			continuation.password ||
			continuation.hash ||
			!continuation.pathname.endsWith(`/${ENTITY_SET}`) ||
			continuation.searchParams.getAll("$filter").length !== 1 ||
			continuation.searchParams.get("$filter") !== filter ||
			continuation.searchParams.getAll("$skiptoken").length !== 1 ||
			!continuation.searchParams.get("$skiptoken")
		) {
			throw new Error("Invalid continuation for this Opportunity.");
		}
		// Keep the server token encoding intact; the SDK, not this URL's origin, owns the request.
		options = nextLink.substring(nextLink.indexOf("?"));
	}
	const result = await client.retrieveMultipleRecords(TABLE_NAME, options, PAGE_SIZE);
	if (!Array.isArray(result.entities)) {
		throw new Error("Invalid PAC response.");
	}
	return { entities: result.entities, nextLink: result.nextLink || null };
}
