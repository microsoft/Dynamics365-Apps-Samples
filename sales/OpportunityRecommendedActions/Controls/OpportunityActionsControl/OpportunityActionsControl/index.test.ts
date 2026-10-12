import { readFileSync } from "fs";
import path from "path";

import { webDarkTheme, webLightTheme } from "@fluentui/react-components";

import { OpportunityActionsControl } from "./index";
import { OpportunityActionsApp, OpportunityActionsProps } from "./src/OpportunityActionsApp";
import type { IInputs } from "./generated/ManifestTypes";

const FIRST_ID = "00000000-0000-4000-8000-000000000001";
const SECOND_ID = "00000000-0000-4000-8000-000000000002";

/** Model-driven page context surfaced at runtime but absent from the public typings. */
interface FormContextInfo {
	entityId?: string | null;
	entityTypeName?: string | null;
}

/** Builds a minimal host boundary while keeping the PCF entry under test real.
 * @param entityId The form binding supplied by the host.
 * @param entityName The entity-name binding supplied by the host.
 * @param contextInfo The model-driven page context the host exposes at runtime.
 * @param theme The host theme supplied for this update.
 */
function createContext(
	entityId: string | null,
	entityName: string | null = "opportunity",
	contextInfo?: FormContextInfo,
	theme?: OpportunityActionsProps["theme"]
): ComponentFramework.Context<IInputs> {
	const resources = readFileSync(path.join(__dirname, "strings/OpportunityActionsControl.1033.resx"), "utf8");
	const values = new Map(
		Array.from(resources.matchAll(/<data name="([^"]+)"[^>]*><value>([^<]*)<\/value>/g), (match) => [
			match[1],
			match[2],
		])
	);
	return {
		parameters: { entityId: { raw: entityId }, entityName: { raw: entityName } },
		mode: { contextInfo },
		resources: {
			/** Reads the actual test resource file.
			 * @param key The requested resource key.
			 */
			getString: (key: string) => values.get(key) || key,
		},
		webAPI: { retrieveMultipleRecords: jest.fn() },
		userSettings: { isRTL: false },
		fluentDesignLanguage: theme ? { tokenTheme: theme } : undefined,
		formatting: {
			/** Supplies deterministic locale formatting at the host boundary.
			 * @param value The score to format.
			 */
			formatDecimal: (value: number) => value.toFixed(2),
		},
	} as unknown as ComponentFramework.Context<IInputs>;
}

describe("OpportunityActionsControl host lifecycle", () => {
	test("should pass current public bindings and declared resources to the real app", () => {
		const control = new OpportunityActionsControl();
		const notify = jest.fn();
		const context = createContext(FIRST_ID);
		control.init(context, notify, {});
		const view = control.updateView(context) as React.ReactElement<OpportunityActionsProps>;
		expect(view.type).toBe(OpportunityActionsApp);
		expect(view.props.entityId).toBe(FIRST_ID);
		expect(view.props.entityName).toBe("opportunity");
		expect(view.props.strings.Title).toBe("Recommended actions");
		expect(Object.values(view.props.strings).some((value) => value.startsWith("OpportunityActions_"))).toBe(false);
		expect(view.props.formatScore(2.5)).toBe("2.50");
		expect(view.props.theme).toBeUndefined();
		expect(context.webAPI.retrieveMultipleRecords).not.toHaveBeenCalled();
		expect(notify).not.toHaveBeenCalled();
		expect(control.getOutputs()).toEqual({});
		expect(() => control.destroy()).not.toThrow();
	});

	test("should read changed form values rather than retaining the initialization record", () => {
		const control = new OpportunityActionsControl();
		control.init(createContext(FIRST_ID), jest.fn(), {});
		const view = control.updateView(createContext(SECOND_ID)) as React.ReactElement<OpportunityActionsProps>;
		expect(view.props.entityId).toBe(SECOND_ID);
	});

	test("should forward the current host theme and refresh it on updateView", () => {
		const control = new OpportunityActionsControl();
		const context = createContext(FIRST_ID, "opportunity", undefined, webDarkTheme);
		const darkView = control.updateView(context) as React.ReactElement<OpportunityActionsProps>;
		expect(darkView.props.theme).toBe(webDarkTheme);
		const updatedContext = createContext(FIRST_ID, "opportunity", undefined, webLightTheme);
		const lightView = control.updateView(updatedContext) as React.ReactElement<OpportunityActionsProps>;
		expect(lightView.props.theme).toBe(webLightTheme);
		expect(lightView.props.entityId).toBe(FIRST_ID);
		expect(context.webAPI.retrieveMultipleRecords).not.toHaveBeenCalled();
		expect(updatedContext.webAPI.retrieveMultipleRecords).not.toHaveBeenCalled();
	});

	test("should preserve an unsaved record's empty identity for the view guard", () => {
		const control = new OpportunityActionsControl();
		const view = control.updateView(createContext(null)) as React.ReactElement<OpportunityActionsProps>;
		expect(view.props.entityId).toBeNull();
	});

	test("should fall back to the model-driven page context when form inputs are unbound", () => {
		const control = new OpportunityActionsControl();
		const context = createContext(null, null, { entityId: FIRST_ID, entityTypeName: "opportunity" });
		const view = control.updateView(context) as React.ReactElement<OpportunityActionsProps>;
		expect(view.props.entityId).toBe(FIRST_ID);
		expect(view.props.entityName).toBe("opportunity");
	});

	test("should prefer explicit form inputs over the page context", () => {
		const control = new OpportunityActionsControl();
		const context = createContext(FIRST_ID, "opportunity", { entityId: SECOND_ID, entityTypeName: "lead" });
		const view = control.updateView(context) as React.ReactElement<OpportunityActionsProps>;
		expect(view.props.entityId).toBe(FIRST_ID);
		expect(view.props.entityName).toBe("opportunity");
	});
});
