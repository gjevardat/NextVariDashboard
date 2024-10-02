

import React, { useRef, useEffect, useState } from 'react';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsMore from 'highcharts/highcharts-more';
import { source, ts } from '../types';


if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
  HighchartsMore(Highcharts);
}

interface TimeSeriesProps {
  source: source | null;
}

export function TimeSeries({ source }: TimeSeriesProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const[chart, setChart] = useState<Highcharts.Chart>()
  
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
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
  
  useEffect( () => {
    if(chartComponentRef && chartComponentRef.current)
    setChart(chartComponentRef.current.chart);
  },[])
  

  useEffect(() => {

    
    
    
    
    if (chart && source && source.timeseries && source.timeseries.length > 0) {
      console.log("chart instance:", chart.index)

      console.log("Existing series IDs: ", chart.series.map((s) => s.options.id)); // Log existing series IDs



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
        console.log(`Series with ID ${valueSeriesId} found: `, valueSeriesChart !== undefined); // Log if series is found

        if (valueSeriesChart) {
          // Update the existing series using setData
          console.log("Update chart only")
          valueSeriesChart.setData(valueSeries, false);
        } else {
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

        if (errorSeriesChart) {
          // Update the error series using setData
          errorSeriesChart.setData(errorSeries, false);
          
        } else {
          // Add new error series if it doesn't exist
          chart.addSeries({
            id: errorSeriesId,
            type: 'errorbar',
            name: 'Error time series',
            data: errorSeries,
            color: 'black',
          }, false);
        }
      });
      
    }
  }, [source,chart]);


  return (
    <div style={{ height: "100%" }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions }
        ref={chartComponentRef}
        containerProps={{ style: { height: "100%" } }}
      />
    </div>
  );
}





