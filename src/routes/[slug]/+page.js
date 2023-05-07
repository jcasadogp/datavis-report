// Imports
import { onMount } from 'svelte';

// Properties
let gps_data_slug = null;
let carstops_data_slug = null;
// let businesses_data_slug = null;

export function load({ fetch, params }) {
    const fetchCar = async () => {
        const gps_res = await fetch('/data/vast2021_gps_coordinates.json')
        const gps_data = await gps_res.json()
        gps_data_slug = gps_data.filter((d) => { return d.car_id == params.slug})

        const carstops_res = await fetch('/data/vast2021_carstops.json')
        const carstops_data = await carstops_res.json()
        carstops_data_slug = carstops_data.filter((d) => { return d.car == params.slug})

        // const businesses_res = await fetch('/data/vast2021_businesses.json')
        // const businesses_data = await businesses_res.json()
        // businesses_data_slug = businesses_data.filter((d) => { return d.car_id == params.slug})[0]
        
        return [gps_data_slug, carstops_data_slug]
    }

    return {
        car: fetchCar()
    }
}