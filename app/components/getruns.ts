import { run } from "../types";



export async function getRuns(): Promise<run[]> {
    
    const response = await fetch(`/api/getRunInfo?offset=0&size=1000`);
    

    if (!response.ok) {
        throw new Error("Failed to fetch runs");
    }
    
    

    const data: run[] = await response.json();
    
    return data;
    
}

