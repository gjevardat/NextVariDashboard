


export async function getRuns() {
    console.log("Server call getRuns ...");
    const response = await fetch(`/api/getRunInfo?offset=0&size=1000`);
    return  await response.json();
}

