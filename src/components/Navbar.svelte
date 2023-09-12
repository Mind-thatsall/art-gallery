<script>
  import { onMount } from "svelte";
  import { link } from "svelte-routing";

  let isArtPieceOrFav = false;

  onMount(() => {
    isArtPieceOrFav =
      location.pathname.startsWith("/art/") ||
      location.pathname.startsWith("/favorites");
  });
</script>

<nav>
  <ul>
    <li class:go_back_visibility={!isArtPieceOrFav} class="go_back">
      <a href="/" use:link
        ><img class="go_back_arrow" src="/arrow.svg" alt="" /></a
      >
    </li>
    <li>ART GALLERY</li>
    <li class="favorite"><a href="/favorites" use:link>S</a></li>
  </ul>
</nav>

<style>
  ul {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    margin: 0;
    height: 80px;
  }

  li {
    font-size: 20px;
    font-weight: 800;
  }

  li a {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .favorite {
    padding: 10px;
  }

  .go_back {
    padding: 10px;
  }

  .go_back_visibility {
    visibility: hidden;
  }

  .go_back_arrow {
    transform: rotate(180deg);
  }

  @media screen and (min-width: 768px) {
    .go_back {
      transition: background-color 0.15s ease;
      border-radius: 50%;
    }
    .go_back:hover {
      background-color: #eae0d3;
    }
  }
</style>
