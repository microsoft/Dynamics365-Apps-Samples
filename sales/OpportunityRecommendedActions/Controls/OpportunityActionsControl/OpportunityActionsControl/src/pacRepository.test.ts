import { fetchOpportunityActions, normalizeOpportunityId } from "./pacRepository";

const OPPORTUNITY_ID = "00000000-0000-4000-8000-000000000001";
const ROW_ID = "00000000-0000-4000-8000-000000000002";
const FILTER = `msdyn_targetentity_opportunity/opportunityid eq ${OPPORTUNITY_ID} and statecode eq 0 and statuscode eq 1 and msdyn_actionuistatus eq 1`;

describe("Opportunity PAC retrieval", () => {
	test("should normalize a braced record identifier", () => {
		expect(normalizeOpportunityId(" {ABCDEF12-0000-4000-8000-000000000001} ")).toBe(
			"abcdef12-0000-4000-8000-000000000001"
		);
	});

	test.each([undefined, "", "00000000-0000-0000-0000-000000000000", "not-a-guid", "x' or true"])(
		"should reject invalid identity %s",
		(value) => {
			expect(normalizeOpportunityId(value)).toBeNull();
		}
	);

	test("should request active actions without top-five or target deduplication", async () => {
		const entities = Array.from({ length: 8 }, (_, index) => ({
			msdyn_prioritizedactioncatalogueid: `${ROW_ID.slice(0, -1)}${index}`,
			msdyn_actionid: `synthetic-action-${index}`,
		}));
		const retrieveMultipleRecords = jest.fn().mockResolvedValue({ entities });
		const result = await fetchOpportunityActions({ retrieveMultipleRecords }, OPPORTUNITY_ID);
		expect(result.entities).toHaveLength(8);
		const [table, query, pageSize] = retrieveMultipleRecords.mock.calls[0];
		expect(table).toBe("msdyn_prioritizedactioncatalogue");
		const options = new URLSearchParams(query);
		expect(options.getAll("$filter")).toEqual([FILTER]);
		expect(options.getAll("$select")).toHaveLength(1);
		expect(options.has("$top")).toBe(false);
		expect(pageSize).toBe(50);
	});

	test("should not query when the record identifier is invalid", async () => {
		const retrieveMultipleRecords = jest.fn();
		await expect(fetchOpportunityActions({ retrieveMultipleRecords }, "invalid")).rejects.toThrow();
		expect(retrieveMultipleRecords).not.toHaveBeenCalled();
	});

	test("should preserve an encoded paging token using only the SDK query options", async () => {
		const options = `?$filter=${encodeURIComponent(FILTER)}&$skiptoken=%3Ccookie%20page%3D%222%22%2F%3E`;
		const nextLink = `https://example.invalid/api/data/v9.2/msdyn_prioritizedactioncatalogues${options}`;
		const retrieveMultipleRecords = jest.fn().mockResolvedValue({ entities: [] });
		await fetchOpportunityActions({ retrieveMultipleRecords }, OPPORTUNITY_ID, nextLink);
		expect(retrieveMultipleRecords).toHaveBeenCalledWith("msdyn_prioritizedactioncatalogue", options, 50);
	});

	test.each([
		"https://example.invalid/api/data/v9.2/accounts?$skiptoken=x",
		"https://example.invalid/api/data/v9.2/msdyn_prioritizedactioncatalogues",
		"https://example.invalid/api/data/v9.2/msdyn_prioritizedactioncatalogues?$skiptoken=x",
		"https://example.invalid/api/data/v9.2/msdyn_prioritizedactioncatalogues?$filter=msdyn_targetentity_opportunity/opportunityid%20eq%2000000000-0000-4000-8000-000000000009&$skiptoken=x",
		"javascript:alert(1)",
	])("should reject malformed or unrelated continuation %s", async (nextLink) => {
		const retrieveMultipleRecords = jest.fn();
		await expect(fetchOpportunityActions({ retrieveMultipleRecords }, OPPORTUNITY_ID, nextLink)).rejects.toThrow();
		expect(retrieveMultipleRecords).not.toHaveBeenCalled();
	});

	test("should propagate a denied data request rather than caching it as empty", async () => {
		const retrieveMultipleRecords = jest.fn().mockRejectedValue(new Error("Access denied"));
		await expect(fetchOpportunityActions({ retrieveMultipleRecords }, OPPORTUNITY_ID)).rejects.toThrow(
			"Access denied"
		);
	});

	test("should reject a malformed response instead of treating it as empty", async () => {
		const retrieveMultipleRecords = jest.fn().mockResolvedValue({ entities: null });
		await expect(fetchOpportunityActions({ retrieveMultipleRecords }, OPPORTUNITY_ID)).rejects.toThrow(
			"Invalid PAC response."
		);
	});
});
