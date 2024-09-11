'use client'

import useSWR from 'swr'


const fetcher = (url:string) => fetch(url).then((res) => res.json());


export function getRuns() {

    const { data, error, isLoading } = useSWR("/api/getRunInfo?offset=0&size=1000", fetcher)

    return {
        runs: data,
        isLoading,
        isError: error
    }    
}

