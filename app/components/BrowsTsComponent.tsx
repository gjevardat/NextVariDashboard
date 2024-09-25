'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
import { run, ts , timeseriestag, source} from '@/app/types';
import { getRuns } from '@/app/components/getruns';


interface BrowseTsProps {
   runid: number|null,
   sourceid: bigint|null,
    tags: string[]
}

export default function BrowseTsComponent({runid, sourceid, tags}: BrowseTsProps) {
    
    
    const [availableRuns,setAvailableRuns] = useState<run[] >( []);
    const [availableTags,setAvailableTags] = useState<timeseriestag[] >([]);
    const [selectedRun, setSelectedRun] = useState<run | null>(null);
    const [selectedSource, setSelectedSource] = useState<source>();
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);

    

 

    async function fetchTimeSeries(run: run, source: bigint, tag: string) {

        const response = await fetch(`/api/getTS?runid=${run.runid}&sourceId=${source}&tags=${tag}`);
        const dataresponse = await response.json();

        
        if (Array.isArray(dataresponse) && dataresponse.length > 0) {
        

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
   
    useEffect(()=>{
        if(runid && availableRuns.length>0){
            setSelectedRun((prevRun)=>(availableRuns.filter((run)=>run.runid==runid)[0]));
        }
        if(runid && sourceid && availableRuns.length>0){
            setSelectedRun((prevRun)=>(availableRuns.filter((run)=>run.runid==runid)[0]));
            setSelectedSource({sourceid:sourceid})
        }
    },[availableRuns])
    useEffect(() => {
        
        setLoadedTs( (prevTs) => {return []});
        if (selectedRun && selectedTags && selectedTags.length > 0 && selectedSource) {

            const tagsToLoad = selectedTags

            if (tagsToLoad.length === 0) {
                return; // No new tags to load
            }

            tagsToLoad.forEach((tag) => {
                fetchTimeSeries(selectedRun, selectedSource.sourceid, tag);
            });
        }        
    }, [selectedTags, selectedRun, selectedSource]); // Any change in one of these states will trigger the useEffect function

    useEffect(()=>{
        if(selectedRun !== null){
            
            fetchRunTimeSeriesTag(selectedRun);
        }
    },[selectedRun]);
  
    return (

        <div className="grid-container">
            <div className="grid-item itemtop">
                <AutoCompleteRuns runs={availableRuns} selectedRun={selectedRun} onRunSelect={setSelectedRun}  />
            </div>
            <div className="grid-item itemtop">
                <Operators availableTags={availableTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
            </div>
            <div className="grid-item itemsourcebrowser">
                <SourceResultId run={selectedRun} onSourceSelect={setSelectedSource} setSelectedRun={setSelectedRun} />
            </div>
            <div className="grid-item">
                <TimeSeries tsArray={loadedTs} sourceId={selectedSource?selectedSource.sourceid:undefined}/>
            </div>
        </div>
    )
}









