<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Piece } from "../../routes/pieces/_pieces";

  import Speaker from "./Speaker.svg.svelte";

  export let piece: Piece;
  export let sceneNumber: number;

  $: song = piece.scenes[sceneNumber].meta?.song;
  // each _unique_ song that appears in the piece
  let urls = [
    ...new Set(
      piece.scenes
        .map((scene) => scene?.meta?.song)
        .filter(Boolean)
        .map((song) => song.url)
    ),
  ];

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

  <!--
    this worked out much better than i expected. essentially, we take
    each individual song that appears in the piece and put them into
    a unique array. (we store it as a list of urls since url strings are
    easier to make a unique set on).

    we make an audio element for each song, like a cassette deck. when a
    scene is active that has a song, the corresponding cassette is played.

    this gives us two main benefits:
    1) when the current song changes, the previous cassette will "unload"
    (dismount from the dom) and transition out while the new cassette will
    "load" (mount to the dom) and transition in. (this also happens when
    we go from no song -> song or song -> no song).
    2) when the scene changes _but_ the song stays the same (e.g. two subsequent
    scenes have the same song), there will be no fade between songs as the same
    "casette" stays live in our virtual cassette deck.
  -->
  {#each urls as url}
    {#if song && song.url === url}
      <audio
        src={url}
        loop
        {muted}
        autoplay
        in:audiofade={{ delay: 1000 }}
        out:audiofade />
    {/if}
  {/each}
</div>
