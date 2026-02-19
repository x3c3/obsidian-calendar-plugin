<script lang="ts">
  import type { Snippet } from "svelte";
  import type { IDayMetadata } from "./types";

  let {
    metadata,
    children,
  }: {
    metadata: Promise<IDayMetadata[]> | null;
    children: Snippet<[IDayMetadata[] | null]>;
  } = $props();
</script>

{#if metadata}
  {#await metadata}
    {@render children(null)}
  {:then resolvedMeta}
    {@render children(resolvedMeta)}
  {:catch}
    {@render children(null)}
  {/await}
{:else}
  {@render children(null)}
{/if}
