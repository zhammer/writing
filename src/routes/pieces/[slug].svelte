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
  import Piece from "../../components/Piece.svelte";
  import type { Piece as PieceType } from "../pieces/_pieces";

  export let piece: PieceType;
</script>

<Piece {piece} />
