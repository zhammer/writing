<script lang="ts">
  import Help from "./Help.svg.svelte";
  let open = false;

  function handleClose() {
    open = false;
  }

  function handleOpen() {
    open = true;
  }
</script>

<style>
  .question-mark {
    position: fixed;
    cursor: pointer;

    bottom: 1em;
    left: 1em;
    width: 2.5em;
    height: 2.5em;
  }

  .modal {
    position: fixed;
    background: yellow;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em 2em;
  }

  @media (min-width: 35em) {
    .question-mark {
      bottom: 2em;
      left: 2em;
      width: 5em;
      height: 5em;
    }
  }
</style>

<div class="question-mark" role="button" title="help">
  <Help on:click={handleOpen} />
</div>

<div class="modal">hey</div>
