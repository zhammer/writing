<script lang="ts">
  import type { Scene } from "src/routes/_pieces";

  import { onMount } from "svelte";

  import { isMobile } from "./SongPlayer/util";
  export let scene: Scene;
  export let showNavHint: boolean;
  let mobile: boolean;

  onMount(() => {
    mobile = isMobile(navigator.userAgent);

    (function addFootnoteScrolling() {
      let footnotes = document.querySelector("#footnotes");
      if (!footnotes) {
        return;
      }
      let footnoteRefs = document.querySelectorAll(".footnote-ref");
      footnoteRefs.forEach((footnoteRef) => {
        footnoteRef.addEventListener("click", () => {
          footnotes.scrollIntoView({ behavior: "smooth" });
        });
      });
    })();
  });
</script>

<section>
  <div>
    {#each scene.sections as section}
      <p class={section.type}>{@html section.content}</p>
    {/each}
    {#if showNavHint}
      <p class="hint">
        ({mobile ? "swipe right" : "press the right arrow key"})
      </p>
    {/if}
  </div>
</section>

<style>
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  :global(.footnote-ref) {
    font-weight: bold;
    cursor: pointer;

    vertical-align: top;
    font-size: 0.6em;
  }

  .hint {
    text-align: center;
    margin-top: 1em;
    font-size: 1.25rem;
    color: darkgray;
    animation: fadein 1s ease-in 3s backwards;
  }

  .Subtitle + .hint {
    margin-top: 1.5em;
    animation-delay: 8s;
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

  .TextCenter {
    white-space: pre-wrap;
    text-align: center;
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

  .Subtitle {
    text-align: center;
    font-size: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 0.7;
    color: dimgrey;

    animation: fadein 2s ease-in 3.5s backwards;
  }
  @media (min-width: 35em) {
    .Subtitle {
      font-size: 3rem;
    }
  }

  p {
    margin-block-end: 0;
    margin-block-start: 0;
  }
</style>
