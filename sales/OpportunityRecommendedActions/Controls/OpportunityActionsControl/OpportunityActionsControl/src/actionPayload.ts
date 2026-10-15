import { normalizeOpportunityId, PacRecord } from "./pacRepository";

export interface PacAction {
	id: string;
	actionId: string | null;
	title: string | null;
	description: string | null;
	reason: string | null;
	impact: string | null;
	eventType: string | null;
	clickType: string | null;
	clickParameters: Record<string, unknown> | null;
	score: number | null;
	uiStatus: number | null;
	state: number | null;
	statusReason: number | null;
	payloadUnavailable: boolean;
}

/** Narrows untrusted JSON to a property container.
 * @param value The decoded value.
 */
function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Reads display text without coercing arbitrary objects.
 * @param value The source value.
 */
function text(value: unknown): string | null {
	return typeof value === "string" && value.trim() ? value : null;
}

/** Reads a finite numeric field.
 * @param value The source value.
 */
function numeric(value: unknown): number | null {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Parses supported JSON or the carousel's legacy key=value navigation format without evaluating code.
 * @param value Serialized navigation parameters.
 */
function parseClickParameters(value: unknown): Record<string, unknown> | null {
	if (typeof value !== "string" || !value.trim()) return null;
	try {
		const parsed: unknown = JSON.parse(value);
		return isObject(parsed) ? parsed : null;
	} catch {
		const result: Record<string, unknown> = {};
		for (const match of Array.from(value.matchAll(/(\w+)\s*=\s*(?:"([^"]*)"|([^,}\s]+))/g))) {
			result[match[1]] = (match[2] ?? match[3]).trim();
		}
		return Object.keys(result).length ? result : null;
	}
}

/** Maps a PAC snapshot to validated display and interaction data, retaining malformed-payload rows.
 * @param row The caller-authorized Dataverse row.
 */
export function mapPacAction(row: PacRecord): PacAction {
	const id = normalizeOpportunityId(text(row.msdyn_prioritizedactioncatalogueid));
	if (!id) {
		throw new Error("PAC row identity is missing or invalid.");
	}
	let payload: Record<string, unknown> | null = null;
	const raw = text(row.msdyn_actionuipayload);
	if (raw) {
		try {
			const envelope: unknown = JSON.parse(raw);
			if (
				isObject(envelope) &&
				(envelope.version === "1.0" || envelope.version === 1) &&
				isObject(envelope.payload)
			) {
				payload = envelope.payload;
			}
		} catch {
			payload = null;
		}
	}
	const title = text(payload?.header);
	let scoreDetails: Record<string, unknown> | null = null;
	try {
		const parsed: unknown = JSON.parse(text(row.msdyn_scoredetails) || "null");
		if (isObject(parsed)) scoreDetails = parsed;
	} catch {
		// Missing or malformed explanations must not hide an otherwise usable recommendation.
	}
	return {
		id,
		actionId: text(row.msdyn_actionid),
		title,
		description: text(payload?.description),
		reason: text(scoreDetails?.Explanation),
		impact: text(scoreDetails?.actionImpact),
		eventType: text(row.msdyn_eventtype),
		clickType: text(payload?.oncardClickActionType),
		clickParameters: parseClickParameters(payload?.oncardClickActionTypeParameters),
		score: numeric(row.msdyn_actionscore),
		uiStatus: numeric(row.msdyn_actionuistatus),
		state: numeric(row.statecode),
		statusReason: numeric(row.statuscode),
		payloadUnavailable: !payload || !title,
	};
}
