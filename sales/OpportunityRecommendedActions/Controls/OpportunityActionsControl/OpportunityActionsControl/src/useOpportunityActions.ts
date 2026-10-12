import React from "react";

import { mapPacAction, PacAction } from "./actionPayload";
import { fetchOpportunityActions, PacReadClient } from "./pacRepository";

interface LoadState {
	identity: string | null;
	items: PacAction[];
	nextLink: string | null;
	loading: boolean;
	failed: boolean;
}

/** Loads caller-readable pages with per-instance, per-record request isolation.
 * @param identity The current validated Opportunity ID, or null when not ready.
 * @param client The public PCF read API.
 */
export function useOpportunityActions(identity: string | null, client: PacReadClient) {
	const clientRef = React.useRef(client);
	clientRef.current = client;
	const generation = React.useRef(0);
	const busy = React.useRef(false);
	const consumedTokens = React.useRef(new Set<string>());
	const [state, setState] = React.useState<LoadState>({
		identity: null,
		items: [],
		nextLink: null,
		loading: false,
		failed: false,
	});
	const [refreshVersion, setRefreshVersion] = React.useState(0);

	const readPage = React.useCallback(
		async (nextLink?: string) => {
			if (!identity || busy.current) return;
			busy.current = true;
			const request = ++generation.current;
			if (!nextLink) consumedTokens.current.clear();
			setState((previous) => ({
				identity,
				items: nextLink ? previous.items : [],
				nextLink: nextLink || null,
				loading: true,
				failed: false,
			}));
			try {
				const page = await fetchOpportunityActions(clientRef.current, identity, nextLink);
				if (request !== generation.current) return;
				if (nextLink) consumedTokens.current.add(nextLink);
				if (page.nextLink && consumedTokens.current.has(page.nextLink))
					throw new Error("Repeated page cursor.");
				const items = page.entities
					.map(mapPacAction)
					.filter((item) => item.state === 0 && item.statusReason === 1 && item.uiStatus === 1);
				setState((previous) => {
					const merged = new Map<string, PacAction>();
					for (const item of nextLink ? previous.items : []) merged.set(item.id, item);
					for (const item of items) merged.set(item.id, item);
					return {
						identity,
						items: Array.from(merged.values()),
						nextLink: page.nextLink,
						loading: false,
						failed: false,
					};
				});
			} catch {
				if (request === generation.current) {
					setState((previous) => ({ ...previous, loading: false, failed: true }));
				}
			} finally {
				if (request === generation.current) busy.current = false;
			}
		},
		[identity]
	);

	const invalidateRequests = React.useCallback(() => {
		generation.current++;
		busy.current = false;
	}, []);

	React.useEffect(() => {
		busy.current = false;
		void readPage();
		return invalidateRequests;
	}, [readPage, refreshVersion, invalidateRequests]);

	const refresh = React.useCallback(() => {
		invalidateRequests();
		setRefreshVersion((version) => version + 1);
	}, [invalidateRequests]);
	const loadMore = React.useCallback(() => {
		if (state.identity === identity && state.nextLink) void readPage(state.nextLink);
	}, [state.identity, state.nextLink, identity, readPage]);
	const current =
		state.identity === identity
			? state
			: { identity, items: [], nextLink: null, loading: !!identity, failed: false };
	return {
		...current,
		refresh,
		loadMore,
	};
}
