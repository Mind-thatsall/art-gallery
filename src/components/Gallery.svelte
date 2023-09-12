<script lang="ts">
  import { link } from "svelte-routing";
  import { onMount } from "svelte";
  import type { ArtPiece } from "../utils/types";
  import Star from "./Star.svelte";
  import { artObjectsStore, pageStore } from "../utils/stores";

  let favorite_pieces: ArtPiece[] = [];
  let artObjects: ArtPiece[];
  let pages = 0;
  let fetching: boolean = false;
  let errorOccured: boolean = false;

  $: fetchArt();

  artObjectsStore.subscribe((data) => {
    artObjects = data;
  });

  pageStore.subscribe((data) => {
    pages = data;
  });

  async function fetchArt() {
    let data: any = [];
    fetching = true;
    try {
      pageStore.update((n) => n + 1);
      const response = await fetch(
        `https://www.rijksmuseum.nl/api/nl/collection?key=${
          import.meta.env.VITE_API_KEY
        }&p=${pages}`
      );
      data = await response.json();
      console.log(data);

      if (!response.ok) {
        console.error("Error: ", response.statusText);
        errorOccured = true;
      }

      artObjectsStore.update((arts) => {
        arts.push(...data.artObjects);
        return arts;
      });

      fetching = false;
      return data.artObjects;
    } catch (err) {
      console.error("Error: ", err);
      errorOccured = true;
    }

    fetching = false;
  }

  function addFav(e: Event, art_piece: ArtPiece) {
    const target = e.target! as HTMLInputElement;

    if (target.checked) {
      favorite_pieces.push(art_piece);
    } else {
      const index = favorite_pieces.findIndex(
        (el) => el.objectNumber === art_piece.objectNumber
      );
      console.log(index);
      favorite_pieces.splice(index, 1);
    }
    localStorage.setItem("favorite_pieces", JSON.stringify(favorite_pieces));
  }

  function isNearEndOfContainer(container: HTMLElement) {
    const scrollThreshold = 10;

    return (
      container.scrollWidth - container.scrollLeft - container.clientWidth <=
      scrollThreshold
    );
  }

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

      if (isNearEndOfContainer(galleryTrack) && !fetching) {
        fetchArt();
      }
    });

    // fetch more when reaching the end more mobile
    galleryTrack.addEventListener("pointermove", async (e: PointerEvent) => {
      e.preventDefault();

      if (isNearEndOfContainer(galleryTrack) && !fetching) {
        fetchArt();
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
      <div class="art_piece">
        <a href={`/art/${artObject.objectNumber}`} use:link>
          <p class="art_piece_title">
            {artObject.title}
          </p>
          <img
            class="art_piece_image"
            src={artObject.webImage.url}
            alt={artObject.title}
            draggable="false"
          />
        </a>
        <label
          for={`favorite_checkbox_${artObject.objectNumber}`}
          class="art_piece_favorite"
        >
          <input
            id={`favorite_checkbox_${artObject.objectNumber}`}
            class="art_piece_favorite_check"
            name="favorite_checkbox"
            type="checkbox"
            on:change={(e) => addFav(e, artObject)}
            checked={favorite_pieces.some(
              (el) => el.objectNumber === artObject.objectNumber
            )}
          />
          <Star />
        </label>
      </div>
    {/each}
  {:else if fetching}
    <p class="art_piece_title">Loading...</p>
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
    margin: 10px 50px 10px 20px;
    transition: opacity 0.35s ease, color 0.2s ease;
    overflow-wrap: break-word;
  }

  .art_piece_favorite {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    cursor: pointer;
  }

  .art_piece_favorite_check {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .art_piece_favorite {
    top: 20px;
    right: 20px;
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

    .art_piece_favorite {
      bottom: 20px;
      right: 20px;
    }
  }
</style>
