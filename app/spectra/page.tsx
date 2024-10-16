import { get } from "http"
import { getRun, getSpectraTS } from "../lib/data"
import { dr4_pool } from "../lib/db";




export default async function SpectraTimeSeries(){

    const spec = await getSpectraTS();
    const availableRuns = await getRun(dr4_pool,0,1000);
    
    console.log(spec)

    return (
        <div>
          <h1>Spectra Time Series</h1>
          <pre>{spec[0].runname}</pre>
          <pre>{availableRuns.slice(0,1).map(r=>r.runname)}</pre>
        </div>
      );
}