const { join } = require("path");
const { ls, cp, mkdir } = require("shelljs");

const { execShellCommand } = require("../scripts/release/module-automation/commons");

const repoRoot = join(process.cwd(), "../");

main().catch(error => {
    console.error(error);
    process.exit(1);
});

async function main() {
    console.log("Building all native widgets...");
    // await execShellCommand("npm run release:native", repoRoot);
    console.log("Done.");
    const lernaPackages = await execShellCommand("npx lerna ls --json --all", repoRoot);
    const packages = JSON.parse(lernaPackages.trim());
    const widgetPackages = packages
        .filter(({ location }) => location.match(/(pluggable|custom)Widgets/))
        // todo: inline two regexes
        .filter(({ location }) => location.match(/(-native)/));

    console.log(`Native widgets: ${widgetPackages.length}`);

    widgetPackages.forEach(({ location }) => {
        // todo: the path after tmp/widgets is dependent on the .xml and can be whatever is defined by dev
        const p = join(location, "dist/tmp/widgets/com/mendix/widget/native");
        const folder = ls(p).stdout.trim();
        const filename = "index.js";
        const path = join(p, folder, filename);
        mkdir(join(process.cwd(), "storybook/stories", folder));
        cp(path, join(process.cwd(), "storybook/stories", folder, filename));

        // todo: modify the index file in stories to import each widget
    });
}
