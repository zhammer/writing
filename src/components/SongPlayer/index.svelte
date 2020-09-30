<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type { Piece } from "../../routes/_pieces";
  import Arrow from "./Arrow.svg.svelte";

  import Speaker from "./Speaker.svg.svelte";
  import { isMobile } from "./util";
  import VirtualCassetteDeck from "./VirtualCassetteDeck.svelte";

  export let piece: Piece;
  export let sceneNumber: number;
  let mobile: boolean;
  let muted: boolean;

  // we can only check the userAgent from the browser in JS land
  // (once the component has mounted on the browser). referencing
  // `navigator` outside of onMount would throw an error as sapper
  // would try to reference the browser's narrator in ssr.
  //
  // (checking user-agent on the server would be fine, but since the
  // intention is to publish this as an exported, static site, we want
  // to force this behavior into the browser.)
  onMount(() => {
    mobile = isMobile(navigator.userAgent);
    muted = mobile;
  });

  $: song = piece.scenes[sceneNumber].meta?.song;

  function toggleMuted() {
    muted = !muted;
  }
</script>

<style>
  @keyframes fadeinout {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes dropdown {
    from {
      transform: translateY(-1em) rotate(270deg);
    }
    to {
      transform: translateY(0em) rotate(270deg);
    }
  }

  .arrow {
    position: absolute;
    bottom: 70%;
    height: 100%;
    width: 100%;
    fill: green;
    transform: rotate(270deg);
    animation: fadeinout 5s ease 0.5s both, dropdown 1s ease-out 0.25s both;
  }

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

<div class="container">
  {#if song}
    {#if mobile}
      <div class="arrow">
        <Arrow />
      </div>
    {/if}
    <div
      role="button"
      class="speaker"
      class:muted
      transition:fade
      on:click={toggleMuted}
      title={`${muted ? 'unmute' : 'mute'} audio`}>
      <Speaker />
    </div>
  {/if}
</div>

<!--
  ideally, we want to use the VirtualCassetteDeck to play songs
  on scenes, as it has nice crossfades between tracks.

  on mobile we use a more basic rig for two reasons (that have applied
  to all mobile browsers i've tested on):
  1. mobile doesn't support programmatically setting an audio element's
     volume (crossfades) from what i can tell, so most of that logic
     is wasted.
  2. mobile needs a user interaction to start playing an audio element.
     the 'VirtualCassetteDeck' sets up one audio player per song, which
     means that every time the song changes a new <audio /> element will
     be added to the DOM, which will need a new user interaction to
     start playing.
-->
{#if mobile}
  <audio src={song && song.url} loop {muted} autoplay />
{:else}
  <VirtualCassetteDeck {piece} currentSong={song} {muted} />
{/if}
