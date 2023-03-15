import { Feature } from "ol";
import { Address } from "./Address";

export interface Route {
    id: number | undefined,
    destination: Address | undefined,
    origin: Address | undefined,
    mode: string,
    features: Feature[]
}