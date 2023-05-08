<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { min, max} from "d3-array";
    import { axisLeft, axisBottom } from 'd3-axis';
    import { select } from 'd3-selection';
    import { schemeTableau10 } from "d3-scale-chromatic";
    
    // Properties
    export let gps_data_slug = undefined;
    export let carstops_data_slug = undefined;
    export let car_ids = undefined;

    export let cumulative_minute_total = 0;

    let hours = [0, 6, 12, 18, 24];
    // let days = [... new Set(gps_data_slug.map(d => d.day))].sort(function(a, b){return a - b});
    // let locations = [... new Set(carstops_data_slug.map(d => d.location.location_type))];
    // console.log(locations)

    let selected_car_id = gps_data_slug[0].car_id;
    let previous_car_id;
    let next_car_id;

    if (car_ids.indexOf(selected_car_id)==0){
        previous_car_id = selected_car_id;
        next_car_id = car_ids[car_ids.indexOf(selected_car_id) +1]
    } else if(car_ids.indexOf(selected_car_id)==car_ids.length-1){
        previous_car_id = car_ids[car_ids.indexOf(selected_car_id) -1];
        next_car_id = selected_car_id;
    } else {
        previous_car_id = car_ids[car_ids.indexOf(selected_car_id) -1];
        next_car_id = car_ids[car_ids.indexOf(selected_car_id) +1]
    }

    // Dimensions
    const width = 350;
    const height = 350;
    const margin = { top: 25, right: 25, bottom: 25, left: 25};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Day bar height
    let dayHeight = innerHeight/14;

    // Scales
    const longScale = scaleLinear().domain([min(gps_data_slug, d => d.long), max(gps_data_slug, d => d.long)]).range([0, innerWidth]);
    const latScale = scaleLinear().domain([min(gps_data_slug, d => d.lat), max(gps_data_slug, d => d.lat)]).range([innerHeight, 0]);
    const busScale = scaleOrdinal(schemeTableau10).domain(carstops_data_slug.map(b => b.location.location_type));
    
    const hourScale = scaleLinear().domain([0, 24]).range([0, innerWidth]) //seconds to width
    const timeScale = scaleLinear().domain([0, 86400]).range([0, innerWidth]) //seconds to width
    const dayScale = scaleLinear().domain([6, 20]).range([0, innerHeight])
    

    // Functions
    function leftAxisBuilder(handle){
        let axisGen = axisLeft(dayScale)
        let yAxis = axisGen(select(handle))
    }

    function bottomAxisBuilder(handle){
        let axisGen = axisBottom(hourScale)
        let xAxis = axisGen.ticks(5).tickValues((hours))(select(handle))
    }

    $: get_cum_minutes_index = function(cmt) {
        let current_day = Math.floor(cmt / 1440) + 6;
        let current_second_day = (cmt % 1440) *60;
        return [current_day, current_second_day]
    }

</script>

{#if gps_data_slug && carstops_data_slug && car_ids}

<table>
    <tr>
        <a href="/">Car overview</a>
    </tr>
    <tr>
      <td><a href="{previous_car_id}">Previous car</a></td>
      <td><a href="{next_car_id}">Next car</a></td>
    </tr>
</table>

<h3>Details for car {selected_car_id}</h3>
<div>
    <input type="range" min="0" max="20159" bind:value={cumulative_minute_total} width={innerWidth}>
</div>

<!-- Left part: map for chosen car id -->
<svg width={width} height={height}>
    <g transform="translate({margin.left},{margin.top})">
        {#each gps_data_slug as gps_datapoint}
            <circle 
                cx={longScale(gps_datapoint.long)} 
                cy={latScale(gps_datapoint.lat)} 
                r=3
                class:car_window="{ Math.abs(gps_datapoint.cumulative_minute_total - cumulative_minute_total) < 15 }"
                >
            </circle>
        {/each}
    </g>
</svg>

<!-- Right part: hours box -->
<svg width={width} height={height}>
    <g transform="translate({margin.left},{margin.top})">
        
        <!-- Bar plot -->
        {#each carstops_data_slug as carstop, i}
            <rect 
                x={timeScale(carstop.start.time) +1}
                y={dayScale(carstop.start.day)} 
                width={timeScale(carstop.end.time - carstop.start.time)} 
                height={dayHeight-2} 
                fill={busScale(carstop.location.location_type)}
                />
        {/each}
        
        <!-- Left and bottom axes -->
        <g use:leftAxisBuilder></g>
        <g transform={`translate(0,${innerHeight})`} use:bottomAxisBuilder></g>

        <!-- Moving bar -->
        <line 
            x1={timeScale(get_cum_minutes_index(cumulative_minute_total)[1])} 
            x2={timeScale(get_cum_minutes_index(cumulative_minute_total)[1])}
            y1={dayScale(get_cum_minutes_index(cumulative_minute_total)[0])}
            y2={dayScale(get_cum_minutes_index(cumulative_minute_total)[0]) +dayHeight-2}
            stroke="black" 
            stroke-width="3" 
            fill-opacity="1"/>

        <!-- X axis legend bars -->
        {#each hours as hour}
            <line 
                x1={hourScale(hour) +0.5}
                x2={hourScale(hour) +0.5}
                y1="0"
                y2={innerHeight} 
                stroke="black" 
                stroke-width="1" 
                fill-opacity="1"/>
        {/each}
    </g>
</svg>

{/if}


<style>
    div{
        width: 300px;
        text-align: center;
    }
    input{
        width: 300px;
    }
    circle{
        fill: steelblue;
        fill-opacity: 0.3;
    }
    circle.car_window{
        fill: red;
        fill-opacity: 1;
    }
</style>