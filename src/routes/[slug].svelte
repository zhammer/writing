<script context="module" lang="ts">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { piece: data.piece };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import Piece from "../components/Piece.svelte";
  import type { Piece as PieceType } from "./_pieces";

  export let piece: PieceType;
</script>

<style>
</style>

<svelte:head>
  <title>{piece.title}</title>
</svelte:head>

<Piece {piece} />
