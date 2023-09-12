<script lang="ts">
  import { onMount } from "svelte";
  import type { ArtPiece } from "./utils/types";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import GalleryFavorite from "./components/GalleryFavorite.svelte";

  let favorite_pieces: ArtPiece[] = [];

  onMount(() => {
    const storedData = localStorage.getItem("favorite_pieces");
    if (storedData) {
      favorite_pieces = JSON.parse(storedData);
    }
  });
</script>

<main>
  <Navbar />
  <GalleryFavorite />
  <Footer />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
