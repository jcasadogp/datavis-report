<script>
    // Imports
    import Exercise from "./Exercise.svelte";

    // Properties
    export let data;
  </script>
  
  <h1>Julia Casado Gómez-Pallete - KU Leuven - r0877500</h1>
  
  <div class="output">
    {#if !data}
    <p>Loading data...</p>
    {:else}
    <Exercise gps_data_slug={data.car[0]} carstops_data_slug={data.car[1]} car_ids={data.car[2]}/>
    {/if}
  </div>
  