//import { useParams } from 'next/navigation'; // Assuming you're using App Router with next/navigation
import BrowseTsComponent from '../components/BrowsTsComponent';
import { getRun } from '@/app/lib/data';
import { dr3_pool, dr4_pool } from '../lib/db';


interface Params {
    db:string;
    runid: string; // Define the expected parameter type
}


// This is now a server component
export default async function Page({ params }: { params: Params }) {
    // Fetch available runs server-side
    
    const pool = params?params.db=='dr4'?dr4_pool:params.db=='dr3'?dr3_pool:null:null;
    if(pool==null)
        throw Error("Pool cannot be null");


    const availableRuns = await getRun(dr4_pool,0,1000);
    const runid = params?.runid  ? parseInt(params.runid, 10) : null;

    const run = availableRuns.filter((r) => r.runid === runid)[0]
    
    return (
        <BrowseTsComponent
            db={params.db}
            run={run}
            sourceid={null}
            tags={[
                'ExtremeErrorCleaningMagnitudeDependent_FOV_G',
                'ExtremeErrorCleaningMagnitudeDependent_FOV_BP',
                'ExtremeErrorCleaningMagnitudeDependent_FOV_RP',
            ]}
            availableRuns={availableRuns} 
        />
    );
}