<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { Plugin } from "obsidian";
  import { onDestroy, setContext } from "svelte";
  import { get, writable } from "svelte/store";

  import type { ISettings } from "src/settings";
  import { activeFile, settings } from "../stores";
  import { DISPLAYED_MONTH } from "./context";
  import Day from "./Day.svelte";
  import PeriodicNotesCache from "./fileStore";
  import { configureGlobalMomentLocale } from "./localization";
  import Nav from "./Nav.svelte";
  import type { ICalendarSource, IEventHandlers, IMonth, ISourceSettings } from "./types";
  import { getDaysOfWeek, getMonth, isWeekend } from "./utils";
  import WeekNum from "./WeekNum.svelte";

  // Props from view.ts
  export let plugin: Plugin;
  export let sources: ICalendarSource[] = [];
  export let onHover: IEventHandlers["onHover"];
  export let onClick: IEventHandlers["onClick"];
  export let onContextMenu: IEventHandlers["onContextMenu"];

  // Internal state derived from stores
  let today: Moment = window.moment();
  $: today = getToday($settings);
  $: showWeekNums = $settings.showWeeklyNote;
  $: selectedId = $activeFile;

  // Public API for view.ts
  export function tick() {
    today = window.moment();
  }

  export function setDisplayedMonth(date: Moment) {
    displayedMonthStore.set(date);
  }

  function getToday(s: ISettings) {
    configureGlobalMomentLocale(s.localeOverride, s.weekStart);
    return window.moment();
  }

  function getSourceSettings(_sourceId: string): ISourceSettings {
    return {
      color: "default",
      display: "calendar-and-menu",
      order: 0,
    };
  }

  // Heartbeat: update today every 60s, sync displayed month if viewing current
  let heartbeat = setInterval(() => {
    tick();
    if (get(displayedMonthStore).isSame(today, "day")) {
      displayedMonthStore.set(today);
    }
  }, 1000 * 60);

  onDestroy(() => {
    clearInterval(heartbeat);
  });

  let displayedMonthStore = writable<Moment>(today);
  setContext(DISPLAYED_MONTH, displayedMonthStore);

  $: eventHandlers = { onHover, onClick, onContextMenu };

  let month: IMonth;
  let daysOfWeek: string[];

  $: { today; month = getMonth($displayedMonthStore); }
  $: { today; daysOfWeek = getDaysOfWeek(); }

  const fileCache = new PeriodicNotesCache(plugin, sources);
</script>

<div id="calendar-container" class="container">
  <Nav
    fileCache="{fileCache}"
    today="{today}"
    getSourceSettings="{getSourceSettings}"
    eventHandlers="{eventHandlers}"
  />
  <table class="calendar">
    <colgroup>
      {#if showWeekNums}
        <col />
      {/if}
      {#each month[1].days as date}
        <col class:weekend="{isWeekend(date)}" />
      {/each}
    </colgroup>
    <thead>
      <tr>
        {#if showWeekNums}
          <th>W</th>
        {/if}
        {#each daysOfWeek as dayOfWeek}
          <th>{dayOfWeek}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each month as week (week.weekNum)}
        <tr>
          {#if showWeekNums}
            <WeekNum
              fileCache="{fileCache}"
              selectedId="{selectedId}"
              getSourceSettings="{getSourceSettings}"
              {...week}
              {...eventHandlers}
            />
          {/if}
          {#each week.days as day (day.format())}
            <Day
              date="{day}"
              fileCache="{fileCache}"
              getSourceSettings="{getSourceSettings}"
              today="{today}"
              selectedId="{selectedId}"
              {...eventHandlers}
            />
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
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

  .container {
    padding: 0 8px;
  }

  .weekend {
    background-color: var(--color-background-weekend);
  }

  .calendar {
    border-collapse: collapse;
    width: 100%;
  }

  th {
    background-color: var(--color-background-heading);
    color: var(--color-text-heading);
    font-size: 0.6em;
    letter-spacing: 1px;
    padding: 4px;
    text-align: center;
    text-transform: uppercase;
  }
</style>
