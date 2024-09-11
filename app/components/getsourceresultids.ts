'use client'

import useSWR from 'swr'


const fetcher = (url:string) => fetch(url).then((res) => res.json());


export function getSourcesResultIds( {pageSize, pageIndex,runid} ) {

    const { data, error, isLoading } =  useSWR("/api/getSourceResultId?runid="+runid+"&offset="+ (pageIndex*pageSize) +"&size="+pageSize
    , fetcher)

    return {
        sourceresultids: data,
        isLoading,
        isError: error
    }

}