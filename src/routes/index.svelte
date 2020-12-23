<script context="module" lang="ts">
  export async function preload({ query }) {
    let resp = await this.fetch("pieces.json");
    let data = await resp.json();
    return { directory: data.directory, query };
  }
</script>

<script lang="ts">
  import Directory from "../components/Directory.svelte";
  import type { DirectoryLS } from "./_pieces";

  export let directory: DirectoryLS;
  export let query: any;
</script>

<Directory {directory} {query} />
