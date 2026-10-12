const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = async function verifyThemeAccessibility(page, resources, row, root) {
	const axeScript =
		process.env.PCF_AXE_SCRIPT ||
		require.resolve("axe-core/axe.min.js", {
			paths: [path.dirname(require.resolve("@axe-core/playwright"))],
		});
	const checks = [];
	const scans = [];
	const firstId = "00000000-0000-4000-8000-000000000001";
	const sampleRows = [
		row(101, "Review the full proposal and confirm the next steps with the opportunity team", {
			msdyn_scoredetails: JSON.stringify({
				Explanation: "Review the full proposal before the next meeting.",
				actionImpact: "Keep all stakeholders informed about the agreed next steps.",
			}),
		}),
		row(102, "Confirm the next meeting"),
	];
	const scan = async (label) => {
		const result = await page.evaluate(async () => {
			await new Promise((resolve) => requestAnimationFrame(resolve));
			await Promise.all(
				document
					.getAnimations()
					.filter((animation) => Number.isFinite(animation.effect.getComputedTiming().endTime))
					.map((animation) => animation.finished.catch(() => undefined))
			);
			const result = await window.axe.run(document.querySelector('[data-testid="primary-control"]'), {
				runOnly: {
					type: "tag",
					values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
				},
			});
			return {
				version: window.axe.version,
				violations: result.violations.map(({ id, impact, nodes }) => ({
					id,
					impact,
					targets: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
				})),
				incomplete: result.incomplete.map(({ id, nodes }) => ({ id, nodes: nodes.length })),
			};
		});
		scans.push({ label, ...result });
		assert.deepEqual(result.violations, [], `${label}: ${JSON.stringify(result.violations)}`);
	};
	const contrast = (foreground, background) => {
		const luminance = (color) => {
			const channels = color
				.match(/[\d.]+/g)
				.slice(0, 3)
				.map(Number)
				.map((value) => {
					const channel = value / 255;
					return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
				});
			return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
		};
		const a = luminance(foreground);
		const b = luminance(background);
		return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
	};
	for (const mode of ["light", "dark"]) {
		for (const rtl of [false, true]) {
			await page.setViewportSize({ width: 900, height: 900 });
			await page.emulateMedia({ forcedColors: "none", colorScheme: mode });
			await page.reload();
			await page.addScriptTag({ path: axeScript });
			const host = page.getByTestId("primary-control");
			const panel = host.locator("section[aria-busy]");
			const refresh = panel.getByRole("button", { name: resources.OpportunityActions_Refresh, exact: true });
			await host.getByText(resources.OpportunityActions_SaveFirst).waitFor();
			await host.evaluate((element) => Object.assign(element.style, { display: "flex", width: "440px" }));
			await page.evaluate(
				({ mode, rtl }) => {
					window.pilotHarness.setTheme(mode);
					window.pilotHarness.setRtl(rtl);
				},
				{ mode, rtl }
			);
			await page.evaluate((id) => window.pilotHarness.setRecord(id), firstId);
			await page.waitForFunction(() => window.pilotHarness.pending.length === 1);
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/loading`);
			await page.evaluate((rows) => window.pilotHarness.resolve(0, rows), sampleRows);
			const card = panel.getByRole("listitem").first();
			const title = card.getByRole("heading", { level: 3 });
			const done = card.getByRole("button", { name: resources.OpportunityActions_MarkDone, exact: true });
			const dismiss = card.getByRole("button", { name: resources.OpportunityActions_Dismiss, exact: true });
			const more = card.getByRole("button", { name: resources.OpportunityActions_ShowMore, exact: true });
			const region = panel.getByRole("region", { name: resources.OpportunityActions_List, exact: true });
			await done.waitFor();
			const colors = await panel.evaluate((element) => {
				const provider = element.parentElement;
				const card = element.querySelector("li");
				const button = card.querySelector("button");
				const color = (node) => ({
					foreground: getComputedStyle(node).color,
					background: getComputedStyle(node).backgroundColor,
				});
				const probe = document.createElement("span");
				probe.style.backgroundColor = "var(--colorBrandBackground)";
				provider.appendChild(probe);
				const brand = getComputedStyle(probe).backgroundColor;
				probe.remove();
				return { provider: color(provider), card: color(card), button: color(button), brand };
			});
			assert.equal(colors.provider.background, mode === "dark" ? "rgb(41, 41, 41)" : "rgb(255, 255, 255)");
			assert.equal(
				colors.button.background,
				colors.brand,
				"Done must use the active theme's primary brand color."
			);
			assert.ok(
				contrast(colors.button.foreground, colors.button.background) >= 4.5,
				"Done text needs AA contrast."
			);
			assert.ok(contrast(colors.card.foreground, colors.card.background) >= 4.5, "Card text needs AA contrast.");
			const titleId = await title.getAttribute("id");
			assert.ok(titleId, "The card heading must have a nonempty ID.");
			for (const button of [done, dismiss, more]) {
				assert.equal(
					await button.getAttribute("aria-describedby"),
					titleId,
					"Repeated actions need card context."
				);
			}
			assert.equal(await panel.locator("h3 button,h3 a").count(), 0);
			assert.equal(await panel.getByText(/^Priority score:/).count(), 0);
			const alignment = await panel.evaluate((element) => {
				const panel = element.getBoundingClientRect();
				const header = element.firstElementChild.getBoundingClientRect();
				const viewport = element.querySelector('[role="region"]').getBoundingClientRect();
				const card = element.querySelector("li").getBoundingClientRect();
				return {
					panelLeft: panel.left,
					panelRight: panel.right,
					headerLeft: header.left,
					headerRight: header.right,
					viewportLeft: viewport.left,
					viewportRight: viewport.right,
					cardLeft: card.left,
				};
			});
			assert.ok(Math.abs(alignment.headerLeft - alignment.panelLeft) <= 1);
			assert.ok(Math.abs(alignment.headerRight - alignment.panelRight) <= 1);
			assert.ok(Math.abs(alignment.viewportLeft - alignment.panelLeft) <= 1);
			assert.ok(Math.abs(alignment.viewportRight - alignment.panelRight) <= 1);
			if (!rtl) assert.ok(Math.abs(alignment.cardLeft - alignment.panelLeft) <= 1);
			await refresh.focus();
			for (const expected of [region, done, dismiss, more]) {
				await page.keyboard.press("Tab");
				assert.equal(await expected.evaluate((element) => element === document.activeElement), true);
			}
			const focusVisible = await more.evaluate((element) => {
				return [
					getComputedStyle(element),
					getComputedStyle(element, "::before"),
					getComputedStyle(element, "::after"),
				].some(
					(style) =>
						(style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
						(style.content !== "none" &&
							style.borderTopStyle === "solid" &&
							parseFloat(style.borderTopWidth) >= 2)
				);
			});
			assert.equal(focusVisible, true, "Keyboard focus must have a visible indicator.");
			await page.keyboard.press("Enter");
			const less = card.getByRole("button", { name: resources.OpportunityActions_ShowLess, exact: true });
			await less.waitFor();
			assert.equal(await less.getAttribute("aria-expanded"), "true");
			const detailsId = await less.getAttribute("aria-controls");
			assert.equal(await page.locator(`[id="${detailsId}"]`).isVisible(), true);
			await card
				.getByText("Keep all stakeholders informed about the agreed next steps.", { exact: true })
				.waitFor();
			assert.ok((await title.boundingBox()).height > 20, "Expanded long titles must wrap instead of truncate.");
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/expanded`);
			await page.keyboard.press("Space");
			await more.waitFor();
			assert.equal(await page.locator(`[id="${detailsId}"]`).isVisible(), false);
			assert.equal(await page.evaluate(() => window.pilotHarness.mutations.length), 0);
			assert.equal(await page.evaluate(() => window.pilotHarness.navigations.length), 0);
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/collapsed`);
			await page.screenshot({ path: path.join(root, `test-results/ui-${mode}-${rtl ? "rtl" : "ltr"}.png`) });
			await host.evaluate((element) => {
				element.style.width = "240px";
			});
			assert.equal(await host.evaluate((element) => element.scrollWidth <= element.clientWidth + 1), true);
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/narrow`);
			await host.evaluate((element) => {
				element.style.width = "440px";
			});
			await page.emulateMedia({ forcedColors: "active" });
			assert.equal(await page.evaluate(() => matchMedia("(forced-colors: active)").matches), true);
			const forcedColors = await done.evaluate((element) => ({
				foreground: getComputedStyle(element).color,
				background: getComputedStyle(element).backgroundColor,
			}));
			assert.ok(
				contrast(forcedColors.foreground, forcedColors.background) >= 4.5,
				"Forced-colors button text needs AA contrast even when axe marks it for manual review."
			);
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/forced-colors`);
			await page.emulateMedia({ forcedColors: "none" });
			await done.focus();
			await page.keyboard.press("Enter");
			await page.waitForFunction(() => window.pilotHarness.mutations.length === 1);
			assert.equal(await refresh.isDisabled(), true);
			assert.equal(await dismiss.isDisabled(), true);
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/pending`);
			await page.evaluate(() => window.pilotHarness.finishMutation(0, false));
			await panel.getByRole("alert").waitFor();
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/operation-error`);
			await refresh.click();
			await page.waitForFunction(() => window.pilotHarness.pending.length === 2);
			await page.evaluate(() => window.pilotHarness.reject(1));
			await panel.getByText(resources.OpportunityActions_Error, { exact: true }).waitFor();
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/read-error`);
			await refresh.click();
			await page.waitForFunction(() => window.pilotHarness.pending.length === 3);
			await page.evaluate(() => window.pilotHarness.resolve(2, []));
			await panel.getByText(resources.OpportunityActions_Empty).waitFor();
			await scan(`${mode}/${rtl ? "RTL" : "LTR"}/empty`);
			const opposite = mode === "dark" ? "light" : "dark";
			await page.evaluate((mode) => window.pilotHarness.setTheme(mode), opposite);
			assert.equal(
				await panel.evaluate((element) => getComputedStyle(element.parentElement).backgroundColor),
				opposite === "dark" ? "rgb(41, 41, 41)" : "rgb(255, 255, 255)"
			);
			assert.equal(
				await page.evaluate(() => window.pilotHarness.pending.length),
				3,
				"Theme updates must not refetch."
			);
			await page.evaluate(() => window.pilotHarness.setTheme(null));
			assert.equal(
				await panel.evaluate((element) => getComputedStyle(element.parentElement).backgroundColor),
				"rgb(255, 255, 255)"
			);
			checks.push({
				mode,
				rtl,
				blueDone: true,
				contrast: true,
				keyboard: true,
				contextualDescriptions: true,
				alignedEdges: true,
				responsive: true,
				forcedColors: true,
				dynamicTheme: true,
				lightFallback: true,
			});
		}
	}
	const primary = page.getByTestId("primary-control");
	await primary.getByRole("button", { name: resources.OpportunityActions_Refresh, exact: true }).click();
	await page.waitForFunction(() => window.pilotHarness.pending.length === 4);
	await page.evaluate((rows) => window.pilotHarness.resolve(3, rows), sampleRows);
	await page.evaluate(() => window.mountSecond());
	await page.evaluate((id) => window.secondHarness.setRecord(id), firstId);
	await page.waitForFunction(() => window.secondHarness.pending.length === 1);
	await page.evaluate((rows) => window.secondHarness.resolve(0, rows), sampleRows);
	const titles = page.locator('[data-testid$="-control"] h3');
	await page.waitForFunction(() => document.querySelectorAll('[data-testid$="-control"] h3').length === 4);
	const titleIds = await titles.evaluateAll((elements) => elements.map((element) => element.id));
	assert.ok(titleIds.every(Boolean));
	assert.equal(new Set(titleIds).size, 4, "Card heading IDs must be unique across control instances.");
	for (const card of await page.locator('[data-testid$="-control"] li').all()) {
		const title = await card.getByRole("heading", { level: 3 }).innerText();
		for (const button of await card.getByRole("button").all()) {
			const description = await button.evaluate((element) => {
				const ids = (element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
				return ids.map((id) => document.getElementById(id)?.textContent).join(" ");
			});
			assert.equal(description, title, "Each command must describe its own card, not another instance.");
		}
	}
	await fs.writeFile(
		path.join(root, "test-results/theme-accessibility.json"),
		JSON.stringify({ checks, scans }, null, 2)
	);
	return {
		themes: ["light", "dark"],
		directions: ["LTR", "RTL"],
		combinations: checks.length,
		axeScans: scans.length,
		violations: 0,
		uniqueAccessibleDescriptionsAcrossInstances: true,
	};
};
