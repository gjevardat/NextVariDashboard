'use client'

import React, { useRef, useEffect } from 'react';

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
  source:source|null;
}


export function TimeSeries( {source} : TimeSeriesProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  
  useEffect(() => {

    
    if (!chartComponentRef.current) return;
    const chart = chartComponentRef.current.chart;
    


    // Check if necessary to ensure the chart is properly initialized before adding series
    if (chart && source && source.timeseries && source.timeseries.length>0) {


      //clean existing series
      while (chart.series.length) {
        chart.series[0].remove();
    }

    source.timeseries.forEach((ts) => {

    

          
          const valueSeries: [number, number][] = ts.obstimes.map((value, index) => [value, ts.val[index]]);
          const errorSeries: [number, number, number][] = ts.obstimes.map((value, index) => [value, ts.val[index] - ts.valerr[index], ts.val[index] + ts.valerr[index]]);

          
          let markerColor = 'grey'; // Default color
          if (ts.tag.includes("FOV_RP")) {
            markerColor = 'red';
          } else if (ts.tag.includes("FOV_BP")) {
            markerColor = 'blue';
          }
          
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
              
              pointFormat: '<b>Obstimes:</b>{point.x:.4f}<br/><b>Value:</b>{point.y:.4f}',
              headerFormat: `<span style="color:${markerColor}">●</span> <span> <b>{series.name}</b></span><br/>`,
              
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
        //  chart.redraw();
        
      });


    }
  }, [source]);

  const options = {
    
    accessibility: {
      enabled: false,
    },
    legend: {
      enabled: false // Disable the legend
    },
    chart: {
      type: 'scatter',
      zooming: {
        type: 'xy',
      },
      animation: false,
      
    },
    xAxis: {
      type: 'linear',
      title:{
        text: 'Time (BJD in TCB-2455197.5)'
      } 
    },
    yAxis: {
      reversed: true,
      title:{
        text: 'Magnitude'
      }
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
      text: ''
    },
    exporting:{
      enabled:true,
      buttons:{
        contextButton:{
          verticalAlign:'bottom'
        }
      }
    }
    
  };

  return (
    <div style={{height: "100%"}}>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      containerProps={ { style: { height: "100%" } }}
    />
    </div>
  );
};





