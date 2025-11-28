import Exa from "exa-js";

let client: Exa | null = null;

export function getExaClient(apiKey: string): Exa {
    if (!client) {
        client = new Exa(apiKey);
    }
    return client;
}
