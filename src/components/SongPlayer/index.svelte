<script lang="ts">
  import Speaker from "./Speaker.svg.svelte";

  let muted = false;

  function toggleMuted() {
    muted = !muted;
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
  <div
    role="button"
    class="speaker"
    class:muted
    title={`${muted ? 'unmute' : 'mute'} audio`}>
    <Speaker />
  </div>
</div>
