import { existsSync, statSync } from "fs";
import { readFile } from "fs/promises";
import { build } from "esbuild";
import { dirname, extname, join, resolve } from "path";
import { createFilter } from "@rollup/pluginutils";

const pluginName = "rollup-plugin-esbuild";

/**
 *
 * @param optionLoaders
 * @param target
 * @param plugins
 * @param format
 * @param sourceMap
 * @param outDir
 * @param platform
 * @param minify
 */
export function esBuild({
    loaders: optionLoaders,
    plugins = [],
    target,
    format = "esm",
    sourceMap = false,
    outDir = "dir",
    platform = "node",
    minify = false
}) {
    const loaders = {
        ".js": "js",
        ".jsx": "jsx",
        ".ts": "ts",
        ".tsx": "tsx"
    };

    const extensions = Object.keys(loaders);
    const INCLUDE_REGEXP = new RegExp(`\\.(${extensions.map(ext => ext.slice(1)).join("|")})$`);
    const EXCLUDE_REGEXP = [];

    const filter = createFilter(INCLUDE_REGEXP, EXCLUDE_REGEXP);

    if (optionLoaders) {
        for (const key of Object.keys(optionLoaders)) {
            const value = optionLoaders[key];
            if (typeof value === "string") {
                loaders[key] = value;
            } else if (value === false) {
                delete loaders[key];
            }
        }
    }

    const resolveFile = (resolved, index = false) => {
        for (const ext of extensions) {
            const file = index ? join(resolved, `index${ext}`) : `${resolved}${ext}`;
            if (existsSync(file)) {
                return file;
            }
        }
        return null;
    };

    return {
        id: pluginName,
        resolveId(source, importer) {
            if (source.charAt(0) !== "." && !filter(source)) {
                console.warn("Not allowed", source);
                return { external: true, id: source };
            }
            if (importer && source.charAt(0) === ".") {
                const resolved = resolve(importer ? dirname(importer) : process.cwd(), source);

                let file = resolveFile(resolved);
                if (file) {
                    // if (!filter(file)) {
                    //     console.warn("Not allowed", file);
                    //     return { external: true, id: source };
                    // }
                    return file;
                }
                if (!file && existsSync(resolved) && statSync(resolved).isDirectory()) {
                    file = resolveFile(resolved, true);
                    if (file) {
                        // if (!filter(file)) {
                        //     console.warn("Not allowed", file);
                        //     return { external: true, id: source };
                        // }
                        return file;
                    }
                }
            }
        },
        async load(id) {
            if (!filter(id)) {
                return null;
            }
            const bundled = await bundle({
                id,
                pluginContext: this,
                plugins,
                loaders,
                target,
                format,
                sourcemap: sourceMap,
                outdir: outDir,
                platform
            });
            if (bundled.code) {
                return {
                    code: bundled.code,
                    map: bundled.map
                };
            }
        },
        async transform(code, id) {
            return null;
        },
        async renderChunk(code, _, rollupOptions) {
            if (minify) {
                const format = rollupOptions.format === "es" ? "esm" : rollupOptions.format;
                const result = await transform(code, {
                    format,
                    loader: "js",
                    minify,
                    sourcemap: sourceMap
                });
                await warn(this, result.warnings);
                if (result.code) {
                    return {
                        code: result.code,
                        map: result.map || null
                    };
                }
            }
            return null;
        }
    };
}

export async function bundle({ id, pluginContext, plugins, loaders, target, format, sourcemap, outdir, platform }) {
    const transform = async (inputCode, id) => {
        let code;
        let map;
        for (const plugin of plugins) {
            if (plugin.transform && plugin.name !== pluginName) {
                const transformed = await plugin.transform.call(pluginContext, inputCode, id);
                if (transformed == null) {
                    continue;
                }
                if (typeof transformed === "string") {
                    code = transformed;
                } else if (typeof transformed === "object") {
                    if (transformed.code !== null) {
                        code = transformed.code;
                    }
                    if (transformed.map !== null) {
                        map = transformed.map;
                    }
                }
            }
        }
        return { code, map };
    };

    const result = await build({
        entryPoints: [id],
        format,
        target,
        bundle: true,
        write: false,
        sourcemap,
        outdir,
        platform,
        plugins: [
            {
                name: "rollup",
                setup: ({ onResolve, onLoad }) => {
                    onResolve({ filter: /.+/ }, async args => {
                        const resolved = await pluginContext.resolve(args.path, args.importer);
                        if (resolved == null) {
                            return;
                        }
                        return {
                            external: resolved.external === "absolute" ? true : resolved.external,
                            path: resolved.id
                        };
                    });

                    onLoad({ filter: /.+/ }, async args => {
                        const loader = loaders[extname(args.path)];

                        let contents;
                        for (const plugin of plugins) {
                            if (plugin.load && plugin.name !== pluginName) {
                                const loaded = await plugin.load.call(pluginContext, args.path);
                                if (loaded == null) {
                                    continue;
                                } else if (typeof loaded === "string") {
                                    contents = loaded;
                                    break;
                                } else if (loaded && loaded.code) {
                                    contents = loaded.code;
                                }
                            }
                        }

                        if (contents == null) {
                            contents = await readFile(args.path, "utf8");
                        }

                        const transformed = await transform(contents, args.path);
                        if (transformed.code) {
                            let code = transformed.code;
                            if (transformed.map) {
                                const map = Buffer.from(
                                    typeof transformed.map === "string"
                                        ? transformed.map
                                        : JSON.stringify(transformed.map)
                                ).toString("base64");
                                code += `\n//# sourceMappingURL=data:application/json;base64,${map}`;
                            }
                            return {
                                contents: code
                            };
                        }
                        return {
                            contents,
                            loader: loader || "js"
                        };
                    });
                }
            }
        ]
    });

    return {
        code: result.outputFiles.find(file => file.path.endsWith(".js"))?.text,
        map: result.outputFiles.find(file => file.path.endsWith(".map"))?.text
    };
}
