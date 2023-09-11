<script lang="ts">
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar.svelte";
  import type { ArtPieceInformations } from "./utils/types";
  let artInformations: ArtPieceInformations;

  export let id: string;

  async function fetchArtInformations(): Promise<ArtPieceInformations> {
    let data = [];
    try {
      const response = await fetch(
        `https://www.rijksmuseum.nl/api/nl/collection/${id}?key=FJXpjyMx`
      );
      data = await response.json();

      if (!response.ok) {
        console.error("Error: ", response.statusText);
      }

      return data.artObject;
    } catch (err) {
      console.error("Error: ", err);
    }

    return data;
  }

  onMount(async () => {
    artInformations = await fetchArtInformations();
    console.log(artInformations);
  });
</script>

<Navbar />
<main class="art_piece_informations_container">
  {#if artInformations}
    <div class="art_piece_informations_title_container">
      <div>
        <h1 id="art_piece_informations_title">{artInformations.title}</h1>
        <p>{artInformations.dating.presentingDate}</p>
      </div>
      <p>{artInformations.principalMaker}</p>
    </div>
    <div class="art_piece_informations_content">
      <img
        class="art_piece_informations_image"
        src={artInformations.webImage.url}
        alt={artInformations.title}
      />
      <div class="art_piece_informations_description_container">
        <p class="art_piece_informations_description_title">DESCRI -PTION</p>
        <p class="art_piece_informations_description">
          {artInformations.plaqueDescriptionEnglish}
        </p>
      </div>
    </div>
  {:else}
    <p>Loading ...</p>
  {/if}
</main>

<style>
  .art_piece_informations_container {
    margin: 0 25px;
    height: 100%;
  }

  #art_piece_informations_title {
    font-size: max(42px, min(5vw, 64px));
    line-height: 1.1;
    text-transform: uppercase;
    margin: 0;
    overflow-wrap: break-word;
  }

  .art_piece_informations_image {
    width: 100%;
  }

  .art_piece_informations_description_container {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .art_piece_informations_description_title {
    font-weight: 800;
    font-size: 48px;
    margin: 0;
    writing-mode: vertical-rl;
    text-orientation: sideways-right;
    transform: rotate(-180deg);
    hyphens: auto;
    height: 200px;
    white-space: normal;
    line-height: 0.9;
  }

  @media screen and (min-width: 768px) {
    .art_piece_informations_container {
      display: flex;
      margin: 0;
      flex-grow: 1;
      overflow: auto;
    }

    .art_piece_informations_content {
      display: flex;
      flex-direction: column;
      width: 50vw;
      border-right: 2px solid #ddd8d7;
      border-top: 2px solid #ddd8d7;
    }

    .art_piece_informations_title_container {
      width: 34vw;
      padding: 150px 100px;
      border-right: 2px solid #ddd8d7;
      border-top: 2px solid #ddd8d7;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .art_piece_informations_image {
      width: 100%;
      height: 75vh;
      object-fit: cover;
      object-position: top;
      border-bottom: 2px solid #ddd8d7;
    }

    .art_piece_informations_description_container {
      display: flex;
      gap: 80px;
      padding: 20px 50px;
      overflow-y: scroll;
    }

    .art_piece_informations_description {
      padding-top: 100px;
      line-height: 1.7;
    }

    .art_piece_informations_description_title {
      align-self: flex-start;
      font-size: 64px;
      height: 265px;
    }
  }
</style>
