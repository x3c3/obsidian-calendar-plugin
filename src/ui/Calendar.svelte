<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import type { Plugin } from "obsidian";
  import { onDestroy } from "svelte";

  import { Calendar as CalendarBase, configureGlobalMomentLocale } from "src/components";
  import type { ICalendarSource, IEventHandlers, ISourceSettings } from "src/components";
  import type { ISettings } from "src/settings";
  import { activeFile, settings } from "./stores";

  let today: Moment = window.moment();

  $: today = getToday($settings);

  export let displayedMonth: Moment = today;
  export let sources: ICalendarSource[];
  export let plugin: Plugin;
  export let onHover: IEventHandlers["onHover"];
  export let onClick: IEventHandlers["onClick"];
  export let onContextMenu: IEventHandlers["onContextMenu"];

  export function tick() {
    today = window.moment();
  }

  export function setDisplayedMonth(date: Moment) {
    displayedMonth = date;
  }

  function getToday(settings: ISettings) {
    configureGlobalMomentLocale(settings.localeOverride, settings.weekStart);
    return window.moment();
  }

  function getSourceSettings(_sourceId: string): ISourceSettings {
    return {
      color: "default",
      display: "calendar-and-menu",
      order: 0,
    };
  }

  let heartbeat = setInterval(() => {
    tick();

    const isViewingCurrentMonth = displayedMonth.isSame(today, "day");
    if (isViewingCurrentMonth) {
      displayedMonth = today;
    }
  }, 1000 * 60);

  onDestroy(() => {
    clearInterval(heartbeat);
  });
</script>

<CalendarBase
  {sources}
  {today}
  {plugin}
  eventHandlers={{ onHover, onClick, onContextMenu }}
  getSourceSettings={getSourceSettings}
  bind:displayedMonth
  localeData={today.localeData()}
  selectedId={$activeFile}
  showWeekNums={$settings.showWeeklyNote}
/>
