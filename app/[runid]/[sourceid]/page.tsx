
import BrowseTsComponent from '@/app/components/BrowsTsComponent';
import { getRun, getTimeSeriesResultTypes } from '@/app/lib/data';
import { dr3_pool, dr4_pool } from '@/app/lib/db';


interface Params {
    db:string
    runid: string; // Define the expected parameter type
    sourceid:string
}



export default async function Page({ params }: { params: Params }) {

    const pool = params?params.db=='dr4'?dr4_pool:params.db=='dr3'?dr3_pool:null:null;
    if(pool==null)
        throw Error("Pool cannot be null");

    const availableRuns = await getRun(pool,0,1000);
    const runid = params?.runid  ? parseInt(params.runid, 10) : null;
    const sourceid=  params?.sourceid?BigInt(params.sourceid):null;

    const run = availableRuns.filter((r) => r.runid === runid)[0]

    return (
        <BrowseTsComponent
            db={params.db}
            run={run}
            sourceid={sourceid}
            tags={[
                'ExtremeErrorCleaningMagnitudeDependent_FOV_G',
                'ExtremeErrorCleaningMagnitudeDependent_FOV_BP',
                'ExtremeErrorCleaningMagnitudeDependent_FOV_RP',
            ]}
            availableRuns={availableRuns} 
        />
    );
}