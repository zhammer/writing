<script lang="ts">
  import { fade } from "svelte/transition";
  import swipeable from "../actions/swipeable";
  import SongPlayer from "../components/SongPlayer/index.svelte";
  import Scene from "./Scene.svelte";
  import type { Piece } from "../routes/_pieces";
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

  function handleSwipeRight() {
    prevScene();
  }

  function handleSwipeLeft() {
    nextScene();
  }
</script>

<style>
  /*
   * We fadein the entire container because, as far as I can tell,
   * the in:fade transition doesn't display on initial page load.
   */
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .container {
    display: relative;
    animation: fadein 1s ease-in 1.5s backwards;
  }

  .scene {
    padding: 4em 20%;
    position: absolute;
    left: 0;
    right: 0;
  }

  .scene.Card {
    display: flex;
    flex-direction: column;
    margin-top: 30%;
  }
</style>

<svelte:window
  on:keydown={handleKeydown}
  use:swipeable
  on:swiperight={handleSwipeRight}
  on:swipeleft={handleSwipeLeft} />

<div class="container">
  {#each piece.scenes as scene, i}
    {#if sceneNumber === i}
      <div
        in:fade|local={{ delay: 1500, duration: 1500 }}
        out:fade|local
        class={`scene ${scene.type}`}>
        <Scene {scene} />
      </div>
    {/if}
  {/each}
</div>
<SongPlayer {piece} {sceneNumber} />
