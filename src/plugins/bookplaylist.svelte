<script lang="ts">
  import type { ProcessedBookPlaylist } from "../routes/_pieces";

  export let piece: ProcessedBookPlaylist;
</script>

<div class="body">
  <div class="page">
    <div>
      <h1>{piece.book.title} <i>by {piece.book.author}</i></h1>
      <a href={piece.book.url} title="view on google books"
        ><img src={piece.book.image} alt="book cover" /></a
      >
      <p>{piece.note}</p>
      <iframe
        title="playlist"
        src={piece.playlist.replace(".com/", ".com/embed/")}
        width="300"
        height="380"
        frameborder="0"
        allowtransparency={true}
        allow="encrypted-media"
      />
    </div>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }

  .body {
    background-image: url("/candle.gif");
    font-family: helvetica, arial, sans-serif;
    font-size: 16px;
    height: 110vh;
  }

  .page {
    padding-top: 1em;
    max-width: 900px;
    margin: 0 auto;
  }

  h1,
  p {
    color: lightyellow;
    background-color: black;
  }

  p {
    white-space: pre-wrap;
  }
</style>
