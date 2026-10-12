const { execFileSync } = require("node:child_process");
const path = require("node:path");

module.exports = () => {
	execFileSync(process.execPath, [require.resolve("pcf-scripts/bin/pcf-scripts.js"), "refreshTypes"], {
		cwd: path.resolve(__dirname, ".."),
		stdio: "inherit",
	});
};
