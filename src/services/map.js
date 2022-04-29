export const createMap = (el,lat,lng,zoom = 12) =>{
    return new window.google.maps.Map(el, {
        center: { lat, lng },
        zoom,
        // mapId: "20c983dc0f4c20e3",
        disableDefaultUI: true
    })
}
