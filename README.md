# Calendar Plugin for Obsidian

A calendar view for navigating and creating daily, weekly, and monthly notes in [Obsidian](https://obsidian.md/).

Originally created by [Liam Cain](https://github.com/liamcain/obsidian-calendar-plugin).

![screenshot-full](https://raw.githubusercontent.com/liamcain/obsidian-calendar-plugin/master/images/screenshot-full.png)

## Usage

After enabling the plugin, a calendar view appears in the right sidebar. The plugin reads your Daily Note settings to determine your date format, template location, and folder for new notes.

## Features

- Navigate to any **daily note** by clicking its date
- Create new daily notes for past or future dates using your configured template
- Word count dots show approximate writing volume per day
- **Weekly notes** with their own format, folder, and template settings
- **Monthly notes** via the [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) plugin
- Hover preview of daily notes with `Ctrl/Cmd` + hover

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Words per dot | 250 | Number of words each dot represents (max 5 dots per day) |
| Start week on | Locale | First day of the week (locale default, or pick a specific day) |
| Confirm before creating | On | Show a confirmation dialog before creating a new note |
| Show week number | Off | Add a column with ISO week numbers; click to open weekly notes |

## Customization

Override these CSS variables in a CSS snippet to customize the calendar appearance:

```css
#calendar-container {
  --color-background-heading: transparent;
  --color-background-day: transparent;
  --color-background-weeknum: transparent;
  --color-background-weekend: transparent;

  --color-dot: var(--text-muted);
  --color-arrow: var(--text-muted);
  --color-button: var(--text-muted);

  --color-text-title: var(--text-normal);
  --color-text-heading: var(--text-muted);
  --color-text-day: var(--text-normal);
  --color-text-today: var(--interactive-accent);
  --color-text-weeknum: var(--text-muted);
}
```

Target specific elements with `#calendar-container .classname` to avoid affecting other parts of Obsidian. Do not rely on `.svelte-*` classes; they change between releases.

## Tips

- **Open in new split**: `Ctrl/Cmd`-click a date to open its note in a new pane
- **Reveal open note**: Use `Calendar: Reveal open note` from the command palette to jump to the current note's date
- **Move the calendar**: Drag it to the left sidebar or main content area; it can be pinned in place
- **Reopen if closed**: Run `Calendar: Open view` from the command palette
- **Style weekends**: Set `--color-background-weekend` to visually distinguish weekend columns

## Weekly Note Template Tags

| Tag | Description |
|-----|-------------|
| `{{sunday:format}}` ... `{{saturday:format}}` | Insert the date of a specific day of the week |
| `{{title}}` | The filename of the weekly note |
| `{{date}}`, `{{time}}` | Date and time of the first day of the week |

To include literal words in your format, wrap them in brackets: `[Week] ww [of] gggg` produces "Week 21 of 2026".

## Compatibility

Requires Obsidian v1.0.0 or later.

## Installation

Install from the Community Plugins catalog in Obsidian by searching for "Calendar".
