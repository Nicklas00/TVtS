export interface RouteRequest {
  id: number | undefined;
  mode: string;
  origin: {
    lat: number;
    lon: number;
  };
  destination: {
    lat: number;
    lon: number;
  };
  message: string;
}
