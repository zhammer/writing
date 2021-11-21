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
</script>

<script lang="ts">
  import type { DirectoryLS } from "../routes/_pieces";
  export let directory: DirectoryLS;

  export let query: any;

  $: sort = {
    column: query.get("C") || "N",
    order: query.get("O") || "A",
  };

  let isRoot = directory.slug === "";

  $: listItems = sortedListItems(sort);
  function sortedListItems(sort: Sort) {
    let listItems = [...directory.children];
    listItems.sort((a, b) => {
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
    return listItems;
  }

  function orderParam(sort: Sort, column: Sort["column"]): Sort["order"] {
    if (sort.column !== column) {
      return "A";
    }

    return sort.order === "A" ? "D" : "A";
  }

  // https://stackoverflow.com/a/9461657
  function format(num: number) {
    if (num === 0) {
      return "-";
    }
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : `${Math.abs(num)}`;
  }

  function entryHref(entrySlug: string) {
    if (isRoot) {
      return `/${entrySlug}`;
    }
    return `/${directory.slug}/${entrySlug}`;
  }
</script>

<svelte:head>
  <title>Index of {directory.slug}/</title>
</svelte:head>

<div class="container">
  <h1>Index of {directory.slug}/</h1>

  <table>
    <tbody>
      <tr>
        <th valign="top" />
        <th>
          <a href={`/${directory.slug}?C=N&O=${orderParam(sort, "N")}`}>Name</a>
        </th>
        <th>
          <a href={`/${directory.slug}?C=M&O=${orderParam(sort, "M")}`}
            >Last modified</a
          >
        </th>
        <th>
          <a href={`/${directory.slug}?C=S&O=${orderParam(sort, "S")}`}>Size</a>
        </th>
        <th>
          <a href={`/${directory.slug}?C=D&O=${orderParam(sort, "D")}`}
            >Description</a
          >
        </th>
      </tr>
      <tr>
        <th colspan="5">
          <hr />
        </th>
      </tr>
      <!-- only works for one-deep nested directories at this point, always links to root -->
      {#if !isRoot}
        <tr>
          <td><img src="/back.gif" alt="[PARENTDIR]" /></td>
          <td><a sveltekit:prefetch href="/">Parent Directory</a></td>
        </tr>
      {/if}
      {#each listItems as entry}
        <tr>
          <td>
            {#if entry.type === "DIR"}
              <img src="/folder.gif" alt="[DIR]" />
            {:else}<img src="/text.gif" alt="[TXT]" />{/if}
          </td>
          <td>
            <a sveltekit:prefetch href={entryHref(entry.slug)}>{entry.title}</a>
          </td>
          <td align="right">{entry.date}</td>
          <td align="right">{format(entry.size)}</td>
          <td class="description">{entry.description}</td>
        </tr>
      {/each}
      <tr>
        <th colspan="5">
          <hr />
        </th>
      </tr>
    </tbody>
  </table>
  <address>
    {directory.meta.description || "SvelteKit/1.0.0-next.196 Server"}
  </address>
</div>

<style>
  .container {
    margin: 8px;
  }

  td.description {
    padding: 0 1em;
  }
</style>
