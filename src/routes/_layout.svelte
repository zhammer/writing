<script lang="ts">
  import Nav from "../components/Nav.svelte";

  export let segment: string;
</script>

<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Courier, monospace;
  }

  main {
    background-color: white;
    padding: 2em;
    margin: 0 auto;
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
