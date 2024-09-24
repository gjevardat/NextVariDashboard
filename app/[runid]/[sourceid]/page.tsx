'use client'

import { useParams } from "next/navigation"
import BrowseTsComponent from "@/app/components/BrowsTsComponent"
import { useEffect } from "react";
import { getRuns } from "@/app/components/getruns";


export default function page()  {

    const params = useParams<{runid:string; sourceid:string}>();
    const runid = params?params.runid:null;
    const sourceid = params?params.sourceid:null;
    console.log("runid",runid);
   const parsedRunId = runid?parseInt(runid,10):null;
    const parsedSourceid=  sourceid?BigInt(sourceid):null;
    console.log("Selecting runid "+ parsedRunId);
    return (
        <BrowseTsComponent runid={parsedRunId} sourceid={parsedSourceid} tags={['ExtremeErrorCleaningMagnitudeDependent_FOV_G','ExtremeErrorCleaningMagnitudeDependent_FOV_BP','ExtremeErrorCleaningMagnitudeDependent_FOV_RP']}/>
    )

}










