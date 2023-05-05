<script>
    import { onMount } from 'svelte';

    import Map from "./Map.svelte";
    import Controls from "./Controls.svelte";

    let gps_data = null;
    let carstops_data = null;
    let businesses_data = null;

    export let selected_car_id = undefined;

    onMount(async () => {
        const gps_res = await fetch('/data/vast2021_gps_coordinates.json')
        gps_data = await gps_res.json()

        const carstops_res = await fetch('/data/vast2021_carstops.json')
        carstops_data = await carstops_res.json()

        const businesses_res = await fetch('/data/vast2021_businesses.json')
        businesses_data = await businesses_res.json()
    });
</script>

{#if !gps_data || !carstops_data || !businesses_data}
  <p>Loading the data, please wait...</p>
{:else}
    <div>
        <h1>{selected_car_id}</h1>
        <Controls bind:selected_car_id={selected_car_id} carstops_data={carstops_data}/>
    </div>
    <div>
        <Map bind:selected_car_id={selected_car_id} gps_data={gps_data} carstops_data={carstops_data} businesses_data={businesses_data}/>
    </div>
{/if}


