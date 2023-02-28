export interface routeRequest {
    "id": number,
    "mode": string,
    "origin": {
        "lat": number,
        "lon": number
    },
    "destination": {
        "lat": number,
        "lon": number
    }
}