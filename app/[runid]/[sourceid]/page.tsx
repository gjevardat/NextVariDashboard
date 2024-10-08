
import BrowseTsComponent from '@/app/components/BrowsTsComponent';
import { getRun, getTimeSeriesResultTypes } from '@/app/lib/data';


interface Params {
    runid: string; // Define the expected parameter type
    sourceid:string
}



export default async function Page({ params }: { params: Params }) {


    const availableRuns = await getRun(0,1000);
    const runid = params?.runid  ? parseInt(params.runid, 10) : null;
    const sourceid=  params?.sourceid?BigInt(params.sourceid):null;

    const run = availableRuns.filter((r) => r.runid === runid)[0]

    return (
        <BrowseTsComponent
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