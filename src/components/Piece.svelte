<script context="module" lange="ts">
  export const router = false;
</script>

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

  $: writingPiece = isProcessedWritingPiece(piece) ? piece : null;

  $: bookPlaylist = isProcessedBookPlaylist(piece) ? piece : null;
</script>

{#if !!writingPiece}
  <WritingPiece piece={writingPiece} />
{:else if !!bookPlaylist}
  <BookPlaylist piece={bookPlaylist} />
{/if}
