
import { run, source, ts } from "@/app/types";

import { TimeSeries } from "./TimeSeriesChart";
import {  LinearProgress } from "@mui/material";
import { fetchTimeSeriesList, getTimeSeries, getTimeSeriesPreload, TimeSeriesFetch } from "./TimeSeriesDataFetching";
import { dataselection } from "./SourceSelectionComponent";


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
  const prefetchSize = 10;

  const { timeseries, error, isLoading }: TimeSeriesFetch = getTimeSeries({ runid: run?.runid, tags: selectedTags, pageIndex: pageIndex, pageSize: pageSize });

  console.log(`selected sources ${dataselection.selectedSources}`)
  const filtered:TimeSeriesFetch = fetchTimeSeriesList({ runid: run?.runid, tags: selectedTags, sourceids:dataselection.selectedSources });

  
    for(let i = pageIndex; i<pageIndex+prefetchSize; i++){
      getTimeSeriesPreload({ runid: run?.runid, tags: selectedTags, pageIndex: pageIndex+1, pageSize: pageSize });
    }
  
 


  if (run && (timeseries == null || timeseries.length == 0 || isLoading)) {
    return (<div><LinearProgress /></div>)
  }
  
  
  const groupedSources:source[] = groupBySourceId(filtered?.timeseries?.length>0?filtered.timeseries:timeseries);
  

  //console.log(`grid of size ${columns}x${rows} will show ${timeseries.length} sources of page with index ${pageIndex}`)
  return (

    
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`, // Fixed columns
        gridTemplateRows: `repeat(${rows}, 1fr)`,       // Fixed rows
        gap: '2px', // Space between grid items
        height: '100%', // Ensure grid does not expand indefinitely
        width: '100%',
        overflow: 'hidden', // Prevent overflow issues
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

