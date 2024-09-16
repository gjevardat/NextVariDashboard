'use client'

import React, { useState } from 'react';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const LineChart = () => {
  const [chartOptions] = useState({
    series: [
      { data: [1, 2, 3 , 3 ,2] }
    ]
  });

  return (
   //   <div style={{height: "100vh"}}>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={ { style: { height: "100%" } }}
        />
     // </div>
    )
}

export default LineChart;