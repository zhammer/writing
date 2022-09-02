<script lang="ts">
  import type { Scene, TextSection } from "src/routes/_pieces";
  import { isTextSection, isImageSection } from "../routes/_pieces";
  import { isTokenFunction } from "../tokenizer";

  import { onMount } from "svelte";

  import { isMobile } from "./SongPlayer/util";
  export let scene: Scene;
  export let showNavHint: boolean;
  let mobile: boolean;

  $: footnotes = scene.sections
    .filter(isTextSection)
    .map((section) => section.tokens)
    .flat()
    .filter(isTokenFunction)
    .filter((token) => token.functionName === "footnote");
  let footnoteElements: HTMLElement[] = [];
  let footnoteRefElements: HTMLElement[] = [];

  function onFootnoteRefClick(event, index: number) {
    event.preventDefault();
    footnoteElements[index].focus({ preventScroll: true });
    footnoteElements[index].scrollIntoView({ behavior: "smooth" });
  }

  function onFootnoteClick(event, index: number) {
    event.preventDefault();
    footnoteRefElements[index].focus({ preventScroll: true });
    footnoteRefElements[index].scrollIntoView({ behavior: "smooth" });
  }

  function getTextSectionClass(section: TextSection): string {
    let classes: string[] = [section.type];
    if (section.type === "Title" && section.content.length > 10) {
      classes.push("Oversized");
    }
    return classes.join(" ");
  }

  onMount(() => {
    mobile = isMobile(navigator.userAgent);
  });
</script>

<section>
  <div>
    {#each scene.sections as section}
      {#if isTextSection(section)}
        <p class={getTextSectionClass(section)}>
          {#each section.tokens as token}
            {#if token.type === "literal"}
              {@html token.text}{/if}{#if isTokenFunction(token)}
              {#if token.functionName === "footnote"}
                <sup
                  class="footnote-ref"
                  tabindex="-1"
                  bind:this={footnoteRefElements[token.meta.functionIndex]}
                  on:click={(event) =>
                    onFootnoteRefClick(event, token.meta.functionIndex)}
                  >{token.meta.functionIndex + 1}</sup
                >
              {/if}
            {/if}
          {/each}
        </p>
      {/if}
      {#if isImageSection(section)}
        <img class="Image" src={section.url} alt={section.caption} />
      {/if}
    {/each}
    {#if showNavHint}
      <p class="hint">
        ({mobile ? "swipe right" : "press the right arrow key"})
      </p>
    {/if}
  </div>
  {#if footnotes.length > 0}
    <ol id="footnotes">
      {#each footnotes as footnote, i}
        <i
          ><li
            class="footnote"
            tabindex="-1"
            bind:this={footnoteElements[i]}
            on:click={(event) => onFootnoteClick(event, i)}
          >
            {footnote.args[0]}
          </li></i
        >
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

  .footnote-ref {
    font-weight: bold;
    cursor: pointer;

    display: inline-block;
    vertical-align: top;
    font-size: 0.6em;
  }

  @keyframes highlight {
    from {
      background-color: rgba(255, 255, 173, 1);
    }
    to {
      background-color: rgba(255, 255, 173, 0);
    }
  }
  .footnote:focus {
    animation: highlight 1s linear;
  }
  .footnote-ref:focus {
    animation: highlight 1s linear;
  }

  .footnote {
    cursor: pointer;
    margin-left: 0px;
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

  .Title.Oversized {
    font-size: 2rem;
  }

  @media (min-width: 35em) {
    .Title {
      font-size: 6rem;
    }
    .Title.Oversized {
      font-size: 3rem;
    }
  }

  .Subtitle {
    text-align: center;
    font-size: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 0.9;
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

  .Image {
    width: 100%;
    margin: auto;
    display: block;
    padding-top: 1em;
    padding-bottom: 1em;
  }
  @media (min-width: 35em) {
    .Image {
      width: 60%;
    }
  }
</style>
