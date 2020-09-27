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
</script>

<style>
  .container {
    margin: 8px;
  }
</style>

<svelte:head>
  <title>My Writing</title>
</svelte:head>

<div class="container">
  <h1>Writing</h1>

  <table>
    <tbody>
      <tr>
        <th valign="top" />
        <th><a href="">Name</a></th>
      </tr>
      <tr>
        <th colspan="2">
          <hr />
        </th>
      </tr>
      {#each pieces as piece}
        <tr>
          <td valign="top"><img src="/text.gif" alt="[TXT]" /></td>
          <td>
            <a rel="prefetch" href="pieces/{piece.slug}">{piece.title}</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
