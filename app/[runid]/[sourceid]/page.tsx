'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState, useEffect } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
import Stack from '@mui/material/Stack';
import { useParams } from 'next/navigation';

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
    const {runid} = useParams()
    const { sourceid } = useParams();

    
    const [selectedTags, setSelectedTags] = useState<string[]>(['ExtremeErrorCleaningMagnitudeDependent_FOV_G', 'ExtremeErrorCleaningMagnitudeDependent_FOV_BP',
        'ExtremeErrorCleaningMagnitudeDependent_FOV_RP'
    ]);
    const [loadedTs, setLoadedTs] = useState<ts[]>([]);



    async function fetchData(run: number, source: number, tag: string) {

        const response = await fetch(`/api/getTS?runid=${run}&sourceId=${source}&tags=${tag}`);
        const dataresponse = await response.json();

        console.log("response ", dataresponse);
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

    useEffect(() => {

        console.log("tag  or run change, reloading ")

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

        if (runid && selectedTags && selectedTags.length > 0 && sourceid) {
            // Find tags that are in selectedTags but not in loadedTs
            const tagsToLoad = selectedTags.filter(
                (tag) => !loadedTs.some(
                    (loadedItem) => (loadedItem.tag === tag && loadedItem.sourceid === sourceid))
            );

            if (tagsToLoad.length === 0) {
                console.log("Nothing new tag to load, quit load ...")
                return; // No new tags to load
            }




            // Fetch data for each tag that needs to be loaded
            tagsToLoad.forEach((tag) => {
                console.log("Ts to fetch " + sourceid + ":" + tag + " for run " + runid)
                fetchData(runid, sourceid, tag);
            });
        }
    }, [selectedTags, runid]); // Dependency array

    useEffect(() => {

        console.log("source  change, reloading with selected tags" + sourceid + " selected")

        setLoadedTs((previousTs) => { return [] });
        if (!Array.isArray(selectedTags)) {
            console.error("selectedTags is not an array, curious it was initialized");
            console.log(selectedTags)
            return;
        }

        if (runid && selectedTags && selectedTags.length > 0 && sourceid) {
            if (selectedTags.length === 0) {
                console.log("Nothing new tag to load, quit load ...")
                return; // No new tags to load
            }

            // Fetch data for each tag that needs to be loaded
            selectedTags.forEach((tag) => {
                console.log("Ts to fetch " + sourceid + ":" + tag + " for run " + runid)
                fetchData(runid, sourceid, tag);
            });
        }
    }, [sourceid]); // Dependency array

    return (
        <div className="flex flex-col h-screen p-4">

            {/* Top Component */}
            <Stack direction="row" spacing={2}>
                <Operators run={runid} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
            </Stack>

            {/* Bottom Layout */}
            
                {/* Right Section */}
                <div className="flex-1 h-full">
                    {sourceid &&
                        Number(sourceid) !== 0 &&
                        selectedTags && selectedTags.length > 0 &&
                        loadedTs && loadedTs.length > 0 && (
                            <TimeSeries sourceId={Number(sourceid)} tsArray={loadedTs} />
                        )}
                </div>
            
        </div>
    )
}









