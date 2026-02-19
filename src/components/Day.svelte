<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import type { TFile } from "obsidian";
  import { type IGranularity, getDateUID } from "../periodic-notes";
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import { DISPLAYED_MONTH } from "./context";
  import type PeriodicNotesCache from "./fileStore";
  import type {
    IDayMetadata,
    IHTMLAttributes,
    ISourceSettings,
  } from "./types";
  import { isMetaPressed } from "./utils";

  // Properties
  export let date: Moment;
  export let fileCache: PeriodicNotesCache;
  export let getSourceSettings: (sourceId: string) => ISourceSettings;

  let file: TFile | null;

  export let onHover: (
    periodicity: IGranularity,
    date: Moment,
    file: TFile | null,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => void;
  export let onClick: (
    granularity: IGranularity,
    date: Moment,
    existingFile: TFile | null,
    inNewSplit: boolean
  ) => void;
  export let onContextMenu: (
    granularity: IGranularity,
    date: Moment,
    file: TFile | null,
    event: MouseEvent
  ) => void;

  // Global state
  export let today: Moment;
  export let selectedId: string | null = null;
  const displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);

  let metadata: Promise<IDayMetadata[]> | null;

  const unsubscribe = fileCache.store.subscribe(() => {
    file = fileCache.getFile(date, "day");
    metadata = fileCache.getEvaluatedMetadata("day", date, getSourceSettings);
  });
  onDestroy(unsubscribe);

  function handleClick(event: MouseEvent) {
    onClick?.("day", date, file, isMetaPressed(event));
  }

  function handleHover(event: PointerEvent) {
    if (event.target) {
      onHover?.("day", date, file, event.target, isMetaPressed(event));
    }
  }

  function handleContextmenu(event: MouseEvent) {
    onContextMenu?.("day", date, file, event);
  }

  function getAttributes(metadata: IDayMetadata[]): IHTMLAttributes {
    if (!metadata) {
      return {};
    }
    return metadata
      .filter((meta) => meta.display === "calendar-and-menu")
      .reduce((acc, meta) => {
        return {
          ...acc,
          ...meta.attrs,
        };
      }, {});
  }
</script>

<td>
  <MetadataResolver metadata="{metadata}" let:metadata>
    <div
      class="day"
      class:active="{selectedId === getDateUID(date, 'day')}"
      class:adjacent-month="{!date.isSame($displayedMonth, 'month')}"
      class:has-note="{!!file}"
      class:today="{date.isSame(today, 'day')}"
      draggable="{true}"
      {...getAttributes(metadata ?? [])}
      on:click="{handleClick}"
      on:contextmenu="{handleContextmenu}"
      on:pointerenter="{handleHover}"
      on:dragstart="{file ? (event) => fileCache.onDragStart(event, file!) : undefined}"
    >
      {date.format("D")}
      <Dots metadata="{metadata ?? []}" />
    </div>
  </MetadataResolver>
</td>

<style>
  .day {
    background-color: var(--color-background-day);
    border-radius: 4px;
    color: var(--color-text-day);
    cursor: pointer;
    font-size: 0.8em;
    height: 100%;
    padding: 4px;
    position: relative;
    text-align: center;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: baseline;
  }
  .day:hover {
    background-color: var(--interactive-hover);
  }

  .day.active:hover {
    background-color: var(--interactive-accent-hover);
  }

  .adjacent-month {
    opacity: 0.25;
  }

  .today {
    color: var(--color-text-today);
  }

  .day:active,
  .active,
  .active.today {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
  }
</style>
