import { Compilation } from 'webpack';
export declare const cacheName = "@cowtech/webpack";
export declare const imagesExtensions: RegExp;
export declare const scriptUrlSuffix: RegExp;
export declare function getManifestUrl(compilation: Compilation): Promise<string>;
export declare function normalizeAssetPath({ filename }: {
    filename?: string;
}): string;
export declare function generateVersion(): string;
export declare function normalizeWebpackEnvironment(env: {
    [key: string]: boolean | string;
}): 'production' | 'development';
export declare function findScriptUrl(compilation: Compilation, path: string, suffixPattern?: RegExp): string | undefined;
