import { getCardContent } from "./cardContent";

describe("Compact recommendation content", () => {
	test("keeps the full reason but omits repeated truncated descriptions", () => {
		expect(
			getCardContent({
				reason: "Legal review is pending. Please follow up.",
				description: "Legal review is pending...",
				impact: "Legal review is pending...",
			})
		).toEqual({ summary: "Legal review is pending. Please follow up.", details: [] });
	});
	test("suppresses repetitions regardless of whitespace and case", () => {
		expect(
			getCardContent({
				reason: "Review the quote",
				description: " Review  the quote ",
				impact: "REVIEW THE QUOTE",
			})
		).toEqual({ summary: "Review the quote", details: [] });
	});
	test("retains distinct details for expansion", () => {
		expect(
			getCardContent({
				reason: "Approval is due tomorrow.",
				description: "Send the proposal.",
				impact: "Protect the close date.",
			})
		).toEqual({ summary: "Approval is due tomorrow.", details: ["Send the proposal.", "Protect the close date."] });
	});
	test("falls back to the description", () => {
		expect(getCardContent({ reason: null, description: "Follow up.", impact: null })).toEqual({
			summary: "Follow up.",
			details: [],
		});
	});
	test("retains a longer impact containing additional information", () => {
		expect(
			getCardContent({
				reason: "Close date is near.",
				description: null,
				impact: "Close date is near. Secure the approval.",
			}).details
		).toEqual(["Close date is near. Secure the approval."]);
	});
	test("handles missing text", () => {
		expect(getCardContent({ reason: null, description: null, impact: null })).toEqual({
			summary: null,
			details: [],
		});
	});
});
