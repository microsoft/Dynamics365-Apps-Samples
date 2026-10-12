import React from "react";

import { OpportunityActionsApp } from "./src/OpportunityActionsApp";
import { updateActionState } from "./src/actionServices";
import { loadStrings } from "./src/strings";
import type { IInputs, IOutputs } from "./generated/ManifestTypes";

/** Model-driven page context surfaced at runtime but absent from the public typings. */
interface FormContextInfo {
	entityId?: string | null;
	entityTypeName?: string | null;
}

/** Public PCF entry for the isolated Opportunity pilot. */
export class OpportunityActionsControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
	/** Initializes the control without attaching global handlers.
	 * @param _context The public PCF context.
	 * @param _notifyOutputChanged Unused because this control has no outputs.
	 * @param _state Host-provided session state.
	 */
	public init(
		_context: ComponentFramework.Context<IInputs>,
		_notifyOutputChanged: () => void,
		_state: ComponentFramework.Dictionary
	): void {
		void _context;
		void _notifyOutputChanged;
		void _state;
	}

	/** Reads current form bindings on every host update.
	 * @param context The current public PCF context.
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
		const contextInfo = (context.mode as ComponentFramework.Mode & { contextInfo?: FormContextInfo }).contextInfo;
		return React.createElement(OpportunityActionsApp, {
			entityId: context.parameters.entityId.raw || contextInfo?.entityId || null,
			entityName: context.parameters.entityName.raw || contextInfo?.entityTypeName || null,
			webApi: context.webAPI,
			actionServices: {
				/** Invokes the authorized lifecycle endpoint.
				 * @param actionId The business action identifier.
				 * @param operation The requested lifecycle change.
				 */
				update: (actionId, operation) => updateActionState(window.fetch.bind(window), actionId, operation),
				/** Opens a validated destination through PCF navigation.
				 * @param url The validated absolute or in-app URL.
				 */
				open: async (url) => {
					await context.navigation.openUrl(new URL(url, window.location.origin).href);
				},
			},
			strings: loadStrings(context.resources),
			isRtl: context.userSettings.isRTL,
			theme: context.fluentDesignLanguage?.tokenTheme,
			formatScore: this.formatScore.bind(this, context),
		});
	}

	/** Leaves the host form unchanged. */
	public getOutputs(): IOutputs {
		return {};
	}

	/** Releases the control's host lifecycle. */
	public destroy(): void {
		// ReactControl unmounts the tree; hook cleanup invalidates pending responses.
	}

	/** Formats a score through the public host locale service.
	 * @param context The public PCF context.
	 * @param score The stored numeric score.
	 */
	private formatScore(context: ComponentFramework.Context<IInputs>, score: number): string {
		return context.formatting.formatDecimal(score, 2);
	}
}
