const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = async function verifyRefreshLayout(page, resources, row, root) {
	const measurements = [];
	const failures = [];
	await page.setViewportSize({ width: 900, height: 900 });
	for (const width of [240, 320, 440, 720]) {
		for (const rtl of [false, true]) {
			await page.reload();
			await page.addStyleTag({ content: ".fui-Button__icon > span { font-size: 20px; }" });
			const host = page.getByTestId("primary-control");
			const panel = host.locator("section[aria-busy]");
			const refresh = panel.getByRole("button", { name: resources.OpportunityActions_Refresh, exact: true });
			await host.getByText(resources.OpportunityActions_SaveFirst).waitFor();
			await host.evaluate((element, width) => {
				Object.assign(element.style, { display: "flex", width: `${width}px`, maxWidth: "100%" });
			}, width);
			await page.evaluate((rtl) => window.pilotHarness.setRtl(rtl), rtl);
			let anchor;
			const capture = async (state) => {
				await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
				const geometry = await panel.evaluate((section) => {
					const rect = (element) => {
						const { x, y, width, height } = element.getBoundingClientRect();
						return { x, y, width, height };
					};
					const button = section.querySelector("button");
					return {
						host: rect(section.closest('[data-testid="primary-control"]')),
						panel: rect(section),
						header: rect(section.firstElementChild),
						button: rect(button),
						glyph: rect(button.querySelector("svg")),
						overflow: section.scrollWidth > section.clientWidth + 1,
					};
				});
				const close = (actual, expected) => Math.abs(actual - expected) <= 1;
				const { host: hostRect, panel: panelRect, header, button, glyph } = geometry;
				const edgeGap = rtl ? button.x - header.x : header.x + header.width - button.x - button.width;
				const position = { x: button.x - hostRect.x, y: button.y - hostRect.y };
				anchor ??= position;
				const checks = {
					fullHostWidth: close(panelRect.width, hostRect.width),
					inlineEnd: close(edgeGap, 0),
					stableTop: close(button.y, header.y),
					stableAcrossStates: close(position.x, anchor.x) && close(position.y, anchor.y),
					buttonSize: close(button.width, 32) && close(button.height, 32),
					upNextGlyphSize: close(glyph.width, 16) && close(glyph.height, 16),
					centeredGlyph:
						close(glyph.x + glyph.width / 2, button.x + button.width / 2) &&
						close(glyph.y + glyph.height / 2, button.y + button.height / 2),
					noHorizontalOverflow: !geometry.overflow,
				};
				measurements.push({ width, rtl, state, geometry, checks });
				for (const [name, passed] of Object.entries(checks)) {
					if (!passed) failures.push(`${width}px ${rtl ? "RTL" : "LTR"} ${state}: ${name}`);
				}
			};
			await capture("unsaved");
			await page.evaluate(() => window.pilotHarness.setRecord("00000000-0000-4000-8000-000000000001"));
			await page.waitForFunction(() => window.pilotHarness.pending.length === 1);
			await capture("initial-loading");
			const rows = [row(91, "Review the proposal"), row(92, "Confirm the next meeting")];
			await page.evaluate((rows) => window.pilotHarness.resolve(0, rows), rows);
			await panel.getByRole("heading", { name: "Review the proposal", exact: true }).waitFor();
			await capture("loaded");
			await refresh.focus();
			await page.keyboard.press("Enter");
			await page.waitForFunction(() => window.pilotHarness.pending.length === 2);
			await capture("refreshing");
			assert.equal(await refresh.evaluate((element) => element === document.activeElement), true);
			await page.keyboard.press("Enter");
			assert.equal(await page.evaluate(() => window.pilotHarness.pending.length), 2);
			await page.evaluate(() => window.pilotHarness.reject(1));
			await panel.getByRole("alert").waitFor();
			await capture("error");
			await refresh.click();
			await page.waitForFunction(() => window.pilotHarness.pending.length === 3);
			await capture("retry-loading");
			await page.evaluate(() => window.pilotHarness.resolve(2, []));
			await panel.getByText(resources.OpportunityActions_Empty).waitFor();
			await capture("empty");
			await refresh.click();
			await page.waitForFunction(() => window.pilotHarness.pending.length === 4);
			await capture("empty-refreshing");
			await page.evaluate((rows) => window.pilotHarness.resolve(3, rows), rows);
			await panel.getByRole("heading", { name: "Review the proposal", exact: true }).waitFor();
			await capture("reloaded");
			await panel.getByRole("button", { name: "Show more", exact: true }).first().click();
			await capture("expanded");
			await panel.getByRole("button", { name: "Mark as done", exact: true }).first().click();
			await page.waitForFunction(() => window.pilotHarness.mutations.length === 1);
			await capture("lifecycle-pending");
			await page.evaluate(() => window.pilotHarness.finishMutation(0, false));
			await panel.getByRole("alert").waitFor();
			await capture("lifecycle-error");
			await page.emulateMedia({ forcedColors: "active" });
			await capture("high-contrast");
			await page.emulateMedia({ forcedColors: "none" });
		}
	}
	await fs.writeFile(
		path.join(root, "test-results/refresh-layout.json"),
		JSON.stringify({ passed: failures.length === 0, measurements, failures }, null, 2)
	);
	assert.equal(
		failures.length,
		0,
		`Refresh layout regressions (${failures.length}):\n${failures.slice(0, 16).join("\n")}`
	);
	return { widths: [240, 320, 440, 720], directions: ["LTR", "RTL"], states: 13, measurements: measurements.length };
};
