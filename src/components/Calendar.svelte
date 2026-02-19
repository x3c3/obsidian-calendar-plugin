<svelte:options immutable />

<script lang="ts">
  import { Plugin } from "obsidian";
  import type { Locale, Moment } from "moment";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import { DISPLAYED_MONTH, IS_MOBILE } from "./context";
  import Day from "./Day.svelte";
  import Nav from "./Nav.svelte";
  import WeekNum from "./WeekNum.svelte";
  import type { ICalendarSource, IEventHandlers, IMonth, ISourceSettings } from "./types";
  import { getDaysOfWeek, getMonth, isWeekend } from "./utils";
  import PeriodicNotesCache from "./fileStore";

  export let localeData: Locale;
  export let showWeekNums: boolean = false;
  export let eventHandlers: IEventHandlers;

  // External sources (All optional)
  export let plugin: Plugin;
  export let sources: ICalendarSource[] = [];
  export let getSourceSettings: (sourceId: string) => ISourceSettings;
  export let selectedId: string | null;

  // Override-able local state
  export let today: Moment = window.moment();
  export let displayedMonth: Moment = today;

  setContext(IS_MOBILE, (plugin.app as any).isMobile);

  let displayedMonthStore = writable<Moment>(displayedMonth);
  setContext(DISPLAYED_MONTH, displayedMonthStore);

  let month: IMonth;
  let daysOfWeek: string[];

  $: { localeData; month = getMonth($displayedMonthStore); }
  $: { localeData; daysOfWeek = getDaysOfWeek(); }

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
