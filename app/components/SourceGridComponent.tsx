
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
  const dataPageSize = 100;
  const dataPageIndex = Math.floor((pageIndex*pageSize)/dataPageSize);
  
  const { timeseries, error, isLoading }: TimeSeriesFetch = getTimeSeries({ runid: run?.runid, tags: selectedTags, pageIndex: dataPageIndex, pageSize: dataPageSize });

  //console.log(`selected sources ${dataselection.selectedSources}`)
  const filtered:TimeSeriesFetch = fetchTimeSeriesList({ runid: run?.runid, tags: selectedTags, sourceids:dataselection.selectedSources });

  
  //prefetch one more datapage
   if(pageIndex>0)
      getTimeSeriesPreload({ runid: run?.runid, tags: selectedTags, pageIndex: dataPageIndex+1, pageSize: dataPageSize });
   
  if (run && (timeseries == null || timeseries.length == 0 || isLoading)) {
    return (<div><LinearProgress /></div>)
  }
  
  
  const groupedSources:source[] = groupBySourceId(filtered?.timeseries?.length>0?filtered.timeseries:timeseries)
    // filter the source to fit current grid
    .slice(((pageIndex%(dataPageSize/pageSize))*pageSize), ((pageIndex%(dataPageSize/pageSize))*pageSize) + pageSize);
  
  
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
      {groupedSources && Array.from({ length: groupedSources.length }, (_, index) => {
        const source = groupedSources[index];
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

