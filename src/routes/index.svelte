<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    let resp = await fetch("pieces.json");
    let data = await resp.json();
    let query = new URLSearchParams();
    try {
      query = page.query;
    } catch (e) {}
    return { props: { directory: data.directory, query: query } };
  }
</script>

<script lang="ts">
  import Directory from "../components/Directory.svelte";
  import type { DirectoryLS } from "./_pieces";

  export let directory: DirectoryLS;
  export let query: any;
</script>

<Directory {directory} {query} />
