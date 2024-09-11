'use client'

import React, { useRef } from 'react';
import { getTS } from '@/app/lib/data';
import { useState, useEffect } from 'react'

import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import useSWR from 'swr'

import Listbox from "react-widgets/Listbox";

import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


import HighchartsExporting from 'highcharts/modules/exporting'
import handler from '@/pages/api/getTS'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

let options: Highcharts.Options = {};
const fetcher = (url) => fetch(url).then((res) => res.json());

type Props = {
  sourceId: number
};

export function LoadTs( { sourceId }) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const { data, error, isLoading } = useSWR("/api/getTS?sourceId="+sourceId, fetcher)

  if (error) return <div>Data loading failed</div>
  if (isLoading) return <div>Loading</div>
  if(isLoading==false && data!== null){

  const combinedArray: [number, number][] = data[0].obstimes.map((value, index) => [value, data[0].val[index]]);
  const combinedArrayErr: [number, number, number][] = data[0].obstimes.map((value, index) => [value, data[0].val[index] - data[0].valerr[index], data[0].val[index] + data[0].valerr[index]]);
  
  console.log(combinedArray);
  
  options = {
    xAxis: {
      type: 'linear'
    },
    chart: {
      zooming: {
        type: 'xy'
      },
      animation: false
      
    },
    plotOptions: {
      series: {
        // general options for all series
      },
      scatter: {
        animation: false
      }
    },
    title: {
      text: data[0].sourceid
    },
    
    series: [{
      type: 'scatter',
      name: 'Magnitude time series',
      data: combinedArray,//.map(tuple => ({ x: tuple[0], y: tuple[1] })) ,
      pointInterval: 0.01,
      marker: {
        radius: 2
      },
      tooltip: {
        followPointer: false,
        pointFormat: '[{point.x:.4f}, {point.y:.4f}]'
      }
    },
    {
      type: 'errorbar',
      name: 'Error time series',
      data: combinedArrayErr,
    },
  ]
};

return <div>
    <p>{sourceId}</p>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      />
  </div>
    }
}

export default function Page() {
  const [sourceId, setSourceId] = useState(7632157690368);
  return (
    <div>
      <Listbox
        defaultValue={7632157690368}
        data={[7632157690368, 48756468795776, 214576566416256, 288832256435328]}
        onChange={(nextValue) => setSourceId(nextValue)}
      />
      <LoadTs sourceId={sourceId} />
    </div>

  );

};
