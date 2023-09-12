<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Art from "./Art.svelte";
  import Favorite from "./Favorite.svelte";
</script>

<Router>
  <Route component={Home} />
  <Route path="/art/:id" let:params>
    <Art id={params.id} />
  </Route>
  <Route path="/favorites" component={Favorite} />
</Router>
