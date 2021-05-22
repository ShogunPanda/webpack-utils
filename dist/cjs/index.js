"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findScriptUrl = exports.normalizeWebpackEnvironment = exports.generateVersion = exports.normalizeAssetPath = exports.getManifestUrl = exports.scriptUrlSuffix = exports.imagesExtensions = exports.cacheName = void 0;
const path_1 = require("path");
exports.cacheName = '@cowtech/webpack';
exports.imagesExtensions = /\.(?:bmp|png|jpg|jpeg|gif|svg|webp)$/;
exports.scriptUrlSuffix = /-(?:(?:[a-f0-9]+)\.mjs)$/i;
async function getManifestUrl(compilation) {
    const url = await compilation.getCache(exports.cacheName).getPromise('html-webpack-tracker-plugin:manifest', null);
    return `/${url}`;
}
exports.getManifestUrl = getManifestUrl;
function normalizeAssetPath({ filename }) {
    let components = filename.split(path_1.sep);
    if (components[0] === 'src') {
        components.shift();
    }
    else if (components.includes('node_modules')) {
        // If a package
        components = components.slice(components.lastIndexOf('node_modules') + 1);
        components.splice(0, components[1][0] === '@' ? 3 : 2); // Remove the scope (if any) and the package name
    }
    return components.join(path_1.sep).replace(exports.imagesExtensions, '-[contenthash]$&');
}
exports.normalizeAssetPath = normalizeAssetPath;
function generateVersion() {
    return new Date()
        .toISOString()
        .replace(/([-:])|(\.\d+Z$)/g, '')
        .replace('T', '.');
}
exports.generateVersion = generateVersion;
function normalizeWebpackEnvironment(env) {
    return env.production === true ? 'production' : 'development';
}
exports.normalizeWebpackEnvironment = normalizeWebpackEnvironment;
function findScriptUrl(compilation, path, suffixPattern) {
    var _a;
    if (!suffixPattern) {
        suffixPattern = exports.scriptUrlSuffix;
    }
    const files = (_a = compilation.entrypoints.get(path)) === null || _a === void 0 ? void 0 : _a.getFiles();
    if (!files) {
        return undefined;
    }
    const url = files.find((f) => f.startsWith(path) && suffixPattern.test(f));
    return `/${url}`;
}
exports.findScriptUrl = findScriptUrl;
