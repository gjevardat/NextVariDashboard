'use client'

import React, { useRef, useState, useEffect } from 'react';
import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import useSWR from 'swr'


import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


import HighchartsExporting from 'highcharts/modules/exporting'


if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

let options: Highcharts.Options = {};
const fetcher = (url: any) => fetch(url).then((res) => res.json());

interface ts {
  tag: string,
  sourceid: number,
  obstimes: number[],
  vals: number[],
  errs: number[]
}
export function TimeSeries({ runid, sourceId, tsArray }: { runid: number; sourceId: number; tsArray: ts[]|undefined }) {

  console.log(tsArray)

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  options = {
    chart: {
      type: 'scatter',
      height: '60%', // Manually setting the chart height
      zooming: {
        type: 'xy'
      },
      animation: false

    },
    xAxis: {
      type: 'linear'
    },

    plotOptions: {
      series: {
        animation: false
      },
      scatter: {
        animation: false
      }
    },
    title: {
      text: String(sourceId)
    },
  };

  tsArray && tsArray.forEach((ts) => {
    const valueSeries: [number, number][] = ts.obstimes.map((value, index) => [value, ts.vals[index]]);
    const errorSeries: [number, number, number][] = ts.obstimes.map((value, index) => [value, ts.vals[index] - ts.errs[index], ts.vals[index] + ts.errs[index]]);

    chartComponentRef.current?.chart.addSeries({
      type: 'scatter',
      name: 'Magnitude time series',
      data: valueSeries,

      marker: {
        radius: 2
      },
      tooltip: {
        followPointer: false,
        pointFormat: '[{point.x:.4f}, {point.y:.4f}]'
      }
    }, false, false);

    chartComponentRef.current?.chart.addSeries({
      type: 'errorbar',
      name: 'Error time series',
      data: errorSeries,

    }, false, false);
  })

  chartComponentRef.current?.chart.redraw();


  return (

    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}

    />


  )
}



