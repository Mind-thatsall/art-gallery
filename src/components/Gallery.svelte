<script lang="ts">
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import type { ArtPiece } from "../utils/types";

  let tempArtObjects: ArtPiece[] = [];
  let artObjects: ArtPiece[] = [];
  let pages = 0;
  let fetching: boolean = false;
  let errorOccured: boolean = false;

  async function fetchArts() {
    let data = [];
    fetching = true;
    try {
      pages += 1;
      const response = await fetch(
        `https://www.rijksmuseum.nl/api/nl/collection?key=${
          import.meta.env.VITE_API_KEY
        }&p=${pages}`
      );
      data = await response.json();
      console.log(data);

      tempArtObjects.push(...data.artObjects);
      artObjects = tempArtObjects;
      if (!response.ok) {
        console.error("Error: ", response.statusText);
        errorOccured = true;
      }

      fetching = false;
      return data.artObjects;
    } catch (err) {
      console.error("Error: ", err);
      errorOccured = true;
    }

    fetching = false;
  }

  $: fetchArts();

  function isNearEndOfContainer(container: HTMLElement) {
    const scrollThreshold = 10;

    return (
      container.scrollWidth - container.scrollLeft - container.clientWidth <=
      scrollThreshold
    );
  }

  onMount(async () => {
    const galleryTrack = document.getElementById("gallery")!;
    let targetScrollLeft = 0;
    let animationFrameID: number | null;

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

      if (isNearEndOfContainer(galleryTrack) && !fetching) {
        fetchArts();
      }
    });

    galleryTrack.addEventListener("pointermove", async (e: PointerEvent) => {
      e.preventDefault();

      if (isNearEndOfContainer(galleryTrack) && !fetching) {
        fetchArts();
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
  {#if artObjects.length > 0}
    {#each artObjects as artObject}
      <a class="art_piece" href={`/art/${artObject.objectNumber}`} use:link>
        <p class="art_piece_title">{artObject.title}</p>
        <img
          class="art_piece_image"
          src={artObject.webImage.url}
          alt={artObject.title}
          draggable="false"
        />
      </a>
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
    background-position: center;
    position: relative;
    border-right: 2px solid #ddd8d7;
  }

  .art_piece_image {
    overflow: hidden;
    flex-shrink: 0;
    background-size: cover;
    height: 100%;
    width: auto;
  }

  .art_piece::before {
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

  .art_piece_title {
    position: absolute;
    width: auto;
    color: #1e1e1e;
    font-size: max(42px, min(5vw, 64px));
    font-weight: bold;
    line-height: 0.96;
    margin: 10px 20px;
    transition: opacity 0.35s ease, color 0.2s ease;
  }

  @media screen and (min-width: 768px) {
    .art_piece {
      width: 600px;
    }

    .art_piece_title {
      margin: 150px 50px;
      width: auto;
      color: #1e1e1e;
      font-weight: bold;
    }
    .art_piece:hover::before {
      opacity: 0;
    }

    .art_piece:hover .art_piece_title {
      color: white;
    }
  }
</style>
