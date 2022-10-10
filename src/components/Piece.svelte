<script lang="ts">
  import BookPlaylist from "../plugins/BookPlaylist.svelte";
  import {
    isBookPlaylist,
    isWritingPiece,
    type Piece,
  } from "../routes/_pieces";
  import WritingPiece from "./WritingPiece.svelte";

  export let piece: Piece;

  $: writingPiece = isWritingPiece(piece) ? piece : null;

  $: bookPlaylist = isBookPlaylist(piece) ? piece : null;
</script>

{#if !!writingPiece}
  <WritingPiece piece={writingPiece} />
{:else if !!bookPlaylist}
  <BookPlaylist piece={bookPlaylist} />
{/if}
