'use client'

import { useParams } from "next/navigation"
import BrowseTsComponent from "../components/BrowsTsComponent"
import { useEffect } from "react";
import { getRuns } from "../components/getruns";


export default function page()  {

    const {runid} = useParams();

   

    console.log("Selecting runid "+ runid);
    return (
        <BrowseTsComponent runid={runid} sourceid={BigInt(0)} tags={['ExtremeErrorCleaningMagnitudeDependent_FOV_G','ExtremeErrorCleaningMagnitudeDependent_FOV_BP','ExtremeErrorCleaningMagnitudeDependent_FOV_RP']}/>
    )

}










