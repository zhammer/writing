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
  import { fade } from "svelte/transition";
  import Scene from "../../components/Scene.svelte";
  import type { Piece } from "./_pieces";
  // https://open.spotify.com/track/3oSBVpyGQ9N3hPibpw0GkB
  export let piece: Piece;

  let sceneNumber = 0;

  function prevScene() {
    sceneNumber = Math.max(sceneNumber - 1, 0);
  }

  function nextScene() {
    sceneNumber = Math.min(sceneNumber + 1, piece.scenes.length - 1);
  }

  function handleKeydown({ key }: KeyboardEvent) {
    switch (key) {
      case "ArrowRight":
        nextScene();
        break;
      case "ArrowLeft":
        prevScene();
        break;
    }
  }
</script>

<style>
  .container {
    position: relative;
    padding: 4em 20%;
    width: 60%;
    margin: 0 auto;
  }

  .scene {
    position: absolute;
    top: 30%;
    width: 100%;
    margin: 0 auto;
    left: 0;
  }
</style>

<svelte:window on:keydown={handleKeydown} />

<div class="container">
  {#each piece.scenes as scene, i}
    {#if sceneNumber === i}
      <div in:fade={{ delay: 1000, duration: 1000 }} out:fade class="scene">
        <Scene {scene} />
      </div>
    {/if}
  {/each}
</div>
