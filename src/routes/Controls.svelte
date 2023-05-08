<script>
    // Imports
    import 'bootstrap/dist/css/bootstrap.min.css';

    // Properties 
    export let carstops_data = [];
    export let selected_car_id = undefined;

    const car_ids = [... new Set(carstops_data.map(c => c.car))].sort(function(a, b){return a - b});
    
    // Dimensions
    const width = 620;
    const height = 80;
    const margin = { top: 10, right: 10, bottom: 10, left: 10};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Functions
    function resetCarId(){
        selected_car_id = undefined;
    }

</script>

<h2>Overview</h2>
<div>
Select a car to highlight:
<!-- Select -->
<select bind:value={selected_car_id}>
    {#each car_ids as car_id}
        <option value={car_id}>Car {car_id}</option>
    {/each}
</select>
<!-- <button class="reset" on:click={resetCarId} fill="red">Reset Car Id</button> -->
<button type="button" class="btn btn-warning btn-sm" on:click={resetCarId}>Reset Car Id</button>
</div>

<!-- Link to details path -->
{#if selected_car_id != undefined}
<div>Go to <a href={selected_car_id}>details</a> for car {selected_car_id}.</div>
{/if}

<!-- Styles -->
<style>
    div{
        margin-bottom: 10px;
        font-family: sans-serif;
    }
</style>