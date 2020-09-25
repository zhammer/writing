<script context="module" lang="ts">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`pieces/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { piece: data.piece };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import type { Piece } from "./_pieces";
  export let piece: Piece;
</script>

<div>{JSON.stringify(piece, null, 2)}</div>
