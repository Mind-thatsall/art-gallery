<script lang="ts">
  import Gallery from "./components/Gallery.svelte";
  import Navbar from "./components/Navbar.svelte";
</script>

<main>
  <Navbar />
  <Gallery />
  <p id="direction">SLIDE</p>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  #direction {
    font-size: 16px;
    font-weight: 800;
    margin-left: 20px;
  }
</style>
