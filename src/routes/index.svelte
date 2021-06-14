<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    let resp = await fetch("pieces.json");
    let data = await resp.json();
    return { props: { directory: data.directory, query: page.query }};
  }
</script>

<script lang="ts">
  import Directory from "../components/Directory.svelte";
  import type { DirectoryLS } from "./_pieces";

  export let directory: DirectoryLS;
  export let query: any;
</script>

<Directory {directory} {query} />