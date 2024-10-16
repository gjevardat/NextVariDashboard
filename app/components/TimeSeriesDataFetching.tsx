import useSWR, { preload } from 'swr'
import { ts } from '@/app/types'
 
export type TimeSeriesFetch = {
  timeseries:ts[],
  error:string,
  isLoading: boolean
}

type InputPageProps ={
  runid:number,
  pageIndex:number,
  pageSize:number,
  tags:string[]
}

type InputSourcesProps ={
  runid:number,
  sourceids:bigint[]
  tags:string[]
}

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => 
  fetch(...args).then(res => res.json());
// Create a custom hook
export function getTimeSeries({ runid, pageIndex, pageSize, tags }: InputPageProps): TimeSeriesFetch {

  const { data, error, isLoading } = useSWR(
    `/api/getTSPage?db=dr4&runid=${runid}&pageIndex=${pageIndex}&pageSize=${pageSize}&tags=${tags.join('&tags=')}`, 
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    timeseries: data, 
    error: String(error) , 
    isLoading: isLoading
  };
}

export  function fetchTimeSeriesList({ runid, sourceids, tags }: InputSourcesProps): TimeSeriesFetch {
  const { data, error,isLoading } = useSWR(sourceids.length>0?
   `/api/getTS?db=dr4&runid=${runid}&tags=${tags.join('&tags=')}&sourceids=${sourceids.join('&sourceids=')}`:null, 
    fetcher
  );

  return {
    timeseries: data, 
    error: String(error) , 
    isLoading: isLoading
  };    
 
  
}

export function getTimeSeriesPreload({ runid, pageIndex, pageSize, tags }: InputPageProps) {


  preload(
    `/api/getTSPage?db=dr4&runid=${runid}&pageIndex=${pageIndex}&pageSize=${pageSize}&tags=${tags.join('&tags=')}`, 
    fetcher
  );

 
}