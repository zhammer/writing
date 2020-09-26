<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Piece } from "../../routes/pieces/_pieces";
  import Error from "../../routes/_error.svelte";

  import Speaker from "./Speaker.svg.svelte";

  export let piece: Piece;
  export let sceneNumber: number;

  $: song = piece.scenes[sceneNumber].meta?.song;

  let muted = false;

  function toggleMuted() {
    muted = !muted;
  }

  function isAudioNode(node: HTMLElement): node is HTMLAudioElement {
    return node.nodeName === "AUDIO";
  }

  function audiofade(node: HTMLElement, { delay = 0 }: { delay?: number }) {
    if (!isAudioNode(node)) {
      throw new Error(
        "audiofade transition only works with <audio /> elements"
      );
    }

    return {
      duration: 1000,
      delay,
      tick: (t: number) => {
        node.volume = t;
      },
    };
  }
</script>

<style>
  .container {
    position: fixed;
    cursor: pointer;

    bottom: 1em;
    right: 1em;
    width: 2.5em;
    height: 2.5em;
  }

  @media (min-width: 35em) {
    .container {
      bottom: 2em;
      right: 2em;
      width: 5em;
      height: 5em;
    }
  }

  .speaker {
    transition: fill 0.25s linear, opacity 1s ease-in;
    fill: black;
  }
  .speaker.muted {
    fill: grey;
  }
</style>

<div class="container" on:click={toggleMuted}>
  {#if song}
    <div
      role="button"
      class="speaker"
      class:muted
      transition:fade
      title={`${muted ? 'unmute' : 'mute'} audio`}>
      <Speaker />
    </div>
  {/if}

  <!-- we line up the scene songs as an array of cassettes -->
  {#each piece.scenes as scene, i}
    {#if ((scene || {}).meta || {}).song && sceneNumber === i}
      <audio
        src={song.url}
        loop
        {muted}
        autoplay
        in:audiofade={{ delay: 1000 }}
        out:audiofade />
    {/if}
  {/each}
</div>
