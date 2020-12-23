<script context="module" lang="ts">
  // query params from apache index directory
  type Sort = {
    column:
      | "N" // name
      | "M" // modified
      | "S" // size
      | "D"; // description
    // order
    order:
      | "A" // ascending
      | "D"; // descending
  };
  export async function preload({ query }) {
    let resp = await this.fetch("pieces.json");
    let { directory }: { directory: DirectoryLS } = await resp.json();
    let sort: Sort = {
      column: query.C || "N",
      order: query.O || "A",
    };
    directory.children.sort((a, b) => {
      let compare = (() => {
        switch (sort.column) {
          case "N":
            return a.title.localeCompare(b.title);
          case "M":
            return a.date.localeCompare(b.date);
          case "S":
            return a.size - b.size;
          case "D":
            return a.description.localeCompare(b.description);
        }
      })();

      if (sort.order === "D") {
        compare = -compare;
      }

      return compare;
    });
    return { entries: directory.children, sort };
  }
</script>

<script lang="ts">
  import type { ListItem, DirectoryLS } from "./_pieces";
  export let entries: ListItem[];

  export let sort: Sort;

  function orderParam(sort: Sort, column: Sort["column"]): Sort["order"] {
    if (sort.column !== column) {
      return "A";
    }

    return sort.order === "A" ? "D" : "A";
  }

  // https://stackoverflow.com/a/9461657
  function format(num: number) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : `${Math.abs(num)}`;
  }
</script>

<style>
  .container {
    margin: 8px;
  }
</style>

<svelte:head>
  <title>Index of /</title>
</svelte:head>

<div class="container">
  <h1>Index of /</h1>

  <table>
    <tbody>
      <tr>
        <th valign="top" />
        <th><a href="?C=N&O={orderParam(sort, 'N')}">Name</a></th>
        <th><a href="?C=M&O={orderParam(sort, 'M')}">Last modified</a></th>
        <th><a href="?C=S&O={orderParam(sort, 'S')}">Size</a></th>
        <th><a href="?C=D&O={orderParam(sort, 'D')}">Description</a></th>
      </tr>
      <tr>
        <th colspan="5">
          <hr />
        </th>
      </tr>
      {#each entries as entry}
        <tr>
          <td>
            {#if entry.type === 'DIR'}
              <img src="/folder.gif" alt="[DIR]" />
            {:else}<img src="/text.gif" alt="[TXT]" />{/if}
          </td>
          <td><a rel="prefetch" href={entry.slug}>{entry.title}</a></td>
          <td align="right">{entry.date}</td>
          <td align="right">{format(entry.size)}</td>
          <td>{entry.description}</td>
        </tr>
      {/each}
      <tr>
        <th colspan="5">
          <hr />
        </th>
      </tr>
    </tbody>
  </table>
  <address>Sapper/0.28.9 Server</address>
</div>
