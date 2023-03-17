import { Feature } from "ol";
import { Address } from "./Address";

export interface Route {
    resultId: number | undefined,
    destination: Address | undefined,
    origin: Address | undefined,
    mode: number,
    features: Feature[],
    setRoute: Boolean
}