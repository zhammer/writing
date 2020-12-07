<script lang="ts">
  import { onMount } from "svelte";

  import type { Scene } from "../routes/_pieces";
  import { isMobile } from "./SongPlayer/util";
  export let scene: Scene;
  export let showNavHint: boolean;
  let mobile: boolean;

  onMount(() => {
    mobile = isMobile(navigator.userAgent);
  });
</script>

<style>
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .hint {
    text-align: center;
    margin-top: 1em;
    font-size: 1.25rem;
    color: darkgray;
    animation: fadein 1s ease-in 3s backwards;
  }

  .Action {
    margin-bottom: 1em;
  }

  .Character {
    font-size: 1.15rem;
    text-transform: uppercase;
    text-align: center;
  }

  .Dialogue {
    text-align: left;
    margin: 0 10% 1em;
    white-space: pre-wrap;
  }
  @media (min-width: 35em) {
    .Dialogue {
      margin: 0 20% 1em;
    }
  }

  .Parenthetical {
    text-align: center;
    position: relative;
    left: -3em;
  }
  .Parenthetical::before {
    content: "(";
  }
  .Parenthetical::after {
    content: ")";
  }

  .SceneHeading {
    text-transform: uppercase;
    font-size: 1.25rem;
    white-space: pre-wrap;
    margin-bottom: 1em;
  }

  .Text {
    white-space: pre-wrap;
  }

  .Title {
    text-align: center;
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: 35em) {
    .Title {
      font-size: 6rem;
    }
  }

  p {
    margin-block-end: 0;
    margin-block-start: 0;
  }
</style>

<section>
  <div>
    {#each scene.sections as section}
      <p class={section.type}>{section.content}</p>
    {/each}
    {#if showNavHint}
      <p class="hint">
        ({mobile ? 'swipe right' : 'press the right arrow key'})
      </p>
    {/if}
  </div>
</section>
