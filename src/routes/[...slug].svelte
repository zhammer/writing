<script context="module" lang="ts">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await fetch(`/pieces_data/${page.params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      let query = new URLSearchParams();
      try {
        query = page.query;
      } catch (e) {}
      return { props: { item: data.item, query: query } };
    } else {
      return { status: res.status, error: data.message };
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

{#if "children" in item}
  <Directory directory={item} {query} />
{:else}
  <Piece piece={item} />
{/if}
