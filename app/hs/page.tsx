'use client'




import { Card } from "./Card";
import { HighchartsChart } from "./MyHighCharts";

export default function App() {
  return (
    <div className="App">
      <Card>
        <HighchartsChart />
      </Card>
      
    </div>
  );
}
