import useSWR from 'swr'
import { source } from '@/app/types'
 

const fetcher = (...args:[input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then(res => res.json())


type TimeSeriesFetch = {
  data:source[],
  error:string,
  isLoading: boolean
}

type InputProps ={
  runid:number,
  pageIndex:number,
  pageSize:number,
  tags:string[]
}




function getTimesSeries ({runid,pageIndex,pageSize,tags}:InputProps) : TimeSeriesFetch  {
  const { data, error, isLoading } = useSWR(`/api/getTSPage?runid=${runid}&pageIndex=${pageIndex}&pageSize=${pageSize}&tags=${tags.join('&tags=')}`, fetcher)
 
  return {data:data, error:error, isLoading:isLoading};
}