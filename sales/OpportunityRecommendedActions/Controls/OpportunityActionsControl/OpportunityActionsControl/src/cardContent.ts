import { PacAction } from "./actionPayload";

/** Normalizes stored text only for duplicate detection, not for display.
 * @param value The stored display text.
 */
function comparable(value: string): string {
	return value
		.trim()
		.replace(/(?:\.{3}|…)\s*$/, "")
		.replace(/\s+/g, " ")
		.toLowerCase();
}

/** Selects one summary and distinct supplementary details without inventing recommendation text.
 * @param action The stored recommendation.
 */
export function getCardContent(action: Pick<PacAction, "reason" | "description" | "impact">) {
	const summary = action.reason || action.description || null;
	const shown = summary ? [comparable(summary)] : [];
	const details: string[] = [];
	for (const candidate of [action.description, action.impact]) {
		if (!candidate) continue;
		const normalized = comparable(candidate);
		if (!normalized || shown.some((existing) => existing === normalized || existing.startsWith(normalized)))
			continue;
		details.push(candidate);
		shown.push(normalized);
	}
	return { summary, details };
}
