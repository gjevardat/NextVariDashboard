
import { run, source, ts } from "@/app/types";

import { TimeSeries } from "./TimeSeriesChart";
import {  LinearProgress } from "@mui/material";
import { fetchTimeSeriesList, getTimeSeries, getTimeSeriesPreload, TimeSeriesFetch } from "./TimeSeriesDataFetching";
import { dataselection } from "./SourceSelectionComponent";
import { useSWRConfig } from "swr";


interface GridProps {
  run: run,
  dataselection:dataselection
  columns: number,
  rows: number,
  pageIndex: number,
  
  
  selectedTags: string[]
}


//todo in SQL ?
function groupBySourceId(array: ts[]): source[] {
  return array.reduce((sources: source[], current: ts) => {
    // Find an existing source with the same sourceid
    let source = sources.find(s => BigInt(s.sourceid) === BigInt(current.sourceid));

    // If not found, create a new source object
    if (!source) {
      source = { sourceid: BigInt(current.sourceid), timeseries: [] };
      sources.push(source); // Add the new source to the list
    }

    // Add the current time series to the source's timeseries array
    source.timeseries = [...source.timeseries, current];

    return sources;
  }, []);
}

export const SourceGrid: React.FC<GridProps> = ({ run, selectedTags, columns, rows, pageIndex ,dataselection}) => {

  const pageSize = columns * rows;
  const dataPageSize = pageSize * 4;
  const dataPageIndex = Math.floor((pageIndex*pageSize)/dataPageSize);
  
  //console.log(`pageSize:${pageSize} dataPageSize:${dataPageSize} pageIndex:${pageIndex} dataPageIndex:${dataPageIndex}`)
  const { timeseries, error, isLoading }: TimeSeriesFetch = getTimeSeries({ runid: run?.runid, tags: selectedTags, pageIndex: dataPageIndex, pageSize: dataPageSize });
  //console.log(`selected sources ${dataselection.selectedSources}`)
  const filtered:TimeSeriesFetch = fetchTimeSeriesList({ runid: run?.runid, tags: selectedTags, sourceids:dataselection.selectedSources });
  
  
  //prefetch one more datapage
  if(pageIndex>0)
    getTimeSeriesPreload({ runid: run?.runid, tags: selectedTags, pageIndex: dataPageIndex+1, pageSize: dataPageSize });
  
  if (run && (timeseries == null || timeseries.length == 0 || isLoading)) {
    return (<div><LinearProgress /></div>)
  }
  
  
  const groupedSources:source[] = groupBySourceId(filtered?.timeseries?.length>0?filtered.timeseries:timeseries);
  //console.log(`grouped sources: dataPageIndex:${dataPageIndex}`)
  const loggroupedsources = groupedSources.map(t=>t.sourceid.toString())
  //console.log(loggroupedsources)

  // filter the source to fit current grid
  //console.log(`slice start: ${(pageIndex%(dataPageSize/pageSize))*pageSize}, slice end: ${((pageIndex%(dataPageSize/pageSize))*pageSize) + pageSize}`)
  const finalSources = groupedSources.slice(((pageIndex%(dataPageSize/pageSize))*pageSize), ((pageIndex%(dataPageSize/pageSize))*pageSize) + pageSize);
  //console.log(finalSources)
  
  
  //console.log(`grid of size ${columns}x${rows} will show ${timeseries.length} sources of page with index ${pageIndex}`)
  return (

    
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`, // Fixed columns
        gridTemplateRows: `repeat(${rows}, 1fr)`,       // Fixed rows
        gap: '2px', 
        height: '100%', 
        width: '100%',
        overflow: 'hidden', 
      }}
    >
      {groupedSources && Array.from({ length: finalSources.length }, (_, index) => {
        const source = finalSources[index];
        //console.log("sources in grid", groupedSources);
        // If no source exists at this index, return an empty cell
        if (!source) {
          return <div key={index} style={{ border: '1px solid #ccc' }} />;
        }


        return (



          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <h4><b>{source.sourceid.toString()}</b></h4>
            <TimeSeries sourceid={source.sourceid} ts={source.timeseries} />
          </div>

        );
      })}




    </div>
  );
};

