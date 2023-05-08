<script>
    // Imports
    import Exercise from "./Exercise.svelte";

    // Properties
    export let data;

    // data[0] => gps_data_slug (Array(508))
    // {
    //     "key": "35642500",
    //     "car_id": 1,
    //     "day": 6,
    //     "hour": 7,
    //     "minute": 20,
    //     "cumulative_minute": 440,
    //     "long": 24.883452833142858,
    //     "lat": 36.06566895828571,
    //     "speed": 62.457142857142856,
    //     "cumulative_minute_total": 440
    // }

    // data[1] ==> carstops_data_slug (Array(101))
    // {
    //     "key": "67867558",
    //     "car": 1,
    //     "start": {
    //         "day": 10,
    //         "time": 29709
    //     },
    //     "end": {
    //         "day": 10,
    //         "time": 44461
    //     },
    //     "location": {
    //         "name": "GAStech",
    //         "location_type": "professional"
    //     }
    // }

  </script>
  
  <h1>Julia Casado Gómez-Pallete - KU Leuven - r0877500</h1>
  
  <div class="output">
    {#if !data}
    <p>Loading data...</p>
    {:else}
    <Exercise gps_data_slug={data.car[0]} carstops_data_slug={data.car[1]} car_ids={data.car[2]}/>
    {/if}
  </div>
  