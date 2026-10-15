import { mapPacAction } from "./actionPayload";
import { getActionDestination, updateActionState } from "./actionServices";

const ID = "00000000-0000-4000-8000-000000000001";
const ROW = "00000000-0000-4000-8000-000000000002";
const TRACKING = "00000000-0000-4000-8000-000000000003";
/** Requires a destination field without hiding missing navigation data behind a type assertion.
 * @param value The resolved destination or parameter.
 */
function required(value: string | null): string {
	if (value === null) throw new Error("Expected navigation data.");
	return value;
}

/** Creates a synthetic stored payload through the actual mapper.
 * @param type The requested click type.
 * @param parameters The serialized parameters.
 * @param eventType The source event.
 */
function action(type = "Navigate", parameters = "{}", eventType?: string) {
	return mapPacAction({
		msdyn_prioritizedactioncatalogueid: ROW,
		msdyn_actionid: "business-action",
		msdyn_eventtype: eventType,
		msdyn_actionuipayload: JSON.stringify({
			version: "1.0",
			payload: { header: "Review", oncardClickActionType: type, oncardClickActionTypeParameters: parameters },
		}),
	});
}

describe("Recommendation interaction contracts", () => {
	test("opens the research control from the deployed legacy parameter format", () => {
		const url = new URL(
			required(
				getActionDestination(
					action(
						"Navigate",
						`{etn="Opportunity", id=${ID}, pagetype="Control", controlName="OpportunityResearch.ResearchControl"}`
					),
					ID,
					TRACKING
				)
			),
			"https://example.invalid"
		);
		expect(url.searchParams.get("controlName")).toBe("OpportunityResearch.ResearchControl");
		expect(JSON.parse(required(url.searchParams.get("data")))).toBe(
			`/opportunities/${ID}/research/trackingId/${TRACKING}/actionId/business-action`
		);
	});
	test.each(["EmailCreated", "MeetingEnded"])(
		"routes %s to action details before the producer's research control",
		(event) => {
			const url = new URL(
				required(
					getActionDestination(
						action(
							"Navigate",
							'{"controlName":"OpportunityResearch.ResearchControl","pagetype":"control"}',
							event
						),
						ID,
						TRACKING
					)
				),
				"https://example.invalid"
			);
			expect(url.searchParams.get("controlName")).toBe("msdyn_Sales.DataQualityAgent.ActionDetailsControl");
			expect(JSON.parse(required(url.searchParams.get("data")))).toBe("business-action");
		}
	);
	test("falls back to the current Opportunity form", () => {
		expect(getActionDestination(action(), ID, TRACKING)).toBe(
			`/main.aspx?pagetype=entityrecord&etn=opportunity&id=${ID}`
		);
	});
	test("handles structured record and list navigation", () => {
		expect(
			getActionDestination(action("NavigateRecord", JSON.stringify({ etn: "account", id: ROW })), ID, TRACKING)
		).toContain(`etn=account&id=${ROW}`);
		expect(
			getActionDestination(
				action("NavigateList", JSON.stringify({ etn: "opportunity", viewId: ROW })),
				ID,
				TRACKING
			)
		).toContain(`pagetype=entitylist&etn=opportunity&viewid=${ROW}`);
	});
	test.each(["javascript:alert(1)", "data:text/html,test", "https://user:password@example.invalid"])(
		"rejects unsafe URL %s",
		(url) => {
			expect(getActionDestination(action("OpenUrl", JSON.stringify({ url })), ID, TRACKING)).toBeNull();
		}
	);
	test("allows safe external URLs but not arbitrary execution types or malformed identity", () => {
		expect(getActionDestination(action("OpenUrl", '{"url":"https://example.invalid/docs"}'), ID, TRACKING)).toBe(
			"https://example.invalid/docs"
		);
		expect(getActionDestination(action("Execute", "{}"), ID, TRACKING)).toBeNull();
		expect(getActionDestination(action(), "invalid", TRACKING)).toBeNull();
	});
	test("extracts only string reason and impact independently of malformed card JSON", () => {
		const value = mapPacAction({
			msdyn_prioritizedactioncatalogueid: ROW,
			msdyn_actionuipayload: "bad",
			msdyn_scoredetails: JSON.stringify({ Explanation: "Reason", actionImpact: "Impact" }),
		});
		expect(value.reason).toBe("Reason");
		expect(value.impact).toBe("Impact");
		expect(getActionDestination(value, ID, TRACKING)).toBeNull();
		expect(
			mapPacAction({
				msdyn_prioritizedactioncatalogueid: ROW,
				msdyn_scoredetails: '{"Explanation":{},"actionImpact":[]}',
			}).reason
		).toBeNull();
	});
	test.each([
		["done", 1],
		["dismiss", 0],
	] as const)("sends the logical action ID and %s operation to the server API", async (operation, code) => {
		const fetcher = jest
			.fn()
			.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({ msdyn_response: '{"Success":true}' }) });
		await updateActionState(fetcher, "business-action", operation);
		expect(fetcher).toHaveBeenCalledTimes(1);
		const [url, options] = fetcher.mock.calls[0];
		expect(url).toBe("/api/data/v9.2/msdyn_RAAgent_UpdateRecommendedActionExecutionState");
		expect(options.credentials).toBe("same-origin");
		expect(JSON.parse(options.body)).toEqual({ msdyn_actionid: "business-action", msdyn_operationtype: code });
	});
	test.each([
		{},
		{ msdyn_response: '{"Success":false}' },
		{ msdyn_response: "bad" },
		{ msdyn_response: '{"Success":"true"}' },
	])("does not treat HTTP success as lifecycle success: %j", async (body) => {
		const fetcher = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(body) });
		await expect(updateActionState(fetcher, "business-action", "done")).rejects.toThrow();
	});
	test("does not fall back to a direct write on denied requests", async () => {
		const fetcher = jest.fn().mockResolvedValue({ ok: false });
		await expect(updateActionState(fetcher, "business-action", "done")).rejects.toThrow();
		expect(fetcher).toHaveBeenCalledTimes(1);
	});
	test("does not send a request without a business identity", async () => {
		const fetcher = jest.fn();
		await expect(updateActionState(fetcher, " ", "done")).rejects.toThrow();
		expect(fetcher).not.toHaveBeenCalled();
	});
});
