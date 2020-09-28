<script context="module" lang="ts">
  export async function preload() {
    let resp = await this.fetch("pieces.json");
    let { pieces } = await resp.json();
    return { pieces };
  }
</script>

<script lang="ts">
  import type { Piece } from "./pieces/_pieces";
  export let pieces: Piece[];

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
  <title>Index of Writing/</title>
</svelte:head>

<div class="container">
  <h1>Index of Writing/</h1>

  <table>
    <tbody>
      <tr>
        <th valign="top" />
        <th><a href="">Name</a></th>
        <th><a href="">Last modified</a></th>
        <th><a href="">Size</a></th>
        <th><a href="">Description</a></th>
      </tr>
      <tr>
        <th colspan="5">
          <hr />
        </th>
      </tr>
      {#each pieces as piece}
        <tr>
          <td><img src="/text.gif" alt="[TXT]" /></td>
          <td>
            <a rel="prefetch" href="pieces/{piece.slug}">{piece.title}</a>
          </td>
          <td align="right">{piece.date}</td>
          <td align="right">{format(piece.size)}</td>
          <td>{piece.description}</td>
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
