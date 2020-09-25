<script context="module" lang="ts">
  export async function preload() {
    let resp = await this.fetch("pieces.json");
    let { pieces } = await resp.json();
    return { pieces };
  }
</script>

<script lang="ts">
  import type { Piece } from "./pieces/_pieces";
  export let pieces: Piece[];
</script>

<style>
  h1 {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>My Writing</title>
</svelte:head>

<h1>My Writing</h1>

<div class="piece-container">
  <ul>
    {#each pieces as piece}
      <li><a rel="prefetch" href="pieces/{piece.slug}">{piece.title}</a></li>
    {/each}
  </ul>
</div>
