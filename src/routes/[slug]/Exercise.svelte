<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { min, max} from "d3-array";
    import { axisLeft, axisBottom } from 'd3-axis';
    import { select } from 'd3-selection';
    import { schemeTableau10 } from "d3-scale-chromatic";
    import { invalidateAll } from '$app/navigation';
    
    // Properties
    export let gps_data_slug = undefined;
    export let carstops_data_slug = undefined;
    export let car_ids = undefined;

    export let cumulative_minute_total = 0;

    let hours = [0, 6, 12, 18, 24];

    let selected_car_id = gps_data_slug[0].car_id;
    let previous_car_id;
    let next_car_id;

    let selected_carstop = undefined;

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
    
    const hourScale = scaleLinear().domain([0, 24]).range([0, innerWidth]) //hours to width
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

    $: getCumMinutesIndex = function(cmt) {
        let current_day = Math.floor(cmt / 1440) + 6;
        let current_second_day = (cmt % 1440) *60;
        return [current_day, current_second_day]
    }
    
    function goPreviousCar(event) {
        if (car_ids.indexOf(selected_car_id)==0){
            previous_car_id = selected_car_id;
        } else {
            previous_car_id = car_ids[car_ids.indexOf(selected_car_id) -1];
            selected_car_id = previous_car_id
        }
        invalidateAll();
    }

    function goNextCar(event) {
        if(car_ids.indexOf(selected_car_id)==car_ids.length-1){    
            next_car_id = selected_car_id;
        } else {
            next_car_id = car_ids[car_ids.indexOf(selected_car_id) +1]
            selected_car_id = next_car_id
        }
        invalidateAll();
    }

    let mouse_x, mouse_y;
    const setMousePosition = function(event) {
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    }
</script>

{#if gps_data_slug && carstops_data_slug && car_ids}
<table>
    <tr>
        <a href="/">Car overview</a>
    </tr>
    <tr>
      <td><a on:click={goPreviousCar} href="{previous_car_id}">Previous car</a></td>
      <td><a on:click={goNextCar} href="{next_car_id}">Next car</a></td>
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
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <rect 
                x={timeScale(carstop.start.time) +1}
                y={dayScale(carstop.start.day)} 
                width={timeScale(carstop.end.time - carstop.start.time)} 
                height={dayHeight-2} 
                fill={busScale(carstop.location.location_type)}
                on:mouseover={function(event) {selected_carstop = carstop; setMousePosition(event)}}
                on:mouseout={function() {selected_carstop = undefined}}
                />
        {/each}
        
        <!-- Left and bottom axes -->
        <g use:leftAxisBuilder></g>
        <g transform={`translate(0,${innerHeight})`} use:bottomAxisBuilder></g>

        <!-- Moving bar -->
        <line 
            x1={timeScale(getCumMinutesIndex(cumulative_minute_total)[1])} 
            x2={timeScale(getCumMinutesIndex(cumulative_minute_total)[1])}
            y1={dayScale(getCumMinutesIndex(cumulative_minute_total)[0])}
            y2={dayScale(getCumMinutesIndex(cumulative_minute_total)[0]) +dayHeight-2}
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

<!-- Hover over the hours box -->
{#if selected_carstop != undefined}
<div id="tooltip" style="left: {mouse_x + 10}px; top: {mouse_y - 10}px">
    <svg width=170 height=20>
        <g transform="translate(0,15)">
            <text x="0" y="0">{selected_carstop.location.name} ({selected_carstop.location.location_type})</text>
        </g>
    </svg>
    <br/>
</div>
{/if}

<!-- Styles -->
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
    #tooltip {
        position: fixed;
        background-color: white;
        padding: 3px;
        border: solid 1px;
    }
    svg.tooltip {
        margin: 0px;
        padding: 0px;
    }
</style>
