//import { useParams } from 'next/navigation'; // Assuming you're using App Router with next/navigation
import BrowseTsComponent from '../components/BrowsTsComponent';
import { getRun } from '@/app/lib/data';


interface Params {
    runid: string; // Define the expected parameter type
}


// This is now a server component
export default async function Page({ params }: { params: Params }) {
    // Fetch available runs server-side
    const availableRuns = await getRun(0,1000);

    
    const runid = params?.runid  ? parseInt(params.runid, 10) : null;

    const run = availableRuns.filter((r) => r.runid === runid)[0]
    
    return (
        <BrowseTsComponent
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