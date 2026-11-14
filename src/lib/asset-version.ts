/**
 * One version string for every photo URL under /public. Bump it when photos
 * are replaced: the URLs change, so no browser or CDN keeps serving the old
 * files. next.config.ts allows exactly this query on local images.
 */
export const ASSET_VERSION = "17";

export function v(publicPath: string): string {
  return `${publicPath}?v=${ASSET_VERSION}`;
}
