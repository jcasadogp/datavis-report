// Properties
let gps_data_slug = null;
let carstops_data_slug = null;

export function load({ fetch, params }) {
    const fetchCar = async () => {
        const gps_res = await fetch('/data/vast2021_gps_coordinates.json')
        const gps_data = await gps_res.json()
        gps_data_slug = gps_data.filter((d) => { return d.car_id == params.slug})

        const carstops_res = await fetch('/data/vast2021_carstops.json')
        const carstops_data = await carstops_res.json()
        carstops_data_slug = carstops_data.filter((d) => { return d.car == params.slug})

        const car_ids = [... new Set(carstops_data.map(c => c.car))].sort(function(a, b){return a - b});
        
        return [gps_data_slug, carstops_data_slug, car_ids]
    }

    return {
        car: fetchCar()
    }
}