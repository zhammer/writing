<script context="module" lang="ts">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { item: data.item, query };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import Directory from "../components/Directory.svelte";
  import Piece from "../components/Piece.svelte";
  import type { Piece as PieceType, DirectoryLS } from "./_pieces";

  export let item: PieceType | DirectoryLS;
  export let query: any;
</script>

{@debug item}

{#if 'children' in item}
  <Directory directory={item} {query} />
{:else}
  <Piece piece={item} />
{/if}
