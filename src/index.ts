import { sep } from 'path'
import { Compilation } from 'webpack'

export const cacheName = '@cowtech/webpack'

export const imagesExtensions = /\.(?:bmp|png|jpg|jpeg|gif|svg|webp)$/

export const scriptUrlSuffix = /-(?:(?:[a-f0-9]+)\.mjs)$/i

export async function getManifestUrl(compilation: Compilation): Promise<string> {
  const url = await compilation.getCache(cacheName).getPromise<string>('html-webpack-tracker-plugin:manifest', null)
  return `/${url}`
}

export function normalizeAssetPath({ filename }: { filename?: string }): string {
  let components = filename!.split(sep)

  if (components[0] === 'src') {
    components.shift()
  } else if (components.includes('node_modules')) {
    // If a package
    components = components.slice(components.lastIndexOf('node_modules') + 1)

    components.splice(0, components[1][0] === '@' ? 3 : 2) // Remove the scope (if any) and the package name
  }

  return components.join(sep).replace(imagesExtensions, '-[contenthash]$&')
}

export function generateVersion(): string {
  return new Date()
    .toISOString()
    .replace(/([-:])|(\.\d+Z$)/g, '')
    .replace('T', '.')
}

export function normalizeWebpackEnvironment(env: { [key: string]: boolean | string }): 'production' | 'development' {
  return env.production === true ? 'production' : 'development'
}

export function findScriptUrl(compilation: Compilation, path: string, suffixPattern?: RegExp): string | undefined {
  if (!suffixPattern) {
    suffixPattern = scriptUrlSuffix
  }

  const files = compilation.entrypoints.get(path)?.getFiles()

  if (!files) {
    return undefined
  }

  const url = files.find(f => f.startsWith(path) && suffixPattern!.test(f))
  return `/${url}`
}
