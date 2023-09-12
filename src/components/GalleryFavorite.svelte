<script lang="ts">
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import type { ArtPiece } from "../utils/types";

  let favorite_pieces: ArtPiece[] = [];
  let fetching: boolean = false;
  let errorOccured: boolean = false;

  onMount(() => {
    const storedData = localStorage.getItem("favorite_pieces");
    if (storedData) {
      favorite_pieces = JSON.parse(storedData);
    }

    const galleryTrack = document.getElementById("gallery")!;
    let targetScrollLeft = 0;
    let animationFrameID: number | null;

    // Scroll horizontally and fetch more when reaching the end
    galleryTrack.addEventListener("wheel", async (e: WheelEvent) => {
      e.preventDefault();

      targetScrollLeft += e.deltaY;

      targetScrollLeft = Math.max(
        0,
        Math.min(
          targetScrollLeft,
          galleryTrack.scrollWidth - galleryTrack.clientWidth
        )
      );

      if (!animationFrameID) {
        animateScroll();
      }
    });

    function animateScroll() {
      const distance = targetScrollLeft - galleryTrack.scrollLeft;
      const speed = 6; // Adjust the animation speed as needed

      galleryTrack.scrollLeft += distance / speed;

      if (Math.abs(distance) > 1) {
        animationFrameID = requestAnimationFrame(animateScroll);
      } else {
        animationFrameID = null;
      }
    }
  });
</script>

<div id="gallery">
  {#if favorite_pieces.length > 0}
    {#each favorite_pieces as fav}
      <div class="art_piece">
        <a href={`/art/${fav.objectNumber}`} use:link>
          <p class="art_piece_title">
            {fav.title}
          </p>
          <img
            class="art_piece_image"
            src={fav.webImage.url}
            alt={fav.title}
            draggable="false"
          />
        </a>
      </div>
    {/each}
  {:else if fetching}
    <p class="art_piece_title">loading...</p>
  {:else if errorOccured}
    <p class="art_piece_title">An error occured.</p>
  {/if}
</div>

<style>
  #gallery {
    display: flex;
    width: auto;
    overflow-y: hidden;
    height: 100%;
  }

  #gallery::-webkit-scrollbar {
    display: none;
  }

  .art_piece {
    height: 100%;
    width: 350px;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    border-right: 2px solid #ddd8d7;
  }

  .art_piece a {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .art_piece_image {
    overflow: hidden;
    object-fit: cover;
    width: auto;
    height: 40vh;
    padding: 20px;
  }

  .art_piece_title {
    width: auto;
    color: #1e1e1e;
    font-size: max(42px, min(5vw, 64px));
    font-weight: bold;
    line-height: 0.96;
    margin: 10px 20px;
    transition: opacity 0.35s ease, color 0.2s ease;
  }

  .art_piece_favorite_check {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 10;
  }

  @media screen and (min-width: 768px) {
    .art_piece {
      width: 600px;
    }

    .art_piece_title {
      position: absolute;
      margin: 150px 50px;
      width: auto;
      color: #1e1e1e;
      font-weight: bold;
    }
    .art_piece:hover a::before {
      opacity: 0;
    }

    .art_piece:hover .art_piece_title {
      color: white;
    }

    .art_piece a::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: #f8f4f0;
      opacity: 1;
      transition: opacity 0.35s ease, color 0.2s ease;
    }

    .art_piece_image {
      overflow: hidden;
      object-fit: cover;
      width: auto;
      height: 100%;
      padding: 0;
    }
  }
</style>
