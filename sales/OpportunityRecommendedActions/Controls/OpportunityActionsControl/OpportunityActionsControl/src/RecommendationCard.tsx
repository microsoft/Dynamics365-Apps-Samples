import React from "react";
import { Badge, Button, makeStyles, mergeClasses, shorthands, tokens, useId } from "@fluentui/react-components";

import { PacAction } from "./actionPayload";
import { LifecycleOperation } from "./actionServices";
import { getCardContent } from "./cardContent";
import { ActionStrings } from "./strings";

const useStyles = makeStyles({
	card: {
		display: "flex",
		flexDirection: "column",
		gap: "8px",
		padding: "12px",
		backgroundColor: tokens.colorNeutralBackground1,
		...shorthands.borderRadius("8px"),
		...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
		minWidth: 0,
	},
	header: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0 },
	title: {
		margin: 0,
		minWidth: 0,
		flex: "1 1 auto",
		fontSize: tokens.fontSizeBase300,
		lineHeight: "20px",
		fontWeight: tokens.fontWeightSemibold,
	},
	titleText: {
		...shorthands.border("0"),
		padding: 0,
		backgroundColor: "transparent",
		fontFamily: "inherit",
		fontSize: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		color: tokens.colorNeutralForeground1,
		textAlign: "start",
		cursor: "default",
		width: "100%",
		display: "block",
		whiteSpace: "nowrap",
		overflowX: "hidden",
		overflowY: "hidden",
		textOverflow: "ellipsis",
	},
	fullTitle: { whiteSpace: "normal", overflowWrap: "anywhere" },
	badge: { flexShrink: 0 },
	summary: {
		margin: 0,
		fontSize: tokens.fontSizeBase200,
		lineHeight: "18px",
		color: tokens.colorNeutralForeground2,
		overflowWrap: "anywhere",
	},
	clamped: { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" },
	details: { display: "flex", flexDirection: "column", gap: "8px" },
	commands: { display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" },
	toggle: { marginInlineStart: "auto", color: tokens.colorBrandForeground1, whiteSpace: "nowrap" },
});

interface RecommendationCardProps {
	action: PacAction;
	disabled: boolean;
	strings: ActionStrings;
	onUpdate: (id: string, operation: LifecycleOperation) => Promise<void>;
}

/** Keeps the default card to one title row, two summary lines and one command row.
 * @param props The validated action and existing operation callbacks.
 */
export function RecommendationCard(props: RecommendationCardProps): React.ReactElement {
	const { action, disabled, strings, onUpdate } = props;
	const styles = useStyles();
	const [expanded, setExpanded] = React.useState(false);
	const titleId = useId("recommendation-title");
	const detailsId = useId("recommendation-details");
	const title = action.payloadUnavailable ? strings.Unavailable : action.title || strings.Unavailable;
	const content = getCardContent(action);
	return (
		<li className={styles.card}>
			<div className={styles.header}>
				<h3 id={titleId} className={styles.title} aria-label={title}>
					<span className={mergeClasses(styles.titleText, expanded && styles.fullTitle)} title={title}>
						{title}
					</span>
				</h3>
				<Badge size="small" appearance="tint" color="brand" className={styles.badge}>
					{strings.Active}
				</Badge>
			</div>
			<p className={mergeClasses(styles.summary, !expanded && styles.clamped)}>
				{content.summary || strings.ReasonUnavailable}
			</p>
			<div id={detailsId} hidden={!expanded}>
				{expanded && (
					<div className={styles.details}>
						{content.details.map((detail) => (
							<p key={detail} className={styles.summary}>
								{detail}
							</p>
						))}
					</div>
				)}
			</div>
			<div className={styles.commands}>
				<Button
					size="small"
					appearance="primary"
					aria-describedby={titleId}
					disabled={!action.actionId || disabled}
					onClick={() => {
						if (action.actionId) void onUpdate(action.actionId, "done");
					}}>
					{strings.MarkDone}
				</Button>
				<Button
					size="small"
					appearance="subtle"
					aria-describedby={titleId}
					disabled={!action.actionId || disabled}
					onClick={() => {
						if (action.actionId) void onUpdate(action.actionId, "dismiss");
					}}>
					{strings.Dismiss}
				</Button>
				<Button
					size="small"
					appearance="transparent"
					className={styles.toggle}
					aria-describedby={titleId}
					aria-expanded={expanded}
					aria-controls={detailsId}
					onClick={() => setExpanded((previous) => !previous)}>
					{expanded ? strings.ShowLess : strings.ShowMore}
				</Button>
			</div>
		</li>
	);
}
