<script lang="ts">
  import type { Piece, Scene } from "../../routes/pieces/_pieces";
  import { unique } from "./util";

  export let piece: Piece;
  export let currentSong: Scene["meta"]["song"] | undefined;
  export let muted: boolean;

  let songs = unique(
    piece.scenes.map((scene) => scene?.meta?.song).filter(Boolean),
    (song) => song.url
  );

  function isAudioNode(node: HTMLElement): node is HTMLAudioElement {
    return node.nodeName === "AUDIO";
  }
  function audiofade(
    node: HTMLElement,
    { delay = 0, duration }: { delay?: number; duration: number }
  ) {
    if (!isAudioNode(node)) {
      throw new Error(
        "audiofade transition only works with <audio /> elements"
      );
    }
    return {
      duration,
      delay,
      tick: (t: number) => {
        node.volume = t;
      },
    };
  }
</script>

<!--
    this worked out much better than i expected. essentially, we take
    each individual song that appears in the piece and put them into
    a unique array. (we store it as a list of urls since url strings are
    easier to make a unique set on).

    we make an audio element for each song, like a cassette deck. when a
    scene is active that has a song, the corresponding cassette is played.

    this gives us two main benefits:
    1) when the current song changes, the previous cassette will "unload"
    (dismount from the dom) and transition out while the new cassette will
    "load" (mount to the dom) and transition in. (this also happens when
    we go from no song -> song or song -> no song).
    2) when the scene changes _but_ the song stays the same (e.g. two subsequent
    scenes have the same song), there will be no fade between songs as the same
    "casette" stays live in our virtual cassette deck.
  -->
{#each songs as song}
  {#if currentSong && currentSong.url === song.url}
    <audio
      src={song.url}
      loop
      {muted}
      autoplay
      in:audiofade={{ delay: 1000, duration: 250 }}
      out:audiofade={{ duration: 1000 }} />
  {/if}
{/each}
