'use client'

import React, { useRef, useEffect } from 'react';
import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import useSWR from 'swr'


import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


import HighchartsExporting from 'highcharts/modules/exporting'
import { truncateSync } from 'fs';


if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

let options: Highcharts.Options = {};


interface Ts {
  tag: string;
  obstimes: number[];
  vals: number[];
  errs: number[];
}

interface ChartProps {
  tsArray: Ts[];
  sourceId: number;
}

export function TimeSeries({ tsArray, sourceId }: ChartProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (!chartComponentRef.current) return;
    const chart = chartComponentRef.current.chart;


    // Ensure the chart is properly initialized before adding series
    if (chart && tsArray) {


      tsArray.forEach((ts) => {

        if (chartComponentRef.current?.chart.get(ts.tag) == null) {

          const valueSeries: [number, number][] = ts.obstimes.map((value, index) => [value, ts.vals[index]]);
          const errorSeries: [number, number, number][] = ts.obstimes.map((value, index) => [value, ts.vals[index] - ts.errs[index], ts.vals[index] + ts.errs[index]]);

          console.log('ts tag:' + ts.tag)
          let markerColor = 'grey'; // Default color
          if (ts.tag.includes("FOV_RP")) {
            markerColor = 'red';
          } else if (ts.tag.includes("FOV_BP")) {
            markerColor = 'blue';
          }
          console.log("Marker color  "+ markerColor)
          chart.addSeries({
            type: 'scatter',
            id: ts.tag,
            name: ts.tag,
            data: valueSeries,
            marker: {
              radius: 4,
              fillColor: markerColor,
              color: markerColor
            },
            tooltip: {
              followPointer: false,
              pointFormat: '[{point.x:.4f}, {point.y:.4f}]',
              headerFormat: `<span style="color:${markerColor}">●</span> <span style="font-size: 0.8em"> {series.name}</span><br/>.`, // Use the markerColor
              
            },
          }, false, false);

          chart.addSeries({
            id: ts.tag + "_err",
            type: 'errorbar',
            name: 'Error time series',
            data: errorSeries,
            color: 'black'
          }, true, false);

          // Redraw the chart after adding series
          //chart.redraw();
        }
      });


    }
  }, [tsArray]);

  const options = {
    
    accessibility: {
      enabled: false,
    },
    height: '50%',
    chart: {
      type: 'scatter',
      zooming: {
        type: 'xy',
      },
      animation: false,
    },
    xAxis: {
      type: 'linear',
    },
    plotOptions: {
      series: {
        animation: false,
      },
      scatter: {
        animation: false,
      },
    },
    title: {
      text: String(sourceId),
    },
    
  };

  return (
    <div style={{height: "100vh"}}>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      containerProps={ { style: { height: "100%" } }}
    />
    </div>
  );
};





