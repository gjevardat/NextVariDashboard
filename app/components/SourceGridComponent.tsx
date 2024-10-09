import { useEffect, useState } from "react";
import { run, source } from "../types";
import Pagination from "./PaginationComponent";
import { TimeSeries } from "./TimeSeriesChart";
import { Box, CircularProgress, LinearProgress } from "@mui/material";

interface GridProps {
  run: run | null,
  sources: source[] | null,
  columns: number,
  rows: number,
  pageIndex: number,
  setPageIndex: (pageIndex: number) => void,
  isLoading:boolean
  selectedTags:string[]
}

export const SourceGrid: React.FC<GridProps> = ({ run, sources, selectedTags, columns, rows, pageIndex, setPageIndex,isLoading }) => {

  if (run && (sources==null || sources.length==0 || isLoading )   ) {
    return (<div><LinearProgress /></div>)
  }

  //console.log(`grid of size ${columns}x${rows} will show ${sources.length} sources of page with index ${pageIndex}`)
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
      {sources && Array.from({ length: sources.length }, (_, index) => {
        const source = sources[index];

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
              <TimeSeries sourceid={source.sourceid} ts={source.timeseries.filter((ts)=>selectedTags.includes(ts.tag))} />
            </div>
          
        );
      })}




    </div>
  );
};

