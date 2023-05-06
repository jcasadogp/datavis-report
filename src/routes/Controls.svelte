<script>
    // Imports
    import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Styles} from 'sveltestrap';
    
    // Properties 
    export let carstops_data = [];
    export let selected_car_id = 0;

    const car_ids = [... new Set(carstops_data.map(c => c.car))].sort(function(a, b){return a - b});
    
    console.log(car_ids)
    
    // Dimensions
    const width = 620;
    const height = 80;
    const margin = { top: 10, right: 10, bottom: 10, left: 10};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

</script>

<h2>Overview</h2>

<div>
Select a car to highlight:
<select bind:value={selected_car_id}>
    {#each car_ids as car_id}
        <option value={car_id}>
            Car {car_id}
        </option>
    {/each}
</select>
</div>

<style>
    div{
        margin-bottom: 10px
    }
</style>