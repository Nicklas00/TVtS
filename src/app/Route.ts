import { Address } from "./Address";

export interface Route {
    destination: Address | undefined,
    origin: Address | undefined,
    mode: string
}