const STRING_NAMES = [
	"Title",
	"Refresh",
	"List",
	"Loading",
	"Empty",
	"Error",
	"PartialError",
	"SaveFirst",
	"WrongEntity",
	"LoadedCount",
	"Unavailable",
	"Active",
	"Done",
	"Dismissed",
	"Inactive",
	"Removed",
	"UnknownStatus",
	"Score",
	"MarkDone",
	"Dismiss",
	"OpenAction",
	"Updating",
	"ActionError",
	"WhyRecommended",
	"ReasonUnavailable",
	"ShowMore",
	"ShowLess",
] as const;

export type ActionStrings = Record<(typeof STRING_NAMES)[number], string>;

/** Loads only this control's localized resources.
 * @param resources The public PCF resource service.
 */
export function loadStrings(resources: Pick<ComponentFramework.Resources, "getString">): ActionStrings {
	return STRING_NAMES.reduce((values, name) => {
		values[name] = resources.getString(`OpportunityActions_${name}`);
		return values;
	}, {} as ActionStrings);
}
