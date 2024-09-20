'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
import { run, ts , timeseriestag} from '@/app/types';
import { getRuns } from '@/app/components/getruns';




export default function Page() {
    
    
    const [availableRuns,setAvailableRuns] = useState<run[] >(getRuns().runs);
    const [availableTags,setAvailableTags] = useState<timeseriestag[] >([]);
    
    const [selectedRun, setSelectedRun] = useState<run>();
    const [selectedSource, setSelectedSource] = useState<number>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);


    async function fetchTimeSeries(run: run, source: number, tag: string) {

        const response = await fetch(`/api/getTS?runid=${run.runid}&sourceId=${source}&tags=${tag}`);
        const dataresponse = await response.json();

        console.log("fetchTimeSeries call from page.tsx", dataresponse);
        if (Array.isArray(dataresponse) && dataresponse.length > 0) {
            console.log("data response from ts loading: ", dataresponse[0].sourceid);

            // Directly update the loadedTs state with fetche   d data
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

        console.log("tag  or run change, reloading  ts")
        setLoadedTs((previousTs) => { return [] });
       
        if (selectedRun && selectedTags && selectedTags.length > 0 && selectedSource) {
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
                <AutoCompleteRuns runs={availableRuns} onRunSelect={setSelectedRun} />
            </div>
            <div className="grid-item itemtop">
                <Operators availableTags={availableTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
            </div>
            <div className="grid-item itemsourcebrowser">
                <SourceResultId run={selectedRun} onSourceSelect={setSelectedSource} setSelectedRun={setSelectedRun} />
            </div>
            <div className="grid-item">
                <TimeSeries sourceId={Number(selectedSource)} tsArray={loadedTs} />
            </div>
        </div>
    )
}









