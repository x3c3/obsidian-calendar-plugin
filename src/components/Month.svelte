<script lang="ts">
  import type { Moment } from "moment";
  import type { TFile } from "obsidian";
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";
  import {
    appHasMonthlyNotesPluginLoaded,
    type IGranularity,
  } from "../periodic-notes";

  import { DISPLAYED_MONTH } from "./context";
  import Dots from "./Dots.svelte";
  import type PeriodicNotesCache from "./fileStore";
  import MetadataResolver from "./MetadataResolver.svelte";
  import { isMetaPressed } from "./utils";
  import type { IDayMetadata, ISourceSettings } from "./types";

  export let fileCache: PeriodicNotesCache;
  export let getSourceSettings: (sourceId: string) => ISourceSettings;
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
  export let resetDisplayedMonth: () => void;

  let displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);
  let metadata: Promise<IDayMetadata[]> | null;

  let file: TFile | null;
  function getMetadata() {
    file = fileCache.getFile($displayedMonth, "month");
    metadata = fileCache.getEvaluatedMetadata(
      "month",
      $displayedMonth,
      getSourceSettings
    );
  }
  const unsubFileCache = fileCache.store.subscribe(getMetadata);
  const unsubDisplayedMonth = displayedMonth.subscribe(getMetadata);
  onDestroy(() => {
    unsubFileCache();
    unsubDisplayedMonth();
  });

  function handleHover(event: PointerEvent) {
    if (!appHasMonthlyNotesPluginLoaded()) {
      return;
    }

    const date = $displayedMonth;
    if (event.target) {
      onHover?.("month", date, file, event.target, isMetaPressed(event));
    }
  }

  function handleClick(event: MouseEvent) {
    if (appHasMonthlyNotesPluginLoaded()) {
      onClick?.("month", $displayedMonth, file, isMetaPressed(event));
    } else {
      resetDisplayedMonth();
    }
  }
</script>

<MetadataResolver metadata="{metadata}" let:metadata>
  <div
    role="button"
    tabindex="0"
    draggable="{true}"
    on:click="{handleClick}"
    on:keydown="{(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (appHasMonthlyNotesPluginLoaded()) {
          onClick?.('month', $displayedMonth, file, false);
        } else {
          resetDisplayedMonth();
        }
      }
    }}"
    on:contextmenu="{metadata &&
      onContextMenu &&
      ((e) => onContextMenu('month', $displayedMonth, file, e))}"
    on:dragstart="{file ? (event) => fileCache.onDragStart(event, file!) : undefined}"
    on:pointerenter="{handleHover}"
  >
    <span class="title">
      <span class="month">
        {$displayedMonth.format("MMM")}
      </span>
      <span class="year">
        {$displayedMonth.format("YYYY")}
      </span>
    </span>
    {#if metadata}
      <Dots metadata="{metadata}" centered="{false}" />
    {/if}
  </div>
</MetadataResolver>

<style>
  .title {
    color: var(--color-text-title);
    cursor: pointer;
    display: flex;
    font-size: 1.4em;
    gap: 0.3em;
    margin: 0;
  }

  .month {
    font-weight: 500;
  }

  .year {
    color: var(--interactive-accent);
  }
</style>
