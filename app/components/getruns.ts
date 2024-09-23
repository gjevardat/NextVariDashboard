import { run } from "../types";



export async function getRuns(): Promise<run[]> {
    console.log("Server call getRuns ...");
    const response = await fetch(`/api/getRunInfo?offset=0&size=1000`);
    

    if (!response.ok) {
        throw new Error("Failed to fetch runs");
    }
    
    // Assuming the API returns an array of objects that match the `run` interface

    const data: run[] = await response.json();
    console.log(data);
    return data;
    
}

