import { mapPacAction } from "./actionPayload";

const ROW_ID = "00000000-0000-4000-8000-000000000002";

describe("PAC display mapping", () => {
	test("should accept version one as a JSON number", () => {
		const action = mapPacAction({
			msdyn_prioritizedactioncatalogueid: ROW_ID,
			msdyn_actionuipayload: JSON.stringify({ version: 1, payload: { header: "Numeric version" } }),
		});
		expect(action.title).toBe("Numeric version");
		expect(action.payloadUnavailable).toBe(false);
	});

	test("should read the object-valued display envelope without executing navigation", () => {
		const action = mapPacAction({
			msdyn_prioritizedactioncatalogueid: ROW_ID,
			msdyn_actionid: "synthetic-action",
			msdyn_actionscore: 2.5,
			msdyn_actionuistatus: 1,
			msdyn_actionuipayload: JSON.stringify({
				version: "1.0",
				payload: { header: "Review", description: "Evidence", oncardClickActionType: "Execute" },
			}),
		});
		expect(action).toMatchObject({
			id: ROW_ID,
			title: "Review",
			description: "Evidence",
			score: 2.5,
			uiStatus: 1,
			payloadUnavailable: false,
		});
	});

	test.each([
		undefined,
		"",
		"not-json",
		"null",
		"[]",
		'{"version":1.1,"payload":{"header":"Unknown schema"}}',
		'{"version":"2.0","payload":{"header":"Unknown schema"}}',
		'{"version":"1.0","payload":"double-encoded"}',
	])("should retain a fallback row for malformed or unsupported payload %s", (payload) => {
		expect(
			mapPacAction({ msdyn_prioritizedactioncatalogueid: ROW_ID, msdyn_actionuipayload: payload })
		).toMatchObject({ id: ROW_ID, payloadUnavailable: true, title: null });
	});

	test("should preserve distinct PAC rows even when business action IDs match", () => {
		const first = mapPacAction({ msdyn_prioritizedactioncatalogueid: ROW_ID, msdyn_actionid: "same" });
		const second = mapPacAction({
			msdyn_prioritizedactioncatalogueid: "00000000-0000-4000-8000-000000000003",
			msdyn_actionid: "same",
		});
		expect(first.id).not.toBe(second.id);
	});

	test("should reject a response with no valid physical row identity", () => {
		expect(() => mapPacAction({ msdyn_actionid: "synthetic-only" })).toThrow();
	});
});
