<script lang="ts">
  import type { Scene } from "../routes/pieces/_pieces";
  export let scene: Scene;
</script>

<style>
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
</style>

<div>
  {#each scene.sections as section}
    <div class={section.type}>{section.content}</div>
  {/each}
</div>
