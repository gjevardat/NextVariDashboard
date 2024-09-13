import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef, useEffect } from "react";
import { time, data, color1, color2, label } from "./data";

const options: Highcharts.Options = {
  chart: {
    //zoomType: "x",
    panning: {
      enabled: true
    },
    panKey: "ctrl"
  },
  xAxis: {
    type: "datetime",
    crosshair: true
  },
  yAxis: {
    max: Math.max(...data),
    min: Math.min(...data)
  },
  title: {
    text: "Highcharts"
  },
  plotOptions: {
    series: {
      marker: {
        fillColor: color2,
        radius: 5
      }
    }
  },
  tooltip: {
    xDateFormat: "%Y",
    followPointer: true,
    hideDelay: 0
  },
  series: [
    {
      type: "line",
      name: label,
      color: color1,
      data: time.map((t, i) => [new Date(t, 0).getTime(), data[i]])
    }
  ]
};

export const HighchartsChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    console.log(chartRef.current.chart);
    if (chartRef.current) chartRef.current.chart.reflow();
  }, []);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartRef}
      //containerProps={{ style: { height: "100%" } }}
    />
  );
};