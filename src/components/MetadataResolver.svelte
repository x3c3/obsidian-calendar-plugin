<svelte:options immutable />

<script lang="ts">
  import type { IDayMetadata } from "./types";

  export let metadata: Promise<IDayMetadata[]> | null;
</script>

{#if metadata}
  {#await metadata}
    <slot metadata="{null}" />
  {:then resolvedMeta}
    <slot metadata="{resolvedMeta}" />
  {:catch}
    <slot metadata="{null}" />
  {/await}
{:else}
  <slot metadata="{null}" />
{/if}
