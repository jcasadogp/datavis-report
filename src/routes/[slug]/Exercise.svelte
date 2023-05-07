<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { min, max} from "d3-array";
    import { axisLeft, axisBottom } from 'd3-axis';
    import { select } from 'd3-selection';
    import { each } from 'svelte/internal';
    import { schemeTableau10 } from "d3-scale-chromatic";
    
    // Properties
    export let gps_data_slug = undefined;
    export let carstops_data_slug = undefined;
    // export let businesses_data_slug = undefined;

    export let cumulative_minute_total = 0;
    let min_cum_min = min(gps_data_slug, d => d.cumulative_minute_total)
    let max_cum_min = max(gps_data_slug, d => d.cumulative_minute_total)

    let hours = [0, 6, 12, 18, 24];
    // let days = [... new Set(gps_data_slug.map(d => d.day))].sort(function(a, b){return a - b});
    // let locations = [... new Set(carstops_data_slug.map(d => d.location.location_type))];
    // console.log(locations)
    
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
    
    const timeScale = scaleLinear().domain([0, 86400]).range([0, innerWidth])//.ticks(hours) //seconds to width
    const dayScale = scaleLinear().domain([6, 20]).range([0, innerHeight])
    

    // Functions
    function leftAxisBuilder(handle){
        let axisGen = axisLeft(dayScale)
        let yAxis = axisGen(select(handle))
    }

    function bottomAxisBuilder(handle){
        let axisGen = axisBottom(timeScale)
        let xAxis = axisGen(select(handle))
    }

</script>

{#if gps_data_slug && carstops_data_slug}

<p><a href="/">Car overview</a></p>

<div>
<h3>Details for car XXX</h3>
<input type="range" min={min_cum_min} max={max_cum_min} bind:value={cumulative_minute_total}> 
<!-- {cumulative_minute_total} -->
</div>

<svg width={width} height={height}>
    <g transform="translate({margin.left},{margin.top})">
        {#each gps_data_slug as gps_datapoint}
            <circle 
                cx={longScale(gps_datapoint.long)} 
                cy={latScale(gps_datapoint.lat)} 
                r=3
                fill="black"
                fill-opacity="0.5"
                >
            </circle>
        {/each}
    </g>
</svg>


<svg width={width} height={height}>
    <g transform="translate({margin.left},{margin.top})">
        {#each carstops_data_slug as carstop, i}
            <rect 
                x={timeScale(carstop.start.time) +1}
                y={dayScale(carstop.start.day)} 
                width={timeScale(carstop.end.time - carstop.start.time)} 
                height={dayHeight-2} 
                fill={busScale(carstop.location.location_type)}
                />
        {/each}
        <g use:leftAxisBuilder></g>
        <g transform={`translate(0,${innerHeight})`} use:bottomAxisBuilder></g>
        
        <!-- {#each hours as hour}
            <line x1={timeScale(hour*3600)} y1="0" x2={timeScale(hour * 3600)} y2={innerHeight} stroke="white" stroke-width="1" fill-opacity="1"/>
            <text x={timeScale(hour*3600)} y={innerHeight +20} text-anchor="middle">{hour}</text>
        {/each} -->
    </g>
</svg>

{/if}
