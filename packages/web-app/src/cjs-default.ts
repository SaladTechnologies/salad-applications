/**
 * Returns the default export of a CommonJS module compiled from ES modules, whichever way the bundler imported it.
 *
 * This package is `"type": "module"`, so Vite and Node import CommonJS the way Node does: a default import is the whole
 * `module.exports` object. For a package compiled from ES modules, that object holds the real default export under
 * `default` (and sets `__esModule`). A bundler that follows the `__esModule` convention instead hands over `default`
 * directly, and this returns it unchanged.
 *
 * @param imported The value of a default import from such a package.
 * @returns The package's real default export.
 */
export const cjsDefault = <T>(imported: T): T => {
  if (typeof imported === 'object' && imported !== null && '__esModule' in imported && 'default' in imported) {
    // The import's declared type is the default export's, which is what `default` holds; nothing at runtime can check
    // it.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- see the comment above
    return imported.default as T
  }
  return imported
}
