<script lang="ts">
  import { fade } from "svelte/transition";
  import Scene from "./Scene.svelte";
  import type { Piece } from "../routes/pieces/_pieces";
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
    display: relative;
  }

  .scene {
    padding: 4em 20%;
    position: absolute;
    left: 0;
    right: 0;
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
