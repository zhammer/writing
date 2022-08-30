<script lang="ts">
  import { fade } from "svelte/transition";
  import swipeable from "../actions/swipeable";
  import SongPlayer from "../components/SongPlayer/index.svelte";
  import Scene from "./Scene.svelte";
  import type { ProcessedWritingPiece } from "../routes/_pieces";
  export let piece: ProcessedWritingPiece;

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

  // this is a bit hacky. the way our scenes transition, when we move
  // from scene A to scene B, scene A does an out:fade. scene B does an
  // in:fade, but with a delay, so that scene B only starts fading in once
  // scene A has fully faded out.
  // it's at this moment (when there is _nothing_ on the page) that we want
  // to reset our view so that if the user were scrolled down on scene A,
  // once scene B fades in they will be at the start of the scene.
  const fadeInDelay = 1500;
  function scrollToTop(event: CustomEvent) {
    setTimeout(() => {
      (event.target as HTMLDivElement).scrollIntoView(true);
    }, fadeInDelay);
  }
</script>

<svelte:window
  on:keydown={handleKeydown}
  use:swipeable
  on:swiperight={handleSwipeRight}
  on:swipeleft={handleSwipeLeft}
/>

<svelte:head>
  <title>{piece.title}</title>
</svelte:head>

<div class="container">
  {#each piece.scenes as scene, i}
    {#if sceneNumber === i}
      <div
        in:fade|local={{ delay: fadeInDelay, duration: 1500 }}
        on:introstart={scrollToTop}
        out:fade|local
        class={`scene ${scene.type}`}
      >
        <Scene
          {scene}
          showNavHint={piece.scenes.length > 1 && sceneNumber === 0}
        />
      </div>
    {/if}
  {/each}
</div>
<SongPlayer {piece} {sceneNumber} />

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
    top: 20%;
  }

  .scene.Card:has(.Image) {
    top: initial;
  }
</style>
