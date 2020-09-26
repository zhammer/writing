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
  let direction: "forward" | "backward" = "forward";

  function prevScene() {
    sceneNumber = Math.max(sceneNumber - 1, 0);
    direction = "backward";
  }

  function nextScene() {
    sceneNumber = Math.min(sceneNumber + 1, piece.scenes.length - 1);
    direction = "forward";
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
    padding: 4em 20%;
    width: 60%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  /*
    when we're transition to backward through scenes, we flip
    the direction of our flex container. to illustrate, assume
    we have three scenes: [beginning, middle, end].

    when we're on beginning, the dom looks like this:
    <container>
      <beginning />
    </container>

    when we go to the next scene, the dom looks like this (while)
    our components are transitioning:
    <container>
      <beginning /> <- fading out
      <middle /> <- waiting (for delay) to fade in
    </container>

    after x time, beginning has finished fading out and middle is
    fading in:
    <container>
      <middle /> <- fading in
    </container>

    for a moment we had both beginning and middle on the DOM,
    but since middle was transparent and *below* beginning,
    middle doesn't affect the position of beginning, so to the
    user this looks like: beginning fades out -> middle fades in
    where beginning was.

    now we're on middle and want to go back to beginning. this looks like:
    <container>
      <beginning /> <- waiting (for delay) to fade in
      <middle /> <- fading out
    </container>

    here, beginning *does* disrupt the position of middle in the DOM as middle
    will appear beneath the height of whatever (still transparent) content is
    in beginning. to fix this, when we're moving backwards through scenes we
    flip the direction of our flex container to simulate a dom that looks like
    this:
    <container>
      <middle /> <- fading out
      <beginning /> <- waiting (for delay) to fade in
    </container>

    or i could have just done display: relative, display: absolute, lol.
  */
  .container.backward {
    flex-direction: column-reverse;
  }

  .scene {
    top: 30%;
    width: 100%;
    margin: 0 auto;
    left: 0;
  }
</style>

<svelte:window on:keydown={handleKeydown} />

<div class={`container ${direction}`}>
  {#each piece.scenes as scene, i}
    {#if sceneNumber === i}
      <div in:fade={{ delay: 1000, duration: 1000 }} out:fade class="scene">
        <Scene {scene} />
      </div>
    {/if}
  {/each}
</div>
