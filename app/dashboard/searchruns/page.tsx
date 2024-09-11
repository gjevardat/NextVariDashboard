'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
interface run {
    runid: number,
    runname: string
}

interface source {
    sourceid: number,
}

interface ts {
    tag: string,
    sourceid: number,
    obstimes: number[],
    vals: number[],
    errs: number[]
}

export default function Page() {
    const [selectedRun, setSelectedRun] = useState<run>();
    const [selectedSource, setSelectedSource] = useState<number>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);
    const [data, setData] = useState();
   

    async function fetchData(tag: string) {
        const response = await fetch("/api/getTS?runid=" + selectedRun + "&sourceId=" + selectedSource + "&tags=" + tag);
        const dataresponse = await response.json();
        setData(dataresponse)
        console.log("response " + response)
        
        console.log("data response from ts loading :" + dataresponse[0])
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


    useEffect(() => {
        
        if (!Array.isArray(selectedTags)) {
            console.error("selectedTags is not an array, curious it was initialized");
            console.log(selectedTags)
            return;
          }
        
          // Check if loadedTs is an array
          if (!Array.isArray(loadedTs)) {
            console.error("loadedTs is not an array");
            return;
          }

        if (selectedRun && selectedTags && selectedTags.length>0 && selectedSource) {
            // Find tags that are in selectedTags but not in loadedTs
            const tagsToLoad = selectedTags.filter(
                (tag) => !loadedTs.some((loadedItem) => loadedItem.tag === tag)
            );

            if (tagsToLoad.length === 0) return; // No new tags to load



            // Fetch data for each tag that needs to be loaded
            tagsToLoad.forEach((tag) => {
                console.log("Tag to fetch " + tag)
                fetchData(tag);
            });
        }
    }, [selectedTags,  selectedRun, selectedSource]); // Dependency array



    return (
        <div className="flex flex-col min-h-screen p-4">
            {/* Top Component */}
            <div >
                <AutoCompleteRuns onRunSelect={setSelectedRun} />
            </div>

            {/* Bottom Layout */}
            <div className="flex flex-1">
                {/* Left Section */}
                <div className="w-1/4  p-4">
                    <div className="flex">
                        {selectedRun && <SourceResultId onSourceSelect={setSelectedSource} run={selectedRun} />}
                    </div>
                    <div className="flex h-1/2">
                        {selectedRun && <Operators run={selectedRun} selectedTags={selectedTags} onTagSelect={setSelectedTags} />}

                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 p-4 flex-grow" >
                    {selectedSource
                        && Number(selectedSource) != 0
                        && selectedTags && selectedTags.length > 0
                        && loadedTs && loadedTs.length>0
                        && <TimeSeries runid={Number(selectedRun)} sourceId={Number(selectedSource)} tsArray={loadedTs} />}
                </div>
            </div>
        </div>
    )
}









