

import React, { useRef, useEffect, useState } from 'react';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data';
import HighChartsOfflineExporting from "highcharts/modules/offline-exporting";

import HighchartsMore from 'highcharts/highcharts-more';
import { source, ts } from '../types';


if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
  HighchartsExportData(Highcharts)
  HighchartsMore(Highcharts);
  HighChartsOfflineExporting(Highcharts)
}

interface TimeSeriesProps {
  sourceid: bigint;
  ts: ts[];
}

export function TimeSeries({ sourceid,ts }: TimeSeriesProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [chart, setChart] = useState<Highcharts.Chart>()

  const [chartOptions] = useState<Highcharts.Options>({
    
    credits: {
      enabled: false
  },
    accessibility: { enabled: false },
    legend: { enabled: false },
    chart: {
      
      type: 'scatter',
      zooming: { type: 'xy' },
      animation: false,
    },
    xAxis: {
      type: 'linear',
      title: { text: 'Time (BJD in TCB-2455197.5)' },
      startOnTick: false,
      endOnTick: false
    },
    yAxis: {
      reversed: true,
      title: { text: 'Magnitude' },
      startOnTick: false,
      endOnTick: false
    },
    plotOptions: {
      series: { animation: false },
      scatter: { animation: false },
    },
    title: { text: '' },
    exporting: {
      enabled: true,
      chartOptions: {
        title: {
          text: sourceid.toString()
        }
      },
      buttons: {
        contextButton: {
          verticalAlign: 'bottom',
          align: 'left',
        },
      },
    },
  });

  
  useEffect(() => {
    if (chartComponentRef && chartComponentRef.current)
      setChart(chartComponentRef.current.chart);
  }, [])


  useEffect(() => {

    if (chart && sourceid && ts && ts.length > 0) {

      //console.log(`ts as params ${ts.map((t)=>t.tag)}`)


      let existingSeries:string[] = chart.series
        .filter((s) => s.options && s.options.id && !s.options.id.endsWith('_err'))
        .map((s) => s.options.id)
        .filter((id): id is string => id !== undefined)
      let requestedSeries = ts.map((ts) => ts.tag);

      /* console.log(`req tags ${requestedSeries}`)
      console.log(`existing tags ${existingSeries}`) */
      // Series to remove from the chart
      let seriesToRemove = existingSeries.filter(tag => !requestedSeries.includes(tag));
      // Series to add to the chart
      let seriesToAdd = requestedSeries.filter(tag => !existingSeries.includes(tag));
      // Series to update in the chart
      let seriesToUpdate = existingSeries.filter(tag => requestedSeries.includes(tag));

      seriesToRemove.forEach((ts) => {
        let valueSeriesChart = chart.get(ts) as Highcharts.Series | undefined;
        let errorSeriesChart = chart.get(ts+"_err") as Highcharts.Series | undefined;
        valueSeriesChart?.remove();
        errorSeriesChart?.remove();
      })

      ts.forEach((ts) => {
        const valueSeries: [number, number][] = ts.obstimes.map((value, index) => [value, ts.val[index]]);
        const errorSeries: [number, number, number][] = ts.obstimes.map((value, index) => [value, ts.val[index] - ts.valerr[index], ts.val[index] + ts.valerr[index]]);

        let markerColor = 'grey'; // Default color
        if (ts.tag.includes("FOV_RP")) {
          markerColor = 'red';
        } else if (ts.tag.includes("FOV_BP")) {
          markerColor = 'blue';
        }

        // Find the existing series by ID or create it if it doesn't exist
        const valueSeriesId = ts.tag;
        const errorSeriesId = ts.tag + "_err";

        let valueSeriesChart = chart.get(valueSeriesId) as Highcharts.Series | undefined;
        let errorSeriesChart = chart.get(errorSeriesId) as Highcharts.Series | undefined;
        
        //udpate chart. important to avoid full redraw that takes long with bigger grids of plots.
        if (valueSeriesChart && seriesToUpdate.includes(valueSeriesId)) {
          valueSeriesChart.setData(valueSeries, false);
        }
        else {
          // Add new series if it doesn't exist
          chart.addSeries({
            type: 'scatter',
            id: valueSeriesId,
            name: ts.tag,
            data: valueSeries,
            marker: {
              radius: 4,
              fillColor: markerColor,
              color: markerColor,
              symbol: 'circle'
            },
            tooltip: {
              followPointer: false,
              pointFormat: '<b>Obstimes:</b>{point.x:.4f}<br/><b>Value:</b>{point.y:.4f}',
              headerFormat: `<span style="color:${markerColor}">●</span> <span> <b>{series.name}</b></span><br/>`,
            },
          }, false);
        }

        if (errorSeriesChart && seriesToUpdate.includes(valueSeriesId)) {
          errorSeriesChart.setData(errorSeries, false);
        }
        else {
          chart.addSeries({
            id: errorSeriesId,
            type: 'errorbar',
            name: 'Error time series',
            data: errorSeries,
            color: 'black',
          }, false);
        }
      });
      chart.redraw();
    }
  }, [chart,ts]);


  return (
    <div style={{ height: "100%" }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        ref={chartComponentRef}
        containerProps={{ style: { height: "100%" } }}
      />
    </div>
  );
}





