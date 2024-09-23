'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect, useRef } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
import { run, ts , timeseriestag} from '@/app/types';
import { getRuns } from '@/app/components/getruns';




export default function Page() {
    
    
    const [availableRuns,setAvailableRuns] = useState<run[] >( []);
    const [availableTags,setAvailableTags] = useState<timeseriestag[] >([]);
    const [selectedRun, setSelectedRun] = useState<run>();
    const [selectedSource, setSelectedSource] = useState<BigInt>(BigInt(0));
    const [selectedTags, setSelectedTags] = useState<string[]>(['ExtremeErrorCleaningMagnitudeDependent_FOV_G','ExtremeErrorCleaningMagnitudeDependent_FOV_BP','ExtremeErrorCleaningMagnitudeDependent_FOV_RP']);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);

    const isInitialRender = useRef(true); 

    

    async function fetchTimeSeries(run: run, source: BigInt, tag: string) {

        const response = await fetch(`/api/getTS?runid=${run.runid}&sourceId=${source}&tags=${tag}`);
        const dataresponse = await response.json();

        console.log("fetchTimeSeries call from page.tsx", source, dataresponse);
        if (Array.isArray(dataresponse) && dataresponse.length > 0) {
            console.log("data response from ts loading: ", dataresponse[0].sourceid);

            // Directly update the loadedTs state with fetched data
            setLoadedTs((prevLoadedTs) => [
                ...prevLoadedTs,
                {
                    tag: tag,
                    sourceid: dataresponse[0].sourceid,
                    obstimes: dataresponse[0].obstimes,
                    vals: dataresponse[0].val,
                    errs: dataresponse[0].valerr,
                },
            ]);
        }
    }

    async function fetchRunTimeSeriesTag(run: run){
        const response = await fetch(`/api/getTimeSeriesResultTypes?runid=${run.runid}`)
        const dataresponse = await response.json();

        setAvailableTags(dataresponse)
    }

    useEffect(() => {
        async function fetchRuns() {
            try {
                
                const runs = await getRuns(); // Fetch runs data
                console.log("Loaded runs:   " + runs.length)
                setAvailableRuns(runs); // Update state with the fetched data
            } catch (error) {
                console.error("Failed to fetch runs:", error);
            }
        }

        fetchRuns(); 
    }, []); // Empty dependency array means it runs once when the component mounts
   
    useEffect(() => {

        
        setLoadedTs( (prevTs) => {return []});
        console.log("tag   run or source change change, reloading  ts")
        
        if (selectedRun && selectedTags && selectedTags.length > 0 && selectedSource) {
            //setLoadedTs((previousTs) => { [] });
            // Find tags that are in selectedTags but not in loadedTs
            const tagsToLoad = selectedTags

            if (tagsToLoad.length === 0) {
                console.log("Nothing new tag to load, quit load ...")
                return; // No new tags to load
            }

            // Fetch data for each tag that needs to be loaded
       
            tagsToLoad.forEach((tag) => {
                console.log("Ts to fetch " + selectedSource + ":" + tag + " for run " + selectedRun)
                fetchTimeSeries(selectedRun, selectedSource, tag);
            });
        }        
    }, [selectedTags, selectedRun, selectedSource]); // Any change in one of these states will trigger the useEffect function

    useEffect(()=>{
        if(selectedRun !== undefined){
            console.log("selectedRun has changed !" + selectedRun);
            fetchRunTimeSeriesTag(selectedRun);
        }
    },[selectedRun]);
    useEffect(()=>{
        if(selectedTags !== undefined){
            console.log("selectedTags has changed !");
        }
    },[selectedTags]);
    useEffect(()=>{
        console.log("selectedSource has changed !");
    },[selectedSource]);

    return (

        <div className="grid-container">
            <div className="grid-item itemtop">
                <AutoCompleteRuns runs={availableRuns} onRunSelect={setSelectedRun}  />
            </div>
            <div className="grid-item itemtop">
                <Operators availableTags={availableTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
            </div>
            <div className="grid-item itemsourcebrowser">
                <SourceResultId run={selectedRun} onSourceSelect={setSelectedSource} setSelectedRun={setSelectedRun} />
            </div>
            <div className="grid-item">
                <TimeSeries tsArray={loadedTs} sourceId={BigInt(selectedSource)}/>
            </div>
        </div>
    )
}









