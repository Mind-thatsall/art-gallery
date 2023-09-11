<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Art from "./Art.svelte";
</script>

<Router>
  <Route component={Home} />
  <Route path="/art/:id" let:params>
    <Art id={params.id} />
  </Route>
</Router>
