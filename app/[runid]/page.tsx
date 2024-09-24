'use client'

import { useParams } from "next/navigation"
import BrowseTsComponent from "../components/BrowsTsComponent"
import { useEffect } from "react";
import { getRuns } from "../components/getruns";


export default function page()  {

    const params = useParams<{runid:string}>();
    const runid = params?params.runid:null;
    console.log("runid",runid);
   const parsedRunId = runid?parseInt(runid,10):null;

    console.log("Selecting runid "+ parsedRunId);
    return (
        <BrowseTsComponent runid={parsedRunId} sourceid={null} tags={['ExtremeErrorCleaningMagnitudeDependent_FOV_G','ExtremeErrorCleaningMagnitudeDependent_FOV_BP','ExtremeErrorCleaningMagnitudeDependent_FOV_RP']}/>
    )

}










