

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
  source: source | null;
}

export function TimeSeries({ source }: TimeSeriesProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const [chart, setChart] = useState<Highcharts.Chart>()

  const [chartOptions] = useState<Highcharts.Options>({
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
    },
    yAxis: {
      reversed: true,
      title: { text: 'Magnitude' },
    },
    plotOptions: {
      series: { animation: false },
      scatter: { animation: false },
    },
    title: { text: '' },
    exporting: {
      enabled: true,
      
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

    if (chart && source && source.timeseries && source.timeseries.length > 0) {



      let existingSeries = chart.series
        .filter((s) => s.options && s.options.id && !s.options.id.endsWith('_err'))
        .map((s) => s.options.id)
      let requestedSeries = source.timeseries.map((ts) => ts.tag);

 
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

      source.timeseries.forEach((ts) => {
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
  }, [chart,source]);


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





