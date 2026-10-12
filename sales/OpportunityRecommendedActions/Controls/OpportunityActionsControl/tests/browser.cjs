const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const esbuild = require("esbuild");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { RefreshIcon } = require("@fluentui/react-icons-mdl2");
const verifyRefreshLayout = require("./refresh-layout.cjs");
const verifyThemeAccessibility = require("./theme-accessibility.cjs");

const browserModule = process.env.PCF_PLAYWRIGHT_MODULE || "@playwright/test";
const { chromium } = require(browserModule);
const root = path.resolve(__dirname, "..");
const FIRST = "00000000-0000-4000-8000-000000000001";
const SECOND = "00000000-0000-4000-8000-000000000002";
const row = (number, title, overrides = {}) => ({
	msdyn_prioritizedactioncatalogueid: `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`,
	msdyn_actionid: `synthetic-${number}`,
	msdyn_actionscore: number / 10,
	statecode: 0,
	statuscode: 1,
	msdyn_actionuistatus: 1,
	msdyn_actionuipayload: JSON.stringify({
		version: "1.0",
		payload: { header: title, description: "Synthetic test evidence" },
	}),
	...overrides,
});

(async () => {
	const build = await esbuild.build({
		entryPoints: [path.join(__dirname, "browser-fixture.tsx")],
		bundle: true,
		write: false,
		platform: "browser",
		format: "iife",
		define: { "process.env.NODE_ENV": '"development"' },
		logLevel: "silent",
	});
	const resourceXml = await fs.readFile(
		path.join(root, "OpportunityActionsControl/strings/OpportunityActionsControl.1033.resx"),
		"utf8"
	);
	const resources = Object.fromEntries(
		[...resourceXml.matchAll(/<data name="([^"]+)"[^>]*><value>([^<]*)<\/value>/g)].map((match) => [
			match[1],
			match[2],
		])
	);
	const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>window.resourceStrings=${JSON.stringify(
		resources
	)};</script><script src="/fixture.js"></script></body></html>`;
	const server = http.createServer((request, response) => {
		if (request.url === "/fixture.js") {
			response.setHeader("Content-Type", "text/javascript");
			response.end(build.outputFiles[0].contents);
		} else if (request.url === "/") {
			response.setHeader("Content-Type", "text/html");
			response.end(html);
		} else response.writeHead(404).end();
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	let browser;
	try {
		browser = await chromium.launch({ channel: "msedge", headless: true });
		const page = await browser.newPage({ viewport: { width: 900, height: 800 } });
		const errors = [];
		const consoleErrors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("console", (message) => {
			if (message.type() === "error" && message.text().includes("React state update")) {
				consoleErrors.push(message.text());
			}
		});
		await page.goto(`http://127.0.0.1:${server.address().port}`);
		const primary = page.getByTestId("primary-control");
		const refresh = primary.getByRole("button", { name: "Refresh", exact: true });
		const listViewport = primary.getByRole("region", {
			name: resources.OpportunityActions_List,
			exact: true,
		});
		await primary.getByText(resources.OpportunityActions_SaveFirst).waitFor();
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 0);
		assert.equal(await refresh.isDisabled(), true);
		assert.equal(await refresh.innerText(), "", "Refresh must be icon-only, not visible button text.");
		assert.equal(await refresh.locator('[aria-hidden="true"] svg').count(), 1);
		const refreshMarkup = renderToStaticMarkup(React.createElement(RefreshIcon));
		const refreshPaths = [...refreshMarkup.matchAll(/<path[^>]* d="([^"]+)"/g)].map((match) => match[1]);
		assert.ok(refreshPaths.length > 0);
		assert.deepEqual(
			await refresh.locator("svg path").evaluateAll((paths) => paths.map((element) => element.getAttribute("d"))),
			refreshPaths,
			"The refresh button must render the approved MDL2 Refresh glyph, not an arbitrary icon."
		);
		assert.equal(await primary.getByRole("button", { name: /Load more|Show less/ }).count(), 0);
		assert.equal(await primary.getByText("Read-only list. Results follow your Dataverse access.").count(), 0);

		await page.evaluate((id) => window.pilotHarness.setRecord(id, "account"), FIRST);
		await primary.getByText(resources.OpportunityActions_WrongEntity).waitFor();
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 0);

		await page.evaluate((id) => window.pilotHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 1);
		await page.evaluate((id) => window.pilotHarness.setRecord(id), SECOND);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 2);
		await page.evaluate((rows) => window.pilotHarness.resolve(1, rows), [row(11, "Current Opportunity")]);
		await primary.getByText("Current Opportunity", { exact: true }).waitFor();
		await page.evaluate((rows) => window.pilotHarness.resolve(0, rows), [row(10, "Wrong Opportunity late result")]);
		assert.equal(await primary.getByText("Current Opportunity", { exact: true }).count(), 1);
		assert.equal(await primary.getByText("Wrong Opportunity late result").count(), 0);
		assert.equal(await primary.getByRole("button", { name: "Refresh", exact: true }).isEnabled(), true);

		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 3);
		const cursor = `https://example.invalid/api/data/v9.2/msdyn_prioritizedactioncatalogues?$filter=${encodeURIComponent(
			`msdyn_targetentity_opportunity/opportunityid eq ${SECOND} and statecode eq 0 and statuscode eq 1 and msdyn_actionuistatus eq 1`
		)}&$skiptoken=next%2Bpage`;
		const rows = Array.from({ length: 8 }, (_, index) => row(index + 20, `Recommendation ${index + 1}`));
		rows[1].msdyn_actionid = rows[0].msdyn_actionid;
		rows.push(row(29, "bad", { msdyn_actionuipayload: "broken-json" }));
		rows.push(row(30, '<img src=x onerror="window.injected=true">'));
		await page.evaluate(({ rows, cursor }) => window.pilotHarness.resolve(2, rows, cursor), { rows, cursor });
		await primary.getByText("10 recommendations loaded").waitFor({ state: "attached" });
		assert.equal(await primary.getByRole("listitem").count(), 10);
		assert.equal(await primary.getByText("Recommendation 1", { exact: true }).count(), 1);
		assert.equal(await primary.getByText("Recommendation 8", { exact: true }).count(), 1);
		await primary.getByRole("heading", { name: resources.OpportunityActions_Unavailable }).waitFor();
		assert.equal(await primary.locator("img").count(), 0);
		const dimensions = await listViewport.evaluate((element) => ({
			height: element.clientHeight,
			contentHeight: element.scrollHeight,
			overflow: getComputedStyle(element).overflowY,
			hasHorizontalOverflow: element.scrollWidth > element.clientWidth + 1,
		}));
		assert.equal(dimensions.overflow, "auto");
		assert.ok(dimensions.height > 0 && dimensions.height <= 320);
		assert.ok(dimensions.contentHeight > dimensions.height);
		assert.equal(dimensions.hasHorizontalOverflow, false);
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 3);
		await refresh.hover();
		assert.equal(await refresh.getAttribute("title"), resources.OpportunityActions_Refresh);
		await fs.mkdir(path.join(root, "test-results"), { recursive: true });
		await page.screenshot({ path: path.join(root, "test-results/opportunity-list.png") });

		await refresh.focus();
		await page.keyboard.press("Tab");
		assert.equal(await listViewport.evaluate((element) => element === document.activeElement), true);
		await page.keyboard.press("End");
		await page.waitForFunction(() => window.pilotHarness.pending.length === 4);
		await listViewport.evaluate((element) => {
			for (let index = 0; index < 5; index++) element.dispatchEvent(new Event("scroll"));
		});
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 4);
		assert.equal(
			await listViewport.evaluate((element) => element === document.activeElement),
			true,
			"Fetching the next page must not discard scrolling-region focus."
		);
		await page.evaluate(() => window.pilotHarness.reject(3));
		await primary.getByRole("alert").waitFor();
		assert.equal(await primary.getByRole("listitem").count(), 10);
		await listViewport.evaluate((element) => element.dispatchEvent(new Event("scroll")));
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 4);
		assert.equal(await primary.getByRole("alert").innerText(), resources.OpportunityActions_PartialError);
		await refresh.focus();
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => window.pilotHarness.pending.length === 5);
		assert.equal(await refresh.evaluate((button) => button === document.activeElement), true);
		await page.evaluate(({ rows, cursor }) => window.pilotHarness.resolve(4, rows, cursor), { rows, cursor });
		await primary.getByText("10 recommendations loaded").waitFor({ state: "attached" });
		assert.equal(await listViewport.evaluate((element) => element.scrollTop), 0);
		await page.keyboard.press("Tab");
		await page.keyboard.press("End");
		await page.waitForFunction(() => window.pilotHarness.pending.length === 6);
		const positionBeforeAppend = await listViewport.evaluate((element) => element.scrollTop);
		assert.ok(positionBeforeAppend > 0);
		await page.evaluate(
			(rows) => window.pilotHarness.resolve(5, rows),
			[row(20, "Updated first recommendation"), row(31, "Recommendation 11", { msdyn_actionid: "synthetic-20" })]
		);
		await primary.getByText("11 recommendations loaded").waitFor({ state: "attached" });
		assert.ok(
			Math.abs((await listViewport.evaluate((element) => element.scrollTop)) - positionBeforeAppend) <= 1,
			"Appending a page must preserve the reading position rather than resetting to the top."
		);
		assert.equal(await primary.getByRole("listitem").count(), 11);
		assert.equal(await primary.getByText("Updated first recommendation", { exact: true }).count(), 1);
		assert.equal(await primary.getByText("Recommendation 2", { exact: true }).count(), 1);
		assert.equal(await primary.getByText("Recommendation 11", { exact: true }).count(), 1);
		assert.equal(await primary.getByText("Recommendation 1", { exact: true }).count(), 0);
		assert.equal(await primary.getByRole("button", { name: "Load more", exact: true }).count(), 0);
		assert.equal(await primary.getByRole("button", { name: "Show less", exact: true }).count(), 0);
		assert.equal(await listViewport.evaluate((element) => element === document.activeElement), true);
		await page.keyboard.press("End");
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 6);

		await page.setViewportSize({ width: 390, height: 844 });
		assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
		await primary.getByRole("heading", { name: resources.OpportunityActions_Title }).scrollIntoViewIfNeeded();

		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 7);
		await page.evaluate(() => window.pilotHarness.reject(6));
		await primary.getByText(resources.OpportunityActions_Error, { exact: true }).waitFor();
		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 8);
		await page.evaluate((cursor) => window.pilotHarness.resolve(7, [], cursor), cursor);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 9);
		assert.equal(
			await primary.getByText(resources.OpportunityActions_Empty, { exact: true }).count(),
			0,
			"An empty page with a continuation must not claim the entire result is empty."
		);
		await page.evaluate((cursor) => window.pilotHarness.resolve(8, [], cursor), cursor);
		await primary.getByRole("alert").waitFor();
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 9);
		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 10);
		await page.evaluate(
			(rows) => window.pilotHarness.resolve(9, rows),
			[
				row(40, "Completed recommendation", { msdyn_actionuistatus: 2 }),
				row(41, "Dismissed recommendation", { msdyn_actionuistatus: 3 }),
				row(42, "Inactive recommendation", { statecode: 1, statuscode: 2 }),
				row(43, "Removed recommendation", { statecode: 1, statuscode: 3 }),
			]
		);
		await primary.getByText(resources.OpportunityActions_Empty).waitFor();
		assert.equal(await primary.getByRole("listitem").count(), 0, "Closed/inactive rows must never be displayed.");

		await page.evaluate(() => window.mountSecond());
		const secondary = page.getByTestId("secondary-control");
		await secondary.getByText(resources.OpportunityActions_SaveFirst).waitFor();
		await page.evaluate((id) => window.secondHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.secondHarness.pending.length === 1);
		await page.evaluate((rows) => window.secondHarness.resolve(0, rows), [row(50, "Second instance only")]);
		await secondary.getByText("Second instance only").waitFor();
		assert.equal(await primary.getByText("Second instance only").count(), 0);
		assert.equal(await secondary.getByText("Completed recommendation").count(), 0);

		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 11);
		await page.evaluate((id) => window.pilotHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 12);
		await page.evaluate((id) => window.pilotHarness.setRecord(id), SECOND);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 13);
		await page.evaluate((rows) => window.pilotHarness.resolve(12, rows), [row(44, "Current return")]);
		await primary.getByText("Current return").waitFor();
		await page.evaluate((rows) => window.pilotHarness.resolve(10, rows), [row(45, "Obsolete same ID")]);
		await page.evaluate(() => window.pilotHarness.reject(11));
		assert.equal(await primary.getByText("Current return").count(), 1);
		assert.equal(await primary.getByText("Obsolete same ID").count(), 0);
		assert.equal(await primary.getByRole("alert").count(), 0);
		assert.equal(await primary.getByRole("button", { name: "Refresh", exact: true }).isEnabled(), true);
		assert.equal(await secondary.getByText("Second instance only").count(), 1);
		await page.evaluate(() => window.pilotHarness.setRtl(true));
		await primary.locator('[dir="rtl"]').waitFor();
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 13);
		assert.equal(await page.evaluate(() => window.secondHarness.pending.length), 1);

		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 14);
		await page.evaluate(() => window.pilotHarness.setRecord(null));
		await primary.getByText(resources.OpportunityActions_SaveFirst).waitFor();
		await page.evaluate((rows) => window.pilotHarness.resolve(13, rows), [row(46, "Invalidated by null binding")]);
		assert.equal(await primary.getByRole("listitem").count(), 0);
		await page.evaluate((id) => window.pilotHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 15);
		await page.evaluate(() => window.pilotHarness.resolve(14, []));
		await primary.getByText(resources.OpportunityActions_Empty).waitFor();

		await primary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 16);
		await secondary.getByRole("button", { name: "Refresh", exact: true }).click();
		await page.waitForFunction(() => window.secondHarness.pending.length === 2);
		await page.evaluate(() => {
			window.pilotHarness.unmount();
			window.secondHarness.unmount();
		});
		await page.evaluate((rows) => window.pilotHarness.resolve(15, rows), [row(32, "Unmounted result")]);
		await page.evaluate(() => window.secondHarness.reject(1));
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		assert.deepEqual(consoleErrors, [], "Late success/rejection must not update an unmounted React control.");

		await page.reload();
		await primary.getByText(resources.OpportunityActions_SaveFirst).waitFor();
		const firstCursor = cursor.replace(SECOND, FIRST);
		await page.evaluate((id) => window.pilotHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 1);
		await page.evaluate(({ rows, cursor }) => window.pilotHarness.resolve(0, rows, cursor), {
			rows: [row(70, "Underfilled first page")],
			cursor: firstCursor,
		});
		await page.waitForFunction(() => window.pilotHarness.pending.length === 2);
		await page.evaluate((rows) => window.pilotHarness.resolve(1, rows), [row(71, "Automatically loaded page")]);
		await primary.getByText("Automatically loaded page", { exact: true }).waitFor();
		assert.equal(await primary.getByRole("listitem").count(), 2);

		await primary.evaluate((element) => (element.style.display = "none"));
		await page.evaluate((id) => window.pilotHarness.setRecord(id), SECOND);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 3);
		await page.evaluate((cursor) => window.pilotHarness.resolve(2, [], cursor), cursor);
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 3);
		await primary.evaluate((element) => (element.style.display = "block"));
		await page.waitForFunction(() => window.pilotHarness.pending.length === 4);
		await page.evaluate((rows) => window.pilotHarness.resolve(3, rows), [row(72, "Visible after hidden host")]);
		await primary.getByText("Visible after hidden host", { exact: true }).waitFor();

		await refresh.click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 5);
		await page.evaluate(({ rows, cursor }) => window.pilotHarness.resolve(4, rows, cursor), { rows, cursor });
		await primary.getByText("10 recommendations loaded").waitFor({ state: "attached" });
		await listViewport.evaluate((element) => (element.style.maxHeight = "4000px"));
		await page.waitForFunction(() => window.pilotHarness.pending.length === 6);
		await page.evaluate((rows) => window.pilotHarness.resolve(5, rows), [row(73, "Loaded after host resize")]);
		await primary.getByText("Loaded after host resize", { exact: true }).waitFor();
		await listViewport.evaluate((element) => element.style.removeProperty("max-height"));
		await listViewport.focus();
		await page.keyboard.press("End");
		await page.waitForFunction(() => {
			const viewport = document.querySelector('[data-testid="primary-control"] [tabindex="0"][role="region"]');
			return Math.abs(viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight) <= 1;
		});
		await page.evaluate((id) => window.pilotHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 7);
		await page.evaluate((rows) => window.pilotHarness.resolve(6, rows), [row(74, "New record starts at top")]);
		await primary.getByText("New record starts at top", { exact: true }).waitFor();
		assert.equal(await listViewport.evaluate((element) => element.scrollTop), 0);

		await refresh.click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 8);
		await page.evaluate(({ rows, cursor }) => window.pilotHarness.resolve(7, rows, cursor), {
			rows,
			cursor: firstCursor,
		});
		await primary.getByText("10 recommendations loaded").waitFor({ state: "attached" });
		await listViewport.focus();
		await page.keyboard.press("End");
		await page.waitForFunction(() => window.pilotHarness.pending.length === 9);
		await page.evaluate((id) => window.pilotHarness.setRecord(id), SECOND);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 10);
		await page.evaluate((rows) => window.pilotHarness.resolve(9, rows), [row(75, "Current record only")]);
		await primary.getByText("Current record only", { exact: true }).waitFor();
		await page.evaluate((rows) => window.pilotHarness.resolve(8, rows), [row(76, "Stale continuation")]);
		assert.equal(await primary.getByText("Stale continuation", { exact: true }).count(), 0);
		assert.equal(await primary.getByRole("listitem").count(), 1);
		assert.equal(await listViewport.evaluate((element) => element.scrollTop), 0);

		await refresh.click();
		await page.waitForFunction(() => window.pilotHarness.pending.length === 11);
		await page.evaluate(({ rows, cursor }) => window.pilotHarness.resolve(10, rows, cursor), { rows, cursor });
		await primary.getByText("10 recommendations loaded").waitFor({ state: "attached" });
		await listViewport.evaluate(
			(element) => (element.scrollTop = element.scrollHeight - element.clientHeight - 49)
		);
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 11);
		await listViewport.evaluate(
			(element) => (element.scrollTop = element.scrollHeight - element.clientHeight - 48)
		);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 12);
		await listViewport.evaluate((element) => element.dispatchEvent(new Event("scroll")));
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 12);
		await page.evaluate((rows) => window.pilotHarness.resolve(11, rows), [row(77, "Near-bottom continuation")]);
		await primary.getByText("Near-bottom continuation", { exact: true }).waitFor();

		await page.reload();
		await primary.getByText(resources.OpportunityActions_SaveFirst).waitFor();
		await page.evaluate((id) => window.pilotHarness.setRecord(id), FIRST);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 1);
		const doneRow = row(81, "Review proposal", {
			msdyn_scoredetails: JSON.stringify({
				Explanation: "Close date is approaching.",
				actionImpact: "Protect the opportunity.",
			}),
			msdyn_actionuipayload: JSON.stringify({
				version: "1.0",
				payload: {
					header: "Review proposal",
					description: "Synthetic description",
					oncardClickActionType: "Navigate",
					oncardClickActionTypeParameters:
						'{etn="opportunity", pagetype="control", controlName="OpportunityResearch.ResearchControl"}',
				},
			}),
		});
		const dismissRow = row(82, "Review timing");
		await page.evaluate(
			(rows) => window.pilotHarness.resolve(0, rows),
			[doneRow, dismissRow, row(83, "No business ID", { msdyn_actionid: null })]
		);
		const doneCard = primary.getByRole("listitem").filter({ hasText: "Review proposal" });
		await doneCard.getByText("Close date is approaching.", { exact: true }).waitFor();
		assert.equal(await primary.getByText(/^Priority score:/).count(), 0, "Collapsed cards must not render scores.");
		assert.equal(await doneCard.getByText("Protect the opportunity.", { exact: true }).count(), 0);
		const collapsedHeight = (await doneCard.boundingBox()).height;
		assert.ok(collapsedHeight <= 132, "Default card must remain compact.");
		const titleBounds = await doneCard.getByRole("heading", { name: "Review proposal", exact: true }).boundingBox();
		const badgeBounds = await doneCard.getByText("Active", { exact: true }).boundingBox();
		assert.ok(
			Math.abs(titleBounds.y + titleBounds.height / 2 - badgeBounds.y - badgeBounds.height / 2) <= 3,
			"Active belongs beside the title."
		);
		const expand = doneCard.getByRole("button", { name: "Show more", exact: true });
		await expand.focus();
		await page.keyboard.press("Enter");
		await doneCard.getByText("Protect the opportunity.", { exact: true }).waitFor();
		assert.equal(await primary.getByText(/^Priority score:/).count(), 0, "Expanded cards must not render scores.");
		assert.equal(
			await doneCard.getByRole("button", { name: "Show less", exact: true }).getAttribute("aria-expanded"),
			"true"
		);
		assert.equal(
			await page.evaluate(() => window.pilotHarness.navigations.length),
			0,
			"Expanding must not navigate."
		);
		assert.equal(await page.evaluate(() => window.pilotHarness.mutations.length), 0, "Expanding must not mutate.");
		const untouchedCard = primary.getByRole("listitem").filter({ hasText: "Review timing" });
		assert.equal(
			await untouchedCard.getByRole("button", { name: "Show more", exact: true }).getAttribute("aria-expanded"),
			"false"
		);
		await doneCard.getByRole("button", { name: "Show less", exact: true }).click();
		assert.equal(await primary.getByText(/^Priority score:/).count(), 0, "Collapsing must not reveal scores.");
		assert.equal(await doneCard.getByText("Protect the opportunity.", { exact: true }).count(), 0);
		assert.equal((await doneCard.boundingBox()).height, collapsedHeight);
		assert.equal(await expand.evaluate((element) => element === document.activeElement), true);
		const cardTitle = doneCard.getByRole("heading", { name: "Review proposal", exact: true });
		assert.equal(await primary.getByRole("button", { name: /^Open recommendation:/ }).count(), 0);
		assert.equal(await doneCard.getByRole("link").count(), 0);
		const titleText = cardTitle.getByText("Review proposal", { exact: true });
		assert.equal(await titleText.evaluate((element) => element.tabIndex), -1);
		const titleColor = await titleText.evaluate((element) => getComputedStyle(element).color);
		await titleText.hover();
		assert.equal(await titleText.evaluate((element) => getComputedStyle(element).cursor), "default");
		assert.equal(
			await titleText.evaluate((element) => getComputedStyle(element).color),
			titleColor,
			"A non-interactive title must not gain a link-colored hover cue."
		);
		await titleText.click();
		await doneCard.getByText("Close date is approaching.", { exact: true }).click();
		await doneCard.click({ position: { x: 4, y: 4 } });
		assert.equal(
			await page.evaluate(() => window.pilotHarness.navigations.length),
			0,
			"Card clicks must not navigate."
		);
		assert.equal(
			await page.evaluate(() => window.pilotHarness.mutations.length),
			0,
			"Card clicks must not mutate."
		);
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 1, "Card clicks must not refetch.");
		assert.equal(await expand.getAttribute("aria-expanded"), "false", "Card clicks must not expand details.");
		await listViewport.focus();
		await page.keyboard.press("Tab");
		assert.equal(
			await doneCard
				.getByRole("button", { name: "Mark as done", exact: true })
				.evaluate((element) => element === document.activeElement),
			true,
			"Keyboard focus must skip the non-interactive title."
		);
		assert.equal(
			await primary
				.getByRole("listitem")
				.filter({ hasText: "No business ID" })
				.getByRole("button", { name: "Mark as done", exact: true })
				.isDisabled(),
			true
		);
		await doneCard.getByRole("button", { name: "Mark as done", exact: true }).click();
		await page.waitForFunction(() => window.pilotHarness.mutations.length === 1);
		assert.deepEqual(JSON.parse(await page.evaluate(() => window.pilotHarness.mutations[0].body)), {
			msdyn_actionid: "synthetic-81",
			msdyn_operationtype: 1,
		});
		assert.equal(await refresh.isDisabled(), true);
		assert.equal(await doneCard.getByRole("button", { name: "Dismiss", exact: true }).isDisabled(), true);
		await page.evaluate(() => window.pilotHarness.finishMutation(0, false));
		await primary.getByText(resources.OpportunityActions_ActionError, { exact: true }).waitFor();
		assert.equal(await doneCard.count(), 1);
		assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 1);
		await doneCard.getByRole("button", { name: "Mark as done", exact: true }).click();
		await page.evaluate(() => window.pilotHarness.finishMutation(1));
		await page.waitForFunction(() => window.pilotHarness.pending.length === 2);
		await page.evaluate((rows) => window.pilotHarness.resolve(1, rows), [dismissRow]);
		await primary.getByText("1 recommendations loaded").waitFor({ state: "attached" });
		assert.equal(await doneCard.count(), 0);
		const dismissCard = primary.getByRole("listitem").filter({ hasText: "Review timing" });
		await dismissCard.getByRole("button", { name: "Dismiss", exact: true }).click();
		assert.deepEqual(JSON.parse(await page.evaluate(() => window.pilotHarness.mutations[2].body)), {
			msdyn_actionid: "synthetic-82",
			msdyn_operationtype: 0,
		});
		await page.evaluate(() => window.pilotHarness.failMutation(2));
		await primary.getByRole("alert").waitFor();
		assert.equal(await dismissCard.count(), 1);
		await dismissCard.getByRole("button", { name: "Dismiss", exact: true }).click();
		await page.evaluate((id) => window.pilotHarness.setRecord(id), SECOND);
		await page.waitForFunction(() => window.pilotHarness.pending.length === 3);
		await page.evaluate((rows) => window.pilotHarness.resolve(2, rows), [row(84, "Other opportunity")]);
		await primary.getByText("Other opportunity", { exact: true }).waitFor();
		assert.equal(
			await primary.getByRole("button", { name: "Show more", exact: true }).getAttribute("aria-expanded"),
			"false"
		);
		await page.evaluate(() => window.pilotHarness.finishMutation(3));
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		assert.equal(
			await page.evaluate(() => window.pilotHarness.pending.length),
			3,
			"An old mutation must not refresh a new record."
		);
		assert.equal(await primary.getByText("Other opportunity", { exact: true }).count(), 1);
		await primary.getByRole("button", { name: "Dismiss", exact: true }).click();
		await page.evaluate(() => window.pilotHarness.unmount());
		await page.evaluate(() => window.pilotHarness.failMutation(4));
		await page.evaluate(
			() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
		);
		const refreshLayout = await verifyRefreshLayout(page, resources, row, root);
		const themeAccessibility = await verifyThemeAccessibility(page, resources, row, root);
		assert.deepEqual(consoleErrors, []);
		assert.deepEqual(errors, []);
		const result = {
			passed: true,
			refreshLayout,
			themeAccessibility,
			scenarios: [
				"unsaved/wrong entity guard",
				"B-completes-before-A stale response",
				"empty state",
				"refresh",
				"more than five rows",
				"all fetched rows in bounded overflow list",
				"icon-only refresh with accessible tooltip",
				"removed paging buttons and read-only footer",
				"malformed payload fallback",
				"inert HTML text",
				"scroll paging failure with refresh retry",
				"keyboard scrolling focus continuity",
				"no duplicate requests from repeated scroll events",
				"no automatic retry loop after paging failure",
				"48px continuation threshold boundary",
				"reading position preserved after append",
				"underfilled first page fills without a scroll gesture",
				"hidden host waits for visibility before draining continuation",
				"host resize triggers automatic continuation",
				"scroll position resets on record navigation and refresh",
				"stale scroll-triggered continuation ignored after navigation",
				"physical-ID merge across pages",
				"shared business IDs remain distinct",
				"narrow viewport",
				"first-page failure/retry",
				"empty page with continuation",
				"repeated continuation guard",
				"active-only filtering",
				"recommendation reason and impact",
				"compact four-line cards with Active beside title",
				"keyboard Show more/less does not navigate or mutate",
				"independent card expansion and focus continuity",
				"priority score absent before expansion, when expanded and after collapse",
				"card title, summary and background clicks are inert",
				"keyboard focus skips the non-interactive card title",
				"missing business ID disables lifecycle commands",
				"Done API contract and explicit false-response handling",
				"successful lifecycle update reloads active actions",
				"dismiss denial retains card and enables retry",
				"lifecycle pending disables conflicting commands",
				"stale lifecycle completion does not refresh next record",
				"unmounted lifecycle rejection does not update React",
				"two simultaneous instances",
				"A-to-B-to-A stale success/rejection",
				"RTL/context update without refetch",
				"valid-to-null-to-valid binding",
				"unmount success/rejection cleanup",
			],
			scope: "Real production React component/hook/adapter in Edge; synthetic PCF WebAPI boundary. Not live Dataverse or solution-import validation.",
		};
		await fs.writeFile(path.join(root, "test-results/browser.json"), JSON.stringify(result, null, 2));
		console.log(JSON.stringify(result, null, 2));
	} catch (error) {
		const failedPage = browser?.contexts()[0]?.pages()[0];
		if (failedPage) {
			console.error(
				"Browser failure state:",
				await failedPage.evaluate(() => ({
					text: document.querySelector('[data-testid="primary-control"]')?.textContent,
					requests: window.pilotHarness?.pending.map((request) => request.options),
					viewport: [...document.querySelectorAll('[role="region"]')].map((element) => ({
						height: element.clientHeight,
						content: element.scrollHeight,
						top: element.scrollTop,
					})),
				}))
			);
		}
		throw error;
	} finally {
		if (browser) await browser.close();
		server.closeAllConnections();
		await new Promise((resolve) => server.close(resolve));
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
