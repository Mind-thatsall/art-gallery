<script lang="ts">
  import Gallery from "./components/Gallery.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
</script>

<main>
  <Navbar />
  <Gallery />
  <Footer />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
