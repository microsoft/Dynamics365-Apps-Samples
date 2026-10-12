import React from "react";
import ReactDOM from "react-dom";

import { Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";

import { OpportunityActionsApp } from "../OpportunityActionsControl/src/OpportunityActionsApp";
import { updateActionState } from "../OpportunityActionsControl/src/actionServices";
import type { PacRecord } from "../OpportunityActionsControl/src/pacRepository";
import { loadStrings } from "../OpportunityActionsControl/src/strings";

interface FixtureHarness {
	setRecord: (id: string | null, entityName?: string) => void;
	setRtl: (value: boolean) => void;
	setTheme: (value: "light" | "dark" | null) => void;
	pending: Array<{
		table: string;
		options?: string;
		resolve: (response: ComponentFramework.WebApi.RetrieveMultipleResponse) => void;
		reject: (error: Error) => void;
	}>;
	resolve: (index: number, rows: PacRecord[], nextLink?: string) => void;
	reject: (index: number) => void;
	mutations: Array<{ body: string; resolve: (response: Response) => void; reject: (error: Error) => void }>;
	navigations: string[];
	finishMutation: (index: number, success?: boolean) => void;
	failMutation: (index: number) => void;
	unmount: () => void;
}

declare global {
	interface Window {
		resourceStrings: Record<string, string>;
		pilotHarness: FixtureHarness;
		secondHarness: FixtureHarness;
		mountSecond: () => void;
	}
}

/** Reads the production resources supplied by the local test server.
 * @param key The namespaced resource key.
 */
function getString(key: string): string {
	return window.resourceStrings[key];
}

/** Supplies deterministic host formatting without replacing product logic.
 * @param value The stored score.
 */
function formatScore(value: number): string {
	return value.toFixed(2);
}

/** Hosts one independent instance with a controllable external WebAPI boundary.
 * @param props The test-instance configuration.
 * @param props.secondary Whether to mount the second test instance.
 */
function Fixture(props: { secondary?: boolean }): React.ReactElement {
	const pending = React.useRef<FixtureHarness["pending"]>([]).current;
	const mutations = React.useRef<FixtureHarness["mutations"]>([]).current;
	const navigations = React.useRef<string[]>([]).current;
	const [record, updateRecord] = React.useState<{ id: string | null; name: string }>({
		id: null,
		name: "opportunity",
	});
	const [isRtl, setRtl] = React.useState(false);
	const [theme, setTheme] = React.useState<Theme | undefined>();
	const webApi = {
		/** Defers only the external request, leaving the real adapter and hook in use.
		 * @param table The requested logical table name.
		 * @param options The public SDK query options.
		 */
		retrieveMultipleRecords: (
			table: string,
			options?: string
		): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> =>
			new Promise((resolve, reject) => pending.push({ table, options, resolve, reject })),
	};
	const harness: FixtureHarness = {
		/** Simulates a public form-binding update.
		 * @param id The current record identity.
		 * @param name The current logical table name.
		 */
		setRecord: (id, name = "opportunity") => updateRecord({ id, name }),
		setRtl,
		/** Simulates the public PCF host's theme updates.
		 * @param value The host-selected theme, or no host theme for the light fallback.
		 */
		setTheme: (value) => setTheme(value === "dark" ? webDarkTheme : value === "light" ? webLightTheme : undefined),
		pending,
		mutations,
		navigations,
		/** Resolves the actual API adapter's response.
		 * @param index The request index.
		 * @param success The server's explicit success flag.
		 */
		finishMutation: (index, success = true) =>
			mutations[index].resolve(
				new Response(JSON.stringify({ msdyn_response: JSON.stringify({ Success: success }) }), { status: 200 })
			),
		/** Rejects a lifecycle request at the external boundary.
		 * @param index The request index.
		 */
		failMutation: (index) => mutations[index].reject(new Error("Synthetic denied action")),
		/** Completes a selected synthetic request.
		 * @param index The request index in this instance.
		 * @param rows Synthetic PAC rows.
		 * @param nextLink The server continuation, if any.
		 */
		resolve: (index, rows, nextLink = "") => pending[index].resolve({ entities: rows, nextLink }),
		/** Fails a selected synthetic request.
		 * @param index The request index in this instance.
		 */
		reject: (index) => pending[index].reject(new Error("Synthetic boundary failure")),
		/** Unmounts just this instance as the React PCF host does. */
		unmount: () => {
			const container = document.getElementById(props.secondary ? "secondary-root" : "root");
			if (container) ReactDOM.unmountComponentAtNode(container);
		},
	};
	if (props.secondary) window.secondHarness = harness;
	else window.pilotHarness = harness;
	return (
		<div data-testid={props.secondary ? "secondary-control" : "primary-control"}>
			<OpportunityActionsApp
				entityId={record.id}
				entityName={record.name}
				webApi={webApi}
				actionServices={{
					/** Defers the real lifecycle adapter at its transport boundary.
					 * @param id The logical action ID.
					 * @param operation The lifecycle operation.
					 */
					update: (id, operation) =>
						updateActionState(
							(_url, options) =>
								new Promise<Response>((resolve, reject) =>
									mutations.push({ body: String(options?.body), resolve, reject })
								),
							id,
							operation
						),
					/** Captures the destination instead of navigating the test host.
					 * @param url The production-resolved URL.
					 */
					open: async (url) => {
						navigations.push(url);
					},
				}}
				strings={loadStrings({ getString })}
				isRtl={isRtl}
				theme={theme}
				formatScore={formatScore}
			/>
		</div>
	);
}

/** Adds a separate React root to test simultaneous PCF instances. */
window.mountSecond = () => {
	const container = document.createElement("div");
	container.id = "secondary-root";
	document.body.appendChild(container);
	ReactDOM.render(<Fixture secondary />, container);
};
ReactDOM.render(<Fixture />, document.getElementById("root"));
