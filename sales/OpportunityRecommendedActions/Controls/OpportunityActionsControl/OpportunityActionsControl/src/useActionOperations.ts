import React from "react";

import { ActionServices, LifecycleOperation } from "./actionServices";

/** Isolates writes/navigation from record switches, unmounts and repeated clicks.
 * @param identity The current validated Opportunity.
 * @param services Host operations.
 * @param refresh Reload after a confirmed lifecycle update.
 */
export function useActionOperations(identity: string | null, services: ActionServices, refresh: () => void) {
	const servicesRef = React.useRef(services);
	servicesRef.current = services;
	const generation = React.useRef(0);
	const locked = React.useRef(false);
	const [state, setState] = React.useState<{ identity: string | null; pending: boolean; error: boolean }>({
		identity: null,
		pending: false,
		error: false,
	});
	const invalidate = React.useCallback(() => {
		locked.current = false;
		generation.current++;
	}, []);
	React.useEffect(() => {
		invalidate();
		setState({ identity, pending: false, error: false });
		return invalidate;
	}, [identity, invalidate]);
	const run = React.useCallback(
		async (operation: () => Promise<void>, reload: boolean) => {
			if (!identity || locked.current) return;
			locked.current = true;
			const request = ++generation.current;
			setState({ identity, pending: true, error: false });
			try {
				await operation();
				if (request !== generation.current) return;
				setState({ identity, pending: false, error: false });
				if (reload) refresh();
			} catch {
				if (request === generation.current) setState({ identity, pending: false, error: true });
			} finally {
				if (request === generation.current) locked.current = false;
			}
		},
		[identity, refresh]
	);
	return {
		pending: state.identity === identity && state.pending,
		error: state.identity === identity && state.error,
		/** Updates a recommendation and reloads only its originating view.
		 * @param actionId The logical action ID.
		 * @param operation The requested lifecycle change.
		 */
		update: (actionId: string, operation: LifecycleOperation) =>
			run(() => servicesRef.current.update(actionId, operation), true),
		/** Opens one validated destination.
		 * @param url The destination URL.
		 */
		open: (url: string) => run(() => servicesRef.current.open(url), false),
	};
}
