<script>
    // Imports
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { min, max} from "d3-array";
    import { schemeTableau10 } from "d3-scale-chromatic";
    
    // Properties
    export let gps_data = [];
    export let businesses_data = [];

    export let selected_car_id = undefined;
    let selected_business = undefined;

    // Dimensions
    const width = 620;
    const height = 620;
    const margin = { top: 10, right: 10, bottom: 10, left: 10};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

     // Scales
    const longScale = scaleLinear().domain([min(gps_data, d => d.long), max(gps_data, d => d.long)]).range([0, innerWidth]);
    const latScale = scaleLinear().domain([min(gps_data, d => d.lat), max(gps_data, d => d.lat)]).range([innerHeight, 0]);
    const busScale = scaleOrdinal(schemeTableau10).domain(businesses_data.map(b => b.type));


    // Functions
    let mouse_x, mouse_y;
    const setMousePosition = function(event) {
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    }
</script>

<!-- Map of all the gps datapoints and businesses points -->
<svg id="gps_map" width={width} height={height}>
    <g transform="translate({margin.left},{margin.top})">
       
        <!-- GPS datapoints -->
        {#each gps_data as gps_datapoint}
            <circle 
                cx={longScale(gps_datapoint.long)} 
                cy={latScale(gps_datapoint.lat)} 
                r=3
                class:selected="{selected_car_id && gps_datapoint.car_id == selected_car_id}"
                fill="black"
                fill-opacity="0.01"
                >
            </circle>
        {/each}
        
        <!-- Businesses point of interest -->
        {#each businesses_data as business_datapoint}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <!-- businesses_data[0] -->
            <circle 
                cx={longScale(business_datapoint.long)} 
                cy={latScale(business_datapoint.lat)} 
                fill={busScale(business_datapoint.type)}
                on:mouseover={function(event) {selected_business = business_datapoint; setMousePosition(event)}}
                on:mouseout={function() {selected_business = undefined}}
                r=6>
            </circle>
        {/each}
    </g>
</svg>

<!-- Hover tooltip box -->
<!--  -->
<!-- class="tooltip"-->
{#if selected_business != undefined}
<div id="tooltip" style="left: {mouse_x + 10}px; top: {mouse_y - 10}px">
    <svg width=170 height=20>
        <g transform="translate(10,15)">
            <text>{selected_business.name}</text>
        </g>
    </svg>
</div>
{/if}

<!-- Styles -->
<style>
    circle.selected {
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