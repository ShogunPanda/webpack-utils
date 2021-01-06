import { sep } from 'path';
export const cacheName = '@cowtech/webpack';
export const imagesExtensions = /\.(?:bmp|png|jpg|jpeg|gif|svg|webp)$/;
export const scriptUrlSuffix = /-(?:(?:[a-f0-9]+)\.mjs)$/i;
export async function getManifestUrl(compilation) {
    const url = await compilation.getCache(cacheName).getPromise('html-webpack-tracker-plugin:manifest', null);
    return `/${url}`;
}
export function normalizeAssetPath({ filename }) {
    const components = filename.split(sep);
    if (components[0] === 'src') {
        components.shift();
    }
    else if (components[0] === 'node_modules') {
        components.splice(0, components[1][0] === '@' ? 3 : 2); // Remove the folder, the scope (if present) and the package
    }
    return components.join(sep).replace(imagesExtensions, '-[contenthash]$&');
}
export function generateVersion() {
    return new Date()
        .toISOString()
        .replace(/([-:])|(\.\d+Z$)/g, '')
        .replace('T', '.');
}
export function normalizeWebpackEnvironment(env) {
    return env.production === true ? 'production' : 'development';
}
export function findScriptUrl(compilation, path, suffixPattern) {
    var _a;
    if (!suffixPattern) {
        suffixPattern = scriptUrlSuffix;
    }
    const files = (_a = compilation.entrypoints.get(path)) === null || _a === void 0 ? void 0 : _a.getFiles();
    if (!files) {
        return undefined;
    }
    const url = files.find((f) => f.startsWith(path) && suffixPattern.test(f));
    return `/${url}`;
}
