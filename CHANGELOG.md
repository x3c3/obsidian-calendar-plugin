# Changelog

## 2.0.0

Fork of [liamcain/obsidian-calendar-plugin](https://github.com/liamcain/obsidian-calendar-plugin). Maintained by Mark Ayers.

### Breaking changes

- Minimum Obsidian version is now 1.0.0 (was 0.9.11)
- Removed streak, tags, and tasks dot sources (word count dots remain)
- Removed metadata popover on hover (native Obsidian hover preview still works with Ctrl/Cmd)

### Toolchain

- Upgraded to Svelte 5, TypeScript 5
- Replaced ESLint + Prettier with Biome
- Replaced Rollup (6 packages) with Vite
- Replaced yarn with bun
- Rewrote CI workflows for Bun (checkout@v4, setup-bun@v2, softprops/action-gh-release@v2)
- Added version-bump.ts for automated version syncing
- Aligned project config with [philoserf/obsidian-plugin-template](https://github.com/philoserf/obsidian-plugin-template)
- Bundle size reduced from ~99kB to ~80kB

### Inlined dependencies

- Inlined `obsidian-calendar-ui` as `src/components/`
- Inlined `obsidian-daily-notes-interface` as `src/periodic-notes/`
- Removed `@popperjs/core` and `svelte-portal` (only used by popover)

### Bug fixes

- Fixed null crash when no active leaf exists
- Fixed null crash from `getRightLeaf()` returning null
- Fixed `new Menu(app)` to `new Menu()` (Obsidian API changed)
- Fixed `collectNotes` failing for vault root folder
- Added try/catch to file cache initialization
- Fixed stale CSS selector (`h4` to `h3` in settings banner)

### Code quality

- Fixed 83 type errors and 8 a11y warnings (zero remain)
- Replaced deprecated Obsidian APIs (`splitActiveLeaf`, `getUnpinnedLeaf`, `fileManager.promptForFileDeletion`)
- Migrated to Svelte 5 component API (`mount`/`unmount` instead of `new Component`)
- Converted interactive divs to buttons with keyboard handlers
- Removed dead test infrastructure, unused exports, and stale comments
- Deduplicated `dailyNotes.ts` + `weeklyNotes.ts` into `notes.ts`
- Deduplicated `getAllDailyNotes`/`Weekly`/`Monthly` into shared `collectNotes` helper

### Known issues

- "Open Weekly Note" command crashes if the calendar view hasn't been opened yet (#377)
- Wrong year when clicking days near year boundary (#393, #384)
- `{{date}}` template tag may apply incorrectly (#376)
