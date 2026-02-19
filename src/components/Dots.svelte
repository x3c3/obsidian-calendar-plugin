<script lang="ts">
  import { MAX_DOTS } from "src/constants";
  import type { IDayMetadata } from "./types";

  import Dot from "./Dot.svelte";

  let {
    centered = true,
    metadata,
  }: { centered?: boolean; metadata: IDayMetadata[] } = $props();

  let sortedMeta = $derived(
    metadata && [...metadata].sort((a, b) => a.order - b.order),
  );
</script>

<div class="dot-container" class:centered>
  {#if metadata}
    {#each sortedMeta as { color, display, dots = [] }}
      {#if display === "calendar-and-menu"}
        {#each dots.slice(0, MAX_DOTS) as dot}
          <Dot {...dot} color={color} />
        {/each}
      {/if}
    {/each}
  {/if}
</div>

<style>
  .dot-container {
    display: flex;
    flex-wrap: wrap;
    line-height: 6px;
    min-height: 6px;
  }

  .centered {
    justify-content: center;
  }
</style>
