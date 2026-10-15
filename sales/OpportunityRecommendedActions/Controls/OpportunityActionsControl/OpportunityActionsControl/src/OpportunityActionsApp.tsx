import React from "react";

import {
	Button,
	CounterBadge,
	FluentProvider,
	makeStyles,
	shorthands,
	Spinner,
	Theme,
	tokens,
	webLightTheme,
} from "@fluentui/react-components";
import { RefreshIcon } from "@fluentui/react-icons-mdl2";

import { ActionServices } from "./actionServices";
import { normalizeOpportunityId, PacReadClient } from "./pacRepository";
import { ActionStrings } from "./strings";
import { useOpportunityActions } from "./useOpportunityActions";
import { useActionOperations } from "./useActionOperations";
import { RecommendationCard } from "./RecommendationCard";

const useStyles = makeStyles({
	provider: { width: "100%", minWidth: 0, flex: "1 1 auto" },
	root: {
		width: "100%",
		minWidth: 0,
		boxSizing: "border-box",
		backgroundColor: "transparent",
		fontFamily: tokens.fontFamilyBase,
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: tokens.spacingHorizontalS,
		flexWrap: "nowrap",
	},
	titleGroup: {
		display: "flex",
		alignItems: "center",
		gap: tokens.spacingHorizontalSNudge,
		minWidth: 0,
		flex: "1 1 auto",
	},
	heading: { fontSize: tokens.fontSizeBase400, fontWeight: tokens.fontWeightSemibold, margin: 0, minWidth: 0 },
	refreshButton: {
		width: "32px",
		height: "32px",
		flexShrink: 0,
		alignSelf: "flex-start",
		color: tokens.colorNeutralForeground2,
	},
	refreshIcon: {
		width: "16px",
		height: "16px",
		fontSize: "16px",
		"& > span": { display: "flex", width: "16px", height: "16px" },
		"& svg": { width: "16px", height: "16px" },
	},
	status: {
		display: "flex",
		alignItems: "center",
		gap: tokens.spacingHorizontalSNudge,
		marginTop: tokens.spacingVerticalM,
		color: tokens.colorNeutralForeground2,
		fontSize: tokens.fontSizeBase200,
	},
	message: {
		marginTop: tokens.spacingVerticalM,
		padding: tokens.spacingHorizontalM,
		...shorthands.borderRadius(tokens.borderRadiusMedium),
		backgroundColor: tokens.colorNeutralBackground1,
		color: tokens.colorNeutralForeground2,
		fontSize: tokens.fontSizeBase300,
	},
	alert: {
		marginTop: tokens.spacingVerticalM,
		padding: tokens.spacingHorizontalM,
		...shorthands.borderRadius(tokens.borderRadiusMedium),
		backgroundColor: tokens.colorStatusWarningBackground1,
		color: tokens.colorStatusWarningForeground1,
		fontSize: tokens.fontSizeBase300,
	},
	listViewport: {
		maxHeight: "320px",
		overflowY: "auto",
		overscrollBehaviorY: "contain",
		marginTop: tokens.spacingVerticalM,
		paddingTop: tokens.spacingVerticalXXS,
		paddingBottom: tokens.spacingVerticalXXS,
		boxSizing: "border-box",
		":focus-visible": {
			outlineStyle: "solid",
			outlineWidth: "2px",
			outlineColor: tokens.colorStrokeFocus2,
			outlineOffset: "-2px",
		},
	},
	list: {
		listStyleType: "none",
		padding: 0,
		margin: 0,
		display: "flex",
		flexDirection: "column",
		gap: tokens.spacingVerticalS,
	},
	liveCount: {
		position: "absolute",
		width: "1px",
		height: "1px",
		padding: 0,
		margin: "-1px",
		overflow: "hidden",
		clip: "rect(0, 0, 0, 0)",
		whiteSpace: "nowrap",
	},
});

const SCROLL_LOAD_THRESHOLD = 48;

export interface OpportunityActionsProps {
	entityId: string | null;
	entityName: string | null;
	webApi: PacReadClient;
	actionServices: ActionServices;
	strings: ActionStrings;
	isRtl: boolean;
	theme?: Theme;
	formatScore: (score: number) => string;
}

/** Renders active recommendations with server-authorized lifecycle actions.
 * @param props Public host inputs and localized presentation services.
 */
export function OpportunityActionsApp(props: OpportunityActionsProps): React.ReactElement {
	const { entityId, entityName, webApi, actionServices, strings, isRtl, theme } = props;
	const styles = useStyles();
	const isOpportunity = entityName?.trim().toLowerCase() === "opportunity";
	const identity = isOpportunity ? normalizeOpportunityId(entityId) : null;
	const { items, nextLink, loading, failed, refresh, loadMore } = useOpportunityActions(identity, webApi);
	const operations = useActionOperations(identity, actionServices, refresh);
	const listViewport = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		if (listViewport.current) listViewport.current.scrollTop = 0;
	}, [identity]);
	const loadNextPage = React.useCallback(() => {
		const viewport = listViewport.current;
		if (!viewport || !identity || !nextLink || loading || failed || !viewport.clientHeight) return;
		if (viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= SCROLL_LOAD_THRESHOLD) {
			loadMore();
		}
	}, [identity, nextLink, loading, failed, loadMore]);
	React.useEffect(() => {
		loadNextPage();
		const viewport = listViewport.current;
		if (!viewport || !identity || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(loadNextPage);
		observer.observe(viewport);
		return () => observer.disconnect();
	}, [identity, items, loadNextPage]);
	const onRefresh = React.useCallback(() => {
		if (listViewport.current) listViewport.current.scrollTop = 0;
		refresh();
	}, [refresh]);
	return (
		<FluentProvider theme={theme ?? webLightTheme} dir={isRtl ? "rtl" : "ltr"} className={styles.provider}>
			<section className={styles.root} aria-label={strings.Title} aria-busy={loading || operations.pending}>
				<div className={styles.header}>
					<div className={styles.titleGroup}>
						<h2 className={styles.heading}>{strings.Title}</h2>
						{!!identity && items.length > 0 && (
							<CounterBadge count={items.length} appearance="filled" color="brand" />
						)}
					</div>
					<Button
						appearance="subtle"
						className={styles.refreshButton}
						aria-label={strings.Refresh}
						title={strings.Refresh}
						icon={{ className: styles.refreshIcon, children: <RefreshIcon aria-hidden="true" /> }}
						onClick={onRefresh}
						disabled={!identity || loading || operations.pending}
						disabledFocusable={!!identity && (loading || operations.pending)}
					/>
				</div>
				{!isOpportunity && (
					<p className={styles.message} role="status">
						{strings.WrongEntity}
					</p>
				)}
				{isOpportunity && !identity && (
					<p className={styles.message} role="status">
						{strings.SaveFirst}
					</p>
				)}
				{identity && (
					<>
						{operations.pending && (
							<p className={styles.status} role="status">
								{strings.Updating}
							</p>
						)}
						{operations.error && (
							<p className={styles.alert} role="alert">
								{strings.ActionError}
							</p>
						)}
						{loading ? (
							<div className={styles.status} role="status" aria-live="polite">
								<Spinner size="extra-tiny" aria-hidden="true" />
								<span>{strings.Loading}</span>
							</div>
						) : (
							<p className={styles.liveCount} role="status" aria-live="polite">
								{strings.LoadedCount.replace("{0}", String(items.length))}
							</p>
						)}
						{failed && (
							<p className={styles.alert} role="alert">
								{items.length ? strings.PartialError : strings.Error}
							</p>
						)}
						{!loading && !failed && !items.length && !nextLink && (
							<p className={styles.message}>{strings.Empty}</p>
						)}
						<div
							ref={listViewport}
							className={styles.listViewport}
							role="region"
							aria-label={strings.List}
							tabIndex={0}
							onScroll={loadNextPage}>
							<ul className={styles.list}>
								{items.map((action) => (
									<RecommendationCard
										key={`${identity}:${action.id}`}
										action={action}
										disabled={operations.pending || loading}
										strings={strings}
										onUpdate={operations.update}
									/>
								))}
							</ul>
						</div>
					</>
				)}
			</section>
		</FluentProvider>
	);
}
