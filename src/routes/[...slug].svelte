<script context="module" lang="ts">
  /**
	 * @type {import('@sveltejs/kit').Load}
	 */
  export async function load({ page, fetch }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await fetch(`${page.params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { props: { item: data.item, query: page.query }};
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

{#if 'children' in item}
  <Directory directory={item} {query} />
{:else}
  <Piece piece={item} />
{/if}
