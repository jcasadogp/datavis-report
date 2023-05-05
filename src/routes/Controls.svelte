<script>

    export let carstops_data = [];
    export let selected_car_id = 0;

    const car_ids = [... new Set(carstops_data.map(c => c.car))].sort();
    
    console.log(car_ids)
    
    // Dimensions
    const width = 620;
    const height = 80;
    const margin = { top: 10, right: 10, bottom: 10, left: 10};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // console.log(carstops_data)

    // for(let i = 0; i < carstops_data.length; i++){
    //     console.log(carstops_data[i].car)
    // }
</script>

<h2>Overview</h2>

<div>
    <form>
        {#each car_ids as car_id}
            <label>
            <input type=radio bind:group={selected_car_id} value={car_id}>
            Car {car_id}
            </label>
        {/each}
    </form>
</div>
