<script lang="ts">
  import BookPlaylist from "../plugins/BookPlaylist.svelte";
  import {
    isProcessedBookPlaylist,
    isProcessedWritingPiece,
  } from "../routes/_pieces";
  import type {
    ProcessedBookPlaylist,
    ProcessedPiece,
    ProcessedWritingPiece,
  } from "../routes/_pieces";
  import WritingPiece from "./WritingPiece.svelte";

  export let piece: ProcessedPiece;

  let writingPiece: ProcessedWritingPiece | null = null;
  $: writingPiece = isProcessedWritingPiece(piece) ? piece : null;

  let bookplaylist: ProcessedBookPlaylist | null;
  $: bookPlaylist = isProcessedBookPlaylist(piece) ? piece : null;
</script>

{#if !!writingPiece}
  <WritingPiece piece={writingPiece} />
{:else if !!bookPlaylist}
  <BookPlaylist piece={bookPlaylist} />
{/if}
