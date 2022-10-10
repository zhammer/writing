<script lang="ts">
  import Directory from "../components/Directory.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let { directory, query } = data;
</script>

<Directory {directory} {query} />
