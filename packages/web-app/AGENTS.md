# Salad Web App: Agent Instructions

Formatting, linting, and testing come from the typescript template in SaladTechnologies/salad-platform
`devops/templates`, last applied from commit `2b9ee65c1c`. Run `just fmt` after editing, and `just ci` before calling
the work done. While the template is adopted in steps (below), some recipes and files named here do not exist yet; run
the ones `just --list` shows.

## Template adoption (web app rebuild)

The web app rebuild (feature branch `web-app-rebuild`) adopted the template in the steps below, one PR each. The
justfile's `lint-typescript` is now the template's.

1. Done: npm (from Yarn PnP), Node.js and npm through mise, just, and CI running `just ci` and `just build` through
   mise. `lint-typescript` ran `tsc` with the old `tsconfig.json` and the template's install-script and license checks;
   `test-typescript` is the template's.
2. Done: Prettier 3 with the template's settings (`fmt-typescript`, `fmt-check-typescript`, and `fmt-check` in `ci`).
   Kiota's generated Machines API client (`src/api/machinesApiClient/generated/`) is in `.prettierignore`, with the
   reason. The template's tsgo editor settings came with step 3; oxc's come with step 4.
3. Done: TypeScript 7 with the template's `tsconfig.*.json` projects (`lint-typescript` runs `tsc --build`), and
   `"type": "module"` in `package.json`. See "TypeScript projects" and "CommonJS default imports" below.
4. Done: the rest of the template's `lint-typescript` (oxlint, knip, `npm audit signatures`, and
   `_lint-typescript-projects`) and the template's oxc editor settings. The code the rebuild has not rewritten yet is in
   oxlint's `ignorePatterns`, the same list as `tsconfig.legacy.json`'s `include` without `src/vite-env.d.ts` (which the
   browser project shares), each entry removed as its area is rewritten. knip runs on everything; what it found unused
   was deleted, Storybook with it (stories, `.storybook/`, and their dependencies: nobody could run them since Create
   React App went, and the redesign replaces the components).
5. Done: `npm audit`, with the upgrades its findings needed: axios 1.8.1 → 1.21.1, lodash 4.17.21 → 4.18.1, moment
   2.30.1 → 2.31.0, `@babel/runtime` 7.26.0 → 7.29.14, and uuid 9.0.1 → 11.1.1 (the app and Kiota use only `v4`).

### TypeScript projects

- `tsconfig.browser.json` (the template's) holds code the rebuild has written or rewritten. New code goes there.
- `tsconfig.legacy.json` holds the code the rebuild has not rewritten yet: the browser project's settings plus
  `experimentalDecorators` and `useDefineForClassFields: false` for MobX, with `erasableSyntaxOnly`,
  `exactOptionalPropertyTypes`, and `noPropertyAccessFromIndexSignature` off (about 850 findings in the old code). Its
  `include` lists the folders and files of the old code; when an area is rewritten, its entry moves out of this list
  (and out of `exclude` in `tsconfig.browser.json`). The list only shrinks: never add new code to it.
- `tsconfig.generated.json` holds Kiota's generated Machines API client, with `verbatimModuleSyntax` off; the reason is
  in the file.
- `tsconfig.node.json` (the template's) holds `vite.config.ts`.
- Vite reads these settings too (through the references in `tsconfig.json`), so they change the build, not only the type
  check: decorators in the old code compile only because the legacy project turns them on.

### CommonJS default imports

The package is `"type": "module"`, so Vite (and Vitest) import CommonJS the way Node does: a default import of a
CommonJS package is its whole `module.exports`. For a package compiled from ES modules (it sets `__esModule` and puts
the component under `default`) that is the wrong value, and the page fails with React error 130. Import such a package's
default through `cjsDefault` (`src/cjs-default.ts`), as `react-responsive`, `react-multi-carousel`, `react-html-parser`,
and `react-aspect-ratio` are; prefer a named export when the package has one that is the same value, as
`react-custom-scrollbars-2`'s `Scrollbars` is. A package whose `module.exports` is the value itself (`classnames`,
`moment`) imports as before.

### Project-specific settings

- `package.json` `overrides` that point a package's peer dependency at the app's own version. npm does not allow
  comments in `package.json`, so the reasons are here. Each goes away with the package that needs it:
  - `@saladtechnologies/garden-components` 1.6.2 asks for `react-intl` 7 and `react-responsive` 10; the app ships with
    6.8.9 and 9.0.2, as it did on Yarn, which did not enforce peers. Upgrading either is a separate change.
  - `mobx-react` 6, `mobx-react-lite` 2, and `react-html-parser` 2 ask for React 16; the app runs React 18, as it did on
    Yarn. MobX and its bindings are removed by the rebuild.
- `package.json` `overrides` `typescript`: `react-intl` 6 and its `@formatjs/intl` have an optional peer on TypeScript 4
  or 5, and npm reaches them through more than one path (the app, and garden-components' peer), so a per-package
  override does not cover them all. The app type checks with TypeScript 7 and uses no TypeScript at runtime.
- `package.json` `overrides` carried over from Yarn's `resolutions`: the patched `@elastic/search-ui` from `libs/` and
  the Kiota preview versions. (The `trim-newlines` and `trim` pins went with Storybook, which brought them in.) The
  `@microsoft/kiota-abstractions` entry also points its `uuid` (it asks for 10) at the app's 11.1.1, which fixes an
  advisory `npm audit` fails on; Kiota only calls `uuid`'s `v4`, which 11 keeps.
- `allowScripts` denies `core-js`, whose install script only prints a funding message, and the patched
  `@elastic/search-ui` tarball in `libs/`, whose `prepare` script builds it from source the tarball does not include (it
  ships the built `lib/`). npm matches that entry by its `file:` spec, so the key is the relative path.
- The justfile allows the `MIT-0` license and lists `typescript-reviewed-packages`, exact versions whose license was
  read by hand. The reasons are next to them.
- `knip.jsonc` and `.oxlintrc.json` carry their project-specific settings next to them, each with its reason.

## TypeScript

- Run `just fmt-typescript` after editing a TypeScript, JavaScript, CSS, HTML, JSON, Markdown, or YAML file, and
  `just fmt-check-typescript`, `just lint-typescript`, and `just test-typescript` before calling the work done. Never
  run Prettier, oxlint, tsc, knip, or Vitest directly with flags that override our configuration.
- Fix every finding. An oxlint suppression is `// oxlint-disable-next-line <plugin>/<rule> -- <reason>` on the line
  before the one it covers, never a block or file-wide `oxlint-disable`, an `eslint-disable` comment, or an
  `.oxlintrc.json` change. A type error that cannot be fixed is `// @ts-expect-error <reason>`, never `@ts-ignore` or
  `@ts-nocheck`. Fix a knip finding by deleting what is unused; a file that only a tool loads, which knip cannot see,
  goes in `entry` in `knip.jsonc`.
- Add a dependency with `npm install <pkg>` (`npm install -D <pkg>` for tools, types, and anything only the build uses),
  which saves the exact version, and commit `package.json` and `package-lock.json` together. Never edit
  `package-lock.json` by hand. A dependency with an install script needs a decision: read the script, then
  `npm install-scripts approve <pkg>` or `npm install-scripts deny <pkg>`. A dependency's license must be on the
  justfile's allowlist. npm installs only versions published at least 7 days ago: wait for a newer one rather than
  relaxing that. Tools that are npm packages go in `devDependencies`; never `npx` one that is not there.
- Code is in one of two TypeScript projects: browser code in `src/` (`tsconfig.browser.json`), and Node code, which is
  scripts and tool config files (`tsconfig.node.json`). A file in neither fails the lint: add it to the right `include`.
  Browser code never imports a Node module or logs to the console.
- Write TypeScript, not JavaScript. Use only syntax Node can strip (`erasableSyntaxOnly`), so scripts run as
  `node scripts/<name>.ts`: no `enum`, `namespace`, or parameter properties. Import a relative module by its file name,
  extension included (`./app.tsx`). Export by name; only a tool's config file has a default export.
- Never use `any` or a non-null assertion (`!`): take `unknown` and narrow it. A `switch` over a union names every
  member and has no `default`, so a new member breaks every `switch` that misses it.
- Document every exported symbol, and every member of an exported type, with a `/** */` comment. Comments inside code
  use `//`. Prettier wraps code and JSDoc comments; wrap `//` comments by hand at 120 columns.
- A script sets `process.exitCode` instead of calling `process.exit()`, so pending output and cleanup finish.
- Tests use Vitest, in `<name>.test.ts` next to the code they test, and import `describe`, `it`, and `expect` from
  `vitest`. They run in random order and never use `.only`. A flaky test is a finding: fix it, never retry it.

## Styling

- New UI uses Tailwind 4 and shadcn/ui components in `src/ui/`. The old pages keep react-jss and garden's Emotion styles
  until their area is rebuilt; never mix Tailwind classes into an old component.
- `src/ui/tailwind.css` loads Tailwind's theme and utilities, not its Preflight reset, so the old pages look exactly as
  before. Without Preflight, a component resets what the browser's own styles set (a button's border, background,
  margin, padding, font, box sizing, and underline: see `button-variants.ts`). The layered utilities lose to the old
  unlayered CSS wherever both set the same property.
- Tailwind scans only `src/ui/`, minus tests (`@source` in `tailwind.css`). It turns every word of a scanned file that
  names a utility into a global class, so a plain word that is not meant as a class (`container`, `outline`) goes in the
  `@source not inline(...)` list. A rebuilt area that moves out of `src/ui/` adds its folder there.
- Use the theme's tokens, not raw values: `salad-*` colors, font sizes (`text-salad-small`), and fonts, which match
  `SaladTheme`, and shadcn's semantic colors (`bg-primary`, `text-foreground`, `border-border`). Add a token to `@theme`
  in `tailwind.css`; a new `salad-*` font size also goes in `cn.ts`, or `cn` reads it as a color.
- Join classes with `cn` (`src/ui/cn.ts`), so a later class wins over a conflicting earlier one.
- Add a shadcn/ui component by copying its source from ui.shadcn.com into `src/ui/` and adapting it to these rules
  (named exports, the resets above, our tokens), not with the shadcn CLI. Its Radix dependency is pre-approved.
- Prettier sorts Tailwind classes (`prettier-plugin-tailwindcss`), including inside `cn(...)` and `cva(...)`.

## Data

- The App API client is `createHttpClient` (`src/data/http-client.ts`); `src/index.tsx` creates the one the app uses. It
  knows nothing about the stores: a 401 calls `onUnauthorized` (the session ends) and a 401 that asks for sudo mode
  calls `onSudoRequired` with the request to replay. A problem response rejects with `SaladError`
  (`src/data/salad-error.ts`), whose message is the one to show the user.
- New code reads and writes App API data with TanStack Query, through that client. The query client
  (`src/data/query-client.ts`) never refetches on focus or reconnect and never retries: the HTTP client already retries
  safe requests, and nothing else is safe to repeat. A query that should refresh says so itself (`refetchInterval`,
  `staleTime`).
- Whether the user is signed in is the session query: `useSession()` (`src/data/session.ts`) is `unknown`, `yes`, or
  `no`. Change it with `setSession` after a sign-in or sign-out, never by refetching. Until MobX is gone,
  `SessionProvider` mirrors it into `AuthStore.isAuthenticated` and runs the root store's login and logout work.
