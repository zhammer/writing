<script lang="ts">
  import { onMount } from "svelte";

  import type { ProcessedScene, Scene, Section } from "../routes/_pieces";
  import { isMobile } from "./SongPlayer/util";
  export let scene: Scene;
  export let showNavHint: boolean;
  let mobile: boolean;

  onMount(() => {
    mobile = isMobile(navigator.userAgent);
  });

  function processScene(scene: Scene): ProcessedScene {
    const footnoteRegex = /\{\{\s*footnote\s*"(.+?)"\s*\}\}/g;
    let processedSections: Section[] = [];
    let footnotes: string[] = [];

    scene.sections.forEach((section) => {
      // collect footnotes
      let match: RegExpExecArray;
      while ((match = footnoteRegex.exec(section.content))) {
        footnotes.push(match[1]);
      }

      processedSections.push({
        ...section,
        content: section.content.replace(footnoteRegex, ""),
      });
    });

    return {
      ...scene,
      sections: processedSections,
      footnotes,
    };
  }

  // https://github.com/sveltejs/svelte/issues/4965, but not important atm since
  // this isn't dynamic
  let processedScene = processScene(scene);
</script>

<section>
  <div>
    {#each processedScene.sections as section}
      <p class={section.type}>{@html section.content}</p>
    {/each}
    {#if showNavHint}
      <p class="hint">
        ({mobile ? "swipe right" : "press the right arrow key"})
      </p>
    {/if}
  </div>
  {#if processedScene.footnotes}
    <ol>
      {#each processedScene.footnotes as footnote}
        <li>{footnote}</li>
      {/each}
    </ol>
  {/if}
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

  .hint {
    text-align: center;
    margin-top: 1em;
    font-size: 1.25rem;
    color: darkgray;
    animation: fadein 1s ease-in 5s backwards;
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

  .Subtitle {
    text-align: center;
    font-size: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;

    animation: fadein 1s ease-in 3s backwards;
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
